# inclusive-code-comments

A *prototype* chrome web extension for improving online comments such
as code reviews on Github or Azure DevOps. The idea is that the
extension would make suggestions *before* you post a comment. This
gives developers a chance to think about their phrasing and reword the
comment.

![popup](docs/popup.png)

For example, you might use the term "whitelist" in a code review on
Azure DevOps:

![negative word](docs/negative-word.png)

The word "allowlist" might be better (and more inclusive) terminology:

![negative word fixed](docs/negative-word-fixed.png)

We welcome changes to [suggestions.js](src-packed/suggestions.js), if
you know other words and terminology we can suggest. Please send a PR!

## Sentiment Analysis

In addition to checking commonly-used words, your comments are sent to
[Azure Text Analytics][text-analytics] for sentiment analysis. No text
is stored anywhere, at any time.

For example, you might make a comment on a Github pull request. Seems
OK, right? Is it a "mean" comment?

![negative sentiment](docs/negative-sentiment.png)

We could certainly reword this be be better -- more inclusive and
generally friendlier:

![negative sentiment fixed](docs/negative-sentiment-fixed.png)

[text-analytics]: https://docs.microsoft.com/azure/cognitive-services/Text-Analytics/overview

## Contributing

This is built using the `extension-cli` module:

https://www.npmjs.com/package/extension-cli

To setup your API key, create a `src-packed/secrets.js` file with:

    export const api_key = "<put the real key here>";

To build:

    npm install
    npx xt-build

To run tests:

    npx xt-test

If you don't want to build the extension from source, you can also
download build artifacts from Github actions:

![artifacts](docs/artifacts.png)

To install in Edge:

1. Navigate to `edge://extensions/`
1. Enable the `Developer Mode` toggle in the bottom left
1. Drag the `release.zip` file produced by the build into Edge.

Instructions should be similar for Google Chrome.

## Links & Docs

Extension CLI

* https://www.npmjs.com/package/extension-cli

Azure Text Analytics

* [Documentation][text-analytics]
* [npm package](https://www.npmjs.com/package/@azure/ai-text-analytics/v/5.1.0)
* [API Test Console](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Sentiment/console)

## Attribution

This is a prototype based on:

* https://languagetool.org/
* [Chrome Extension](https://chrome.google.com/webstore/detail/grammar-and-spell-checker/oldceeleldhonbafppcapldpdifcinji)
* [Github Repo](https://github.com/languagetool-org/languagetool)
* See [LICENSE](LICENSE) for original GPL license.
