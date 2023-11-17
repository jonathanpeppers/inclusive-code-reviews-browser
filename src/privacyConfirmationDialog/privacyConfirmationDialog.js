/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
if (
    ("localhost" === location.hostname ||
        "languagetoolplus.com" === location.hostname ||
        "languagetool.com" === location.hostname ||
        "www.languagetoolplus.com" === location.hostname ||
        "www.languagetool.com" === location.hostname ||
        "languagetool.org" === location.hostname ||
        "www.languagetool.org" === location.hostname ||
        location.protocol.match(/^(chrome|moz)-extension/)) &&
    document.querySelector("meta[name=lt-webextension-install-page]")
) {
    const e = StorageController.create();
    e.onReady(onInit);
    const t = document.getElementById("slogan"),
        n = document.getElementById("message"),
        o = document.getElementById("footer"),
        a = document.getElementById("privacyLink"),
        i = document.getElementById("confirm");
    function onInit() {
        const o = e.getManagedSettings();
        if (o.loginUrl) return void initManagedLogin(o.loginUrl);
        const r = e.getSettings();
        if (r.apiServerUrl === StorageControllerClass.getDefaultSettings().apiServerUrl) {
            const e = BrowserDetector.isSafari() ? "https://languagetool.org/?hidePremium=true" : "https://languagetool.org";
            n.innerHTML = i18nManager.getMessage("privacyNoteForDefaultServer", [e, "Inclusive Code Comments"]);
        } else n.innerHTML = i18nManager.getMessage("privacyNoteForOtherServer", escapeHTML(r.apiServerUrl));
        const g = BrowserDetector.isSafari() ? "https://languagetool.org/legal/privacy/?hidePremium=true" : "https://languagetool.org/legal/privacy/";
        (a.innerHTML = i18nManager.getMessage("privacyLinkForDefaultServer", [g])),
            (t.textContent = i18nManager.getMessage("privacyNoteSlogan")),
            (i.textContent = i18nManager.getMessage("continue")),
            (i.onclick = onConfirmClick),
            Tracker.trackPageView(chrome.runtime.getURL("privacyConfirmation/privacyConfirmation.html"));
    }
    function initManagedLogin(r) {
        (i.onclick = () => {
            goToManagedLogin(r, (t, n) => {
                e.updatePrivacySettings({ allowRemoteCheck: !0 }),
                    e.updateSettings({ username: t, password: "", token: n, knownEmail: t, isDictionarySynced: !1, havePremiumAccount: !0 }).then(() => {
                        e.checkForPaidSubscription();
                    }),
                    showNextStep();
            });
        }),
            (a.textContent = ""),
            (t.textContent = i18nManager.getMessage("privacyNoteSlogan")),
            (n.textContent = i18nManager.getMessage("managedLoginDescription")),
            (i.textContent = i18nManager.getMessage("managedLoginButton1")),
            o.remove();
    }
    function showNextStep() {
        let t = `<h2>${i18nManager.getMessage("onboardingHeadline")}</h2>\n\t\t\t<p>${i18nManager.getMessage("onboardingIntro")}</p>`,
            a = !1;
        try {
            a = "ot" === localStorage.getItem("ref_source");
        } catch (e) {}
        (t += "<ul>"),
            a && (e.updateSettings({ hasSynonymsEnabled: !0 }), (t += `<li>${i18nManager.getMessage("onboardingNote4")}</li>`)),
            BrowserDetector.isSafari()
                ? (t += `\n\t\t\t\t<li>${i18nManager.getMessage("onboardingNote1")}</li>\n\t\t\t\t<li>${i18nManager.getMessage("onboardingNote3")}</li>\n\t\t\t`)
                : BrowserDetector.isFirefox()
                ? (t += `\n\t\t\t\t<li>${i18nManager.getMessage("onboardingNote2")}</li>\n\t\t\t\t<li>${i18nManager.getMessage("onboardingNote3")}</li>\n\t\t\t`)
                : (t += `\n\t\t\t\t<li>${i18nManager.getMessage("onboardingNote1")}</li>\n\t\t\t\t<li>${i18nManager.getMessage("onboardingNote2")}</li>\n\t\t\t\t<li>${i18nManager.getMessage("onboardingNote3")}</li>\n\t\t\t`),
            (t += "</ul>"),
            (n.innerHTML = t),
            (i.textContent = i18nManager.getMessage("close")),
            (i.onclick = closeTab),
            o.remove();
    }
    function onConfirmClick() {
        e.updatePrivacySettings({ allowRemoteCheck: !0 }).then(showNextStep), Tracker.trackEvent("Action", "accept_privacy_note", "autoCheck:true");
    }
    function closeTab() {
        globalThis.messaging.sendMessage({ command: "CLOSE_CURRENT_TAB" });
    }
}
