console.log('service worker loaded');

// These were the order of V2 background scripts
try {
    importScripts("packed.js", "config/config.js", "common/browserDetector.js", "common/utils.js", "common/eventBus.js", "common/messages.js", "common/i18nManager.js", "common/extensioni18nManager.js", "common/languageManager.js", "common/storageController.js", "common/extensionStorageController.js", "common/environmentAdapter.js", "common/extensionEnvironmentAdapter.js", "common/extension-init.js", "common/tracker.js", "background/graphemeSplitter.js", "background/validator.js", "background/dictionarySync.js", "background/synonyms.js", "background/extension-main.js");
} catch (e) {
    console.error(e);
}

addEventListener('activate', () => {
    console.log('service worker activated');
});