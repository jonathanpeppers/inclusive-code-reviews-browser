const replacements = {
    "terrible": ["not so great"],
    "whitelist": ["allowlist"],
    "blacklist": ["denylist"],
    "master": ["main", "primary"],
    "slave": ["secondary"],
    "crazy": ["weird"],
    "hang": ["freeze"],
    "hanging": ["frozen"]
};

// returns suggestions for certain words
export function getSuggestions(text) {
    var suggestions = [];
    for (const [key, values] of Object.entries(replacements)) {
        var regex = new RegExp('\\b' + key + '\\b', "gi");
        var index = text.search(regex);
        var replacements = [];
        values.forEach(value => replacements.push([{ value: key }, { value: value }]));
        if (index != -1) {
            suggestions.push({
                index: index,
                length: key.length,
                replacements: replacements,
            });
        }
    }
    return suggestions;
}
