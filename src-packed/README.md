# What is `src-packed`?

Files here are packed into a single `packed.js` via `package.json`:

```json
"xtbuild": {
    "js_bundles": [
        {
            "name": "packed",
            "src": "./src-packed/*.js"
        }
    ],
}
```
