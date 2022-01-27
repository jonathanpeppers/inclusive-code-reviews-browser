/*
    Contains a list of phrases that produce a negative sentiment but can be ignored.
    Be conscientious when adding new items to this file, as we don't want to filter out generic words/phrases that can be used in many contexts.
*/
export const ignorablePhrases = [
    "error",
    "build failure",
    "test failure",
];