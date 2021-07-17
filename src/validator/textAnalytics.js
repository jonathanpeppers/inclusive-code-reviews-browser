const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const fs = require('fs');
const api_key = fs.readFileSync('.apikey', 'utf8');
const server_url = "https://westus.api.cognitive.microsoft.com/";
const client = new TextAnalyticsClient(server_url, new AzureKeyCredential(api_key));

export async function analyzeSentiment(text) {
    const [result] = await client.analyzeSentiment([text]);
    return result.sentences[0].sentiment;
}
