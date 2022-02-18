/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
let isMessageListenerSet = !1;
function reloadContentScriptsIfNecessary(e, t) {
    isMessageListenerSet ||
        ((isMessageListenerSet = !0),
        browser.runtime.onMessage.addListener((s, a) => {
            if (s && "INJECT_SCRIPTS" === s.command) {
                (browser.runtime.getManifest().content_scripts || []).forEach((t) => {
                    t.js &&
                        t.js.forEach((t) => {
                            browser.scripting.executeScript(e, { files: [ "/" + t ], matchAboutBlank: !0, allFrames: !1, frameId: a.frameId }).catch((e) => console.error(e.message));
                        }),
                        t.css &&
                            t.css.forEach((t) => {
                                browser.tabs.insertCSS(e, { file: "/" + t, matchAboutBlank: !0, allFrames: !1, frameId: a.frameId }).catch((e) => console.error(e.message));
                            });
                }),
                    Tracker.trackEvent("Action", "inject_scripts", t);
            }
        })),
        browser.scripting
            .executeScript(e, {
                func: inject,
                matchAboutBlank: !0,
                allFrames: !0,
            })
            .catch(() => null);
}

function inject() {
    if (typeof(LTAssistant) === "undefined" && navigator.userAgent.match(/Chrome\/|Chromium\//) && !location.pathname.includes('_generated_background_page')) {
        window.__ltLastActiveElement = document.activeElement;
        chrome.runtime.sendMessage({ command: "INJECT_SCRIPTS" }, () => null);
    }
}
