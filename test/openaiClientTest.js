const timeout = 20000;
const retries = 2;
const commentRewriteEndpoint = "https://app-rel.wus3.sample-dev.azgrafana-test.io/api/CommentRewrite";

describe('comment rewrite endpoint', () => {
    it('check comment rewrite basic usage', async () => {
        let comment = "Remove this line of code. This is a wasted line of code.";

        let request = {
            "comment": comment,
            // 0 accurate, 1 creative
            "temperature": 0.5,
            // prevent the model from repeating itself without sacrificing quality of response
            "frequencyPenalty": 1.0,
            "maxTokens": 800,
            "enableJsonMode": true,
            "seed": 4567
        };

        const serverResponse = await fetch(commentRewriteEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request),
        }).then(response => response.json());

        let result = serverResponse.content[0].text;

        expect(result.length).to.not.be.equal(0);
        expect(result).to.not.be.contains("This is a wasted line of code");
    }).timeout(timeout).retries(retries);
});
