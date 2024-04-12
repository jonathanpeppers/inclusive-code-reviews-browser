const timeout = 20000;
const retries = 2;
const endpoint = "https://app-rel.wus3.sample-dev.azgrafana-test.io/api/ChatCompletion";
const endpointv4 = "https://app-rel.wus3.sample-dev.azgrafana-test.io/api/Gpt4ChatCompletion";
const commentRewriteEndpoint = "https://app-rel.wus3.sample-dev.azgrafana-test.io/api/CommentRewrite";

// Commented to see if tests are more reliable

// describe('openai client', () => {
//     it('basic comment rewrite', async () => {
//         let comment = "Remove this line of code. This is a wasted line of code.";

//         const response = await fetch(endpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 "messages": [
//                     {
//                         "role": "system",
//                         "content": "You are a helpful assistant."
//                     },
//                     {
//                         "role": "user",
//                         "content": "Rewrite this sentence in a more friendly manner: " + comment
//                     }
//                   ],
//                   // 0 accurate, 1 creative
//                   "temperature": 0,
//                   "maxTokens": 800,
//             }),
//         }).then(response => response.json());

//         let result = response.choices[0].message.content;

//         expect(result.length).to.not.be.equal(0);
//         expect(result).to.not.be.contains("This is a wasted line of code");
//     }).timeout(timeout).retries(retries);
// });

// describe('openai client gpt4', () => {
//     it('check gpt4 endpoint', async () => {
//         let comment = "Remove this line of code. This is a wasted line of code.";

//         let request = {
//             "messages": [
//                 {
//                     "role": "system",
//                     "content": "You are an assistant that only replies with exactly three options as a JSON array, which is not indented and contains no new lines. For example: { \"suggestions\" : [ \"1\", \"2\", \"3\" ] }"
//                 },
//                 {
//                     "role": "system",
//                     "content": "You are expert software engineer that is particularly good at writing inclusive, well-written, thoughtful code reviews."
//                 },
//                 {
//                     "role": "user",
//                     "content": "Suggest three polite alternatives to the code review comment: " + comment
//                 }
//             ],
//             // 0 accurate, 1 creative
//             "temperature": 0.5,
//             // prevent the model from repeating itself without sacrificing quality of response
//             "frequencyPenalty": 1.0,
//             "maxTokens": 800,
//             "enableJsonMode": true,
//             "seed": 4567
//         };

//         const serverResponse = await fetch(endpointv4, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(request),
//         }).then(response => response.json());

//         let result = serverResponse.choices[0].message.content;

//         expect(result.length).to.not.be.equal(0);
//         expect(result).to.not.be.contains("This is a wasted line of code");
//     }).timeout(timeout).retries(retries);
// });


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

        let result = serverResponse.choices[0].message.content;

        expect(result.length).to.not.be.equal(0);
        expect(result).to.not.be.contains("This is a wasted line of code");
    }).timeout(timeout).retries(retries);
});
