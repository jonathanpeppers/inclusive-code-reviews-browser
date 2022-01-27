describe('validator', () => {
    const client = require('../src-packed/validator');

    it('No match', async () => {
        if (client.hasEmptyApiKey())
            return;
        var matches = [];
        await client.getMatches('Hello, World! This is a long text', matches);
        expect(matches.length).to.be.equal(0);
    });

    it('Negative', async () => {
        if (client.hasEmptyApiKey())
            return;
        var matches = [];
        await client.getMatches('This is so bad way to do things', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Ignorable sentence', async () => {
        if (client.hasEmptyApiKey())
            return;
        var matches = [];
        await client.getMatches('There are some new test failures.', matches);
        expect(matches.length).to.be.equal(0);
    });

    it('Ignorable negative sentence', async () => {
        if (client.hasEmptyApiKey())
            return;
        var matches = [];
        await client.getMatches('There are some new test failures, this is terrible.', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Ignorable sentence and negative sentence', async () => {
        if (client.hasEmptyApiKey())
            return;
        var matches = [];
        await client.getMatches('I see a new error in the build. This is the worst thing that has ever happened.', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Suggestion', async () => {
        if (client.hasEmptyApiKey())
            return;
        var matches = [];
        await client.getMatches('This is crazy good', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Suggestion and negative', async () => {
        if (client.hasEmptyApiKey())
            return;
        var matches = [];
        await client.getMatches('This is crazy long text', matches);
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

    it('shouldReportManualFix multiple issues', async () => {
        // Reset initial state
        client.clearState();
        // No suggestions
        expect(client.shouldReportManualFix([])).to.be.equal(false);
        // Two suggestions
        expect(client.shouldReportManualFix([ "one", "two" ])).to.be.equal(false);
        // One suggestion
        expect(client.shouldReportManualFix([ "one" ])).to.be.equal(true);
        // No suggestions
        expect(client.shouldReportManualFix([])).to.be.equal(true);
        // No suggestions, again
        expect(client.shouldReportManualFix([])).to.be.equal(false);
    });

    it('Brief text suggestion', async () => {
        var text = "Great changes";
        var matches = [];
        client.getMatches(text, matches);
        expect(matches.length).to.be.equal(1);
        expect(matches[0].length).to.be.equal(text.length);
    });
    
    it('Brief text no suggestion', async () => {
        var matches = [];
        client.getMatches("These changes are more than 15 characters", matches);
        expect(matches.length).to.be.equal(0);
    });
});
