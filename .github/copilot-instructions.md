# Inclusive Code Reviews Browser Extension - AI Agent Instructions

## Project Overview

This Chrome/Edge extension analyzes text in real-time on GitHub and Azure DevOps to suggest more inclusive language in code reviews. It uses both rule-based suggestions and a custom ONNX ML model for sentiment analysis, with optional OpenAI integration for enhanced suggestions.

## Architecture & Key Components

### Core Processing Pipeline
1. **Content Scripts** (`src/content/`) inject into web pages and capture text input
2. **Background Service Worker** (`src/background.js`) orchestrates validation using imported modules
3. **Packed Modules** (`src-packed/`) contain the core logic bundled via `extension-cli`
4. **ONNX Model** (`assets/model.onnx`) runs sentiment analysis entirely in-browser

### Critical File Structure
```
src-packed/          # Core business logic (bundled into packed.js)
├── suggestions.js   # Rule-based inclusive language replacements
├── validator.js     # Main validation orchestrator
├── textAnalytics.js # Text preprocessing and ONNX model inference
└── secrets.js       # API keys (gitignored, see setup)

src/                 # Extension-specific code
├── manifest.json    # Extension configuration
├── background.js    # Service worker entry point
└── content/         # DOM injection and UI

test/               # Mocha tests with ONNX integration
```

## Development Workflows

### Setup & Build
```bash
npm install
# Create src-packed/secrets.js with API keys (or empty strings for dev)
npx xt-build         # Build Chrome extension
npx xt-test          # Run tests
```

### Extension CLI Integration
- Uses `extension-cli` package for building and bundling
- `_import.js` configures ONNX runtime with CDN paths
- Build outputs `release.zip` for browser installation

### Testing Patterns
- Tests run with `onnxruntime-node` for server-side execution
- OpenAI tests require real API calls (20s timeout, 2 retries)
- Use `npx xt-test` or VS Code debugger for breakpoints

## Code Patterns & Conventions

### Suggestion System (`src-packed/suggestions.js`)
```javascript
const allReplacements = {
    "blacklist": ["denylist", "exclusion list", "block list"],
    "guys": ["folks", "friends", "people", "everyone"],
    // Categories: socially charged, gendered, ableist, technical
};
```

### ML Model Integration (`src-packed/textAnalytics.js`)
- Preprocesses text: removes code blocks, image tags, normalizes whitespace
- ONNX model predicts sentiment scores (threshold: 0.6 for negative)
- Model runs client-side, no text sent to servers (except OpenAI feature)

### Validation Flow (`src-packed/validator.js`)
```javascript
// Main entry point
export async function getMatches(ort, text, matches) {
    // 1. Rule-based suggestions check
    // 2. ONNX sentiment analysis
    // 3. Populate matches array with issues
}
```

### Content Script Architecture
- Built on LanguageTool foundation (see LICENSE)
- `LTAssistant` class manages DOM interaction and highlighting
- Supports iframe injection with `all_frames: true`

## Integration Points

### External Services
- **OpenAI**: Optional rewrite suggestions via Azure endpoint
- **Application Insights**: Telemetry for usage analytics
- **ONNX Runtime**: WebAssembly model execution

### Browser Extension APIs
- `scripting` permission for content injection
- `storage` for user preferences and state
- `contextMenus` for right-click integration
- Service Worker architecture (Manifest V3)

## Common Development Tasks

### Adding New Suggestions
1. Edit `src-packed/suggestions.js` with new replacements
2. Add tests in `test/suggestions.js`
3. Rebuild with `npx xt-build`

### Updating ML Model
1. Replace `assets/model.onnx` with new model
2. Update inference logic in `textAnalytics.js` if needed
3. Test with various text samples

### Debugging Content Scripts
- Use browser DevTools on target pages
- Console logs appear in page context, not extension
- VS Code debugger works for background scripts and tests

### Packaging for Distribution
- `npx xt-build` creates `release.zip`
- Drag zip file to `edge://extensions/` or `chrome://extensions/`
- Enable Developer Mode for side-loading

## Dependencies & Constraints

- **Node.js 16+** required for build system
- **ONNX Runtime Web 1.21+** for model execution
- **extension-cli** handles Webpack bundling and manifest generation
- Content Security Policy allows `'wasm-unsafe-eval'` for ONNX
- Text length limits: 10k chars (standard), 60k (premium)
