// packed/validator.js returns a data structure that background/validator.js expects

const suggestions = require('./suggestions');
const textAnalytics = require('./textAnalytics');
var appinsights = null;
var hasFoundSuggestionsBefore = false; // If a problem has been found before

// Load appinsights lazily, so we aren't tracking until this method is called
function loadAppInsights() {
    if (!appinsights) appinsights = require('./appinsights');
}

export async function getMatches(text, matches) {
    loadAppInsights();

    var minRev = typeof config != "undefined" ? config.MIN_REVIEW_LENGTH : 15;
    var shortText = text.length < minRev;
    if (shortText)
    {
        appinsights.trackEvent('tooShort');
        matches.push({
            "message": "This is comment is too brief. Could you elaborate?",
            "shortMessage": "Comment is brief",
            "offset": 0,
            "length": text.length-1,
            "rule": { "id": "NON_STANDARD_WORD", "subId": "1", "description": "Negative word", "issueType": "misspelling", "category": { "id": "TYPOS", "name": "Small text" } },
            "replacements": [],
            "type": { "typeName": "Other" },
            "ignoreForIncompleteSentence": false,
            "contextForSureMatch": 7
        });
    }
    // Suggestions, based on a dictionary
    suggestions.getSuggestions(text).forEach(suggestion => {
        appinsights.trackEvent('negativeWord');

        matches.push({
            "message": "This word has a negative connotation. Did you want to use a different word?",
            "shortMessage": "Negative word",
            "offset": suggestion.index,
            "length": suggestion.length,
            "rule": { "id": "NON_STANDARD_WORD", "subId": "1", "description": "Negative word", "issueType": "misspelling", "category": { "id": "TYPOS", "name": "Negative word" } },
            "replacements": suggestion.replacements,
            "type": { "typeName": "Other" },
            "ignoreForIncompleteSentence": false,
            "contextForSureMatch": 7
        });
    });

    //we don't need to call analytics api if the text is too short
    if(shortText)
        return;

    // TextAnalytics API
    const result = await textAnalytics.analyzeSentiment(text);
    if (result.error !== undefined) {
        console.log(result.error);
        return;
    }
    result.sentences.forEach(sentence => {
        if (sentence.sentiment !== "negative")
            return;
        console.log(`Index: ${sentence.offset}, Negative sentiment: ${sentence.confidenceScores.negative}`)
        if (sentence.confidenceScores.negative <= 0.75)
            return;

        appinsights.trackEvent('negativeSentence', sentence.confidenceScores);

        matches.push({
            "message": "This phrase could be considered negative. Would you like to rephrase?",
            "shortMessage": "Negative sentiment",
            "offset": sentence.offset,
            "length": sentence.length,
            "rule": { "id": "NON_STANDARD_WORD", "subId": "1", "description": "Negative word", "issueType": "misspelling", "category": { "id": "TYPOS", "name": "Negative word" } },
            // Stuff that has to be filled out
            "replacements": [],
            "type": { "typeName": "Other" },
            "ignoreForIncompleteSentence": false,
            "contextForSureMatch": 7
        });
    });

    // 'manualFix' event
    if (shouldReportManualFix(matches)) {
        appinsights.trackEvent('manualFix');
    }
}

// clears the state of 'hasFoundSuggestionsBefore'
export function clearState() {
    hasFoundSuggestionsBefore = false;
}

// Sends the 'appliedSuggestion' event and clears the state of 'hasFoundSuggestionsBefore'
export function appliedSuggestion(appliedSuggestions) {
    clearState();
    loadAppInsights();
    appinsights.trackEvent('appliedSuggestion', { total: appliedSuggestions });
}

// Returns true if the 'manualFix' event should be sent
export function shouldReportManualFix(matches) {
    if (matches) {
        if (hasFoundSuggestionsBefore && matches.length == 0) {
            hasFoundSuggestionsBefore = false;
            return true;
        } else if (matches.length > 0) {
            hasFoundSuggestionsBefore = true;
        }
    }
    return false;
}

// For use inside the extension (which isn't using webpack)
// The best I came up with for now is to add this function to window.
window.getMatches = getMatches;
window.appliedSuggestion = appliedSuggestion;
