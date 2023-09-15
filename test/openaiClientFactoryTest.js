const { openai_key, public_openai_key } = require("../src-packed/secrets");
var assert = require('assert');

// Mock localStorage
(function () {

    function createStorage() {
        let UNSET = Symbol();
        let s = {};
        let noopCallback = () => { };
        let _itemInsertionCallback = noopCallback;

        Object.defineProperty(s, 'setItem', {
            get: () => {
                return (k, v = UNSET) => {
                    if (v === UNSET) {
                        throw new TypeError(`Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 1 present.`);
                    }
                    if (!s.hasOwnProperty(String(k))) {
                        _itemInsertionCallback(s.length);
                    }
                    s[String(k)] = String(v);
                };
            }
        });

        Object.defineProperty(s, 'getItem', {
            get: () => {
                return k => {
                    if (s.hasOwnProperty(String(k))) {
                        return s[String(k)];
                    } else {
                        return null;
                    }
                };
            }
        });

        Object.defineProperty(s, 'removeItem', {
            get: () => {
                return k => {
                    if (s.hasOwnProperty(String(k))) {
                        delete s[String(k)];
                    }
                };
            }
        });

        Object.defineProperty(s, 'clear', {
            get: () => {
                return () => {
                    for (let k in s) {
                        delete s[String(k)];
                    }
                };
            }
        });

        Object.defineProperty(s, 'length', {
            get: () => {
                return Object.keys(s).length;
            }
        });

        Object.defineProperty(s, "key", {
            value: k => {
                let key = Object.keys(s)[String(k)];
                return (!key) ? null : key;
            },
        });

        Object.defineProperty(s, 'itemInsertionCallback', {
            get: () => {
                return _itemInsertionCallback;
            },
            set: v => {
                if (!v || typeof v != 'function') {
                    v = noopCallback;
                }
                _itemInsertionCallback = v;
            }
        });

        return s;
    }

    const global = require("global")
    const window = require("global/window")

    Object.defineProperty(global, 'Storage', {
        value: createStorage,
    });
    Object.defineProperty(window, 'Storage', {
        value: createStorage,
    });

    Object.defineProperty(global, 'localStorage', {
        value: createStorage(),
    });
    Object.defineProperty(window, 'localStorage', {
        value: global.localStorage,
    });

    Object.defineProperty(global, 'sessionStorage', {
        value: createStorage(),
    });
    Object.defineProperty(window, 'sessionStorage', {
        value: global.sessionStorage,
    });
}());

describe('openai client factory', () => {
    // Just return if the key is not set.
    // This would happen on a PR from a fork.
    if (!openai_key) {
        console.warn("Skipping openai client factory tests, key not set.");
        return;
    }

    let azureEndpoint = "https://icropenaiservice.openai.azure.com/";

    const factory = require('../src-packed/openaiClientFactory');

    it('would get empty', () => {
        factory.clearOpenaiConfig();
        var result = factory.getOpenaiClient();
        assert.equal(result, undefined);
    });

    it('would store the azure config and get the instance', async () => {
        factory.setAzureManagedConfig(azureEndpoint, openai_key);

        var openai = factory.getOpenaiClient();
        assert.notEqual(openai, undefined);

        const response = await openai.chat.completions.create({
            model: 'text-davinci-003',
            messages:
                [
                    {
                        "role": "user",
                        "content": 'What is the meaning of life?'
                    }
                ],
            // 0 accurate, 1 creative
            temperature: 0.5
        });
        let result = response.choices[0].message.content;
        expect(result.length).to.not.be.equal(0);

        // clear would remove the stored config
        factory.clearOpenaiConfig();

        openai = factory.getOpenaiClient();
        assert.equal(openai, undefined);
    }).timeout(5000);

    it('basic comment rewrite', async () => {
        factory.setAzureManagedConfig(azureEndpoint, openai_key);
        var openai = factory.getOpenaiClient();
        assert.notEqual(openai, undefined);

        let comment = "Remove this line of code. This is a wasted line of code.";
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
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

        let result = response.choices[0].message.content;

        expect(result.length).to.not.be.equal(0);
        expect(result).to.not.be.contains("This is a wasted line of code");
    }).timeout(5000);

    it('basic comment rating', async () => {
        factory.setAzureManagedConfig(azureEndpoint, openai_key);
        var openai = factory.getOpenaiClient();
        assert.notEqual(openai, undefined);

        let comment = "Remove this line of code. This is a wasted line of code.";

        const response = await openai.chat.completions.create({
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

        let result = response.choices[0].message.content;
        expect(result.length).to.not.be.equal(0);
    }).timeout(5000);
});
