import * as ort from 'onnxruntime-node';

describe('validator', () => {
    const client = require('../src-packed/validator');

    it('No match', async () => {
        var matches = [];
        await client.getMatches(ort, 'Hello, World! This is a long text', matches);
        expect(matches.length).to.be.equal(0);
    });

    it('Negative', async () => {
        var matches = [];
        await client.getMatches(ort, 'This is such a bad way to do things', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Suggestion', async () => {
        var matches = [];
        await client.getMatches(ort, 'This is crazy good', matches);
        expect(matches.length).to.be.equal(1);
    });

    it('Suggestion and negative', async () => {
        var matches = [];
        await client.getMatches(ort, 'This is crazy long text', matches);
        expect(matches.length).to.be.equal(1);
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
        var text = "Ok?";
        var matches = [];
        client.getMatches(ort, text, matches);
        expect(matches.length).to.be.equal(1);
        expect(matches[0].length).to.be.equal(text.length);
    });
    
    it('Brief text no suggestion', async () => {
        var matches = [];
        client.getMatches(ort, "Thank you", matches);
        expect(matches.length).to.be.equal(0);
    });

    it('Brief text in ignore list no suggestion', async () => {
        var matches = [];
        client.getMatches(ort, "Fixes #77", matches);
        expect(matches.length).to.be.equal(0);
    });
});
