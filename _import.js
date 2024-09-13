import * as ort from 'onnxruntime-web';
globalThis.ort = ort;

// Use a CDN for the WebAssembly binaries, see:
// * https://onnxruntime.ai/docs/tutorials/web/deploy.html#webassembly-binaries
// * https://www.jsdelivr.com/
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/';
