// packed/validator.js returns a data structure that background/validator.js expects

const suggestions = require('./suggestions');
const textAnalytics = require('./textAnalytics');

export async function getMatches(text, matches, track) {

    let appinsights = null;
    if (track) {
        appinsights = require('./appinsights');
        appinsights.trackPageView();
    }

    // Suggestions, based on a dictionary
    suggestions.getSuggestions(text).forEach(suggestion => {
        if (appinsights) appinsights.trackEvent('negativeWord');

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

        if (appinsights) appinsights.trackEvent('negativeSentence', sentence.confidenceScores);

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
}

// For use inside the extension (which isn't using webpack)
// The best I came up with for now is to add this function to window.
window.getMatches = getMatches;