describe('textAnalytics', () => {
    const client = require('../src/packed/textAnalytics');

    it('Negative', async () => {
        const result = await client.analyzeSentiment("This is terrible!");
        expect(result.sentences[0].sentiment).to.be.equal("negative");
    });

    it('Neutral', async () => {
        const result = await client.analyzeSentiment("Hello, World!");
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });

    it('Positive', async () => {
        const result = await client.analyzeSentiment("This is great!");
        expect(result.sentences[0].sentiment).to.be.equal("positive");
    });
});