const { openai_key } = require("../src-packed/secrets");
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
    }).timeout(5000);

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
    }).timeout(5000);
});
