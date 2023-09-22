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
        await client.getMatches(ort, text, matches);
        expect(matches.length).to.be.equal(1);
        expect(matches[0].length).to.be.equal(text.length);
        expect(matches[0].shortMessage).to.be.equal("Comment is brief");
    });
    
    it('Brief text no suggestion', async () => {
        var matches = [];
        await client.getMatches(ort, "Thank you", matches);
        expect(matches.length).to.be.equal(0);
    });

    it('Brief text in ignore list no suggestion', async () => {
        var matches = [];
        await client.getMatches(ort, "Fixes #77", matches);
        expect(matches.length).to.be.equal(0);
    });

    it('Brief text but catches negative connotation first', async () => {
        var matches = [];
        await client.getMatches(ort, "Sucks", matches);
        expect(matches.length).to.be.equal(2);
        expect(matches[0].shortMessage).to.be.equal("Negative sentiment");
        expect(matches[1].shortMessage).to.be.equal("Comment is brief");
    });

    it('Two sentences', async () => {
        var matches = [];
        var bad = 'This is bad.';
        await client.getMatches(ort, bad + ' This is good.', matches);
        expect(matches.length).to.be.equal(1);
        var match = matches[0];
        expect(match.offset).to.be.equal(0);
        expect(match.length).to.be.equal(bad.length);
    });

    const { openai_key } = require("../src-packed/secrets");
    const timeout = 10000;
    var apiKey = openai_key || process.env.OPEN_AI_KEY;
    let endpoint = "https://icropenaiservice.openai.azure.com/openai/deployments/icrgpt-35-turbo-16k";
    if (!apiKey) {
        console.warn("Skipping 'OpenAI suggestions' test, key not set.");
        return;
    }
    it('OpenAI suggestions', async () => {
        var matches = [];
        await client.getMatches(ort, "Remove this stupid line of terrible code", matches, apiKey, endpoint);
        expect(matches.length).to.be.equal(1);
        var match = matches[0];
        expect(match.shortMessage).to.be.equal("Negative sentiment");
        expect(match.replacements.length).to.be.equal(3);
    }).timeout(timeout);
});
