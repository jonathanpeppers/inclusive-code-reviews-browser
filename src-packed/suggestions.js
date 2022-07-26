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
    "blackhat": ["criminal", "unethical engineer", "unethical developer"],
    "whitehat": ["ethical engineer", "ethical developer"],
    "grayhat": ["hacktivist"],
    "mob programming": ["team"],
    "whitespace": ["empty space", "blank", "formatting"],
    "master": ["main", "primary"],
    "scrum master": ["agile lead", "agile program manager", "scrum coach", "scrum leader"],
    "web master": ["web product owner"],
    "slave": ["secondary", "replica", "standby"],
    "culture fit": ["values fit", "cultural contribution"],
    "minority": ["marginalized groups", "underrepresented groups"],
    "native": ["core", "built-in", "unmanaged"],
    // gendered 
    "guys": ["folks", "friends", "people", "you all", "y'all", "all", "everyone"],
    "ladies": ["folks", "friends", "people", "you all", "y'all", "all", "everyone"],
    "manpower": ["labor"],
    "man hours": ["labor hours", "person hours", "engineer hours", "hours of effort"],
    "chairman": ["chairperson"],
    "foreman": ["foreperson"],
    "girl": ["woman"],
    "female": ["woman"],
    "male cable": ["input"],
    "male connector": ["input"],
    "female cable": ["socket"],
    "female connector": ["socket"],
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
    "crazy": ["unexpected", "unpredictable", "wild"],
    "insane": ["unexpected", "suboptimal"],
    "OCD": ["organized", "detail-oriented"],
    "sanity check": ["quick check", "confidence check", "coherence check"],
    "dummy": ["placeholder", "sample"],
    "handicapped": ["disabled", "person with disabilities"],
    // violent
    "hang": ["freeze"],
    "hanging": ["frozen", "stuck"],
    "crushing it": ["elevating", "exceeding expectations", "excelling"],
    "killing it": ["elevating", "exceeding expectations", "excelling"],
    "kill": ["stop", "cancel"],
    "execute": ["start", "run"],
    // ageist
    "grandfather": ["flagship", "established", "rollover", "carryover", "classic"],
    "legacy": ["flagship", "established", "rollover", "carryover", "classic"],
    // custom negative sentiment just leave replacements empty
    // https://www.oxfordinternationalenglish.com/dictionary-of-british-slang/
    "is pants": [],
    "naff": [],
    "tosh": [],
    "eejit": [],
    "faff": [],
    "gobby": [],
    "numpty": [],
    "shirty": [],
    "wonky": [],
};

// returns suggestions for certain words
export function getSuggestions(text) {
    var suggestions = [];
    for (const [key, values] of Object.entries(allReplacements)) {
        var regex = new RegExp('\\b' + key + '\\b', "gi");
        var matches = text.matchAll(regex);
        for (var m of matches) {
            if (m.index != -1) {
                var replacements = [];
                var textToReplace = text.substring(m.index, m.index + key.length);

                if (isCapitalized(textToReplace)) {
                    values.forEach(value => replacements.push({ value: capitalize(value) }));
                } else {
                    values.forEach(value => replacements.push({ value: value }));
                }

                suggestions.push({
                    index: m.index,
                    length: key.length,
                    replacements: replacements,
                });
            }
        }
    }
    return suggestions;
}

export function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function isCapitalized(word) {
    return /[A-Z]/.test(word.charAt(0));
}
