const { openai_key } = require("../src-packed/secrets");
const { Configuration, OpenAIApi } = require("openai");

// A lot of this came from:
// https://github.com/openai/openai-node/issues/53#issuecomment-1517604780
const openai = new OpenAIApi(new Configuration({
  apiKey: openai_key,
  basePath: 'https://icropenaiservice.openai.azure.com/openai/deployments/icrgpt-35-turbo',
  baseOptions: {
    headers: { 'api-key': openai_key },
    params: {
      // https://learn.microsoft.com/azure/cognitive-services/openai/reference#chat-completions
      'api-version': '2023-03-15-preview'
    }
  }
}));

describe('openai', () => {
  it('simple prompt', async () => {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'What is the meaning of life?',
      // 0 accurate, 1 creative
      temperature: 0.5
    });
    const result = response.data.choices[0].text;
    expect(result.length).to.not.be.equal(0);
  });

  it('basic comment rewrite', async () => {
    let comment = "Remove this line of code. This is a wasted line of code.";

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages:
        [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": "Rewrite this sentence in a more friendly manner: " + comment
          }
        ],
      // 0 accurate, 1 creative
      temperature: 0
    });

    let result = response.data.choices[0].message.content;
    expect(result).to.be.equal("Hey there! Would you mind removing this line of code? It doesn't seem to be necessary and could be taking up some space. Thanks!");
  });

  it('basic comment rating', async () => {
    let comment = "Remove this line of code. This is a wasted line of code.";

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages:
        [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": "In a scale from 0 to 10. 0 means not polite at all. 10 means very polite. Please tell me only the score number of this sentence: " + comment
          }
        ],
      // 0 accurate, 1 creative
      temperature: 0
    });

    let result = response.data.choices[0].message.content;
    expect(result.length).to.not.be.equal(0);
  });
});