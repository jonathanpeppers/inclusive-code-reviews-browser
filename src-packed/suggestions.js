/*
    Some sources: 
    - https://medium.com/pm101/inclusive-language-guide-for-tech-companies-and-startups-f5b254d4a5b7
    - https://buffer.com/resources/inclusive-language-tech/
    - https://www.aswf.io/blog/inclusive-language/
    - https://www.it.northwestern.edu/about/it-projects/dei/glossary.html
*/
const allReplacements = {
    // socially charged
    "whitelist": ["allowlist", "inclusion list", "safe list"],
    "blacklist": ["denylist", "exclusion list", "block list", "banned list"],
    "blackbox": ["closed box", "mystery box"],
    "whitebox": ["open box", "clear box"],
    "blackhat": ["criminal", "unethical hacker"],
    "whitehat": ["ethical hacker"],
    "grayhat": ["hacktivist"],
    "mob programming": ["team"],
    "whitespace": ["empty space", "blank"],
    "master": ["main", "primary"],
    "scrum master": ["agile lead", "agile program manager", "scrum coach", "scrum leader"],
    "web master": ["web product owner"],
    "slave": ["secondary", "replica", "standby"],
    "culture fit": ["values fit", "cultural contribution"],
    "minority": ["marginalized groups, underrepresented groups"],
    "native": ["core", "built-in"],
    // gendered 
    "guys": ["folks", "people", "you all", "y'all", "all", "everyone"],
    "ladies": ["folks", "people", "you all", "y'all", "all", "everyone"],
    "manpower": ["labor"],
    "man hours": ["labor hours", "person hours", "engineer hours", "hours of effort"],
    "chairman": ["chairperson"],
    "foreman": ["foreperson"],
    "girl": ["woman"],
    "female": ["woman"],
    "middleman": ["middle person", "mediator", "liaison"],
    "hacker": ["engineer", "developer"],
    "housekeeping": ["maintenance", "cleanup"],
    "wife": ["spouse", "partner"],
    "husband": ["spouse", "partner"],
    "boyfriend": ["spouse", "partner"],
    "girlfriend": ["spouse", "partner"],
    "mother": ["parent"],
    "father": ["parent"],
    "mom test": ["user test"],
    "girlfriend test": ["user test"],
    // ableist
    "normal": ["typical"],
    "abnormal": ["atypical"],
    "crazy": ["unexpected", "unpredictable"],
    "OCD": ["organized", "detail-oriented"],
    "sanity check": ["quick check", "confidence check", "coherence check"],
    "dummy": ["placeholder", "sample"],
    "handicapped": ["disabled", "person with disabilities"],
    // violent
    "hang": ["freeze"],
    "hanging": ["frozen"],
    "crushing it": ["elevating", "exceeding expectations", "excelling"],
    "killing it": ["elevating", "exceeding expectations", "excelling"],
    // ageist
    "grandfather": ["flagship", "established", "rollover", "carryover"],
    "legacy": ["flagship", "established", "rollover", "carryover"],
};

// returns suggestions for certain words
export function getSuggestions(text) {
    var suggestions = [];
    for (const [key, values] of Object.entries(allReplacements)) {
        var regex = new RegExp('\\b' + key + '\\b', "gi");
        var index = text.search(regex);
        var replacements = [];
        values.forEach(value => {
            replacements.push({ value: key });
            replacements.push({ value: value });
        });
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
