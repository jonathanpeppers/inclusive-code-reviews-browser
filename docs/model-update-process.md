# Model Update Process

This document describes the process for updating the Machine Learning model used in the Inclusive Code Reviews browser extension.

## Source Repository

The ML model used in this extension is built from:
- Repository: [jonathanpeppers/inclusive-code-reviews-ml](https://github.com/jonathanpeppers/inclusive-code-reviews-ml)

## Update Process

To update the model:

1. Go to the latest commit on main branch of the ML repository
2. Find the GitHub action run named `models / build (push)`
3. Download the `models` artifact
4. Unzip `models.zip`
5. Copy `model.onnx` to replace `assets/model.onnx` in this repository
6. Run tests to verify the model works correctly
7. Commit changes with a message mentioning the commit hash from the ML repository

## Latest Update

The current model was updated from commit:
- **Hash**: `8936534bb121270301675947fb52bcb8f8a14011`
- **Title**: "[samples] Try out ONNX model in a C# console app"
- **Date**: May 23, 2025

The model file is located at:
- `assets/model.onnx`

## Verification

After updating the model, you should verify it works correctly by:
1. Running tests: `npm test`
2. Testing the browser extension manually with some sample text inputs
3. Verifying that sentiment analysis works as expected

If you encounter issues, please check the console for any errors related to model loading or inference.