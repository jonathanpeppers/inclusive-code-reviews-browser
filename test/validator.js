describe('validator', () => {
    const client = require('../src/packed/validator');

    it('No match', async () => {
        var matches = [];
        await client.getMatches('Hello, World!', matches);
        expect(matches.length).to.be.equal(0);
    });

    it('Negative', async () => {
        var matches = [];
        await client.getMatches('This is so bad', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Suggestion', async () => {
        var matches = [];
        await client.getMatches('This is crazy good', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Suggestion and negative', async () => {
        var matches = [];
        await client.getMatches('This is terrible', matches);
        expect(matches.length).to.be.equal(2);
    });
});