# inclusive-code-comments

A chrome web extension for improving online comments.

This is built using the `extension-cli` module:

https://www.npmjs.com/package/extension-cli

To setup your API key, create a `src/packed/secrets.js` file with:

    export const api_key = "<put the real key here>";

To build:

    npx xt-build

To run tests:

    npx xt-test

To install in Edge:

1. Navigate to `edge://extensions/`
1. Enable the `Developer Mode` toggle in the bottom left
1. Drag the `release.zip` file produced by the build into Edge.

Instructions should be similar for Google Chrome.

## Links & Docs

Extension CLI

* https://www.npmjs.com/package/extension-cli

Azure Text Analytics

* https://docs.microsoft.com/azure/cognitive-services/Text-Analytics/overview
* https://www.npmjs.com/package/@azure/ai-text-analytics/v/5.1.0
* https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Sentiment/console

## Attribution

This is a prototype based on:

* https://languagetool.org/
* [Chrome Extension](https://chrome.google.com/webstore/detail/grammar-and-spell-checker/oldceeleldhonbafppcapldpdifcinji)
* [Github Repo](https://github.com/languagetool-org/languagetool)
* See [COPYING.txt](COPYING.txt) for original license.
