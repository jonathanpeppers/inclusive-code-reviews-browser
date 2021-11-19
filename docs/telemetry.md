# Telemetry

This doc describes what telemetry is currently recorded. This doc
should evolve over time to match the implementation.

If we should change something [file an issue][0]. Thanks!

Our general goals are:

1. Record general usage information.
1. Don't record any text that is inspected.
1. Don't record the URLs of any sites visited: except for Azure DevOps
   or Github organizations.

# Individual Users

Application Insights automatically records a random and unique `user_Id` value for
page views and custom events such as `IsVTD5OcT+9c4g7k8pN+Qp`.

This `user_Id` should remain stable as long as the browser extension is installed.
If you uninstall/reinstall the extension, the `user_Id` will change.

# Page Views

URLs are only recorded for:

1. https://github.com/[organization]/[repository]
1. https://dev.azure.com/*
1. https://devdiv.visualstudio.com/*

If we don't hit one of these cases, `not_specified` will be recorded.

# Custom Events

All events are sent to the App Insights SDK at the time they occurred.
It may take a few minutes for values to show up on the backend.

All values have a `timestamp` value recorded by the App Insights SDK.

## appliedSuggestion

The user clicked a replacement, such as `allowlist`:

![appliedSuggestion event][1]

We also report a running total since the extension was installed via `customMeasurements`:

```json
{"total":1}
```

## manualFix

This is somewhat more complicated scenario:

1. The user typed some text.
1. The extension recommended a change (either via `negativeWord` or `negativeSentence`).
1. The user changed the text.
1. Now the extension finds no issues.

`appliedSuggestion` should not trigger `manualFix`, file a bug if it does!

## ignoreSuggestion

The user clicked `Ignore in this text`:

![ignoreSuggestion event][1]

NOTE: `Turn off rule everywhere` is removed in latest version.

## negativeWord

1. The user pauses typing, and a negative "word" is underlined.

See the full word list in [suggestions.js][2].

## negativeSentence

1. The user pauses typing, and Azure Text Analytics reported a negative sentiment with a 75% confidence or higher.

We also report `customMeasurements` such as:

```json
{"positive":0,"neutral":0,"negative":1}
```

[0]: https://github.com/jonathanpeppers/inclusive-code-comments/issues
[1]: negative-word.png
[2]: ../src-packed/suggestions.js
