/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
{
    let e, t, s, o;
    const n = document.getElementById("popup-container"),
        a = document.getElementById("popup-basic-link"),
        i = document.getElementById("popup-plus-link"),
        p = document.getElementById("onboarding-button"),
        r = document.getElementById("popup-hint"),
        d = document.getElementById("popup-synonym-settings"),
        l = document.querySelector("#popup-option-capitalization .lt-popup__switch"),
        c = document.querySelector("#popup-option-check .lt-popup__switch"),
        u = document.querySelector("#popup-option-synonyms .lt-popup__switch"),
        m = document.getElementById("popup-synonyms-tutorial"),
        g = document.getElementById("popup-tutorial-close"),
        _ = document.getElementById("popup-validator"),
        h = document.getElementById("popup-validator-button"),
        E = document.getElementById("popup-teaser"),
        b = document.getElementById("feedback-link"),
        L = document.getElementById("popup-more-options-link"),
        w = document.getElementById("lt-popup-logo");
    translateSection(document.body),
        translateElement("#popup-onboarding-text-1", { key: "popupOnboardingStep1", isHTML: !0 }),
        translateElement("#popup-onboarding-text-2", { key: "popupOnboardingStep2", isHTML: !0, interpolations: ['<span class="lt-popup__onboarding__icon1"></span>', '<span class="lt-popup__onboarding__icon2"></span>'] }),
        translateElement("#popup-onboarding-text-3", { key: "popupOnboardingStep3", isHTML: !0 }),
        translateElement("#popup-onboarding-text-4", { key: "popupOnboardingStep4", isHTML: !0 }),
        L.setAttribute("title", i18nManager.getMessage("popupSettingsHover")),
        [L, a, i].forEach((e) => {
            e.addEventListener("click", () => {
                EnvironmentAdapter.openOptionsPage(void 0, e === L ? "popup-icon" : "popup-badge"), window.close();
            });
        }),
        w.addEventListener("click", (e) => {
            browser.runtime.sendMessage({ command: "OPEN_URL", url: w.href }), e.preventDefault(), window.close();
        }),
        p.addEventListener("click", () => {
            n.classList.remove("lt-popup--show-onboarding"), n.classList.remove("lt-popup--disabled"), v.updateUIState({ hasSeenOnboarding: !0 }), Tracker.trackEvent("Action", "popup:onboarding_banner:close");
        }),
        b.addEventListener("click", () => EnvironmentAdapter.openFeedbackForm(e));
    let v = StorageController.create();
    v.onReady(() => {
        browser.tabs.query({ currentWindow: !0, active: !0 }).then((a) => {
            if (!a || !a.length) return void window.close();
            if (((s = a[0].id), (e = a[0].url || ""), (t = getDomain(e)), (o = TweaksManager.getTweaks(e)), !v.getPrivacySettings().allowRemoteCheck && !e.startsWith(config.INSTALL_URL) && !BrowserDetector.isSafari())) {
                const e = { command: "OPEN_PRIVACY_CONFIRMATION" };
                return browser.runtime.sendMessage(e), void window.close();
            }
            reloadContentScriptsIfNecessary(s, t);
            const i = v.getValidationSettings(t, o.getEditorGroupId(e)),
                p = { enabled: !i.isDomainDisabled && !i.isEditorGroupDisabled, supported: !0, unsupportedMessage: "", capitalization: i.shouldCapitalizationBeChecked };
            o.supported() ? v.isDomainSupported(t) || ((p.supported = !1), (p.unsupportedMessage = browser.i18n.getMessage("siteCannotBeSupported"))) : ((p.supported = !1), (p.unsupportedMessage = o.unsupportedMessage()));
            const d = v.getStatistics(),
                g = v.getSettings(),
                b = v.getUIState(),
                L = Date.now() - 1e3 * d.firstVisit;
            if ((E.classList.add("lt-popup__teaser--hide"), d.appliedSuggestions < 2 && !b.hasSeenOnboarding))
                n.classList.add("lt-popup--show-onboarding"), n.classList.add("lt-popup--disabled"), Tracker.trackEvent("Action", "popup:onboarding_banner", t);
            else if (p.supported && !v.isUsedCustomServer())
                if (!b.hasPaidSubscription && ("like" === d.ratingValue || d.appliedSuggestions > 7 || L > 432e5)) {
                    const e = getHistoricPremiumErrors(d);
                    if (e.hiddenErrorsCount > 5) {
                        const t = "popup:historic_premium_teaser",
                            s = browser.i18n.getMessage("historicPremiumErrorsHeadline"),
                            o = browser.i18n.getMessage("historicPremiumErrorsText2", [e.hiddenErrorsCount, e.dayCount]),
                            n = browser.i18n.getMessage("historicPremiumErrorsButton");
                        E.classList.remove("lt-popup__teaser--hide"), new PremiumTeaser(E, t, s, o, n, { campaign: "addon2-popup-historic-premium-errors", historicMatches: e.hiddenErrorsCountStr });
                    } else {
                        const e = "popup:premium_teaser",
                            t = browser.i18n.getMessage("popupPremiumHeadline"),
                            s = browser.i18n.getMessage("popupPremiumText"),
                            o = browser.i18n.getMessage("popupPremiumLink");
                        E.classList.remove("lt-popup__teaser--hide"), new PremiumTeaser(E, e, t, s, o, { campaign: "addon2-popup" });
                    }
                    Tracker.trackEvent("Action", "popup:upgrade_teaser", `hidden_errors:${e.hiddenErrorsCountStr}`);
                } else b.hasRated || BrowserDetector.isSafari() || (E.classList.remove("lt-popup__teaser--hide"), new RatingTeaser(E, "popup", e).render());
            b.hasPaidSubscription && n.classList.add("lt-popup--plus"),
                v.hasLanguageToolAccount() &&
                    ((h.textContent = i18nManager.getMessage("popupOpenEditorButton")),
                    h.classList.add("lt-popup__button--edit"),
                    _.classList.remove("lt-popup__validator--hide"),
                    (h.onclick = () => {
                        browser.runtime.sendMessage({ command: "LAUNCH_EDITOR" }), Tracker.trackEvent("Action", "popup:open_editor"), window.close();
                    }));
            browser.tabs
                .sendMessage(s, { command: "GET_SELECTED_TEXT" })
                .then((t) => {
                    !t ||
                        t.selectedText.trim().length < config.MIN_TEXT_LENGTH ||
                        e.includes("//" + browser.runtime.id) ||
                        (_.classList.remove("lt-popup__validator--hide"),
                        (h.textContent = i18nManager.getMessage(v.hasLanguageToolAccount() ? "popupOptionValidateInEditor" : "popupOptionValidate")),
                        m.classList.add("lt-popup__tutorial--hide"),
                        (h.onclick = () => {
                            const e = { command: "LAUNCH_EDITOR", text: t.selectedText };
                            browser.runtime.sendMessage(e), Tracker.trackEvent("Action", "popup:check_selected_text"), window.close();
                        }));
                })
                .catch((e) => console.log("Failed getting selected text", e)),
                p.supported || (r.classList.add("lt-popup__hint-visible"), (r.innerHTML = p.unsupportedMessage), n.classList.add("lt-popup--disabled"), Tracker.trackEvent("Action", "popup:disabled", getDomain(e))),
                p.enabled || (c.classList.add("lt-popup__switch--off"), I(), O()),
                v.isUsedCustomServer() && O(),
                p.capitalization || l.classList.add("lt-popup__switch--off"),
                g.hasSynonymsEnabled ? u.classList.remove("lt-popup__switch--off") : u.classList.add("lt-popup__switch--off"),
                !b.hasSeenSynonymsTutorial && g.hasSynonymsEnabled && m.classList.remove("lt-popup__tutorial--hide"),
                l.addEventListener("click", () => y()),
                c.addEventListener("click", () => S()),
                u.addEventListener("click", () => f()),
                setTimeout(() => {
                    n.classList.add("lt-popup--animations-enabled");
                }, 500),
                Tracker.trackPageView();
        });
    });
    const k = (t) => ("extensions" === t ? e : t),
        S = () => {
            c.classList.contains("lt-popup__switch--off") ? T() : M();
        },
        y = () => {
            l.classList.contains("lt-popup__switch--off") ? C() : B();
        },
        f = () => {
            u.classList.contains("lt-popup__switch--off") ? P() : D();
        },
        T = () => {
            if (!v) return;
            c.classList.remove("lt-popup__switch--off");
            const n = o.getEditorGroupId(e);
            v.enableDomainAndEditorGroup(t, n), EnvironmentAdapter.ltAssistantStatusChanged(s, { enabled: !0 }), A(), x(), Tracker.trackEvent("Action", "enable_domain", k(t));
        },
        M = () => {
            v && (c.classList.add("lt-popup__switch--off"), v.disableDomain(t), EnvironmentAdapter.ltAssistantStatusChanged(s, { enabled: !1 }), O(), I(), Tracker.trackEvent("Action", "disable_domain", k(t)));
        },
        A = () => {
            l.parentElement.classList.remove("lt-popup__option--hide");
        },
        I = () => {
            l.parentElement.classList.add("lt-popup__option--hide");
        },
        C = () => {
            v && (l.classList.remove("lt-popup__switch--off"), v.enableCapitalization(t), EnvironmentAdapter.ltAssistantStatusChanged(s, { capitalization: !0 }), Tracker.trackEvent("Action", "enable_capitalization", k(t)));
        },
        B = () => {
            v && (l.classList.add("lt-popup__switch--off"), v.disableCapitalization(t), EnvironmentAdapter.ltAssistantStatusChanged(s, { capitalization: !1 }), Tracker.trackEvent("Action", "disable_capitalization", k(t)));
        },
        P = () => {
            v &&
                (v.getUIState().hasSeenSynonymsTutorial || U(),
                u.classList.remove("lt-popup__switch--off"),
                v.updateSettings({ hasSynonymsEnabled: !0 }),
                Tracker.trackEvent("Action", "enable_synonyms", LanguageManager.getUserLanguageCodes()[0]));
        },
        D = () => {
            v && (H(), u.classList.add("lt-popup__switch--off"), v.updateSettings({ hasSynonymsEnabled: !1 }), Tracker.trackEvent("Action", "disable_synonyms", LanguageManager.getUserLanguageCodes()[0]));
        },
        O = () => {
            d.classList.add("lt-popup__settings--hide");
        },
        x = () => {
            d.classList.remove("lt-popup__settings--hide");
        },
        H = () => {
            v && m.classList.add("lt-popup__tutorial--hide");
        },
        U = () => {
            v && m.classList.remove("lt-popup__tutorial--hide");
        };
    g.addEventListener("click", () => {
        v.updateUIState({ hasSeenSynonymsTutorial: !0 }), H();
    }),
        BrowserDetector.isSafari() && (n.classList.add("lt-popup--safari"), (w.href = w.href + (w.href.includes("?") ? "&" : "?") + "hidePremium=true"));
}
