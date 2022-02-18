/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class ErrorCard {
    constructor(e, t, r, i) {
        (this._renderOutsideIframe = !1), (this._inputArea = e), (this._error = r), (this._uiOptions = i), (this._referenceArea = e), (this._document = this._inputArea.ownerDocument);
        const s = getFrameElement(window);
        s &&
            this._inputArea === this._inputArea.ownerDocument.body &&
            isLTAvailable(window.parent) &&
            ((this._referenceArea = s), (this._document = this._referenceArea.ownerDocument), (this._renderOutsideIframe = !0), (this._onPageHide = this._onPageHide.bind(this)), window.addEventListener("pagehide", this._onPageHide, !0)),
            (this._domMeasurement = new DomMeasurement(this._document)),
            (this._eventListeners = []),
            this._render(t);
    }
    static _cacheMessages() {
        ErrorCard.MESSAGES = {
            HEADLINE_SPELLING_ERROR: i18nManager.getMessage("spellingError"),
            HEADLINE_SUGGESTION_ERROR: i18nManager.getMessage("suggestionError"),
            HEADLINE_PUNCTUATION_ERROR: i18nManager.getMessage("punctuationError"),
            HEADLINE_GRAMMAR_ERROR: i18nManager.getMessage("grammarError"),
            LINK_MORE_DETAILS: i18nManager.getMessage("moreDetails"),
            LINK_IGNORE_HERE: i18nManager.getMessage("ignoreHere"),
            SEND_FEEDBACK_TOOLTIP: i18nManager.getMessage("dialogTooltipSendFeedback"),
            EN_US_LINK: i18nManager.getMessage("switchToAmericanEnglish"),
            EN_CA_LINK: i18nManager.getMessage("switchToCanadianEnglish"),
            EN_AU_LINK: i18nManager.getMessage("switchToAustralianEnglish"),
            EN_NZ_LINK: i18nManager.getMessage("switchToNewZealandEnglish"),
            EN_ZA_LINK: i18nManager.getMessage("switchToSouthAfricanEnglish"),
            EN_GB_LINK: i18nManager.getMessage("switchToBritishEnglish"),
            DELETE: i18nManager.getMessage("deleteWord"),
            REMOVE_EXTRA_WHITESPACE: i18nManager.getMessage("removeExtraWhitespace"),
        };
    }
    static _constructor() {
        ErrorCard._isInitialized || (ErrorCard._cacheMessages(), i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, ErrorCard._cacheMessages.bind(ErrorCard)), (ErrorCard._isInitialized = !0));
    }
    _render(e) {
        (this._container = createContainerElement(this._document, ErrorCard.CONTAINER_ELEMENT_NAME)),
            this._container.classList.add("lt-error-card"),
            this._container.addEventListener("click", (e) => e.stopPropagation()),
            this._eventListeners.push(
                addUseCaptureEvent(document, "keydown", this._onKeyDown.bind(this)),
                addUseCaptureEvent(this._container, "mousedown", (e) => {
                    e.stopImmediatePropagation(), e.target && !e.target.closest(".lt-errorcard__text, .lt-card__headline") && e.preventDefault();
                }),
                addUseCaptureEvent(this._container, "mouseup", (e) => e.stopImmediatePropagation()),
                addUseCaptureEvent(this._container, "pointerdown", (e) => e.stopImmediatePropagation()),
                addUseCaptureEvent(this._container, "pointerup", (e) => e.stopImmediatePropagation())
            );
        const t = this._document.createElement("lt-div");
        t.classList.add("lt-card__container"), t.classList.add("lt-card__container--error-card"), t.classList.add("notranslate"), this._renderContent(t);
        const r = this._document.createElement("lt-span");
        (r.className = "lt-card__close-button"), this._eventListeners.push(addUseCaptureEvent(r, "click", this._onCloseClicked.bind(this))), t.appendChild(r), this._container.appendChild(t);
        const i = "BODY" === this._referenceArea.nodeName ? this._document.documentElement : this._document.body;
        i.appendChild(this._container), this._domMeasurement.clearCache();
        const s = this._domMeasurement.getDocumentVisibleBox(),
            n = this._domMeasurement.getBorderBox(t);
        if (this._renderOutsideIframe) {
            let t = document.createElement("lt-span");
            (t.style.position = "absolute"), (t.style.left = e.left + "px"), (t.style.top = e.top + "px"), document.documentElement.appendChild(t);
            const r = t.getBoundingClientRect();
            t.remove(), (t = null);
            const i = new DomMeasurement(this._document).getContentBox(this._referenceArea);
            (e.left = i.left + r.left), (e.top = i.top + r.top), (e.bottom = i.top + r.top + e.height), (e.right = i.left + r.left + e.width);
        }
        let o = Math.min(e.left, s.width - n.width),
            a = e.bottom + 5;
        a + n.height > s.bottom && (a = Math.max(s.top, e.top - n.height - 5));
        const d = this._domMeasurement.getScaleFactor(i),
            l = this._domMeasurement.getZoom(i);
        (o /= d.x * l), (a /= d.y * l), (t.style.left = Math.round(o) + "px"), (t.style.top = Math.round(a) + "px");
    }
    _renderContent(e) {
        const t = this._document.createElement("lt-div");
        t.classList.add("lt-card__headline"),
            this._error.isSpellingError
                ? ((t.textContent = this._error.shortDescription || ErrorCard.MESSAGES.HEADLINE_SPELLING_ERROR), e.classList.add("lt-card__container--spelling-mistake"))
                : this._error.isStyleError
                ? ((t.textContent = this._error.shortDescription || ErrorCard.MESSAGES.HEADLINE_SUGGESTION_ERROR), e.classList.add("lt-card__container--style-suggestion"))
                : this._error.isPunctuationError
                ? ((t.textContent = this._error.shortDescription || ErrorCard.MESSAGES.HEADLINE_PUNCTUATION_ERROR), e.classList.add("lt-card__container--punctuation-mistake"))
                : ((t.textContent = this._error.shortDescription || ErrorCard.MESSAGES.HEADLINE_GRAMMAR_ERROR), e.classList.add("lt-card__container--grammar-mistake")),
            e.appendChild(t);
        const r = this._document.createElement("lt-div");
        if ((r.classList.add("lt-errorcard__text"), (r.textContent = this._error.description), e.appendChild(r), this._error.rule.urls && this._error.rule.urls.length > 0)) {
            const e = this._document.createElement("lt-span");
            e.classList.add("lt-errorcard__more-details"), (e.title = ErrorCard.MESSAGES.LINK_MORE_DETAILS), this._eventListeners.push(addUseCaptureEvent(e, "click", this._onMoreDetailsClick.bind(this))), r.appendChild(e);
        }
        if (this._error.fixes.length) {
            const t = this._document.createElement("lt-div");
            t.classList.add("lt-errorcard__suggestion-wrapper");
            const r = Math.min(this._error.fixes.length, config.MAX_FIXES_COUNT);
            for (let e = 0; e < r; e++) {
                const r = this._error.fixes[e],
                    i = this._document.createElement("lt-span");
                if (
                    (i.classList.add("lt-errorcard__suggestion"),
                    r.value.startsWith(" ") && (r.value.length > 1 || " " === r.value)
                        ? (i.textContent = r.value.replace(ErrorCard.TRAILING_WHITESPACE_REGEXP, "·"))
                        : (i.textContent = r.value.replace(ErrorCard.NARROW_WHITESPACE_REGEXP, " ")),
                    (i.title = r.shortDescription || ""),
                    "" === r.value && this._error.originalPhrase.match(/[a-z0-9]{2,}/)
                        ? (i.classList.add("lt-errorcard__suggestion--strikethrough"), (i.textContent = this._error.originalPhrase))
                        : "" === r.value
                        ? ((i.className = "lt-errorcard__suggestion--optional"), (i.textContent = ErrorCard.MESSAGES.DELETE))
                        : " " === r.value && /^\s\s+$/.test(this._error.originalPhrase) && ((i.className = "lt-errorcard__suggestion--optional"), (i.textContent = ErrorCard.MESSAGES.REMOVE_EXTRA_WHITESPACE)),
                    r.suffix)
                ) {
                    const e = this._document.createElement("lt-span");
                    (e.textContent = r.suffix), e.classList.add("lt-card__hint"), i.append(e);
                } else if (r.prefix) {
                    const e = this._document.createElement("lt-span");
                    e.classList.add("lt-card__hint"), i.prepend(e);
                }
                this._eventListeners.push(addUseCaptureEvent(i, "click", this._onFixClick.bind(this, e))), t.appendChild(i);
            }
            if (1 === this._error.fixes.length && (this._error.description.match(/is\s+(chiefly\s)?((North\s)?American|British)\s+English/) || "EN_GB_SIMPLE_REPLACE" === this._error.rule.id)) {
                const e = this._document.createElement("lt-span");
                e.classList.add("lt-errorcard__suggestion--optional");
                let r = null;
                this._error.description.match(/is\s+(chiefly\s)?British English/)
                    ? "CA" === this._uiOptions.geoIpCountry
                        ? ((r = "en-ca"), (e.textContent = ErrorCard.MESSAGES.EN_CA_LINK))
                        : "AU" === this._uiOptions.geoIpCountry
                        ? ((r = "en-au"), (e.textContent = ErrorCard.MESSAGES.EN_AU_LINK))
                        : "NZ" === this._uiOptions.geoIpCountry
                        ? ((r = "en-nz"), (e.textContent = ErrorCard.MESSAGES.EN_NZ_LINK))
                        : "ZA" === this._uiOptions.geoIpCountry
                        ? ((r = "en-za"), (e.textContent = ErrorCard.MESSAGES.EN_ZA_LINK))
                        : ((r = "en-gb"), (e.textContent = ErrorCard.MESSAGES.EN_GB_LINK))
                    : (this._error.description.match(/is\s+(chiefly\s)?(North\s)?American English/) || this._error.description.includes("is a common American expression")) && ((r = "en-us"), (e.textContent = ErrorCard.MESSAGES.EN_US_LINK)),
                    r && (this._eventListeners.push(addUseCaptureEvent(e, "click", this._onLanguageChange.bind(this, r))), t.appendChild(e));
            }
            e.appendChild(t);
        }
        if (this._error.isSpellingError) {
            if (!this._uiOptions.disableAddingWord && !includesWhiteSpace(this._error.originalPhrase)) {
                const t = this._document.createElement("lt-div");
                t.classList.add("lt-errorcard__add-to-dictionary"),
                    (t.textContent = i18nManager.getMessage("addToDictionaryTitle", this._error.originalPhrase)),
                    this._eventListeners.push(addUseCaptureEvent(t, "click", this._onAddToDictionaryClick.bind(this))),
                    e.appendChild(t);
            }
            const t = this._document.createElement("lt-div");
            t.classList.add("lt-errorcard__temporarily-ignore-word"),
                (t.textContent = ErrorCard.MESSAGES.LINK_IGNORE_HERE),
                this._eventListeners.push(addUseCaptureEvent(t, "click", this._onTemporarilyIgnoreWordClick.bind(this))),
                e.appendChild(t);
        } else {
            const t = this._document.createElement("lt-div");
            t.classList.add("lt-errorcard__temporarily-ignore-rule"),
                (t.textContent = ErrorCard.MESSAGES.LINK_IGNORE_HERE),
                this._eventListeners.push(addUseCaptureEvent(t, "click", this._onTemporarilyIgnoreRuleClick.bind(this))),
                e.appendChild(t);
        }
        const ignoreDiv = this._document.createElement("lt-div");
            ignoreDiv.classList.add("lt-errorcard__send-feedback"),
            (ignoreDiv.textContent = ErrorCard.MESSAGES.SEND_FEEDBACK_TOOLTIP),
            this._eventListeners.push(addUseCaptureEvent(ignoreDiv, "click", this._showGithubIssues.bind(this))),
            e.appendChild(ignoreDiv);
    }
    _showGithubIssues(e) {
        e.stopImmediatePropagation();
        window.open("https://github.com/jonathanpeppers/inclusive-code-comments/issues/new");
    }
    _onBadgeClicked(e) {
        e.stopImmediatePropagation();
        const t = { errorCard: this };
        dispatchCustomEvent(document, ErrorCard.eventNames.badgeClicked, t);
    }
    _onLogoClicked(e) {
        e.stopImmediatePropagation();
        const t = { errorCard: this };
        dispatchCustomEvent(document, ErrorCard.eventNames.logoClicked, t);
    }
    _onMoreDetailsClick(e) {
        e.stopImmediatePropagation();
        const t = { errorCard: this, url: this._error.rule.urls[0].value };
        dispatchCustomEvent(document, ErrorCard.eventNames.moreDetailsClicked, t);
    }
    _onFixClick(e, t) {
        t.stopImmediatePropagation();
        const r = { errorCard: this, error: this._error, fixIndex: e };
        dispatchCustomEvent(document, ErrorCard.eventNames.fixSelected, r);
    }
    _onLanguageChange(e, t) {
        t.stopImmediatePropagation();
        const r = { errorCard: this, error: this._error, language: e };
        dispatchCustomEvent(document, ErrorCard.eventNames.languageChanged, r);
    }
    _onAddToDictionaryClick(e) {
        e.stopImmediatePropagation();
        const t = { errorCard: this, error: this._error };
        dispatchCustomEvent(document, ErrorCard.eventNames.addToDictionaryClicked, t);
    }
    _onIgnoreRuleClick(e) {
        e.stopImmediatePropagation();
        const t = { errorCard: this, error: this._error };
        dispatchCustomEvent(document, ErrorCard.eventNames.ignoreRuleClicked, t);
    }
    _onTemporarilyIgnoreWordClick(e) {
        e.stopImmediatePropagation();
        const t = { errorCard: this, error: this._error };
        dispatchCustomEvent(document, ErrorCard.eventNames.temporarilyIgnoreWordClicked, t);
    }
    _onTemporarilyIgnoreRuleClick(e) {
        e.stopImmediatePropagation();
        const t = { errorCard: this, error: this._error };
        dispatchCustomEvent(document, ErrorCard.eventNames.temporarilyIgnoreRuleClicked, t);
    }
    _onCloseClicked(e) {
        e.stopImmediatePropagation(), this.destroy();
    }
    _onKeyDown(e) {
        "Escape" === e.key && (this.destroy(), e.stopImmediatePropagation());
    }
    _onPageHide() {
        this.destroy();
    }
    destroy() {
        if (this._container) {
            this._container.remove(), (this._container = null);
            const e = { errorCard: this, error: this._error };
            dispatchCustomEvent(document, ErrorCard.eventNames.destroyed, e);
        }
        window.removeEventListener("pagehide", this._onPageHide, !0),
            this._eventListeners.forEach((e) => {
                e.destroy();
            }),
            (this._eventListeners = []);
    }
}
(ErrorCard.TRAILING_WHITESPACE_REGEXP = /^ | $/),
    (ErrorCard.NARROW_WHITESPACE_REGEXP = /\u202F/g),
    (ErrorCard.CONTAINER_ELEMENT_NAME = "lt-card"),
    (ErrorCard.eventNames = {
        addToDictionaryClicked: "lt-errorCard.addToDictionaryClicked",
        ignoreRuleClicked: "lt-errorCard.ignoreRuleClicked",
        temporarilyIgnoreWordClicked: "lt-errorCard.temporarilyIgnoreWordClicked",
        temporarilyIgnoreRuleClicked: "lt-errorCard.temporarilyIgnoreRuleClicked",
        moreDetailsClicked: "lt-errorCard.moreDetailsClicked",
        fixSelected: "lt-errorCard.fixSelected",
        languageChanged: "lt-errorCard.languageSwitched",
        badgeClicked: "lt-errorCard.badgeClicked",
        logoClicked: "lt-errorCard.logoClicked",
        destroyed: "lt-errorCard.destroyed",
    }),
    (ErrorCard._isInitialized = !1),
    ErrorCard._constructor();
