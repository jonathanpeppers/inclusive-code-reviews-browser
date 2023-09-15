const { Configuration, OpenAI } = require("openai");

const configObjectLocalStorageName = "icr-openai-config";

export function setAzureManagedConfig(endpoint, key) {
  let config = {
    azureEndpoint: endpoint,
    azureKey: key
  };

  window.localStorage.setItem(configObjectLocalStorageName, JSON.stringify(config));
}

export function setPublicOpenaiConfig(key) {
  let config = {
    openaiApiKey: key
  };

  window.localStorage.setItem(configObjectLocalStorageName, JSON.stringify(config));
}

export function clearOpenaiConfig() {
  window.localStorage.removeItem(configObjectLocalStorageName);
}

export function getOpenaiClient() {
  let serilizedConfig = window.localStorage.getItem(configObjectLocalStorageName);

  if (!serilizedConfig) {
    return null;
  }

  let parsedConfig = JSON.parse(serilizedConfig);

  if (Object.hasOwn(parsedConfig, 'azureEndpoint') && Object.hasOwn(parsedConfig, 'azureKey')) {
    if (!parsedConfig.azureEndpoint.endsWith("/")) {
      parsedConfig.azureEndpoint = parsedConfig.azureEndpoint + "/";
    }

    var openai = new OpenAI({
      apiKey: parsedConfig.azureKey,
      baseURL: `${parsedConfig.azureEndpoint}openai/deployments/icrgpt-35-turbo-16k`,
      defaultHeaders: { 
        'api-key': parsedConfig.azureKey
      },
      defaultQuery:  {
        // https://learn.microsoft.com/azure/cognitive-services/openai/reference#chat-completions
        'api-version': '2023-03-15-preview'
      },
      // NOTE: this warns inside our tests and the chrome extension, have no choice really
      dangerouslyAllowBrowser: true
    });

    return openai;
  } else if (Object.hasOwn(parsedConfig, 'openaiApiKey')){
    var openai = new OpenAI({
      apiKey: parsedConfig.openaiApiKey,
      // NOTE: this warns inside our tests and the chrome extension, have no choice really
      dangerouslyAllowBrowser: true
    });
    return openai;
  }

  return null;
} 