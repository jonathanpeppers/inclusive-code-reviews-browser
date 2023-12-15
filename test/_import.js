// I found this was required for `npx xt-test` to compile at all
import regeneratorRuntime from "regenerator-runtime";

// Comment out if you want console output during test runs
console.log = () => { }

// Seed for OpenAI
globalThis.OpenAISeed = 1234;
