describe('validator', () => {
    const client = require('../src-packed/validator');

    it('No match', async () => {
        var matches = [];
        await client.getMatches('Hello, World! This is a long text', matches);
        expect(matches.length).to.be.equal(0);
    });

    it('Negative and short', async () => {
        var matches = [];
        await client.getMatches('This is so bad', matches);
        expect(matches.length).to.be.equal(2);
    });

    it('Suggestion', async () => {
        var matches = [];
        await client.getMatches('This is crazy good', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Suggestion, negative and short', async () => {
        var matches = [];
        await client.getMatches('This is crazy', matches);
        expect(matches.length).to.be.equal(3);
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

    it('Brief text suggestion', async () => {
        var matches = [];
        var result = client.getMatches("Great changes", matches);
        expect(matches.length).to.be.equal(1);
    });
    
    it('Brief text no suggestion', async () => {
        var matches = [];
        var result = client.getMatches("These changes are more than 15 characters", matches);
        expect(matches.length).to.be.equal(0);
    });
});
