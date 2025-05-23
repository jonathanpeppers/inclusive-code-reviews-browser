#!/bin/bash

# Script to update the ML model from inclusive-code-reviews-ml repository
# Usage: ./scripts/update-model.sh <artifact_url> <commit_hash>
# Example: ./scripts/update-model.sh https://github.com/jonathanpeppers/inclusive-code-reviews-ml/actions/runs/15218905919/artifacts/123456/models.zip 8936534bb121270301675947fb52bcb8f8a14011

# Check command line arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <artifact_url> <commit_hash>"
    echo "Example: $0 https://github.com/jonathanpeppers/inclusive-code-reviews-ml/actions/runs/15218905919/artifacts/123456/models.zip 8936534bb121270301675947fb52bcb8f8a14011"
    exit 1
fi

ARTIFACT_URL=$1
COMMIT_HASH=$2
TEMP_DIR=$(mktemp -d)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MODEL_PATH="$REPO_ROOT/assets/model.onnx"
BACKUP_PATH="$TEMP_DIR/model.onnx.backup"

echo "Updating ML model to commit: $COMMIT_HASH"
echo "Artifact URL: $ARTIFACT_URL"

# Backup current model
echo "Backing up current model..."
if [ -f "$MODEL_PATH" ]; then
    cp "$MODEL_PATH" "$BACKUP_PATH"
    echo "Backup created at: $BACKUP_PATH"
else
    echo "Warning: No existing model found at $MODEL_PATH"
fi

# Download the artifact
echo "Downloading artifact from $ARTIFACT_URL..."
MODELS_ZIP="$TEMP_DIR/models.zip"
curl -L -o "$MODELS_ZIP" "$ARTIFACT_URL"
if [ $? -ne 0 ]; then
    echo "Error: Failed to download artifact"
    exit 1
fi

# Extract the model
echo "Extracting model.onnx from artifact..."
unzip -j "$MODELS_ZIP" "model.onnx" -d "$TEMP_DIR"
if [ $? -ne 0 ]; then
    echo "Error: Failed to extract model from zip"
    exit 1
fi

# Check if model was extracted successfully
if [ ! -f "$TEMP_DIR/model.onnx" ]; then
    echo "Error: model.onnx not found in the artifact"
    exit 1
fi

# Copy the model to the assets directory
echo "Copying model to assets directory..."
cp "$TEMP_DIR/model.onnx" "$MODEL_PATH"
if [ $? -ne 0 ]; then
    echo "Error: Failed to copy model to assets directory"
    exit 1
fi

# Update the model information in docs
echo "Updating documentation..."
sed -i "s/\*\*Commit Hash\*\*: \`[0-9a-f]*\`/**Commit Hash**: \`$COMMIT_HASH\`/g" "$REPO_ROOT/docs/model-update-process.md"
sed -i "s/\*\*ML Repository Commit\*\*: \`[0-9a-f]*\`/**ML Repository Commit**: \`$COMMIT_HASH\`/g" "$REPO_ROOT/assets/README.md"

# Update the model updates document
TODAY=$(date +"%b %d, %Y")
sed -i "s/The current model was updated on .* from/The current model was updated on $TODAY from/g" "$REPO_ROOT/docs/model-updates.md"
sed -i "s/\*\*Commit Hash\*\*: \`[0-9a-f]*\`/**Commit Hash**: \`$COMMIT_HASH\`/g" "$REPO_ROOT/docs/model-updates.md"

echo "Model update completed successfully!"
echo "Remember to commit the changes with a message mentioning the commit hash."
echo "Suggested commit message: Update model.onnx to commit $COMMIT_HASH"

# Clean up
rm -rf "$TEMP_DIR"