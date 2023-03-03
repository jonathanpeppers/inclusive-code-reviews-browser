/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class ExtensionEnvironmentAdapter extends EnvironmentAdapterClass {
    constructor() {
        super(...arguments), (this._isProductionEnvironmentCached = null);
    }
    isProductionEnvironment() {
        if (null === this._isProductionEnvironmentCached) {
            if (BrowserDetector.isSafari()) return !0;
            BrowserDetector.isFirefox() ? (this._isProductionEnvironmentCached = !browser.runtime.id.match("languagetool.dev")) : (this._isProductionEnvironmentCached = "update_url" in browser.runtime.getManifest());
        }
        return this._isProductionEnvironmentCached;
    }
    isRuntimeConnected() {
        try {
            return browser.runtime.getManifest(), !0;
        } catch (e) {
            return !1;
        }
    }
    getVersion() {
        if (this.isRuntimeConnected()) {
            const e = browser.runtime.getManifest();
            return e && e.version ? e.version : "unknown";
        }
        return "unknown";
    }
    getTrackingId() {
        return BrowserDetector.isSafari() ? "13" : "12";
    }
    getType() {
        return "extension";
    }
    getURL(e) {
        return browser.runtime.getURL(e);
    }
    getUILanguageCode() {
        return chrome.i18n.getUILanguage();
    }
    loadContentScripts(e, n) {
        this.isRuntimeConnected() &&
            browser.runtime.getManifest().content_scripts.forEach((t) => {
                if ("js" === n && t.js) {
                    const n = t.js.map((e) => {
                        const n = this.getURL(e);
                        return fetch(n).then((e) => e.text());
                    });
                    Promise.all(n).then((n) => {
                        const t = n.join("\n");
                        e.eval(t);
                    });
                } else if ("css" === n && t.css) {
                    const n = t.css.map((e) => {
                        const n = this.getURL(e);
                        return fetch(n).then((e) => e.text());
                    });
                    Promise.all(n).then((n) => {
                        n.forEach((n) => {
                            const t = e.document.createElement("style");
                            (t.textContent = n), (e.document.head || e.document.documentElement).appendChild(t);
                        });
                    });
                }
            });
    }
    getPreferredLanguages() {
        return browser.runtime.sendMessage({ command: "GET_PREFERRED_LANGUAGES" });
    }
    startDictionarySync() {
        return browser.runtime.sendMessage({ command: "START_DICTIONARY_SYNC" });
    }
    updateDictionary() {
        return browser.runtime.sendMessage({ command: "UPDATE_DICTIONARY" });
    }
    addWordToDictionary(e) {
        const n = { command: "ADD_WORD_TO_DICTIONARY", word: e };
        return browser.runtime.sendMessage(n);
    }
    addWordsToDictionary(e) {
        const n = { command: "BATCH_ADD_WORDS_TO_DICTIONARY", words: e };
        return browser.runtime.sendMessage(n);
    }
    removeWordFromDictionary(e) {
        const n = { command: "REMOVE_WORD_FROM_DICTIONARY", word: e };
        return browser.runtime.sendMessage(n);
    }
    clearDictionary() {
        return browser.runtime.sendMessage({ command: "CLEAR_DICTIONARY" });
    }
    loadSynonyms(e, n, t) {
        const r = { command: "LOAD_SYNONYMS", wordContext: e, language: n, motherLanguage: t };
        return browser.runtime.sendMessage(r);
    }
    trackEvent(e, n) {
        const t = { command: "TRACK_EVENT", action: e, label: n };
        return browser.runtime.sendMessage(t);
    }
    trackTextLength(e) {
        const n = { command: "TRACK_TEXT_LENGTH", textLength: e };
        return browser.runtime.sendMessage(n);
    }
    pageLoaded(e, n, t, r, s) {
        const o = { command: "PAGE_LOADED", enabled: e, capitalization: n, supported: t, beta: r, unsupportedMessage: s };
        return browser.runtime.sendMessage(o);
    }
    ltAssistantStatusChanged(e, n) {
        const t = "object" == typeof e ? e : n,
            r = { command: "LTASSISTANT_STATUS_CHANGED", tabId: "number" == typeof e ? e : void 0, enabled: t.enabled, capitalization: t.capitalization };
        return browser.runtime.sendMessage(r);
    }
    validate(e, n, t, r, s, o) {
        const a = { command: "VALIDATE_TEXT", text: n, changedParagraphs: t, language: e.language, forceLanguage: e.forceLanguage, hasUserChangedLanguage: o, metaData: r, options: s };
        return browser.runtime.sendMessage(a);
    }
    isOptionsPageSupported() {
        return !0;
    }
    openOptionsPage(e, n) {
        const t = { command: "OPEN_OPTIONS", target: e, ref: n };
        return browser.runtime.sendMessage(t);
    }
    isFeedbackFormSupported() {
        return !0;
    }
    openFeedbackForm(e, n = "", t = "") {
        const r = { command: "OPEN_FEEDBACK_FORM", url: e, title: n, html: t };
        return browser.runtime.sendMessage(r);
    }
}
