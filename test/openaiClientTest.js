const timeout = 20000;
const retries = 2;
const endpoint = "https://app-rel.wus3.sample-dev.azgrafana-test.io/api/ChatCompletion";

describe('openai client', () => {
    it('basic comment rewrite', async () => {
        let comment = "Remove this line of code. This is a wasted line of code.";

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "messages": [
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
                  "temperature": 0,
                  "maxTokens": 800,
            }),
        }).then(response => response.json());

        let result = response.choices[0].message.content;

        expect(result.length).to.not.be.equal(0);
        expect(result).to.not.be.contains("This is a wasted line of code");
    }).timeout(timeout).retries(retries);
});
