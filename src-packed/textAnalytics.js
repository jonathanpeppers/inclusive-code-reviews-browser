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

const backtickRegex = /`+[^`]+`+/gi;

function replaceBackticks (text) {
    return text.replace(backtickRegex, '#code');
}

const urlRegex = /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/gi;

function replaceUrls(text) {
    return text.replace(urlRegex, '#url');
}

const githubHandleRegex = /\B@([a-z0-9](?:-(?=[a-z0-9])|[a-z0-9]){0,38}(?<=[a-z0-9]))/gi;

function replaceGitHubHandles (text) {
    return text.replace(githubHandleRegex, '@github');
}

const punctuationRegex = /(\.|!|\?|;|:)+$/g;

function replaceTrailingPunctuation (text) {
    return text.replace(punctuationRegex, '');
}

// These are transformations applied, before it is split into sentences
// These need to preserve text length
export function preprocessText (text) {
    var result = removeCodeBlocks (text);
    result = removeImageTags (result);
    return result;
}

// These are transformations applied, after split into sentences
// These do not need to preserve text length
export function postprocessText (text) {
    const github_replaced = replaceGitHubHandles(text);
    const backticks_replaced = replaceBackticks(github_replaced);
    const urls_replaced = replaceUrls(backticks_replaced);
    const punctuation_replaced = replaceTrailingPunctuation(urls_replaced);
    return punctuation_replaced.trim();
}

const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });

export function splitIntoSentences(text) {
    var split = [];
    const iterator = segmenter.segment(text)[Symbol.iterator]();
    while (true) {
        var current = iterator.next();
        if (current.done)
            break;
        split.push(current.value.segment);
    }
    return split;
}

var session;

export async function initialize(ort) {
    if (session == null)
        session = await ort.InferenceSession.create('./assets/model.onnx');
}

export async function analyzeSentiment(ort, sentences) {
    await initialize(ort);

    var shouldPreprocess = true;

    // Split into sentences if needed
    if (typeof sentences === 'string') {
        sentences = preprocessText(sentences);
        sentences = splitIntoSentences(sentences);
        shouldPreprocess = false;
    }
    var sentiment = {
        sentences: []
    };
    var totalLength = 0;
    for await (const sentence of sentences) {
        const text = shouldPreprocess ? preprocessText(sentence) : sentence;
        const results = await session.run({
            text: new ort.Tensor([postprocessText(text)], [1,1]),
            isnegative: new ort.Tensor([''], [1,1]),
            importance: new ort.Tensor('float32', [''], [1,1]),
        })
        const result = results['PredictedLabel.output'].data[0];

        // Trim any trailing spaces for the length used
        const trimmedText =  text.trimEnd();

        sentiment.sentences.push({
            text: text,
            sentiment: result === '1' ? 'negative' : 'neutral',
            confidenceScores: {
                negative: results['Score.output'].data[1],
                neutral: results['Score.output'].data[0],
            },
            offset: totalLength,
            length: trimmedText.length,
        });
        totalLength += text.length;
    }
    return sentiment;
}

