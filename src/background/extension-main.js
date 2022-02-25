var __awaiter =
    (this && this.__awaiter) ||
    function (e, t, a, s) {
        return new (a || (a = Promise))(function (o, n) {
            function r(e) {
                try {
                    c(s.next(e));
                } catch (e) {
                    n(e);
                }
            }
            function i(e) {
                try {
                    c(s.throw(e));
                } catch (e) {
                    n(e);
                }
            }
            function c(e) {
                var t;
                e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof a
                          ? t
                          : new a(function (e) {
                                e(t);
                            })).then(r, i);
            }
            c((s = s.apply(e, t || [])).next());
        });
    };
class BackgroundApp {
    static _constructor() {
        if (!this._isInitialized) {
            if (
                ((this._onDataLoaded = this._onDataLoaded.bind(this)),
                (this._onInstalled = this._onInstalled.bind(this)),
                (this._onMessage = this._onMessage.bind(this)),
                (this._onValidateClicked = this._onValidateClicked.bind(this)),
                (this._storageController = StorageController.create()),
                this._storageController.onReady(this._onDataLoaded),
                browser.runtime.onInstalled.addListener(this._onInstalled),
                browser.runtime.onMessage.addListener(this._onMessage),
                DictionarySync.init(),
                this._updateIcon(),
                this._checkForPaidSubscription(),
                this._loadConfiguration(),
                BrowserDetector.isFirefox())
            ) {
            }
            this._isInitialized = !0;
        }
    }
    static _assignToTestGroups() {
        EnvironmentAdapter.isProductionEnvironment();
    }
    static _isUsedDarkTheme() {
        var e;
        return __awaiter(this, void 0, void 0, function* () {
            if (BrowserDetector.isFirefox()) {
                const t = yield browser.theme.getCurrent();
                if (null === (e = null === t || void 0 === t ? void 0 : t.colors) || void 0 === e ? void 0 : e.toolbar) {
                    return getColorLuminosity(t.colors.toolbar) <= 35;
                }
            }
            return !("undefined" == typeof window || !window.matchMedia) && Boolean(window.matchMedia("(prefers-color-scheme: dark)").matches);
        });
    }
    static _updateIcon() {
        return __awaiter(this, void 0, void 0, function* () {
            if (BrowserDetector.isSafari()) return;
            const e = yield this._isUsedDarkTheme();
            this._darkMode !== e &&
                ((this._darkMode = e),
                this._darkMode
                    ? browser.action.setIcon({
                          path: {
                              16: "/assets/images/icons/icon16_white.png",
                              32: "/assets/images/icons/icon32_white.png",
                              48: "/assets/images/icons/icon48_white.png",
                              64: "/assets/images/icons/icon64_white.png",
                              128: "/assets/images/icons/icon128_white.png",
                          },
                      })
                    : browser.action.setIcon({
                          path: { 16: "/assets/images/icons/icon16.png", 32: "/assets/images/icons/icon32.png", 48: "/assets/images/icons/icon48.png", 64: "/assets/images/icons/icon64.png", 128: "/assets/images/icons/icon128.png" },
                      }));
        });
    }
    static _setContextMenu() {
        if (browser.contextMenus) {
            let e = i18nManager.getMessage("contextMenuValidate");
            this._storageController.hasLanguageToolAccount() && (e = i18nManager.getMessage("contextMenuValidateInEditor")),
                browser.contextMenus.removeAll().then(() => {
                    browser.contextMenus.create({ title: e, contexts: ["selection"], onclick: this._onValidateClicked });
                });
        }
    }
    static _updateBadge(e, t) {
        browser.action.setBadgeTextColor && browser.action.setBadgeTextColor({ tabId: e, color: "#FFFFFF" }),
            t.enabled && t.supported
                ? t.capitalization
                    ? browser.action.setBadgeText({ tabId: e, text: "" })
                    : (browser.action.setBadgeBackgroundColor && browser.action.setBadgeBackgroundColor({ tabId: e, color: "#45A8FC" }),
                      browser.action.setBadgeText({ tabId: e, text: BrowserDetector.isOpera() ? "" : "abc" }))
                : (browser.action.setBadgeBackgroundColor && browser.action.setBadgeBackgroundColor({ tabId: e, color: "#F53987" }),
                  browser.action.setBadgeText({ tabId: e, text: BrowserDetector.isOpera() ? "" : "OFF" }));
    }
    static _setMotherTongue() {
        this._storageController.onReady(() => {
            const { motherTongue: e, geoIpLanguages: t } = this._storageController.getSettings();
            if (e) return;
            const a = t.some((e) => !!e.match(/^de/i)) && navigator.languages[0] && navigator.languages[0].match(/^de/i),
                s = Array.from(navigator.languages).some((e) => !e.match(/^(de|en)/i));
            a && !s && (Tracker.trackEvent("Action", "set_mother_tongue", "de"), this._storageController.updateSettings({ motherTongue: "de" }));
            const o = t.some((e) => !!e.match(/^fr/i)) && navigator.languages[0] && navigator.languages[0].match(/^fr/i),
                n = Array.from(navigator.languages).some((e) => !e.match(/^(fr|en)/i));
            o && !n && (Tracker.trackEvent("Action", "set_mother_tongue", "fr"), this._storageController.updateSettings({ motherTongue: "fr" }));
        });
    }
    static _launchEditor(e) {
        let t = void 0;
        e && ((t = Math.round(99999 * Math.random()) + ":" + Date.now()), (this._validatorsData[t] = { id: t, text: e, timestamp: Date.now() }));
        let a = EnvironmentAdapter.getURL(`/validator/validator.html?id=${t}`);
        const { username: s, token: o } = this._storageController.getSettings();
        if (BrowserDetector.isSafari()) {
            const t = this._storageController.getSettings().userId || void 0;
            browser.runtime.sendMessage({ userId: t, message: { username: s, token: o, text: e }, command: "LAUNCH_DESKTOP_EDITOR" });
        } else s && o && navigator.onLine && (a = getAutoLoginUrl(s, o, t)), browser.tabs.create({ url: a });
    }
    static _onDataLoaded() {
        Tracker.trackActivity(), this._applyManagedSettings(), this._setContextMenu();
    }
    static _applyManagedSettings() {
        const { disablePrivacyConfirmation: e } = this._storageController.getManagedSettings();
        !0 === e && this._storageController.updatePrivacySettings({ allowRemoteCheck: !0 });
    }
    static _loadConfiguration() {
        this._storageController.onReady(() => {
            this._storageController.isUsedCustomServer() ||
                fetch(config.EXTERNAL_CONFIG_URL, { credentials: "omit" })
                    .then((e) => e.json())
                    .then((e) => {
                        if (e.disabledSites && Array.isArray(e.disabledSites)) {
                            const t = { unsupportedDomains: e.disabledSites };
                            this._storageController.updateConfiguration(t);
                        }
                    });
        });
    }
    static _checkForPaidSubscription() {
        this._storageController.onReady(() => {
            this._storageController.checkForPaidSubscription().catch((e) => {
                Tracker.trackError("js", `Error checking paid subscripton: ${e && e.reason} - ${e && e.status}`);
            });
        });
    }
    static _onInstalled(e) {
        const { reason: t, previousVersion: a } = e;
        this._storageController.onReady(() => {
            if ((this._applyManagedSettings(), "install" === t)) {
                if (!this._storageController.getPrivacySettings().allowRemoteCheck && !this._storageController.getUIState().hasSeenPrivacyConfirmationDialog) {
                    this._storageController.updateUIState({ hasSeenPrivacyConfirmationDialog: !0 });
                    let e = `${config.INSTALL_URL}?new`;
                    EnvironmentAdapter.isProductionEnvironment() || (e += "&dev"),
                        browser.tabs.create({ url: e }),
                        this._assignToTestGroups(),
                        LanguageManager.getLanguagesForGeoIPCountry()
                            .then((e) => {
                                const t = { geoIpLanguages: e.geoIpLanguages, geoIpCountry: e.geoIpCountry || "" };
                                "GB" === e.geoIpCountry || "IE" === e.geoIpCountry
                                    ? (t.enVariant = "en-GB")
                                    : "US" === e.geoIpCountry
                                    ? (t.enVariant = "en-US")
                                    : "CA" === e.geoIpCountry
                                    ? (t.enVariant = "en-CA")
                                    : "NZ" === e.geoIpCountry
                                    ? (t.enVariant = "en-NZ")
                                    : "AU" === e.geoIpCountry
                                    ? (t.enVariant = "en-AU")
                                    : "ZA" === e.geoIpCountry
                                    ? (t.enVariant = "en-ZA")
                                    : "DE" === e.geoIpCountry
                                    ? (t.deVariant = "de-DE")
                                    : "AT" === e.geoIpCountry
                                    ? (t.deVariant = "de-AT")
                                    : "CH" === e.geoIpCountry
                                    ? (t.deVariant = "de-CH")
                                    : "BR" === e.geoIpCountry
                                    ? (t.ptVariant = "pt-BR")
                                    : ["PT", "IT", "DE", "ES", "NL", "BE", "CH", "AT", "FR", "LU", "GB", "IE", "PL", "CZ"].includes(e.geoIpCountry) && (t.ptVariant = "pt-PT");
                                const a = "CA" === e.geoIpCountry,
                                    s = navigator.languages.some((e) => "en-ca" === e.toLowerCase()),
                                    o = navigator.languages.some((e) => "fr-ca" === e.toLowerCase());
                                if (a || s || o) {
                                    const e = { id: "FRENCH_WHITESPACE", language: "fr", description: "Insertion des espaces fines insécables", turnOffDate: new Date() },
                                        a = this._storageController.getSettings().ignoredRules;
                                    a.push(e), (t.ignoredRules = a);
                                }
                                this._storageController.updateSettings(t), this._setMotherTongue();
                            })
                            .catch((e) => {
                                console.error(e), Tracker.trackError("js", e && e.message);
                            }),
                        Tracker.trackInstall();
                }
            }
        });
    }
    static _migrate() {}
    static _onMessage(e, t, a) {
        let s;
        return (
            isPageLoadedMessage(e)
                ? (s = this._onPageLoadedMessage(t, e))
                : isPageView(e)
                ? (s = this._onPageView(t, e))
                : isTrackCustomEvent(e)
                ? (s = this._onTrackCustomEvent(t, e))
                : isAppliedSuggestion(e)
                ? (s = this._onAppliedSuggestionMessage(t, e))
                : isLTAssistantStatusChangedMessage(e)
                ? (s = this._onLTAssistantStatusChangedMessage(t, e))
                : isCheckForPaidSubscriptionMessage(e)
                ? (s = this._onCheckForPaidSubscriptionMessage(t, e))
                : isTrackTextLengthMessage(e)
                ? (s = this._onTrackTextLengthMessage(t, e))
                : isTrackEventMessage(e)
                ? (s = this._onTrackEventMessage(t, e))
                : isOpenFeedbackFormMessage(e)
                ? (s = this._onOpenFeedbackFormMessage(t, e))
                : isSendFeedbackMessage(e)
                ? (s = this._onSendFeedbackMessage(t, e))
                : isOpenOptionsMessage(e)
                ? (s = this._onOpenOptionsMessage(t, e))
                : isOpenPrivacyConfirmationMessage(e)
                ? (s = this._onOpenPrivacyConfirmationMessage(t, e))
                : isCloseCurrentTabMessage(e)
                ? (s = this._onCloseCurrentTabMessage(t, e))
                : isValidateTextMessage(e)
                ? (s = this._onValidateTextMessage(t, e))
                : isLaunchEditorMessage(e)
                ? (s = this._onLaunchEditorMessage(t, e))
                : isGetValidatorDataMessage(e)
                ? (s = this._onGetValidatorDataMessage(t, e))
                : isStartDictionarySyncMessage(e)
                ? (s = this._onStartDictionarySyncMessage(t, e))
                : isAddWordToDictionaryMessage(e)
                ? (s = this._onAddWordToDictionaryMessage(t, e))
                : isBatchAddWordToDictionaryMessage(e)
                ? (s = this._onBatchAddWordToDictionaryMessage(t, e))
                : isRemoveWordFromDictionaryMessage(e)
                ? (s = this._onRemoveWordFromDictionaryMessage(t, e))
                : isClearDictionaryMessage(e)
                ? (s = this._onClearDictionaryMessage(t, e))
                : isGetPreferredLanguagesMessage(e)
                ? (s = this._onGetPreferredLanguagesMessage(t, e))
                : isLoadSynonymsMessage(e)
                ? (s = this._onLoadSynonymsMessage(t, e))
                : isUpdateDictionaryMessage(e)
                ? (s = this._onUpdateDictionaryMessage(t, e))
                : isOpenURLMessage(e)
                ? (s = this._onOpenURLMessage(t, e))
                : isOpenPremiumPageMessage(e)
                ? (s = this._openPremiumPage(t, e))
                : isLoginUserMessage(e)
                ? (s = this._loginUserMessage(t, e))
                : isLogoutUserMessage(e)
                ? (s = this._logoutUserMessage(t, e))
                : isOnLoginUserMessage(e)
                ? (s = this._onLoginUserMessage(t, e))
                : isOnLogoutUserMessage(e) && (s = this._onLogoutUserMessage(t, e)),
            s || Promise.resolve(null)
        );
    }
    static _onPageLoadedMessage(e, t) {
        if (0 !== e.frameId || !e.tab) return;
        const a = e.tab.id,
            s = { enabled: t.enabled, capitalization: t.capitalization, supported: t.supported, unsupportedMessage: t.unsupportedMessage, language: null, beta: t.beta };
        (this._extensionStates[a] = s),
            browser.tabs
                .detectLanguage(a)
                .then((e) => {
                    e && "und" !== e && (s.language = LanguageManager.getPrimaryLanguageCode(e));
                })
                .catch((e) => {
                    console.error("Error detecting language", e);
                }),
            this._updateBadge(a, s);
    }
    static _onPageView(e, t) {
        window.aiTrackPageView(t.location);
    }
    static _onTrackCustomEvent(e, t) {
        window.aiTrackEvent(t.name);
    }
    static _onAppliedSuggestionMessage(e, t) {;
        window.appliedSuggestion(t.appliedSuggestions);
    }
    static _onLTAssistantStatusChangedMessage(e, t) {
        const a = t.tabId || e.tab.id;
        if (!this._extensionStates.hasOwnProperty(a)) return;
        const s = this._extensionStates[a];
        "boolean" == typeof t.enabled && (s.enabled = t.enabled), "boolean" == typeof t.capitalization && (s.capitalization = t.capitalization), this._updateBadge(a, s);
    }
    static _onCheckForPaidSubscriptionMessage(e, t) {
        return Validator.checkForPaidSubscription(t.username, t.password, t.token)
            .then((e) => {
                return { initialCommand: "CHECK_FOR_PAID_SUBSCRIPTION", isSuccessful: !0, hasPaidSubscription: e };
            })
            .catch((e) => {
                return { initialCommand: "CHECK_FOR_PAID_SUBSCRIPTION", isSuccessful: !1, error: { reason: e.reason, status: e.status, message: e.message, response: e.response, stack: e.stack } };
            });
    }
    static _onTrackTextLengthMessage(e, t) {
        Tracker.trackTextLength(t.textLength);
    }
    static _onTrackEventMessage(e, t) {
        Tracker.trackEvent("Action", t.action, t.label);
    }
    static _onOpenFeedbackFormMessage(e, t) {
        browser.tabs.create({ url: "https://github.com/jonathanpeppers/inclusive-code-comments/issues/new" });
    }
    static _onOpenOptionsMessage(e, t) {
        let a = "/options/options.html";
        t.target && (a += `#${t.target}`), t.ref && (a += `?ref=${encodeURIComponent(t.ref)}`), browser.tabs.create({ url: EnvironmentAdapter.getURL(a) });
    }
    static _onOpenPrivacyConfirmationMessage(e, t) {
        browser.tabs.create({ url: config.INSTALL_URL });
    }
    static _onCloseCurrentTabMessage(e, t) {
        browser.tabs.query({ currentWindow: !0, active: !0 }).then((e) => {
            e.length && browser.tabs.remove(e[0].id);
        });
    }
    static _getPreferredLanguages(e) {
        const { geoIpLanguages: t, motherTongue: a } = this._storageController.getSettings();
        let s = [];
        if ((a && s.push(a), e.tab)) {
            const t = this._extensionStates[e.tab.id];
            t && t.language && s.push(t.language);
        }
        return (s = s.concat(LanguageManager.getUserLanguageCodes()).concat(t)).push("en"), (s = s.map((e) => ("nb" === e ? "no" : "fil" === e ? "tl" : e))), uniq(s);
    }
    static _onValidateTextMessage(e, t) {
        Tracker.trackActivity(),
            0 === this._validationThrottlingCount &&
                window.setTimeout(() => {
                    this._validationThrottlingCount = 0;
                }, 5e3),
            this._validationThrottlingCount++;
        const a = e.url && e.url.includes("docs.google.com") ? 60 : 30;
        if (this._validationThrottlingCount > a) {
            const e = {
                initialCommand: "VALIDATE_TEXT",
                isSuccessful: !1,
                instanceId: t.metaData.instanceId,
                error: { status: 0, message: "Too many checks within five seconds. Please try again in a couple of seconds.", response: "Too many checks within five seconds. Please try again in a couple of seconds." },
            };
            return Promise.resolve(e);
        }
        const s = this._getPreferredLanguages(e);
        t.metaData.elementLanguage && s.push(LanguageManager.getPrimaryLanguageCode(t.metaData.elementLanguage));
        const o = this._storageController.getStatistics().usageCount + 1;
        this._storageController.updateStatistics({ usageCount: o });
        const n = [];
        return (
            t.options.useFullValidation
                ? n.push(Validator.validate(t.text, t.forceLanguage ? t.language : null, s, t.metaData, t.hasUserChangedLanguage))
                : n.push(Validator.detectLanguage(t.text, t.forceLanguage ? t.language : null, s, t.metaData)),
            n.push(Validator.partialValidate(t.changedParagraphs, t.language, s, t.metaData, !t.forceLanguage)),
            Promise.all(n)
                .then(([e, a]) => {
                    let s = e.language || t.language;
                    const o = !(!s || s.name !== this.UNSUPPORTED_LANGUAGE_NAME);
                    return (
                        o && (s = null),
                        {
                            initialCommand: "VALIDATE_TEXT",
                            isSuccessful: !0,
                            instanceId: t.metaData.instanceId,
                            text: t.text,
                            changedParagraphs: t.changedParagraphs,
                            language: s,
                            isUnsupportedLanguage: o,
                            isIncompleteResult: a.isIncompleteResult,
                            validationErrors: e.errors,
                            validationPremiumErrors: e.premiumErrors,
                            validationPremiumPickyErrors: e.premiumPickyErrors,
                            validationPickyErrors: e.pickyErrors,
                            partialValidationErrors: a.errors,
                            partialValidationPremiumErrors: a.premiumErrors,
                            partialValidationPremiumPickyErrors: a.premiumPickyErrors,
                            partialValidationPickyErrors: a.pickyErrors,
                        }
                    );
                })
                .catch((e) => {
                    if (!e || "AbortError" !== e.reason)
                        return (
                            t.options.textTooLongMessage && e.message === i18nManager.getMessage("textTooLong") && (e.message = t.options.textTooLongMessage),
                            { initialCommand: "VALIDATE_TEXT", isSuccessful: !1, instanceId: t.metaData.instanceId, error: { reason: e.reason, status: e.status, message: e.message, response: e.response, stack: e.stack } }
                        );
                })
        );
    }
    static _onLaunchEditorMessage(e, t) {
        this._launchEditor(t.text);
    }
    static _onGetValidatorDataMessage(e, t) {
        const a = this._validatorsData[t.id];
        this._validatorsData[t.id] = null;
        const s = { initialCommand: "GET_VALIDATOR_DATA", isSuccessful: !0, text: a ? a.text : "" };
        return Promise.resolve(s);
    }
    static _onStartDictionarySyncMessage(e, t) {
        DictionarySync.checkForInitialSync();
    }
    static _onAddWordToDictionaryMessage(e, t) {
        DictionarySync.addWord(t.word).catch(() => null);
    }
    static _onBatchAddWordToDictionaryMessage(e, t) {
        DictionarySync.addBatch(t.words).catch(() => null);
    }
    static _onRemoveWordFromDictionaryMessage(e, t) {
        DictionarySync.removeWord(t.word).catch(() => null);
    }
    static _onClearDictionaryMessage(e, t) {
        DictionarySync.removeBatch(this._storageController.getSettings().dictionary).catch(() => null);
    }
    static _onUpdateDictionaryMessage(e, t) {
        DictionarySync.downloadAll();
    }
    static _onOpenURLMessage(e, t) {
        Tracker.trackEvent("Action", "open_tab", t.url), browser.tabs.create({ url: t.url });
    }
    static _onGetPreferredLanguagesMessage(e, t) {
        const a = this._getPreferredLanguages(e),
            s = this._storageController.getSettings(),
            o = a.map((e) => s[`${e}Variant`] || e);
        return Promise.resolve(o);
    }
    static _onLoadSynonymsMessage(e, t) {
        return Synonyms.load(t.wordContext, t.language, t.motherLanguage);
    }
    static _onValidateClicked(e, t) {
        if (t && t.id) {
            const a = { command: "GET_SELECTED_TEXT" };
            browser.tabs
                .sendMessage(t.id, a)
                .then((e) => {
                    this._launchEditor(e.selectedText);
                })
                .catch((t) => {
                    this._launchEditor(e.selectionText);
                });
        } else this._launchEditor(e.selectionText);
        this._storageController.updateUIState({ hasUsedValidator: !0 });
    }
    static _openPremiumPage(e, t) {
        if (BrowserDetector.isSafari()) {
            const e = this._storageController.getSettings().userId || void 0;
            return Tracker.trackEvent("Action", "go_to_apple_upgrade", t.campaign), void browser.runtime.sendMessage({ message: Object.assign(Object.assign({}, t), { userId: e }), command: "LAUNCH_APPLE_UPGRADE" });
        }
        const a = [];
        a.push(`pk_campaign=${encodeURIComponent(t.campaign)}`),
            t.textLanguage && a.push(`textLang=${encodeURIComponent(t.textLanguage)}`),
            t.historicMatches && a.push(`historicMatches=${encodeURIComponent(t.historicMatches)}`),
            t.hiddenGrammarMatches && a.push(`grammarMatches=${encodeURIComponent(t.hiddenGrammarMatches)}`),
            t.hiddenPunctuationMatches && a.push(`punctuationMatches=${encodeURIComponent(t.hiddenPunctuationMatches)}`),
            t.hiddenStyleMatches && a.push(`styleMatches=${encodeURIComponent(t.hiddenStyleMatches)}`);
        let s = "https://languagetool.org/premium?" + a.join("&");
        browser.tabs.create({ url: s });
    }
    static _loginUserMessage(e, t) {
        browser.runtime.sendMessage({ command: "LOGIN" });
    }
    static _logoutUserMessage(e, t) {
        browser.runtime.sendMessage({ command: "LOGOUT" });
    }
    static _onLoginUserMessage(e, t) {
        this._storageController.updateSettings({ username: t.username, password: "", userId: t.userId, token: t.token, knownEmail: t.username, havePremiumAccount: !0, apiServerUrl: config.MAIN_SERVER_URL }).then(() => {
            this._storageController.checkForPaidSubscription();
        }),
            EnvironmentAdapter.isProductionEnvironment() || EnvironmentAdapter.startDictionarySync();
    }
    static _onLogoutUserMessage(e, t) {
        this._storageController.updateSettings({ username: "", password: "", userId: null, token: "", isDictionarySynced: !1, havePremiumAccount: !1 }).then(() => {
            this._storageController.checkForPaidSubscription();
        });
    }
}
(BackgroundApp.UNSUPPORTED_LANGUAGE_NAME = "NoopLanguage"),
    (BackgroundApp._darkMode = !1),
    (BackgroundApp._lastPing = null),
    (BackgroundApp._extensionStates = new Map()),
    (BackgroundApp._validatorsData = new Map()),
    (BackgroundApp._validationThrottlingCount = 0),
    (BackgroundApp._isInitialized = !1),
    (BackgroundApp._lastScreenshot = null),
    BackgroundApp._constructor();
