import regeneratorRuntime from "regenerator-runtime";

describe('Test extension', () => {

    const fs = require('fs');

    //NOTE: create this file in the root of the repo, we don't commit it to the repo
    const api_key = fs.readFileSync('.apikey', 'utf8');
    const server_url = "https://westus.api.cognitive.microsoft.com/";
    const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
    const client = new TextAnalyticsClient(server_url, new AzureKeyCredential(api_key));

    it('Text Analytics library loads', () => {
        const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
        const client = new TextAnalyticsClient("<endpoint>", new AzureKeyCredential("Not a real API key at all"));
        expect(client).to.be.not.null;
    });

    it('Negative sentiment', async () => {
        const [result] = await client.analyzeSentiment(["This is terrible!"]);
        expect(result.sentences[0].sentiment).to.be.equal("negative");
    });

    it('Positive sentiment', async () => {
        const [result] = await client.analyzeSentiment(["This is great!"]);
        expect(result.sentences[0].sentiment).to.be.equal("positive");
    });

    it('Neutral sentiment', async () => {
        const [result] = await client.analyzeSentiment(["Hello World!"]);
        expect(result.sentences[0].sentiment).to.be.equal("neutral");
    });
});