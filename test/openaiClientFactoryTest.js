const { openai_key } = require("../src-packed/secrets");
const timeout = 10000;
var apiKey = openai_key || process.env.OPEN_AI_KEY;
var assert = require('assert');

describe('openai client factory', () => {
    // Just return if the key is not set.
    // This would happen on a PR from a fork.
    if (!apiKey) {
        console.warn("Skipping openai client factory tests, key not set.");
        return;
    }

    let endpoint = "https://icropenaiservice.openai.azure.com/openai/deployments/icrgpt-35-turbo-16k";
    const factory = require('../src-packed/openaiClientFactory');

    it('basic comment rewrite', async () => {
        var openai = factory.getOpenaiClient(apiKey, endpoint);
        assert.notEqual(openai, undefined);

        let comment = "Remove this line of code. This is a wasted line of code.";
        const response = await openai.chat.completions.create({
            messages:
                [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": "Rewrite this sentence in a more friendly manner: " + comment
                    }
                ],
            // 0 accurate, 1 creative
            temperature: 0
        });

        let result = response.choices[0].message.content;

        expect(result.length).to.not.be.equal(0);
        expect(result).to.not.be.contains("This is a wasted line of code");
    }).timeout(timeout);

    it('basic comment rating', async () => {
        var openai = factory.getOpenaiClient(apiKey, endpoint);
        assert.notEqual(openai, undefined);

        let comment = "Remove this line of code. This is a wasted line of code.";

        const response = await openai.chat.completions.create({
            messages:
                [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": "In a scale from 0 to 10. 0 means not polite at all. 10 means very polite. Please tell me only the score number of this sentence: " + comment
                    }
                ],
            // 0 accurate, 1 creative
            temperature: 0
        });

        let result = response.choices[0].message.content;
        expect(result.length).to.not.be.equal(0);
    }).timeout(timeout);

    it('return comments as JSON', async () => {
        var openai = factory.getOpenaiClient(apiKey, endpoint);
        assert.notEqual(openai, undefined);

        let comment = "Remove this, it is a useless line of code.";

        const response = await openai.chat.completions.create({
            messages:
                [
                    {
                        "role": "system",
                        "content": "You are an assistant that only replies with exactly three sentences, each sentence on its own line. Do not number the sentences."
                    },
                    {
                        "role": "system",
                        "content": "You are expert software engineer that is particularly good at writing inclusive, well-written, thoughtful code reviews"
                    },
                    {
                        "role": "user",
                        "content": "Suggest three polite alternatives to the code review comment: " + comment
                    }
                ],
            // 0 accurate, 1 creative
            temperature: 0.5
        });

        let result = response.choices[0].message.content;
        expect(result.length).to.not.be.equal(0);
        let sentences = result.split('\n');
        expect(sentences.length).to.be.equal(3);
        expect(sentences[0].length).to.not.be.equal(0);
    }).timeout(timeout);
});
