/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
var __awaiter =
    (this && this.__awaiter) ||
    function (e, t, r, i) {
        return new (r || (r = Promise))(function (o, n) {
            function a(e) {
                try {
                    d(i.next(e));
                } catch (e) {
                    n(e);
                }
            }
            function s(e) {
                try {
                    d(i.throw(e));
                } catch (e) {
                    n(e);
                }
            }
            function d(e) {
                var t;
                e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof r
                          ? t
                          : new r(function (e) {
                                e(t);
                            })).then(a, s);
            }
            d((i = i.apply(e, t || [])).next());
        });
    };
class LTAssistant {
    constructor(e = {}, t = TweaksManager.getDefaultTweaks()) {
        (this._spellcheckingAttributesData = new Map()),
            (this._editors = []),
            (this._messages = []),
            (this._checkExtensionHealthIntervalId = void 0),
            (this._fixTinyMCEIntervalId = void 0),
            (this._initElementTimeouts = new Map()),
            (this._init = () => {
                if (
                    ("string" == typeof this._options.apiServerUrl && this._storageController.updateSettings({ apiServerUrl: this._options.apiServerUrl }),
                    "boolean" == typeof this._options.enableSynonyms && this._storageController.updateSettings({ hasSynonymsEnabled: this._options.enableSynonyms }),
                    this._options.dev && this._storageController.updateUIState({ showRuleId: !0 }),
                    this.updateLanguageOptions({ motherTongue: this._options.motherTongue, preferredLanguages: this._options.preferredLanguages, preferredVariants: this._options.preferredVariants }),
                    this._options.user && this.updateUser({ email: this._options.user.email, token: this._options.user.token, premium: this._options.user.premium, apiServerUrl: this._options.apiServerUrl }),
                    this._onPageLoaded(),
                    this._tweaks.supported() && this._storageController.isDomainSupported(getCurrentDomain()))
                ) {
                    if (
                        ((this._isRemoteCheckAllowed = this._storageController.getPrivacySettings().allowRemoteCheck),
                        (this._checkExtensionHealthIntervalId = window.setInterval(this._checkExtensionHealth, config.EXTENSION_HEALTH_RECHECK_INTERVAL)),
                        this._options.initElements)
                    ) {
                        const e = Array.isArray(this._options.initElements) ? this._options.initElements : [this._options.initElements];
                        for (const t of e) this._initElement(t);
                    }
                    if (!this._options.ignoreFocus) {
                        const e = document.querySelector(":focus");
                        e && this._initElement(e, !0), document.body && hasFirefoxDesignMode(document.body) && this._initElement(document.body, !0);
                    }
                    window.__ltLastActiveElement && (this._initElement(window.__ltLastActiveElement), (window.__ltLastActiveElement = null)),
                        this._tweaks.onElement((e, t) => {
                            this._initElement(e, t);
                        }),
                        BrowserDetector.isChromium() &&
                            window.innerHeight > 14 &&
                            (this._fixTinyMCEIntervalId = window.setInterval(() => {
                                this._fixIframeWithoutContentScripts();
                            }, config.IFRAME_INITILIZATION_RECHECK_INTERVAL)),
                        window.addEventListener("pageshow", this._onPageLoaded),
                        window.addEventListener("pagehide", this._onPageHide),
                        document.addEventListener("focus", this._onDocumentFocus, !0),
                        document.addEventListener("mousemove", this._onDocumentMousemove, !0),
                        document.addEventListener("focusout", this._onDocumentFocusout, !0),
                        document.addEventListener(this._tweaks.getClickEvent(), this._onDocumentClick, !0),
                        window.frameElement && window.frameElement.ownerDocument && window.frameElement.ownerDocument.addEventListener("click", this._onDocumentClick, !0),
                        document.addEventListener(LTAssistant.events.DESTROY, this._onDestroy),
                        document.addEventListener(InputAreaWrapper.eventNames.dblclick, this._onInputDblClick),
                        document.addEventListener(InputAreaWrapper.eventNames.textChanged, this._onInputTextChanged),
                        document.addEventListener(InputAreaWrapper.eventNames.scroll, this._onInputScroll),
                        document.addEventListener(InputAreaWrapper.eventNames.paste, this._onInputPaste),
                        document.addEventListener(Highlighter.eventNames.blockClicked, this._onHiglighterBlockClicked),
                        document.addEventListener(Toolbar.eventNames.permissionRequiredIconClicked, this._onToolbarPermissionRequiredIconClicked),
                        document.addEventListener(Toolbar.eventNames.toggleDialog, this._onToolbarToggleDialog),
                        document.addEventListener(Toolbar.eventNames.notifyAboutPremiumIcon, this._onToolbarNotifyAboutPremiumIcon),
                        document.addEventListener(Dialog.eventNames.positionChangeClicked, this._onPositionChangeClicked),
                        document.addEventListener(Dialog.eventNames.enableHere, this._onDialogEnableHere),
                        document.addEventListener(Dialog.eventNames.togglePickyMode, this._onPickyModeToggle),
                        document.addEventListener(Dialog.eventNames.enableEverywhere, this._onDialogEnableEverywhere),
                        document.addEventListener(Dialog.eventNames.languageChanged, this._onDialogLanguageChanged),
                        document.addEventListener(Dialog.eventNames.countChanged, this._onDialogCountChanged),
                        document.addEventListener(Dialog.eventNames.errorSelected, this._onDialogErrorSelected),
                        document.addEventListener(Dialog.eventNames.errorHighlighted, this._onDialogErrorHighlighted),
                        document.addEventListener(Dialog.eventNames.addToDictionaryClicked, this._onAddToDictionary),
                        document.addEventListener(Dialog.eventNames.ignoreRuleClicked, this._onIgnoreRule),
                        document.addEventListener(Dialog.eventNames.temporarilyIgnoreWordClicked, this._onTemporarilyIgnoreWord),
                        document.addEventListener(Dialog.eventNames.temporarilyIgnoreRuleClicked, this._onTemporarilyIgnoreRule),
                        document.addEventListener(Dialog.eventNames.moreDetailsClicked, this._onMoreDetailsClicked),
                        document.addEventListener(Dialog.eventNames.fixSelected, this._onFixSelected),
                        document.addEventListener(Dialog.eventNames.openOptions, this._onDialogOpenOptions),
                        document.addEventListener(Dialog.eventNames.showFeedbackForm, this._onDialogShowFeedbackForm),
                        document.addEventListener(Dialog.eventNames.destroyed, this._onDialogDestroyed),
                        document.addEventListener(Dialog.eventNames.badgeClicked, this._onBadgeClicked),
                        document.addEventListener(Dialog.eventNames.turnOff, this._onTurnOffClicked),
                        document.addEventListener(Dialog.eventNames.pauseChecking, this._onPauseCheckingClicked),
                        document.addEventListener(ErrorCard.eventNames.addToDictionaryClicked, this._onAddToDictionary),
                        document.addEventListener(ErrorCard.eventNames.ignoreRuleClicked, this._onIgnoreRule),
                        document.addEventListener(ErrorCard.eventNames.temporarilyIgnoreWordClicked, this._onTemporarilyIgnoreWord),
                        document.addEventListener(ErrorCard.eventNames.temporarilyIgnoreRuleClicked, this._onTemporarilyIgnoreRule),
                        document.addEventListener(ErrorCard.eventNames.moreDetailsClicked, this._onMoreDetailsClicked),
                        document.addEventListener(ErrorCard.eventNames.fixSelected, this._onFixSelected),
                        document.addEventListener(ErrorCard.eventNames.badgeClicked, this._onBadgeClicked),
                        document.addEventListener(ErrorCard.eventNames.logoClicked, this._onLogoClicked),
                        document.addEventListener(ErrorCard.eventNames.languageChanged, this._onErrorCardLanguageChanged),
                        document.addEventListener(ErrorCard.eventNames.destroyed, this._onErrorCardDestroyed),
                        document.addEventListener(SynonymsCard.eventNames.badgeClicked, this._onBadgeClicked),
                        document.addEventListener(SynonymsCard.eventNames.logoClicked, this._onLogoClicked),
                        document.addEventListener(SynonymsCard.eventNames.synonymSelected, this._onSynonymSelected),
                        document.addEventListener(SynonymsCard.eventNames.destroyed, this._onSynonymsCardDestroyed),
                        document.addEventListener(MessagePopup.eventNames.destroyed, this._onMessagePopupDestroyed),
                        document.addEventListener(MessagePopup.eventNames.turnOn, this._onTurnOnClicked),
                        this._storageController.addEventListener(StorageControllerClass.eventNames.settingsChanged, this._onSettingsChanged),
                        this._storageController.addEventListener(StorageControllerClass.eventNames.privacySettingsChanged, this._onPrivacySettingsChanged),
                        this._storageController.addEventListener(StorageControllerClass.eventNames.uiStateChanged, this._onUiStateChanged),
                        this._options.onInit && this._options.onInit(this);
                }
            }),
            (this._checkExtensionHealth = () => {
                EnvironmentAdapter.isRuntimeConnected() ||
                    ((this._isConnected = !1),
                    this._hideAllErrorCards(),
                    this._editors.forEach((e) => {
                        e.highlighter && e.highlighter.destroy(), this._updateState(e);
                    }),
                    window.clearInterval(this._checkExtensionHealthIntervalId));
            }),
            (this._onPageLoaded = () => {
                let e = !0;
                const t = this._tweaks.beta();
                let r = !0,
                    i = !0,
                    o = "";
                if (this._tweaks.supported())
                    if (this._storageController.isDomainSupported(getCurrentDomain())) {
                        const t = this._getValidationSettings();
                        (e = !t.isDomainDisabled && !t.isEditorGroupDisabled), (r = t.shouldCapitalizationBeChecked);
                    } else (i = !1), (o = browser.i18n.getMessage("siteCannotBeSupported"));
                else (i = !1), (o = this._tweaks.unsupportedMessage());
                EnvironmentAdapter.pageLoaded(e, r, i, t, o);
            }),
            (this._onPageHide = () => {
                this._editors.forEach((e) => {
                    this._savePremiumErrorCount(e), this._trackEditor(e);
                });
            }),
            (this._onDocumentFocus = (e) => {
                this._options.ignoreFocus || (e.target instanceof HTMLElement ? this._initElement(e.target, !0) : e.target === document && document.body && hasFirefoxDesignMode(document.body) && this._initElement(document.body, !0));
            }),
            (this._onDocumentMousemove = (e) => {
                const t = this._editors.find((e) => e.isUserTyping);
                t && this._endTypingModeAndUpdateState(t);
            }),
            (this._onDocumentFocusout = (e) => {
                const t = this._editors.find((e) => e.isUserTyping);
                t && this._endTypingModeAndUpdateState(t);
            }),
            (this._onDocumentClick = (e) => {
                if (this._tweaks.isClickIgnored(e)) return;
                const t = closestElement(e.target, ErrorCard.CONTAINER_ELEMENT_NAME);
                t || this._hideAllErrorCards();
                const r = closestElement(e.target, SynonymsCard.CONTAINER_ELEMENT_NAME);
                r || this._hideAllSynonymsCards();
                const i = closestElement(e.target, `${Dialog.CONTAINER_ELEMENT_NAME}, ${Toolbar.CONTAINER_ELEMENT_NAME}`);
                i || this._hideAllDialogs(), closestElement(e.target, `${MessagePopup.CONTAINER_ELEMENT_NAME}`) || this._hideAllMessagePopups(), i || r || t || this._editors.forEach((e) => this._unselectError(e));
            }),
            (this._onInputDblClick = (e) => {
                const { hasSynonymsEnabled: t } = this._storageController.getSettings();
                if (!t || this._storageController.isUsedCustomServer()) return;
                const r = this._editors.find((t) => t.inputAreaWrapper === e.detail.inputAreaWrapper);
                if (!r) return;
                const i = e.detail.selection,
                    o = getWordContext(r.inputAreaWrapper.getText(), i.start, i.end || i.start);
                o && this._showSynonymsCard(r, e.detail.clickedRectangles, o);
            }),
            (this._onInputTextChanged = (e) => {
                this._hideAllErrorCards(), this._hideAllSynonymsCards();
                const t = this._editors.find((t) => t.inputAreaWrapper === e.detail.inputAreaWrapper);
                if (t) {
                    if ((this._startTypingMode(t), t.dialog && t.dialog.setInsignificantChangeMode(!this._isSignificantTextChange(e.detail.previousText, e.detail.text)), this._validateEditor(t, e.detail.text, !0)))
                        this._endTypingMode(t), this._updateDisplayedErrors(t);
                    else {
                        const r = e.detail.text,
                            i = this._tweaks.getReplacedParts(t.inputArea, r),
                            o = getValuableText(r, i),
                            n = LTAssistant._migrateErrorsBetweenTexts(t.errors, t.validatedText.originalText, r);
                        this._updateDisplayedErrors(t, o, n);
                    }
                    this._highlight(t), this._updateState(t);
                }
            }),
            (this._onInputPaste = (e) => {
                this._hideAllErrorCards(), this._hideAllSynonymsCards();
                const t = this._editors.find((t) => t.inputAreaWrapper === e.detail.inputAreaWrapper);
                t && t.dialog && t.dialog.setInsignificantChangeMode(!e.detail.isSignificantTextChange);
            }),
            (this._onInputScroll = () => {
                window.requestAnimationFrame(() => {
                    this._hideAllErrorCards(), this._hideAllSynonymsCards();
                });
            }),
            (this._onHiglighterBlockClicked = (e) => {
                if (e.detail.blockId === SynonymsCard.BLOCK_ID) return;
                this._hideAllErrorCards(), this._hideAllSynonymsCards(), this._hideAllDialogs();
                const t = this._editors.find((t) => t.highlighter === e.detail.highlighter);
                if (!t) return;
                const r = t.displayedErrors.find((t) => t.id === e.detail.blockId);
                if (!r) return;
                if (t.temporaryDisabledErrorId === r.id) return;
                if (!EnvironmentAdapter.isRuntimeConnected()) return;
                if (getSelectedText().trim()) return;
                t.selectedErrorId = r.id;
                let i = !1;
                t.callbacks.onErrorClick && (i = t.callbacks.onErrorClick(r)), i || this._showErrorCard(t, r, e.detail.clickedBox), this._highlight(t);
            }),
            (this._onToolbarPermissionRequiredIconClicked = () => {
                window.open(config.INSTALL_URL), Tracker.trackEvent("Action", "toolbar:open_install_url");
            }),
            (this._onToolbarToggleDialog = (e) => {
                const t = this._editors.find((t) => t.toolbar === e.detail.toolbar);
                if (!t) return;
                const r = !t.dialog;
                this._hideAllErrorCards(), this._hideAllSynonymsCards(), this._hideAllDialogs(!0), r && this._showDialog(t);
            }),
            (this._onToolbarNotifyAboutPremiumIcon = (e) => {
                const t = this._editors.find((t) => t.toolbar === e.detail.toolbar);
                t && t.language && (t.tracking.sawPremiumIcon = !0);
            }),
            (this._onTurnOffClicked = (e) => {
                const t = getMainPageDomain();
                if (
                    (this._storageController.disableDomain(t),
                    EnvironmentAdapter.ltAssistantStatusChanged({ enabled: !1 }),
                    Tracker.trackEvent("Action", "check_trigger:turn_off"),
                    !this._storageController.getUIState().hasSeenTurnOnMessagePopup && this._tweaks.getMessagePopupAppearance().isVisible())
                ) {
                    const e = { className: "enable-spelling", hasPrimaryButton: !0, hasSecondaryButton: !0, isClosable: !0, destroysAutomatically: !0 },
                        t = new MessagePopup(document, this._tweaks.getMessagePopupAppearance(), e);
                    this._messages.push(t);
                }
            }),
            (this._onPauseCheckingClicked = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                if (!t) return;
                const r = t.groupId;
                Array.from(this._editors).forEach((e) => {
                    e.groupId === r && this._destroyEditor(e);
                }),
                    this._temporaryDisabledEditorGroups.push(t.groupId),
                    Tracker.trackEvent("Action", "check_trigger:pause");
            }),
            (this._onTurnOnClicked = (e) => {
                const t = getMainPageDomain(),
                    r = this._tweaks.getEditorGroupId(getCurrentUrl());
                this._storageController.enableDomainAndEditorGroup(t, r),
                    EnvironmentAdapter.ltAssistantStatusChanged({ enabled: !0 }),
                    document.activeElement instanceof HTMLElement && this._initElement(document.activeElement, !0),
                    Tracker.trackEvent("Action", "check_trigger:turn_on");
            }),
            (this._onPositionChangeClicked = (e) => {
                this._storageController.updateUIState({ dialogPosition: e.detail.newPosition });
            }),
            (this._onDialogEnableHere = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                t && (this._enableEditor(t), Tracker.trackEvent("Action", "check_trigger:manually_triggered"));
            }),
            (this._onPickyModeToggle = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                if (!t) return;
                const r = e.detail.isEnabled ? "picky" : "hidden-picky",
                    i = t.groupId;
                if (
                    (this._editors
                        .filter((e) => e.groupId === i)
                        .forEach((e) => {
                            this._setCheckLevel(e, r);
                        }),
                    this._tweaks.persistTemporarySettings())
                ) {
                    const e = `checkLevel:${i}`;
                    LocalStorageWrapper.set(e, r);
                }
            }),
            (this._onDialogEnableEverywhere = (e) => {
                this._storageController.updateSettings({ autoCheck: !0, ignoreCheckOnDomains: [] }), Tracker.trackEvent("Action", "enable_everywhere");
            }),
            (this._onDialogLanguageChanged = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                t && this._setLanguage(t, e.detail.language);
            }),
            (this._onDialogCountChanged = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                if (t && t.dialog) {
                    (t.countMode = e.detail.countMode), this._storageController.updateUIState({ countMode: e.detail.countMode });
                    let r = this._getCountOptions(t.validatedText.originalText, e.detail.countMode);
                    t.dialog.setCountOptions(r);
                }
            }),
            (this._onErrorCardLanguageChanged = (e) => {
                const t = this._editors.find((t) => t.errorCard === e.detail.errorCard);
                t && (this._setLanguage(t, e.detail.language), Tracker.trackEvent("Action", "check_trigger:switch_language_variant"));
            }),
            (this._onDialogErrorHighlighted = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                if (!t) return;
                const r = t.displayedErrors.find((t) => t.id === e.detail.errorId);
                r && ((t.selectedErrorId = r.id), this._highlight(t));
            }),
            (this._onDialogErrorSelected = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                if (!t) return;
                const r = t.displayedErrors.find((t) => t.id === e.detail.errorId);
                r && this._scrollToError(t, r, !0);
            }),
            (this._onAddToDictionary = (e) => {
                let t;
                if ("errorCard" in e.detail) {
                    const r = e.detail.errorCard;
                    t = this._editors.find((e) => e.errorCard === r);
                } else if ("dialog" in e.detail) {
                    const r = e.detail.dialog;
                    t = this._editors.find((e) => e.dialog === r);
                }
                if ((this._hideAllErrorCards(), !t)) return;
                const r = e.detail.error,
                    i = r.originalPhrase;
                this._addToDictionary(t, i);
                const o = LanguageManager.getPrimaryLanguageCode(r.language.code);
                (o.startsWith("de") || o.startsWith("en")) &&
                    ("de" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: de: ${r.contextPhrase}`)
                        : "del" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: del: ${r.contextPhrase}`)
                        : "air" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: air: ${r.contextPhrase}`)
                        : "click" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: click: ${r.contextPhrase}`)
                        : "school" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: school: ${r.contextPhrase}`)
                        : "un" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: un: ${r.contextPhrase}`)
                        : "eco" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: eco: ${r.contextPhrase}`)
                        : "geo" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: geo: ${r.contextPhrase}`)
                        : "et" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: et: ${r.contextPhrase}`)
                        : "and" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: and: ${r.contextPhrase}`)
                        : "el" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: el: ${r.contextPhrase}`)
                        : "of" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: of: ${r.contextPhrase}`)
                        : "for" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: for: ${r.contextPhrase}`)
                        : "the" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: the: ${r.contextPhrase}`)
                        : "pre" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: pre: ${r.contextPhrase}`)
                        : "black" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: black: ${r.contextPhrase}`)
                        : "connect" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: connect: ${r.contextPhrase}`)
                        : "day" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: day: ${r.contextPhrase}`)
                        : "advanced" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: advanced: ${r.contextPhrase}`)
                        : "social" === r.originalPhrase.toLowerCase()
                        ? Tracker.trackEvent("Debug", `${o}: social: ${r.contextPhrase}`)
                        : "big" === r.originalPhrase.toLowerCase() && Tracker.trackEvent("Debug", `${o}: big: ${r.contextPhrase}`)),
                    Tracker.trackDictionaryEvent(o, r.originalPhrase, !1),
                    Tracker.trackEvent("Action", `${o}:add_word_to_dict`);
            }),
            (this._onIgnoreRule = (e) => {
                let t;
                if ("errorCard" in e.detail) {
                    const r = e.detail.errorCard;
                    t = this._editors.find((e) => e.errorCard === r);
                } else if ("dialog" in e.detail) {
                    const r = e.detail.dialog;
                    t = this._editors.find((e) => e.dialog === r);
                }
                if ((this._hideAllErrorCards(), !t)) return;
                const r = e.detail.error,
                    i = LanguageManager.getPrimaryLanguageCode(r.language.code),
                    o = { id: r.rule.id, language: i, description: r.rule.description, turnOffDate: new Date() };
                let n = !1;
                if ((this._options.onRuleIgnore && (n = this._options.onRuleIgnore(o, t.inputArea)), t.callbacks.onRuleIgnore && (n = t.callbacks.onRuleIgnore(o)), !n)) {
                    const e = this._storageController.getSettings().ignoredRules;
                    e.push(o), this._storageController.updateSettings({ ignoredRules: e });
                }
                Tracker.trackDisabledRule(i, r.rule.id, `[${r.rule.subId || "0"}] ${r.contextPhrase}`, r.rule.isPremium),
                    "errorCard" in e.detail && Tracker.trackEvent("Action", `${i}:disable_rule`, r.rule.id),
                    "DOUBLES_ESPACES" === r.rule.id && Tracker.trackEvent("Stat", "ignore_doubles_espaces", getCurrentDomain() + ": " + r.contextPhrase);
            }),
            (this._onTemporarilyIgnoreWord = (e) => {
                let t;
                if ("errorCard" in e.detail) {
                    const r = e.detail.errorCard;
                    t = this._editors.find((e) => e.errorCard === r);
                } else if ("dialog" in e.detail) {
                    const r = e.detail.dialog;
                    t = this._editors.find((e) => e.dialog === r);
                }
                if ((this._hideAllErrorCards(), !t)) return;
                const r = e.detail.error,
                    i = LanguageManager.getPrimaryLanguageCode(r.language.code);
                if (t.callbacks.onTemporaryIgnore) {
                    const e = { id: r.rule.id, phrase: r.originalPhrase, language: i };
                    t.callbacks.onTemporaryIgnore(e);
                }
                this._temporarilyIgnoreWord(t, r.originalPhrase), Tracker.trackDictionaryEvent(i, r.originalPhrase, !0), Tracker.trackEvent("Action", `${i}:temp_ignore_word`);
            }),
            (this._onTemporarilyIgnoreRule = (e) => {
                let t;
                if ("errorCard" in e.detail) {
                    const r = e.detail.errorCard;
                    t = this._editors.find((e) => e.errorCard === r);
                } else if ("dialog" in e.detail) {
                    const r = e.detail.dialog;
                    t = this._editors.find((e) => e.dialog === r);
                }
                if ((this._hideAllErrorCards(), !t)) return;
                const r = e.detail.error,
                    i = t.groupId,
                    o = LanguageManager.getPrimaryLanguageCode(r.language.code),
                    n = { id: r.rule.id, phrase: r.originalPhrase, language: o };
                if (this._tweaks.persistTemporarySettings()) {
                    const e = `ignored:${i}`,
                        t = LocalStorageWrapper.get(e) || { words: [], rules: [] };
                    t.rules.push(n), LocalStorageWrapper.set(e, t);
                }
                const a = this._editors.filter((e) => e.groupId === i);
                t.callbacks.onTemporaryIgnore && t.callbacks.onTemporaryIgnore(n),
                    a.forEach((e) => this._temporarilyIgnoreRule(e, n)),
                    Tracker.trackDisabledRule(o, r.rule.id, `[${r.rule.subId || "0"}] ${r.contextPhrase}`, r.rule.isPremium),
                    "errorCard" in e.detail && Tracker.trackEvent("Action", `${o}:temp_disable_rule`, r.rule.id),
                    "DOUBLES_ESPACES" === r.rule.id && Tracker.trackEvent("Stat", "ignore_doubles_espaces", getCurrentDomain() + ": " + r.contextPhrase);
            }),
            (this._onMoreDetailsClicked = (e) => {
                window.open(e.detail.url, "_blank"), Tracker.trackEvent("Action", "show_rule_details", e.detail.url);
            }),
            (this._onFixSelected = (e) => {
                let t;
                if ("errorCard" in e.detail) {
                    const r = e.detail.errorCard;
                    t = this._editors.find((e) => e.errorCard === r);
                } else if ("dialog" in e.detail) {
                    const r = e.detail.dialog;
                    t = this._editors.find((e) => e.dialog === r);
                }
                if ((this._hideAllErrorCards(), !t)) return;
                const r = e.detail.error;
                this._applyFix(t, r, e.detail.fixIndex),
                    "errorCard" in e.detail && Tracker.trackEvent("Action", `${LanguageManager.getPrimaryLanguageCode(e.detail.error.language.code)}:apply_rule`, e.detail.error.rule.id),
                    "Translation" === r.fixes[e.detail.fixIndex].type && Tracker.trackEvent("Stat", `${LanguageManager.getPrimaryLanguageCode(e.detail.error.language.code)}:apply_translation`);
            }),
            (this._onDialogOpenOptions = (e) => {
                EnvironmentAdapter.openOptionsPage(e.detail.target, e.detail.ref);
            }),
            (this._onDialogShowFeedbackForm = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                if (!t) return;
                const r = t.inputArea.cloneNode(!1);
                try {
                    r.innerText = `${t.inputAreaWrapper.getText().length} chars, ${t.language ? t.language.code : "unknown lang"}`;
                } catch (e) {}
                EnvironmentAdapter.openFeedbackForm(getCurrentUrl(), "", r.outerHTML || "");
            }),
            (this._onDialogDestroyed = (e) => {
                const t = this._editors.find((t) => t.dialog === e.detail.dialog);
                t && ((t.dialog = null), null === t.errorCard && this._unselectError(t));
            }),
            (this._onBadgeClicked = () => {
                this._hideAllErrorCards(), this._hideAllSynonymsCards();
                let e = !1;
                this._options.onPremiumTeaserClick && (e = this._options.onPremiumTeaserClick()),
                    e || EnvironmentAdapter.openOptionsPage(void 0, "errorcard"),
                    Tracker.trackEvent("Action", "check_trigger:badge:clicked", String(`premium:${this._storageController.getUIState().hasPaidSubscription}`));
            }),
            (this._onLogoClicked = () => {
                this._hideAllErrorCards(), this._hideAllSynonymsCards();
                let e = "https://languagetool.org/?pk_campaign=addon2-errorcard-logo";
                BrowserDetector.isSafari() && (e += "&hidePremium=true"), window.open(e, "_blank"), Tracker.trackEvent("Action", "check_trigger:logo:clicked", String(`premium:${this._storageController.getUIState().hasPaidSubscription}`));
            }),
            (this._onMessagePopupDestroyed = (e) => {
                const t = this._messages.indexOf(e.detail.message);
                -1 !== t && this._messages.splice(t, 1);
            }),
            (this._onErrorCardDestroyed = (e) => {
                var t;
                const r = this._editors.find((t) => t.errorCard === e.detail.errorCard);
                r &&
                    ((r.errorCard = null),
                    null === (t = r.dialog) || void 0 === t || t.fadeIn(),
                    r.selectedErrorId === e.detail.error.id && ((r.temporaryDisabledErrorId = r.selectedErrorId), window.setTimeout(() => (r.temporaryDisabledErrorId = null), 500), this._unselectError(r)));
            }),
            (this._onSynonymSelected = (e) => {
                const t = this._editors.find((t) => t.synonymsCard === e.detail.synonymsCard);
                if ((this._hideAllSynonymsCards(), !t)) return;
                const r = e.detail.word,
                    i = r.replace(r.trim(), e.detail.synonym),
                    o = e.detail.selection.end || e.detail.selection.start;
                this._tweaks.applyFix({ offset: e.detail.selection.start, length: o - e.detail.selection.start, replacementText: i, editor: t }),
                    this._temporarilyIgnoreWord(t, e.detail.synonym),
                    wait(100).then(() => t.validationDebounce.callImmediately());
                const { appliedSynonyms: n } = this._storageController.getStatistics();
                this._storageController.updateStatistics({ appliedSynonyms: n + 1 }), Tracker.trackEvent("Action", "synonyms:applied");
            }),
            (this._onSynonymsCardDestroyed = (e) => {
                const t = this._editors.find((t) => t.synonymsCard === e.detail.synonymsCard);
                t && ((t.synonymsCard = null), this._highlight(t));
            }),
            (this._onSettingsChanged = (e) => {
                if (e.dictionary) {
                    const e = Dictionary.get();
                    for (const t of this._editors) (t.errors = t.errors.filter((t) => !isErrorIgnoredByDictionary(t, e))), this._updateDisplayedErrors(t), this._highlight(t), this._updateState(t);
                }
                if (e.ignoredRules) for (const e of this._editors) this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e);
                if (
                    (e.disabledDomainsCapitalization &&
                        this._editors.forEach((e) => {
                            this._resetEditor(e), this._endTypingMode(e), this._validateEditor(e), this._highlight(e), this._updateState(e);
                        }),
                    e.autoCheck || e.autoCheckOnDomains || e.disabledDomains || e.ignoreCheckOnDomains || e.disabledEditorGroups)
                ) {
                    const e = this._getValidationSettings();
                    if (e.isDomainDisabled || e.isEditorGroupDisabled) {
                        Array.from(this._editors).forEach((e) => this._destroyEditor(e));
                    } else
                        e.isAutoCheckEnabled
                            ? this._editors.filter((e) => !e.isAutoCheckEnabled).forEach((e) => this._enableEditor(e))
                            : e.isAutoCheckEnabled || (this._hideAllDialogs(), this._editors.forEach((e) => this._disableEditor(e)));
                }
            }),
            (this._onPrivacySettingsChanged = (e) => {
                e.allowRemoteCheck &&
                    e.allowRemoteCheck.newValue &&
                    ((this._isRemoteCheckAllowed = !0),
                    this._editors.forEach((e) => {
                        this._validateEditor(e), this._updateState(e);
                    }));
            }),
            (this._onUiStateChanged = (e) => {
                e.hasPaidSubscription &&
                    this._editors.forEach((e) => {
                        this._resetEditor(e), this._validateEditor(e), this._updateState(e);
                    });
            }),
            (this._onDestroy = (e) => {
                e.detail.type ? e.detail.type === EnvironmentAdapter.getType() && this.destroy() : this.destroy();
            }),
            document.documentElement &&
                "HTML" === document.documentElement.nodeName &&
                ((this._options = Object.assign({}, e)),
                "string" == typeof this._options.localeCode && i18nManager.setLocale(this._options.localeCode),
                (this._tweaks = t),
                this._tweaks.init(),
                (this._isConnected = !0),
                (this._temporaryDisabledEditorGroups = []),
                (this._storageController = StorageController.create()),
                this._storageController.onReady(this._init),
                Dictionary.init(this._storageController, this._options.dictionary));
    }
    static _isPendingError(e, t) {
        if (0 === e.contextForSureMatch) return !1;
        const r = t.substr(e.end, 100).split("\n")[0],
            i = LTAssistant.COMPLETED_SENTENCE_REGEXP.test(r) || LTAssistant.PUNCTIUATION_CHAR_REGEXP.test(e.originalPhrase);
        if (-1 === e.contextForSureMatch && !i) return !0;
        if (!i) {
            if (r.split(/\s+/).length - 1 <= e.contextForSureMatch) return !0;
        }
        return !1;
    }
    static _isErrorSelected(e, t) {
        return !(!t || (t.start !== e.start && t.end !== e.end));
    }
    static _getChangedParagraphs(e, t) {
        return getParagraphsDiff(e, t)
            .filter((e) => e.oldText !== e.newText && null !== e.newText)
            .map((e) => ({ text: e.newText, offset: e.newOffset }));
    }
    static _migrateErrorsToValuableText(e, t) {
        const r = [];
        for (const i of e) {
            const e = binarySearch(t, (e) => compareNumberAndSegment(i.start, e.originalStart, e.originalEnd, !0)),
                o = binarySearch(t, (e) => compareNumberAndSegment(i.end, e.originalStart, e.originalEnd));
            if (!e || !o) continue;
            const n = clone(i);
            (n.start -= e.posDiff), (n.end -= o.posDiff), (n.length = n.end - n.start), r.push(n);
        }
        return r;
    }
    static _migrateErrorsToOriginalText(e, t) {
        const r = [];
        for (const i of e) {
            const e = binarySearch(t, (e) => compareNumberAndSegment(i.start, e.start, e.end, !0)),
                o = binarySearch(t, (e) => compareNumberAndSegment(i.end, e.start, e.end));
            if (!e || !o) continue;
            const n = clone(i);
            (n.start += e.posDiff), (n.end += o.posDiff), (n.length = n.end - n.start), r.push(n);
        }
        return r;
    }
    static _migrateErrorsBetweenTexts(e, t, r, i) {
        let o,
            n = !1;
        "string" == typeof t && "string" == typeof r ? ((o = getParagraphsDiff(t, r)), (n = "boolean" == typeof i && i)) : ((o = t), (n = "boolean" == typeof r && r));
        const a = [];
        for (const t of e) {
            const e = binarySearch(o, (e) => {
                    const r = e.oldOffset;
                    if (null === e.oldText) return t.start >= r ? 1 : -1;
                    const i = e.oldOffset + e.oldText.length + 1;
                    return compareNumberAndSegment(t.start, r, i, !0);
                }),
                r = clone(t);
            if (e) {
                if (e.textDiff) {
                    if (n) continue;
                    {
                        const t = e.oldOffset + e.textDiff.from,
                            i = t + e.textDiff.oldFragment.length;
                        if (isIntersect(t, i, r.start, r.end, !0)) continue;
                        if (r.start >= i) {
                            const t = e.textDiff.newFragment.length - e.textDiff.oldFragment.length;
                            (r.start += t), (r.end += t);
                        }
                    }
                }
                (r.start += e.newOffset - e.oldOffset), (r.end = r.start + r.length);
            }
            a.push(r);
        }
        return a;
    }
    static _migrateErrorsBetweenSameOriginalTexts(e, t, r) {
        const i = [];
        for (const o of e) {
            let e = o.start,
                n = o.end,
                a = binarySearch(t.usedParts, (t) => compareNumberAndSegment(e, t.originalStart, t.originalEnd, !0)),
                s = binarySearch(t.usedParts, (e) => compareNumberAndSegment(n, e.originalStart, e.originalEnd));
            if (!a || !s) continue;
            if (((e -= a.posDiff), (n -= s.posDiff), (a = binarySearch(r.usedParts, (t) => compareNumberAndSegment(e, t.start, t.end, !0))), (s = binarySearch(r.usedParts, (e) => compareNumberAndSegment(n, e.start, e.end))), !a || !s))
                continue;
            (e += a.posDiff), (n += s.posDiff);
            const d = clone(o);
            (d.start = e), (d.end = n), (d.length = n - e), i.push(d);
        }
        return i;
    }
    _isSignificantTextChange(e, t) {
        return Math.abs(t.length - e.length) > 200;
    }
    _getValidationSettings() {
        const e = getMainPageDomain();
        return this._storageController.getValidationSettings(e, this._tweaks.getEditorGroupId(getCurrentUrl()));
    }
    _fixIframeWithoutContentScripts() {
        if (!document.activeElement || "IFRAME" !== document.activeElement.nodeName) return;
        const e = document.activeElement.contentWindow;
        let t = !1;
        try {
            t = !!e.location.href;
        } catch (e) {}
        t &&
            "complete" === e.document.readyState &&
            e.document.documentElement &&
            (e.__ltJsLoaded || (isLTAvailable(e) ? (e.__ltJsLoaded = !0) : e.document.body && isTinyMCE(e.document.body) && ((e.__ltJsLoaded = !0), EnvironmentAdapter.loadContentScripts(e, "js"))),
            e.__ltCssLoaded || (isCssContentScriptsLoaded(e) ? (e.__ltCssLoaded = !0) : e.document.body && ((e.__ltCssLoaded = !0), EnvironmentAdapter.loadContentScripts(e, "css"))));
    }
    _initElement(e, t = !1) {
        if (!e.parentElement) return;
        if (this._editors.some((t) => t.inputArea === e)) return;
        if (!this._tweaks.isElementCompatible(e)) return;
        const r = this._tweaks.getEditorGroupId(getCurrentUrl());
        if (this._temporaryDisabledEditorGroups.includes(r)) return;
        const i = this._getValidationSettings();
        i.isDomainDisabled ||
            i.isEditorGroupDisabled ||
            (window.clearTimeout(this._initElementTimeouts.get(e)),
            i.isAutoCheckEnabled && this._disableOtherSpellCheckers(e),
            this._initElementTimeouts.set(
                e,
                window.setTimeout(() => {
                    this._initElementTimeouts.delete(e), !t || hasFocus(e) ? this.initElement(e) : this._enableOtherSpellCheckers(e);
                }, 150)
            ));
    }
    initElement(e, t) {
        if (this._editors.some((t) => t.inputArea === e)) throw "LanguageTool is already initialized on this element.";
        if (!this._storageController.isReady()) throw "LTAssistant is not ready initialized yet.";
        const r = String((t && t.id) || Math.round(99999 * Math.random()) + ":" + Date.now()),
            i = this._tweaks.getEditorGroupId(getCurrentUrl()),
            o = isFormElement(e) ? new Mirror(e) : null,
            n = o ? o.getCloneElement() : e,
            a = new InputAreaWrapper(e, n, this._tweaks.getInputAreaWrapperTweaks(e), this._tweaks.getMaxTextLength(e, this._storageController)),
            s = new Highlighter(e, a, n, !!o, this._tweaks.getHighlighterTweaks(e, n, !!o), this._tweaks.getClickEvent());
        let d = null;
        "false" !== e.getAttribute("data-lt-toolbar") && (d = new Toolbar(e, this._tweaks.getToolbarAppearance(e), o));
        const l = this._tweaks.initElement(e);
        let g = { words: (t && t.dictionary) || [], rules: (t && t.ignoredRules) || [] };
        this._tweaks.persistTemporarySettings() && (g = LocalStorageWrapper.get(`ignored:${i}`) || g);
        let c = "hidden-picky";
        this._tweaks.persistTemporarySettings() && (c = LocalStorageWrapper.get(`checkLevel:${i}`) || c);
        const h = {
                id: r,
                groupId: i,
                checkLevel: (t && t.checkLevel) || c,
                inputArea: e,
                countMode: this._storageController.getUIState().countMode,
                inputAreaTweaks: l,
                mirror: o,
                inputAreaWrapper: a,
                highlighter: s,
                toolbar: d,
                dialog: null,
                errorCard: null,
                synonymsCard: null,
                ignoredRules: g.rules || [],
                ignoredWords: g.words || [],
                validationDebounce: new Debounce(this._sendValidationRequest.bind(this), config.VALIDATION_DELAY, config.VALIDATION_MAX_DELAY),
                validationStatus: VALIDATION_STATUS.COMPLETED,
                language: null,
                forceLanguage: !1,
                isLanguageSupported: !0,
                isAutoCheckEnabled: this._getValidationSettings().isAutoCheckEnabled,
                isUserTyping: !1,
                isValidating: !1,
                isTextTooShort: !1,
                isTextTooLong: !1,
                validationError: null,
                validationTimestamp: 0,
                validatedText: { text: "", originalText: "", usedParts: [{ start: 0, end: 0, originalStart: 0, originalEnd: 0, posDiff: 0, length: 0, text: "" }], ignoredParts: [] },
                isIncompleteResult: !1,
                errors: [],
                displayedErrors: [],
                pendingErrors: [],
                pickyErrors: [],
                premiumErrors: [],
                premiumPickyErrors: [],
                displayedHiddenErrorCount: 0,
                selectedErrorId: null,
                temporaryDisabledErrorId: null,
                typingTimeoutId: void 0,
                callbacks: {
                    onDictionaryAdd: t && t.onDictionaryAdd,
                    onRuleIgnore: t && t.onRuleIgnore,
                    onTemporaryIgnore: t && t.onTemporaryIgnore,
                    onUpdate: t && t.onUpdate,
                    onErrorClick: t && t.onErrorClick,
                    onBeforeErrorCorrect: t && t.onBeforeErrorCorrect,
                },
                tracking: { hasTracked: !1, hasEnoughText: !1, sawPremiumIcon: !1, languageCode: null, maxTextLength: 0 },
            },
            u = ((t && t.language) || "").toLowerCase();
        if (u) {
            const e = LanguageManager.LANGUAGES.find((e) => e.code === u);
            e && ((h.language = e), (h.forceLanguage = !0));
        }
        return (
            this._editors.push(h),
            this._validateEditor(h),
            this._updateState(h),
            this._tweaks.onElementDestroy(e, () => this._destroyEditor(h)),
            {
                addWord: (e) => this._temporarilyIgnoreWord(h, e),
                addToDictionary: (e) => this._addToDictionary(h, e),
                ignoreRule: (e) => this._temporarilyIgnoreRule(h, e),
                clearIgnoredRules: () => this._clearTemporarilyIgnoredRules(h),
                clearWords: () => this._clearWords(h),
                getText: () => h.inputAreaWrapper.getText(),
                getLanguage: () => h.language,
                setLanguage: (e) => this._setLanguage(h, e.toLowerCase()),
                setCheckLevel: (e) => this._setCheckLevel(h, e),
                getCheckLevel: () => h.checkLevel,
                getElement: () => h.inputArea,
                getDisplayedErrors: () => h.displayedErrors,
                getDisplayedPremiumErrors: () => h.premiumErrors,
                getStatus: () => h.validationStatus,
                getSelection: () => h.inputAreaWrapper.getSelection(),
                setSelection: (e) => h.inputAreaWrapper.setSelection(e),
                getTextBoxes: (e) => h.highlighter.getTextBoxes(e.id),
                applyFix: (e, t) => this._applyFix(h, e, t),
                scrollToError: (e, t = !1, r = "nearest", i) => this._scrollToError(h, e, t, r, i),
                destroy: () => this._destroyEditor(h),
            }
        );
    }
    updateLanguageOptions(e) {
        if (Array.isArray(e.preferredVariants)) {
            const t = {};
            for (const r of e.preferredVariants) {
                const e = LanguageManager.getPrimaryLanguageCode(r);
                "en" === e ? (t.enVariant = r) : "de" === e ? (t.deVariant = r) : "pt" === e ? (t.ptVariant = r) : "ca" === e && (t.caVariant = r);
            }
            this._storageController.updateSettings(t);
        }
        this._options.motherTongue && this._storageController.updateSettings({ motherTongue: e.motherTongue }), this._options.preferredLanguages && this._storageController.updateSettings({ geoIpLanguages: e.preferredLanguages });
    }
    updateUser(e) {
        this._storageController.updateSettings({ username: e.email, token: e.token, havePremiumAccount: !0, apiServerUrl: e.apiServerUrl || config.MAIN_SERVER_URL }),
            e.premium && this._storageController.updateUIState({ hasPaidSubscription: !0 });
    }
    setLocale(e) {
        i18nManager.setLocale(e);
    }
    _disableOtherSpellCheckers(e) {
        if (this._spellcheckingAttributesData.get(e)) return;
        const t = { spellcheck: e.getAttribute("spellcheck"), "data-gramm": e.getAttribute("data-gramm") };
        e.setAttribute("spellcheck", "false"), e.setAttribute("data-gramm", "false");
        const r = new MutationObserver(() => {
            ("false" === e.getAttribute("spellcheck") && "false" === e.getAttribute("data-gramm")) || (e.setAttribute("spellcheck", "false"), e.setAttribute("data-gramm", "false"));
        });
        r.observe(e, { attributes: !0, attributeFilter: ["spellcheck", "data-gramm"] }), this._spellcheckingAttributesData.set(e, { originalValues: t, mutationObserver: r });
    }
    _enableOtherSpellCheckers(e) {
        const t = this._spellcheckingAttributesData.get(e);
        if (t) {
            t.mutationObserver.disconnect();
            for (const r in t.originalValues) {
                const i = t.originalValues[r];
                t.originalValues[r] ? e.setAttribute(r, i) : e.removeAttribute(r);
            }
            this._spellcheckingAttributesData.delete(e);
        }
    }
    _updateState(e) {
        let t = VALIDATION_STATUS.COMPLETED;
        const r = e.language ? e.language.code : "";
        let i = "";
        this._isConnected
            ? this._isRemoteCheckAllowed
                ? e.isAutoCheckEnabled
                    ? e.isUserTyping || e.isValidating
                        ? (t = VALIDATION_STATUS.IN_PROGRESS)
                        : e.validationError
                        ? ((t = VALIDATION_STATUS.FAILED), (i = e.validationError.message))
                        : e.isTextTooShort
                        ? (t = VALIDATION_STATUS.TEXT_TOO_SHORT)
                        : e.isTextTooLong
                        ? (t = VALIDATION_STATUS.TEXT_TOO_LONG)
                        : e.isLanguageSupported || (t = VALIDATION_STATUS.UNSUPPORTED_LANGUAGE)
                    : (t = VALIDATION_STATUS.DISABLED)
                : (t = VALIDATION_STATUS.PERMISSION_REQUIRED)
            : (t = VALIDATION_STATUS.DISCONNECTED),
            (e.validationStatus = t);
        const o = {
            validationStatus: t,
            errorsCount: e.displayedErrors.length,
            premiumErrorsCount: e.premiumErrors.length,
            isIncompleteResult: e.isIncompleteResult,
            validationErrorMessage: i,
            showNotification: !this._storageController.getUIState().changelog2021CountdownEnd && this._storageController.isRelevantForChangelogCoupon().status,
        };
        if ((e.toolbar && e.toolbar.updateState(o), e.dialog)) {
            const r = new TextStatistics(e.validatedText.originalText),
                o = new TextScore().calculateTextScore(r.getAllWords().length, e.errors, e.premiumErrors, e.pickyErrors),
                n = {
                    validationStatus: t,
                    displayedErrors: e.displayedErrors,
                    premiumErrors: e.premiumErrors,
                    pickyErrors: e.pickyErrors,
                    errors: e.errors,
                    isIncompleteResult: e.isIncompleteResult,
                    ignoredErrorsStats: this._getIgnoredErrorsStats(e.errors),
                    validationErrorMessage: i,
                    textScore: o,
                    countOptions: this._getCountOptions(e.validatedText.originalText, e.countMode),
                };
            e.dialog.updateState(n);
        }
        e.displayedHiddenErrorCount = Math.max(e.displayedHiddenErrorCount, e.premiumErrors.length);
        const n = {
            validationStatus: t,
            languageCode: r,
            errors: e.errors,
            displayedErrors: e.displayedErrors,
            premiumErrors: e.premiumErrors,
            premiumPickyErrors: e.premiumPickyErrors,
            pickyErrors: e.pickyErrors,
            isIncompleteResult: e.isIncompleteResult,
            validationErrorMessage: i,
            validatedText: e.validatedText,
        };
        dispatchCustomEvent(e.inputArea, LTAssistant.events.UPDATE, n), e.callbacks.onUpdate && e.callbacks.onUpdate(n);
    }
    _getCountOptions(e, t) {
        const r = new TextStatistics(e);
        return { mode: t, counts: { characters: e.length, sentences: r.getAllSentences().length, words: r.getAllWords().length } };
    }
    _setLanguage(e, t) {
        const r = e.language;
        let i = null;
        if ("auto" === t) (e.language = null), (e.forceLanguage = !1);
        else {
            if (!(i = LanguageManager.LANGUAGES.find((e) => e.code === t) || null)) throw new Error(`LTAssistant: Language '${t}' is not supported.`);
            (e.language = i), (e.forceLanguage = !0);
        }
        if ((this._resetEditor(e), this._endTypingMode(e), this._validateEditor(e, !0, !1), this._highlight(e), this._updateState(e), r && r.code)) {
            if ((Tracker.trackEvent("Action", "check_trigger:switch_language", `${r.code} -> ${t}`), i && LanguageManager.isLanguageVariant(r) && LanguageManager.isLanguageVariant(i))) {
                const e = LanguageManager.getPrimaryLanguageCode(r.code),
                    t = LanguageManager.getPrimaryLanguageCode(i.code);
                if (e === t && r.code !== i.code) {
                    const e = LanguageManager.formatLanguageCode(i.code);
                    "en" === t
                        ? this._storageController.updateSettings({ enVariant: e })
                        : "de" === t
                        ? this._storageController.updateSettings({ deVariant: e })
                        : "pt" === t
                        ? this._storageController.updateSettings({ ptVariant: e })
                        : "ca" === t && this._storageController.updateSettings({ caVariant: e });
                }
            }
        } else Tracker.trackEvent("Action", "check_trigger:switch_language", `unknown -> ${t}`);
    }
    _setCheckLevel(e, t) {
        this._resetEditor(e), (e.checkLevel = t), this._validateEditor(e), this._updateState(e), Tracker.trackEvent("Action", "set_check_level", t);
    }
    _resetEditor(e) {
        (e.isValidating = !1),
            (e.isTextTooShort = !1),
            (e.isTextTooLong = !1),
            (e.validationError = null),
            (e.validationTimestamp = 0),
            (e.validatedText = { text: "", originalText: "", usedParts: [{ start: 0, end: 0, originalStart: 0, originalEnd: 0, posDiff: 0, length: 0, text: "" }], ignoredParts: [] }),
            (e.isIncompleteResult = !1),
            (e.errors = []),
            (e.displayedErrors = []),
            (e.pendingErrors = []),
            (e.premiumErrors = []),
            (e.pickyErrors = []),
            (e.selectedErrorId = null),
            e.errorCard && e.errorCard.destroy(),
            e.synonymsCard && e.synonymsCard.destroy();
    }
    _validateEditor(e, t, r) {
        let i,
            o = !1;
        if (
            (void 0 === t && void 0 === r
                ? ((i = e.inputAreaWrapper.getText()), (r = !1))
                : "boolean" == typeof t && void 0 === r
                ? ((i = e.inputAreaWrapper.getText()), (r = t))
                : "string" == typeof t && "boolean" == typeof r
                ? (i = t)
                : ((i = e.inputAreaWrapper.getText()), (o = t)),
            !this._isConnected)
        )
            return !0;
        if (!this._isRemoteCheckAllowed || !e.isAutoCheckEnabled) return !0;
        const n = i.trim();
        if (n.length < config.MIN_TEXT_LENGTH || LTAssistant.NO_LETTERS_REGEXP.test(n))
            return e.forceLanguage || ((e.language = null), (e.isLanguageSupported = !0)), this._resetEditor(e), (e.isTextTooShort = !0), e.validationDebounce.cancelCall(), !0;
        if (i.length > this._tweaks.getMaxTextLength(e.inputArea, this._storageController)) {
            const { hasPaidSubscription: t } = this._storageController.getUIState();
            if (!t && !this._storageController.isUsedCustomServer()) return e.forceLanguage || ((e.language = null), (e.isLanguageSupported = !0)), this._resetEditor(e), (e.isTextTooLong = !0), e.validationDebounce.cancelCall(), !0;
        }
        return (
            !e.forceLanguage && isTextsCompletelyDifferent(e.validatedText.originalText, i) && ((e.language = null), (e.isLanguageSupported = !0)),
            e.isLanguageSupported || ((e.isLanguageSupported = !0), e.forceLanguage || (e.language = null)),
            (e.isValidating = !0),
            (e.isTextTooShort = !1),
            (e.isTextTooLong = !1),
            e.validationDebounce.call(e, i, o),
            r || e.validationDebounce.callImmediately(),
            !1
        );
    }
    _sendValidationRequest(e, t, r) {
        return __awaiter(this, void 0, void 0, function* () {
            const i = this._tweaks.getReplacedParts(e.inputArea, t),
                o = getValuableText(t, i);
            if (o.text === e.validatedText.text) return void this._onValidationAborted(e, e.validatedText, o);
            const n = LTAssistant._getChangedParagraphs(e.validatedText.text, o.text),
                a = getCurrentUrl(),
                s = yield this._tweaks.getRecipientInfo(e.inputArea),
                d = this._tweaks.shouldUsePartialValidationCaching(e),
                l = {
                    instanceId: e.id,
                    url: a,
                    checkLevel: e.checkLevel,
                    elementLanguage: e.inputArea instanceof HTMLElement ? e.inputArea.lang : "",
                    recipientInfo: s,
                    ignoreUppercaseErrors: isCEElement(e.inputArea),
                    usePartialValidationCaching: d,
                },
                g = this._tweaks.getValidationOptions(e, t),
                c = Date.now();
            try {
                const t = yield EnvironmentAdapter.validate(e, o.text, n, l, g, r);
                if (!t) return;
                t.isSuccessful ? this._onValidationCompleted(t, o, c) : this._onValidationFailed(t);
            } catch (t) {
                (e.isValidating = !1),
                    console.error(t),
                    Tracker.trackError("message", t.message, "VALIDATE_TEXT"),
                    t.message && (t.message.startsWith("Invocation of form runtime.connect(null, ) doesn't match definition runtime.connect") || t.message.startsWith("Extension context invalidated"))
                        ? ((this._isConnected = !1),
                          this._editors.forEach((e) => {
                              e.highlighter && e.highlighter.destroy(), this._updateState(e);
                          }))
                        : ((e.validationError = { message: i18nManager.getMessage("unknownError") }), this._updateState(e));
            }
        });
    }
    _onValidationCompleted(e, t, r) {
        const i = this._editors.find((t) => t.id === e.instanceId);
        if (!i) return;
        if (!i.isAutoCheckEnabled) return;
        if (r < i.validationTimestamp) return;
        if (((i.validationError = null), (i.isValidating = !1), (i.validationTimestamp = r), e.isUnsupportedLanguage))
            return this._resetEditor(i), this._endTypingMode(i), (i.language = null), (i.isLanguageSupported = !1), (i.validatedText = t), this._highlight(i), void this._updateState(i);
        if (
            (e.language && !i.language && (i.language = e.language),
            t.originalText.length > config.MIN_TEXT_LENGTH && ((i.tracking.languageCode = e.language ? e.language.code : null), (i.tracking.hasEnoughText = !0)),
            (i.tracking.maxTextLength = Math.max(t.originalText.length, i.tracking.maxTextLength)),
            e.language && i.dialog && i.dialog.setCurrentLanguage(e.language.code),
            e.language && e.language.code.toLowerCase() !== i.language.code.toLowerCase())
        )
            return this._resetEditor(i), (i.language = e.language), this._validateEditor(i), this._highlight(i), void this._updateState(i);
        let o = i.errors.slice(0),
            n = i.premiumErrors.slice(0),
            a = i.premiumPickyErrors.slice(0),
            s = i.pickyErrors.slice(0);
        (o = o.filter((e) => e.isPartialValidation)),
            (n = n.filter((e) => e.isPartialValidation)),
            (a = a.filter((e) => e.isPartialValidation)),
            (s = s.filter((e) => e.isPartialValidation)),
            (o = LTAssistant._migrateErrorsToValuableText(o, i.validatedText.usedParts)),
            (n = LTAssistant._migrateErrorsToValuableText(n, i.validatedText.usedParts)),
            (a = LTAssistant._migrateErrorsToValuableText(a, i.validatedText.usedParts)),
            (s = LTAssistant._migrateErrorsToValuableText(s, i.validatedText.usedParts));
        const d = getParagraphsDiff(i.validatedText.text, t.text);
        (o = LTAssistant._migrateErrorsBetweenTexts(o, d, !0)),
            (n = LTAssistant._migrateErrorsBetweenTexts(n, d, !0)),
            (a = LTAssistant._migrateErrorsBetweenTexts(a, d, !0)),
            (s = LTAssistant._migrateErrorsBetweenTexts(s, d, !0)),
            (o = o.concat(e.partialValidationErrors)),
            (n = n.concat(e.partialValidationPremiumErrors)),
            (a = a.concat(e.partialValidationPremiumPickyErrors)),
            (s = s.concat(e.partialValidationPickyErrors));
        for (const t of e.validationErrors) o.some((e) => e.start === t.start && e.end === t.end) || o.push(t);
        for (const t of e.validationPremiumErrors) n.some((e) => e.start === t.start && e.end === t.end) || n.push(t);
        for (const t of e.validationPremiumPickyErrors) a.some((e) => e.start === t.start && e.end === t.end) || a.push(t);
        for (const t of e.validationPickyErrors) s.some((e) => e.start === t.start && e.end === t.end) || s.push(t);
        this._sortErrorsByOffset(o), this._sortErrorsByOffset(n), this._sortErrorsByOffset(a), this._sortErrorsByOffset(s);
        const l = {};
        o.forEach((e) => {
            const t = `${e.rule.id}:${e.originalPhrase}`;
            (l[t] = l[t] ? l[t] + 1 : 1), (e.id = `${t}:${l[t]}`);
        }),
            n.forEach((e) => {
                const t = `${e.rule.id}:${e.originalPhrase}`;
                (l[t] = l[t] ? l[t] + 1 : 1), (e.id = `${t}:${l[t]}`);
            }),
            a.forEach((e) => {
                const t = `${e.rule.id}:${e.originalPhrase}`;
                (l[t] = l[t] ? l[t] + 1 : 1), (e.id = `${t}:${l[t]}`);
            }),
            s.forEach((e) => {
                const t = `${e.rule.id}:${e.originalPhrase}`;
                (l[t] = l[t] ? l[t] + 1 : 1), (e.id = `${t}:${l[t]}`);
            }),
            (o = LTAssistant._migrateErrorsToOriginalText(o, t.usedParts)),
            (i.validatedText = t),
            (i.errors = o),
            (i.premiumErrors = n),
            (i.premiumPickyErrors = a),
            (i.pickyErrors = s),
            (i.isIncompleteResult = e.isIncompleteResult),
            (o = LTAssistant._migrateErrorsToValuableText(o, t.usedParts));
        const g = i.inputAreaWrapper.getText(),
            c = this._tweaks.getReplacedParts(i.inputArea, g),
            h = getValuableText(g, c);
        (o = LTAssistant._migrateErrorsBetweenTexts(o, t.text, h.text)),
            (o = LTAssistant._migrateErrorsToOriginalText(o, h.usedParts)),
            this._updateDisplayedErrors(i, h, o),
            0 === i.pendingErrors.length && this._endTypingMode(i),
            this._highlight(i),
            this._updateState(i);
    }
    _sortErrorsByOffset(e) {
        e.sort((e, t) => (e.start === t.start ? (e.isPartialValidation ? 1 : -1) : e.start > t.start ? 1 : -1));
    }
    _onValidationAborted(e, t, r) {
        (e.isValidating = !1),
            (e.pendingErrors = []),
            this._endTypingMode(e),
            (e.errors = LTAssistant._migrateErrorsBetweenSameOriginalTexts(e.errors, t, r)),
            (e.premiumErrors = LTAssistant._migrateErrorsBetweenSameOriginalTexts(e.premiumErrors, t, r)),
            (e.pickyErrors = LTAssistant._migrateErrorsBetweenSameOriginalTexts(e.pickyErrors, t, r)),
            (e.validatedText = r),
            (e.validationTimestamp = Date.now()),
            this._updateDisplayedErrors(e),
            this._highlight(e),
            this._updateState(e);
    }
    _onValidationFailed(e) {
        const t = this._editors.find((t) => t.id === e.instanceId);
        if (t) {
            if ((this._resetEditor(t), (t.validationError = e.error), e && e.error && void 0 !== e.error.status))
                this._storageController.isUsedCustomServer() ||
                    (e.error.response.includes("too many errors")
                        ? Tracker.trackError("http", `${e.error.status}: Too many errors`)
                        : e.error.response.includes("Client request limit")
                        ? Tracker.trackError("http", `${e.error.status}: Client Request Limit`)
                        : e.error.response.includes("Client request size limit")
                        ? Tracker.trackError("http", `${e.error.status}: Client Request Size Limit`)
                        : e.error.response.includes("oo many recent timeouts")
                        ? Tracker.trackError("http", `${e.error.status}: Too Many Recent Timeouts`)
                        : e.error.response.match(/(application|page|site|request) blocked/i) || e.error.response.match(/has been blocked|cannot be accessed/)
                        ? Tracker.trackError("http", `${e.error.status}: Application blocked by proxy`)
                        : Tracker.trackError("http", `${e.error.status}: ${e.error.response}`));
            else if (e && e.error && e.error.message) {
                const r = e.error;
                t.validationError = { message: i18nManager.getMessage("unknownError") };
                const i = generateStackTrace(r);
                Tracker.trackError("js", r.message, i || "");
            } else Tracker.trackError("http", "unknown");
            this._highlight(t), this._updateState(t);
        }
    }
    _startTypingMode(e) {
        (e.isUserTyping = !0), window.clearTimeout(e.typingTimeoutId), (e.typingTimeoutId = window.setTimeout(() => this._endTypingModeAndUpdateState(e), config.STOPPED_TYPING_TIMEOUT));
    }
    _endTypingModeAndUpdateState(e) {
        this._endTypingMode(e);
        const t = e.inputAreaWrapper.getText(),
            r = this._tweaks.getReplacedParts(e.inputArea, t),
            i = getValuableText(t, r),
            o = LTAssistant._migrateErrorsBetweenTexts(e.errors, e.validatedText.originalText, t);
        this._updateDisplayedErrors(e, i, o), this._highlight(e), this._updateState(e);
    }
    _endTypingMode(e) {
        (e.isUserTyping = !1), window.clearTimeout(e.typingTimeoutId);
    }
    _updateDisplayedErrors(e, t = e.validatedText, r = e.errors) {
        r = this._tweaks.filterErrors(e, t, r);
        let { ignoredRules: i } = this._storageController.getSettings();
        "picky" === e.checkLevel && (i = []);
        const o = e.inputAreaWrapper.getSelection(),
            n = e.displayedErrors;
        (e.displayedErrors = []), (e.pendingErrors = []);
        for (const t of r) {
            if (!(isErrorIgnoredByDictionary(t, e.ignoredWords) || isErrorRuleIgnored(t, i) || isErrorRuleIgnored(t, e.ignoredRules))) {
                if (e.isUserTyping) {
                    if (!n.some((e) => (e.start === t.start && e.end === t.end) || (e.id === t.id && e.originalPhrase === t.originalPhrase))) {
                        if (LTAssistant._isPendingError(t, e.validatedText.originalText)) {
                            e.pendingErrors.push(t);
                            continue;
                        }
                        if (LTAssistant._isErrorSelected(t, o)) {
                            e.pendingErrors.push(t);
                            continue;
                        }
                    }
                }
                e.displayedErrors.push(t);
            }
        }
    }
    _highlight(e) {
        const t = e.displayedErrors.map((t) => {
            let r = config.COLORS.GRAMMAR.UNDERLINE,
                i = config.COLORS.GRAMMAR.BACKGROUND,
                o = config.COLORS.GRAMMAR.EMPHASIZE;
            return (
                t.rule.id.startsWith("TOO_LONG_SENTENCE") && !t.isPartialValidation
                    ? ((r = config.COLORS.LONG_SENTENCE.UNDERLINE), (i = config.COLORS.LONG_SENTENCE.BACKGROUND), (o = config.COLORS.LONG_SENTENCE.EMPHASIZE))
                    : t.isSpellingError
                    ? ((r = config.COLORS.SPELLING.UNDERLINE), (i = config.COLORS.SPELLING.BACKGROUND), (o = config.COLORS.SPELLING.EMPHASIZE))
                    : t.isStyleError && ((r = config.COLORS.STYLE.UNDERLINE), (i = config.COLORS.STYLE.BACKGROUND), (o = config.COLORS.STYLE.EMPHASIZE)),
                { id: t.id, offset: t.start, length: t.length, isEmphasized: t.id === e.selectedErrorId || !!this._options.emphasizeErrors, backgroundColor: t.id === e.selectedErrorId ? i : o, isUnderlined: !0, underlineColor: r }
            );
        });
        if (e.synonymsCard) {
            const r = e.synonymsCard.selection;
            t.push({ id: SynonymsCard.BLOCK_ID, offset: r.start, length: r.end - r.start, isEmphasized: !1, backgroundColor: "", isUnderlined: !1, underlineColor: config.COLORS.SYNONYMS.UNDERLINE, simulateSelection: !0 });
        }
        e.highlighter.highlight(t);
    }
    _enableEditor(e) {
        (e.isAutoCheckEnabled = !0), this._disableOtherSpellCheckers(e.inputArea), e.inputAreaWrapper.resetText(), this._resetEditor(e), this._validateEditor(e), this._updateState(e);
    }
    _disableEditor(e) {
        (e.isAutoCheckEnabled = !1), this._enableOtherSpellCheckers(e.inputArea), e.inputAreaWrapper.resetText(), this._resetEditor(e), this._endTypingMode(e), this._highlight(e), this._updateState(e);
    }
    _trackEditor(e) {
        (EnvironmentAdapter.isRuntimeConnected() || e.tracking.hasTracked) &&
            ((e.tracking.hasTracked = !0),
            Math.random() < 0.1 && e.tracking.hasEnoughText && EnvironmentAdapter.trackEvent(`saw_premium_icon_10perc:${e.tracking.sawPremiumIcon}`, e.tracking.languageCode),
            Math.random() < 0.01 && EnvironmentAdapter.trackTextLength(e.tracking.maxTextLength));
    }
    _destroyEditor(e) {
        const t = this._editors.indexOf(e);
        if (-1 === t) return;
        this._editors.splice(t, 1),
            e.inputAreaWrapper.destroy(),
            e.highlighter.destroy(),
            e.inputAreaTweaks.destroy(),
            e.toolbar && e.toolbar.destroy(),
            window.clearTimeout(e.typingTimeoutId),
            e.mirror && e.mirror.destroy(),
            e.errorCard && e.errorCard.destroy(),
            e.synonymsCard && e.synonymsCard.destroy(),
            e.dialog && e.dialog.destroy();
        const r = this._initElementTimeouts.get(e.inputArea);
        r && (this._initElementTimeouts.delete(e.inputArea), clearTimeout(r)), this._enableOtherSpellCheckers(e.inputArea), this._savePremiumErrorCount(e), this._trackEditor(e);
    }
    _showErrorCard(e, t, r) {
        const i = this._storageController.getManagedSettings(),
            o = {
                disableIgnoringRule: void 0 !== this._options.disableRuleIgnore ? this._options.disableRuleIgnore : i.disableIgnoredRules,
                disableAddingWord: void 0 !== this._options.disableDictionaryAdd ? this._options.disableDictionaryAdd : i.disablePersonalDictionary,
                isPremiumAccount: this._storageController.getUIState().hasPaidSubscription,
                geoIpCountry: this._storageController.getSettings().geoIpCountry,
                showFooter: !this._options.disablePremiumTeaser,
            };
        (e.errorCard = new ErrorCard(e.inputArea, r, t, o)), this._fadeAllDialogs();
        const n = LanguageManager.getPrimaryLanguageCode(t.language.code);
        Tracker.trackEvent("Action", `${n}:open_rule`, t.rule.id),
            1 === t.fixes.length &&
                "" === t.fixes[0].value &&
                t.language.code.match(/^(de|en|fr|nl)/i) &&
                !["SEKSE_LIJK", "COMMA_PARENTHESIS_WHITESPACE", "UNLIKELY_OPENING_PUNCTUATION"].includes(t.rule.id) &&
                Tracker.trackError("other", "empty_fix", n + ":" + t.rule.id + ": " + t.contextPhrase),
            t.language.code.startsWith("de") && t.fixes.length && t.fixes[0].value.match(/\(.+\)/) && Tracker.trackError("other", "broken_fix", n + ":" + t.rule.id + ": " + t.contextPhrase);
    }
    _hideAllErrorCards() {
        this._storageController.getUIState().dialogPosition;
        this._editors.forEach((e) => {
            var t;
            e.errorCard && e.errorCard.destroy(), null === (t = e.dialog) || void 0 === t || t.fadeIn();
        });
    }
    _showSynonymsCard(e, t, r) {
        this._hideAllErrorCards(),
            this._hideAllSynonymsCards(),
            this._fadeAllDialogs(),
            EnvironmentAdapter.isRuntimeConnected() &&
                waitFor(() => (e.language ? e.language.code : e.isTextTooShort ? LanguageManager.getUserLanguageCodes()[0] || "en" : e.errors[0] ? e.errors[0].language.code : void 0))
                    .then((i) => {
                        (e.synonymsCard = new SynonymsCard(e.inputArea, t, r, i, this._storageController.getSettings().motherTongue, this._storageController.getUIState().hasPaidSubscription, !this._options.disablePremiumTeaser)),
                            this._highlight(e),
                            Tracker.trackEvent("Action", "synonyms:open");
                    })
                    .catch((e) => {
                        Tracker.trackEvent("Other-Error", "synonyms:no_language", e && e.message);
                    });
    }
    _hideAllSynonymsCards() {
        this._editors.forEach((e) => {
            var t;
            e.synonymsCard && (e.synonymsCard.destroy(), this._highlight(e)), null === (t = e.dialog) || void 0 === t || t.fadeIn();
        });
    }
    _hideAllMessagePopups() {
        this._messages.forEach((e) => {
            e && e.destroy();
        });
    }
    _showDialog(e) {
        if (!e.toolbar) return;
        const t = e.language && e.language.code,
            r = new TextStatistics(e.validatedText.originalText),
            i = new TextScore().calculateTextScore(r.getAllWords().length, e.errors, e.premiumErrors, e.pickyErrors),
            o = {
                validationStatus: e.validationStatus,
                displayedErrors: e.displayedErrors,
                premiumErrors: e.premiumErrors,
                pickyErrors: e.pickyErrors,
                errors: e.errors,
                isIncompleteResult: e.isIncompleteResult,
                ignoredErrorsStats: this._getIgnoredErrorsStats(e.errors),
                validationErrorMessage: (e.validationError && e.validationError.message) || "",
                textScore: i,
                countOptions: this._getCountOptions(e.validatedText.originalText, e.countMode),
            },
            n = this._storageController.getManagedSettings(),
            a = void 0 !== this._options.disableRuleIgnore ? this._options.disableRuleIgnore : n.disableIgnoredRules,
            s = void 0 !== this._options.disableDictionaryAdd ? this._options.disableDictionaryAdd : n.disablePersonalDictionary,
            d = {
                disableOptionsPage: !EnvironmentAdapter.isOptionsPageSupported(),
                disableSaveDocument: !0,
                disableTurnOff: !1,
                disableFeedbackForm: !EnvironmentAdapter.isFeedbackFormSupported(),
                disableHelpCenter: !1,
                disableRatingTeaser: this._storageController.getUIState().hasRated || (!this._storageController.getUIState().changelog2021CountdownEnd && this._storageController.isRelevantForChangelogCoupon().status),
                disableIgnoringRule: a,
                disableAddingWord: s,
                dialogPosition: this._storageController.getUIState().dialogPosition,
                isPremiumAccount: this._storageController.getUIState().hasPaidSubscription,
            },
            l = "picky" === e.checkLevel;
        e.dialog = new Dialog(e.toolbar.getContainer(), this._tweaks.getDialogAppearance(), t, o, d, l);
    }
    _hideAllDialogs(e = !1) {
        this._editors.forEach((t) => {
            var r, i, o;
            null === (r = t.dialog) || void 0 === r || r.setApplyFixMode(!1), null === (i = t.dialog) || void 0 === i || i.closeAllMenus();
            const n = null === (o = t.dialog) || void 0 === o ? void 0 : o.getCurrentPosition();
            !t.dialog || ("default" !== n && EnvironmentAdapter.isRuntimeConnected() && !e) || t.dialog.destroy();
        });
    }
    _fadeAllDialogs() {
        this._storageController.getUIState().dialogPosition;
        this._editors.forEach((e) => {
            e.dialog && e.dialog.fadeOut();
        });
    }
    _savePremiumErrorCount(e) {
        if (!e.displayedHiddenErrorCount || !EnvironmentAdapter.isRuntimeConnected()) return;
        const t = new Date().toDateString(),
            { hiddenErrors: r } = this._storageController.getStatistics();
        r[0] && r[0].day === t ? (r[0].count += e.displayedHiddenErrorCount) : r.unshift({ day: t, count: e.displayedHiddenErrorCount }), (r.length = Math.min(r.length, 62)), this._storageController.updateStatistics({ hiddenErrors: r });
    }
    _getIgnoredErrorsStats(e) {
        const { ignoredRules: t } = this._storageController.getSettings(),
            r = Dictionary.get(),
            i = [],
            o = [];
        return (
            e.forEach((e) => {
                e.isSpellingError && isErrorIgnoredByDictionary(e, r) && !i.includes(e.originalPhrase) && i.push(e.originalPhrase), e.isSpellingError || !isErrorRuleIgnored(e, t) || o.includes(e.rule.id) || o.push(e.rule.id);
            }),
            { byDictionary: i.length, byRules: o.length }
        );
    }
    destroy() {
        Array.from(this._editors).forEach((e) => this._destroyEditor(e)),
            this._spellcheckingAttributesData.forEach((e, t) => {
                this._enableOtherSpellCheckers(t);
            }),
            this._tweaks && document.removeEventListener(this._tweaks.getClickEvent(), this._onDocumentClick, !0),
            document.removeEventListener("focus", this._onDocumentFocus, !0),
            document.removeEventListener("mousemove", this._onDocumentMousemove, !0),
            document.removeEventListener("focusout", this._onDocumentFocusout, !0),
            window.frameElement && window.frameElement.ownerDocument && window.frameElement.ownerDocument.removeEventListener("click", this._onDocumentClick, !0),
            document.removeEventListener(InputAreaWrapper.eventNames.dblclick, this._onInputDblClick),
            document.removeEventListener(InputAreaWrapper.eventNames.textChanged, this._onInputTextChanged),
            document.removeEventListener(InputAreaWrapper.eventNames.scroll, this._onInputScroll),
            document.removeEventListener(InputAreaWrapper.eventNames.paste, this._onInputPaste),
            document.removeEventListener(Highlighter.eventNames.blockClicked, this._onHiglighterBlockClicked),
            document.removeEventListener(Toolbar.eventNames.permissionRequiredIconClicked, this._onToolbarPermissionRequiredIconClicked),
            document.removeEventListener(Toolbar.eventNames.toggleDialog, this._onToolbarToggleDialog),
            document.removeEventListener(Toolbar.eventNames.notifyAboutPremiumIcon, this._onToolbarNotifyAboutPremiumIcon),
            document.removeEventListener(Dialog.eventNames.enableHere, this._onDialogEnableHere),
            document.removeEventListener(Dialog.eventNames.positionChangeClicked, this._onPositionChangeClicked),
            document.removeEventListener(Dialog.eventNames.togglePickyMode, this._onPickyModeToggle),
            document.removeEventListener(Dialog.eventNames.enableEverywhere, this._onDialogEnableEverywhere),
            document.removeEventListener(Dialog.eventNames.languageChanged, this._onDialogLanguageChanged),
            document.removeEventListener(Dialog.eventNames.countChanged, this._onDialogCountChanged),
            document.removeEventListener(Dialog.eventNames.errorSelected, this._onDialogErrorSelected),
            document.removeEventListener(Dialog.eventNames.errorHighlighted, this._onDialogErrorHighlighted),
            document.removeEventListener(Dialog.eventNames.addToDictionaryClicked, this._onAddToDictionary),
            document.removeEventListener(Dialog.eventNames.ignoreRuleClicked, this._onIgnoreRule),
            document.removeEventListener(Dialog.eventNames.temporarilyIgnoreWordClicked, this._onTemporarilyIgnoreWord),
            document.removeEventListener(Dialog.eventNames.temporarilyIgnoreRuleClicked, this._onTemporarilyIgnoreRule),
            document.removeEventListener(Dialog.eventNames.moreDetailsClicked, this._onMoreDetailsClicked),
            document.removeEventListener(Dialog.eventNames.fixSelected, this._onFixSelected),
            document.removeEventListener(Dialog.eventNames.openOptions, this._onDialogOpenOptions),
            document.removeEventListener(Dialog.eventNames.showFeedbackForm, this._onDialogShowFeedbackForm),
            document.removeEventListener(Dialog.eventNames.destroyed, this._onDialogDestroyed),
            document.removeEventListener(Dialog.eventNames.badgeClicked, this._onBadgeClicked),
            document.removeEventListener(Dialog.eventNames.turnOff, this._onTurnOffClicked),
            document.removeEventListener(Dialog.eventNames.pauseChecking, this._onPauseCheckingClicked),
            document.removeEventListener(ErrorCard.eventNames.addToDictionaryClicked, this._onAddToDictionary),
            document.removeEventListener(ErrorCard.eventNames.ignoreRuleClicked, this._onIgnoreRule),
            document.removeEventListener(ErrorCard.eventNames.temporarilyIgnoreWordClicked, this._onTemporarilyIgnoreWord),
            document.removeEventListener(ErrorCard.eventNames.temporarilyIgnoreRuleClicked, this._onTemporarilyIgnoreRule),
            document.removeEventListener(ErrorCard.eventNames.moreDetailsClicked, this._onMoreDetailsClicked),
            document.removeEventListener(ErrorCard.eventNames.fixSelected, this._onFixSelected),
            document.removeEventListener(ErrorCard.eventNames.badgeClicked, this._onBadgeClicked),
            document.removeEventListener(ErrorCard.eventNames.logoClicked, this._onLogoClicked),
            document.removeEventListener(ErrorCard.eventNames.languageChanged, this._onErrorCardLanguageChanged),
            document.removeEventListener(ErrorCard.eventNames.destroyed, this._onErrorCardDestroyed),
            document.removeEventListener(SynonymsCard.eventNames.badgeClicked, this._onBadgeClicked),
            document.removeEventListener(SynonymsCard.eventNames.logoClicked, this._onLogoClicked),
            document.removeEventListener(SynonymsCard.eventNames.synonymSelected, this._onSynonymSelected),
            document.removeEventListener(SynonymsCard.eventNames.destroyed, this._onSynonymsCardDestroyed),
            document.removeEventListener(MessagePopup.eventNames.destroyed, this._onMessagePopupDestroyed),
            document.removeEventListener(MessagePopup.eventNames.turnOn, this._onTurnOnClicked),
            document.removeEventListener(LTAssistant.events.DESTROY, this._onDestroy),
            window.removeEventListener("pageshow", this._onPageLoaded),
            window.removeEventListener("pagehide", this._onPageHide),
            this._storageController && this._storageController.destroy(),
            this._tweaks && this._tweaks.destroy(),
            window.clearInterval(this._checkExtensionHealthIntervalId),
            window.clearInterval(this._fixTinyMCEIntervalId),
            this._editors.forEach((e) => {
                e.validationDebounce.cancelCall();
            }),
            this._options && this._options.onDestroy && this._options.onDestroy();
    }
    _scrollToError(e, t, r = !1, i = "nearest", o) {
        this._hideAllDialogs(),
            e.inputAreaWrapper.scrollToText(t.start, t.length, 300, i, () => {
                (e.selectedErrorId = t.id), this._highlight(e);
                const i = e.highlighter.getTextBoxes(t.id);
                r && i.length && this._showErrorCard(e, t, i[0]), o && o(i);
            });
    }
    _unselectError(e) {
        null !== e.selectedErrorId && ((e.selectedErrorId = null), this._highlight(e));
    }
    _addToDictionary(e, t) {
        let r = !1;
        this._options.onDictionaryAdd && (r = this._options.onDictionaryAdd(t, e.inputArea)), e.callbacks.onDictionaryAdd && (r = e.callbacks.onDictionaryAdd(t)), r || Dictionary.add(t);
    }
    _temporarilyIgnoreWord(e, t) {
        const r = e.groupId;
        if (this._tweaks.persistTemporarySettings()) {
            const e = `ignored:${r}`,
                i = LocalStorageWrapper.get(e) || { words: [], rules: [] };
            i.words.push(t), LocalStorageWrapper.set(e, i);
        }
        this._editors
            .filter((e) => e.groupId === r)
            .forEach((e) => {
                e.ignoredWords.push(t), this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e);
            });
    }
    _temporarilyIgnoreRule(e, t) {
        e.ignoredRules.push(t), this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e);
    }
    _clearTemporarilyIgnoredRules(e) {
        (e.ignoredRules = []), this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e);
    }
    _clearWords(e) {
        (e.ignoredWords = []), this._updateDisplayedErrors(e), this._highlight(e), this._updateState(e);
    }
    _applyFix(e, t, r) {
        const i = t.fixes[r].value,
            o = { offset: t.start, length: t.length, replacementText: i, editor: e };
        e.callbacks.onBeforeErrorCorrect && e.callbacks.onBeforeErrorCorrect(t), this._tweaks.applyFix(o), wait(100).then(() => this._validateEditor(e));
        const { appliedSuggestions: n } = this._storageController.getStatistics();
        this._storageController.updateStatistics({ appliedSuggestions: n + 1 });
    }
}
(LTAssistant.events = { UPDATE: "_lt-state-updated", DESTROY: "_lt-destroy" }),
    (LTAssistant.PUNCTIUATION_CHAR_REGEXP = /^[.!?]$/),
    (LTAssistant.COMPLETED_SENTENCE_REGEXP = /^[^\n]*?[.!?]($|\s)/),
    (LTAssistant.NO_LETTERS_REGEXP = /^[0-9,\.\-\:\;\+\*\/\\\%#\=\_]+$/);
