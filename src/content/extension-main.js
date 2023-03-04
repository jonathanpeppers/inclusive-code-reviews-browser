/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
const tweaks = TweaksManager.getTweaks(getCurrentUrl());
let currentDocumentElement, interval;
function destroyOldInstances() {
    window.ltAssistant && window.ltAssistant.destroy(), dispatchCustomEvent(document, LTAssistant.events.DESTROY, { type: "extension" });
}
function initLTAssistant() {
    if (!(currentDocumentElement = document.documentElement)) return;
    if (currentDocumentElement.hasAttribute("data-lt-script-installed")) return void tweaks.init();
    if ((destroyOldInstances(), currentDocumentElement.hasAttribute("data-lt-installed"))) return;
    const e = {
        onDestroy: () => {
            window.clearInterval(interval);
        },
    };
    (window.ltAssistant = new LTAssistant(e, tweaks)),
        window.clearInterval(interval),
        (interval = window.setInterval(() => {
            currentDocumentElement !== document.documentElement && initLTAssistant();
        }, 1e3));
}
function onMessage(e, t) {
    return isGetSelectedTextMessage(e) ? onGetSelectedTextMessage(t, e) : (isDestroyMessage(e) && onDestroyMessage(t, e), !1);
}
function onGetSelectedTextMessage(e, t) {
    if (window.innerHeight < 20 || window.innerWidth < 20) return !1;
    const n = tweaks.getSelectedText();
    if (n) {
        const e = { initialCommand: "GET_SELECTED_TEXT", isSuccessful: !0, selectedText: n };
        return Promise.resolve(e);
    }
    return !1;
}
function onDestroyMessage(e, t) {
    destroyOldInstances();
    try {
        chrome.runtime.onMessage.removeListener(onMessage);
    } catch (e) {}
}
window.ltAssistant || (initLTAssistant(), chrome.runtime.onMessage.addListener(onMessage));
