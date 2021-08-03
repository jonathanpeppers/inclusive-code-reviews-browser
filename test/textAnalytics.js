import regeneratorRuntime from "regenerator-runtime";

describe('Test extension', () => {
    const client = require('../src/packed/textAnalytics');

    it('Negative sentiment', async () => {
        const result = await client.analyzeSentiment("This is terrible!");
        expect(result).to.be.equal("negative");
    });
});