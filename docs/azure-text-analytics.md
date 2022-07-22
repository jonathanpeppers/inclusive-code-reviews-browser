# Azure Text Analytics

In past versions of this extension, your comments were sent to
[Azure Text Analytics][text-analytics] for sentiment analysis. No text
is stored anywhere, at any time.

For example, you might make a comment on a Github pull request. Seems
OK, right? Is it a "mean" comment?

![negative sentiment](docs/negative-sentiment.png)

We could certainly reword this be be better -- more inclusive and
generally friendlier:

![negative sentiment fixed](docs/negative-sentiment-fixed.png)

[text-analytics]: https://docs.microsoft.com/azure/cognitive-services/Text-Analytics/overview

## Links & Docs

* [Documentation][text-analytics]
* [npm package](https://www.npmjs.com/package/@azure/ai-text-analytics/v/5.1.0)
* [API Test Console](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-1/operations/Sentiment/console)
