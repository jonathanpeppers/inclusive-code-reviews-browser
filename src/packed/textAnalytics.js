const { api_key } = require("./secrets");
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const server_url = "https://westus.api.cognitive.microsoft.com/";
const client = new TextAnalyticsClient(server_url, new AzureKeyCredential(api_key));

export async function analyzeSentiment(text) {
    const [result] = await client.analyzeSentiment([text]);
    return result;
}

// For use inside the extension (which isn't using webpack)
// The best I came up with for now is to add this function to window.
window.analyzeSentiment = analyzeSentiment;
