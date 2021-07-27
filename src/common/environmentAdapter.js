/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class EnvironmentAdapterClass {}
const EnvironmentAdapter = class {
    static init(t) {
        this._instance = t;
    }
    static isProductionEnvironment() {
        return this._instance.isProductionEnvironment();
    }
    static isRuntimeConnected() {
        return this._instance.isRuntimeConnected();
    }
    static getVersion() {
        return this._instance.getVersion();
    }
    static getTrackingId() {
        return this._instance.getTrackingId();
    }
    static getType() {
        return this._instance.getType();
    }
    static getURL(t) {
        return this._instance.getURL(t);
    }
    static getUILanguageCode() {
        return this._instance.getUILanguageCode();
    }
    static loadContentScripts(t, n) {
        this._instance.loadContentScripts(t, n);
    }
    static getPreferredLanguages() {
        return this._instance.getPreferredLanguages();
    }
    static startDictionarySync() {
        return this._instance.startDictionarySync();
    }
    static addWordToDictionary(t) {
        return this._instance.addWordToDictionary(t);
    }
    static addWordsToDictionary(t) {
        return this._instance.addWordsToDictionary(t);
    }
    static removeWordFromDictionary(t) {
        return this._instance.removeWordFromDictionary(t);
    }
    static clearDictionary() {
        return this._instance.clearDictionary();
    }
    static updateDictionary() {
        return this._instance.updateDictionary();
    }
    static loadSynonyms(t, n, e) {
        return this._instance.loadSynonyms(t, n, e);
    }
    static trackEvent(t, n) {
        return this._instance.trackEvent(t, n);
    }
    static trackTextLength(t) {
        return this._instance.trackTextLength(t);
    }
    static pageLoaded(t, n, e, i, a) {
        return this._instance.pageLoaded(t, n, e, i, a);
    }
    static ltAssistantStatusChanged(t, n) {
        return "number" == typeof t ? this._instance.ltAssistantStatusChanged(t, n) : this._instance.ltAssistantStatusChanged(t);
    }
    static validate(t, n, e, i, a, s) {
        return this._instance.validate(t, n, e, i, a, s);
    }
    static isOptionsPageSupported() {
        return this._instance.isOptionsPageSupported();
    }
    static openOptionsPage(t, n) {
        return this._instance.openOptionsPage(t, n);
    }
    static isFeedbackFormSupported() {
        return this._instance.isFeedbackFormSupported();
    }
    static openFeedbackForm(t, n, e) {
        return this._instance.openFeedbackForm(t, n, e);
    }
};
