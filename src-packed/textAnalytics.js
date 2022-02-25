export let emptyApiKey = false;
const { api_key } = require("./secrets");
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const server_url = "https://westus.api.cognitive.microsoft.com/";
const client = new TextAnalyticsClient(server_url, new AzureKeyCredential(api_key || defaultApiKey()));

function defaultApiKey() {
    emptyApiKey = true;
    return "EMPTY_API_KEY";
}

function removeImageTags (text) {
    var startTag = text.indexOf ("![");
    var result = text;
    while (startTag >= 0) {
        var endTag = result.indexOf ("](", startTag + 2);
        if (endTag == -1)
            break;
        var end = result.indexOf (")", endTag + 2);
        if (end == -1)
            break;
        var alttext = result.substring (startTag + 2, endTag);
        var space = " ".repeat (end - endTag);
        result = result.substring (0, startTag).concat (". ", alttext, ".", space, result.substring (end + 1));
        startTag = result.indexOf ("![", end + 1);
    }
    return result;
}

// Replace fenced / indented code blocks with spaces to not analyze them
function removeCodeBlocks (text) {
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

export function preprocessText (text) {
    var result = removeCodeBlocks (text);
    result = removeImageTags (result);
    return result;
}

// Replace ignorable phrases that produce a negative sentiment with spaces
export function preprocessIgnorableNegativeText (text) {
    // Match all case-insensitive instances
    var regex = new RegExp(ignorablePhraseRegex, "gi");
    var replacedResult = text.replace(regex,
        function(stringToReplace) {
            return " ".repeat(stringToReplace.length);
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
    "negative|" +
    "";
