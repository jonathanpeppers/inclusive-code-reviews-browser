describe('validator', () => {
    const client = require('../src-packed/validator');

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
        await client.getMatches('This is crazy', matches);
        expect(matches.length).to.be.equal(2);
    });

    it('shouldReportManualFix', async () => {
        // Reset initial state
        client.clearState();
        // No suggestions
        expect(client.shouldReportManualFix([])).to.be.equal(false);
        // One suggestion
        expect(client.shouldReportManualFix([ "one" ])).to.be.equal(false);
        // No suggestions
        expect(client.shouldReportManualFix([])).to.be.equal(true);
        // No suggestions, again
        expect(client.shouldReportManualFix([])).to.be.equal(false);
    });

    it('shouldReportManualFix after suggestion', async () => {
        // Reset initial state
        client.clearState();
        // One suggestion
        expect(client.shouldReportManualFix([ "one" ])).to.be.equal(false);
        // Applied suggestion
        client.appliedSuggestion(42);
        // No suggestions
        expect(client.shouldReportManualFix([])).to.be.equal(false);
        // No suggestions, again
        expect(client.shouldReportManualFix([])).to.be.equal(false);
    });
});
