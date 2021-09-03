const replacements = {
    "terrible": "not so great",
    "whitelist": "allowlist",
    "blacklist": "denylist",
    "master": "main",
    "slave": "secondary",
    "crazy": "weird",
    "hang": "freeze",
    "hanging": "frozen"
};

// returns suggestions for certain words
export function getSuggestions(text) {
    var suggestions = [];
    for (const [key, value] of Object.entries(replacements)) {
        var regex = new RegExp(key, "gi");
        var index = text.search(regex);
        if (index != -1) {
            suggestions.push({
                index: index,
                length: key.length,
                replacements: [{ value: key }, { value: value }],
            });
        }
    }
    return suggestions;
}
