// Fix webpack publicPath auto-detection issue in browser extension context
// This must be set before any webpack imports to prevent "Automatic publicPath is not supported in this browser" error
__webpack_public_path__ = './';

import * as ort from 'onnxruntime-web';
globalThis.ort = ort;

// Use a CDN for the WebAssembly binaries, see:
// * https://onnxruntime.ai/docs/tutorials/web/deploy.html#webassembly-binaries
// * https://www.jsdelivr.com/
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/';
