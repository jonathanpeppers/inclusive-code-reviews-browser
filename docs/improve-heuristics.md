# Report sentence to improve heuristics

If you are investigating an issue like:

https://github.com/jonathanpeppers/inclusive-code-reviews-browser/issues/137

To solve this:

1. Test `main`, does it still happen there? If not, you might be able
   to close -- as our custom machine learning model may have fixed it.

2. If the problem still occurs, try the same phrase in our ML tests:

https://github.com/jonathanpeppers/inclusive-code-reviews-ml/blob/main/onnxjs/tests/test_cases.json

3. If it still fails there, add a *similar* phrase (not verbatim!) to:

https://github.com/jonathanpeppers/inclusive-code-reviews-ml/blob/main/comments/classified.csv

4. Update the model as described here:

https://github.com/jonathanpeppers/inclusive-code-reviews-ml#updating-the-model
