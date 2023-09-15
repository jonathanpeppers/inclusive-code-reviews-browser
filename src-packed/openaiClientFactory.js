const { OpenAI } = require("openai");

export function getOpenaiClient(apiKey, baseURL) {
    var config = {
        apiKey,
        // NOTE: this warns inside our tests and the chrome extension, have no choice really
        dangerouslyAllowBrowser: true
    }
    if (baseURL) {
        if (!baseURL.endsWith("/")) {
            baseURL += "/";
        }
        config.baseURL = baseURL;
        config.defaultHeaders = { 
            'api-key': apiKey
        };
        config.defaultQuery = {
            // https://learn.microsoft.com/azure/cognitive-services/openai/reference#chat-completions
            'api-version': '2023-03-15-preview'
        };
    }
    return new OpenAI(config);
} 