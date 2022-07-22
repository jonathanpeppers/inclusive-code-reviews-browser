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

// Replace backticks for double quotes, since backticks make sentiment more negative
// See textAnalytics.js 'Yield Example' test
function replaceBackticks (text) {
    var result = text.replace(/`/g, "\"");
    return result;
}

export function preprocessText (text) {
    var result = removeCodeBlocks (text);
    result = removeImageTags (result);
    result = replaceBackticks (result);
    //TODO: do a real punctuation remover
    result = result.replace('!', ' ');
    return result;
}

var session;

export async function analyzeSentiment(ort, sentences) {
    if (session == null)
        session = await ort.InferenceSession.create('./assets/model.onnx');

    if (typeof sentences === 'string') {
        sentences = [sentences];
    }
    var sentiment = {
        sentences: []
    };
    var totalLength = 0;
    for await (const sentence of sentences) {
        const text = preprocessText(sentence);
        const results = await session.run({
            text: new ort.Tensor([text], [1,1]),
            isnegative: new ort.Tensor([''], [1,1]),
        })
        const result = results['PredictedLabel.output'].data[0];
        sentiment.sentences.push({
            text: text,
            sentiment: result === '1' ? 'negative' : 'neutral',
            confidenceScores: {
                negative: results['Score.output'].data[1],
                neutral: results['Score.output'].data[0],
            },
            offset: totalLength,
            length: text.length,
        });
        totalLength += text.length;
    }
    return sentiment;
}

