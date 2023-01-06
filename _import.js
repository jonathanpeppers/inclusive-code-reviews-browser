import * as ort from 'onnxruntime-web';
if (typeof window !== 'undefined') {
    window.ort = ort;
}
