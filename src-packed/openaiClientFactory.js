const { Configuration, OpenAIApi } = require("openai");

const configObjectLocalStorageName = "icr-openai-config";

export function setAzureManagedConfig(endpoint, key) {
  let config = {
    azureEndpoint: endpoint,
    azureKey: key
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

    var epBasePath = `${parsedConfig.azureEndpoint}openai/deployments/icrgpt-35-turbo`

    var openai = new OpenAIApi(new Configuration({
      apiKey: parsedConfig.azureKey,
      basePath: epBasePath,
      baseOptions: {
        headers: { 'api-key': parsedConfig.azureKey },
        params: {
          // https://learn.microsoft.com/azure/cognitive-services/openai/reference#chat-completions
          'api-version': '2023-03-15-preview'
        }
      }
    }));

    return openai;
  }

  return null;
} 