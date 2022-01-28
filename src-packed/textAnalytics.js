export let emptyApiKey = false;
const { api_key } = require("./secrets");
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const server_url = "https://westus.api.cognitive.microsoft.com/";
const client = new TextAnalyticsClient(server_url, new AzureKeyCredential(api_key || defaultApiKey()));

function defaultApiKey() {
    emptyApiKey = true;
    return "EMPTY_API_KEY";
}

// Replace fenced / indented code blocks with spaces to not analyze them
export function preprocessText (text) {
    var atStartOfLine = true;
    var inFencedCodeBlock = false;
    var inIndentedCodeBlock = false;
    var result = "";
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if (c == '\n') {
            atStartOfLine = true;
            inIndentedCodeBlock = false;
            result += c;
            continue;
        }

        if (!atStartOfLine) {
            if (inIndentedCodeBlock || inFencedCodeBlock) {
                result += " ";
            } else {
                result += c;
            }
            continue;
        }

        if (atStartOfLine && c == '`' && text.substring (i, i + 3) == "```") {
            inFencedCodeBlock = !inFencedCodeBlock;
            result += "   ";
            i += 2;
            atStartOfLine = false;
            continue;
        }

        if (inFencedCodeBlock) {
            result += " ";
            atStartOfLine = false;
            continue;
        }

        if (atStartOfLine && c == ' ' && text.substring (i, i + 4) == "    ") {
            inIndentedCodeBlock = true;
            result += "    ";
            i += 3;
            atStartOfLine = false;
            continue;
        }

        result += c;
        atStartOfLine = false;
    }

    return result;
}

// Replace ignorable phrases that produce a negative sentiment with spaces
export function preprocessIgnorableNegativeText (text) {
    // Match all case-insensitive instances
    var regex = new RegExp(ignorablePhraseRegex, "gi");
    var replacedResult = text.replace(regex,
        function(stringToReplace) {
            return " ".repeat(stringToReplace.length);;
        }
    )
    return replacedResult;
}

export async function analyzeSentiment(text) {
    text = preprocessText(text);
    text = preprocessIgnorableNegativeText(text);
    const [result] = await client.analyzeSentiment([text]);
    return result;
}

/*
    Contains a list of phrases that produce a negative sentiment but can be ignored.
    Be conscientious when adding new items to this file, as we don't want to filter out generic words/phrases that can be used in many contexts.
*/
const ignorablePhraseRegex =
    "build failure|" +
    "error|" +
    "ignore|" +
    "test failure|" +
    "warning|" +
    "";
