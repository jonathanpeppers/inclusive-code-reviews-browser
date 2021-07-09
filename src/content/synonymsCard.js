class SynonymsCard {
    constructor(t, e, n, s, i, a, o) {
        (this.MAX_SYNONYMS_PER_ROW = 4),
            (this._renderOutsideIframe = !1),
            (this._destroyed = !1),
            (this._tts = []),
            (this._inputArea = t),
            (this._targetBoxes = e),
            (this._wordContext = n),
            (this._language = s),
            (this._motherLanguage = i),
            (this._hasSubscription = a),
            (this._tts = [n.word]),
            (this.selection = { start: n.position.start, end: n.position.end || n.position.start }),
            (this._referenceArea = t),
            (this._document = this._inputArea.ownerDocument);
        const d = getFrameElement(window);
        d &&
            this._inputArea === this._inputArea.ownerDocument.body &&
            isLTAvailable(window.parent) &&
            ((this._referenceArea = d), (this._document = this._referenceArea.ownerDocument), (this._renderOutsideIframe = !0), (this._onUnload = this._onUnload.bind(this)), window.addEventListener("pagehide", this._onUnload, !0)),
            (this._domMeasurement = new DomMeasurement(this._document)),
            (this._eventListeners = []),
            this._loadSynonyms();
    }
    static _cacheMessages() {
        SynonymsCard.MESSAGES = {
            HEADLINE: i18nManager.getMessage("synonymsCardHeadline"),
            LOADING: i18nManager.getMessage("synonymsCardLoading"),
            ERROR: i18nManager.getMessage("synonymsCardGeneralError"),
            NO_SYNONYMS_FOUND: i18nManager.getMessage("synonymsCardNoSynonymsAvailable"),
            LANGUAGE_NOT_SUPPORTED: i18nManager.getMessage("synonymsCardLanguageNotSupported"),
            READ_TEXT: i18nManager.getMessage("synonymsCardTooltipReadText"),
        };
    }
    static _constructor() {
        SynonymsCard._isInitialized || (SynonymsCard._cacheMessages(), i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, SynonymsCard._cacheMessages.bind(SynonymsCard)), (SynonymsCard._isInitialized = !0));
    }
    _renderContainer(t = null) {
        if ((this._renderHeader(t), this._container || this._destroyed)) return;
        (this._container = createContainerElement(this._document, SynonymsCard.CONTAINER_ELEMENT_NAME)),
            this._container.classList.add("lt-synonyms-card"),
            this._container.addEventListener("click", (t) => t.stopPropagation()),
            this._eventListeners.push(
                addUseCaptureEvent(document, "keydown", this._onKeyDown.bind(this)),
                addUseCaptureEvent(this._container, "mousedown", (t) => {
                    t.stopImmediatePropagation(), t.target && !t.target.closest(".lt-synonymscard__synonym-title, .lt-card__headline") && t.preventDefault();
                }),
                addUseCaptureEvent(this._container, "mouseup", (t) => t.stopImmediatePropagation()),
                addUseCaptureEvent(this._container, "pointerdown", (t) => t.stopImmediatePropagation()),
                addUseCaptureEvent(this._container, "pointerup", (t) => t.stopImmediatePropagation())
            ),
            (this._innerContainer = this._document.createElement("lt-div")),
            this._innerContainer.classList.add("lt-card__container"),
            this._innerContainer.classList.add("lt-card__container--synonyms-card"),
            this._innerContainer.classList.add("notranslate"),
            (this._header = this._document.createElement("lt-div")),
            this._header.classList.add("lt-synonymscard__header"),
            this._innerContainer.appendChild(this._header);
        const e = new Icon("close", null, null, this._innerContainer);
        this._eventListeners.push(addUseCaptureEvent(e.getElement(), "click", this._onCloseClicked.bind(this))),
            this._renderHeader(t),
            this._renderContent(this._innerContainer),
            this._container.appendChild(this._innerContainer),
            ("BODY" === this._referenceArea.nodeName ? this._document.documentElement : this._document.body).appendChild(this._container),
            this._position();
    }
    _position() {
        if (!this._innerContainer) return;
        const t = Object.assign({}, this._targetBoxes.sort((t, e) => (t.width > e.width ? -1 : 1))[0]);
        if (!t) return;
        this._domMeasurement.clearCache();
        const e = this._domMeasurement.getDocumentVisibleBox(),
            n = this._domMeasurement.getBorderBox(this._innerContainer);
        if (this._renderOutsideIframe) {
            let e = document.createElement("lt-span");
            (e.style.position = "absolute"), (e.style.left = t.left + "px"), (e.style.top = t.top + "px"), document.documentElement.appendChild(e);
            const n = e.getBoundingClientRect();
            e.remove(), (e = null);
            const s = new DomMeasurement(this._document).getContentBox(this._referenceArea);
            (t.left = s.left + n.left), (t.top = s.top + n.top), (t.bottom = s.top + n.top + t.height), (t.right = s.left + n.left + t.width);
        }
        let s = Math.min(t.left, e.width - n.width),
            i = t.bottom + 5;
        i + n.height > e.bottom && (i = Math.max(e.top, t.top - n.height - 5)), (this._innerContainer.style.left = s + "px"), (this._innerContainer.style.top = i + "px");
    }
    _setMessage(t) {
        if (this._content) {
            const e = this._document.createElement("lt-div");
            e.classList.add("lt-synonymscard__message"), (e.textContent = t), (this._content.innerHTML = ""), this._content.appendChild(e);
        }
    }
    _loadSynonyms() {
        const t = LanguageManager.getPrimaryLanguageCode(this._language);
        if (-1 === config.SUPPORTED_SYNONYM_LANGUAGES.indexOf(t)) return this._renderContainer(), void this._setMessage(SynonymsCard.MESSAGES.LANGUAGE_NOT_SUPPORTED);
        const e = Date.now(),
            n = window.setTimeout(this._renderContainer.bind(this), 400);
        EnvironmentAdapter.loadSynonyms(this._wordContext, t, this._motherLanguage)
            .then((t) => {
                window.clearTimeout(n);
                const s = Date.now() - e;
                return wait(Math.max(0, 400 - s), t);
            })
            .then((t) => {
                this._destroyed ||
                    (this._renderContainer(t),
                    this._renderSynonyms(t),
                    t.genders &&
                        t.genders.length &&
                        ((this._tts = []),
                        t.genders[0].display.toLowerCase().includes(this._wordContext.word.toLowerCase()) || this._tts.push(this._wordContext.word),
                        t.genders.forEach((t) => {
                            this._tts.push(t.display);
                        })));
            })
            .catch((t) => {
                this._destroyed || (window.clearTimeout(n), this._renderContainer(), this._setMessage(SynonymsCard.MESSAGES.ERROR), Tracker.trackEvent("Other-Error", "synonym_card:load_failed", t && t.message));
            });
    }
    _renderHeader(t) {
        var e;
        if (!this._innerContainer || !this._header) return;
        const n = null === t || void 0 === t ? void 0 : t.genders;
        if (((this._header.innerHTML = ""), TextToSpeech.isSupported() && TextToSpeech.supportsLanguage(this._language) && TextToSpeech.supportsWord(this._wordContext.word))) {
            const t = { label: SynonymsCard.MESSAGES.READ_TEXT, position: "bottom-left" };
            (this._readIcon = new Icon("read", null, t, this._header)), this._eventListeners.push(addUseCaptureEvent(null === (e = this._readIcon) || void 0 === e ? void 0 : e.getElement(), "click", this._onReadOutLoudClicked.bind(this)));
        }
        if (n && n.length) {
            const t = this._document.createElement("lt-div");
            t.classList.add("lt-synonymscard__header__headlines"),
                n.forEach((e) => {
                    const n = this._createHeadline(e.display, e.displayType);
                    t.appendChild(n);
                }),
                this._header.appendChild(t);
        } else {
            const t = this._createHeadline(this._wordContext.word);
            this._header.appendChild(t);
        }
    }
    _renderContent(t) {
        this._content = this._document.createElement("lt-div");
        this._content.classList.add("lt-synonymscard__content");
        this._setMessage(SynonymsCard.MESSAGES.LOADING), t.appendChild(this._content);
    }
    _renderSynonyms(t) {
        if (!this._content) return;
        const e = t.synonymSets;
        if (((this._content.innerHTML = ""), !e.length)) {
            const t = this._document.createElement("lt-div");
            return t.classList.add("lt-card__no-synonyms"), (t.textContent = SynonymsCard.MESSAGES.NO_SYNONYMS_FOUND), void this._content.appendChild(t);
        }
        const n = this._document.createElement("lt-div");
        if ((n.classList.add("lt-card__headline", "lt-card__headline--synonyms"), (n.textContent = SynonymsCard.MESSAGES.HEADLINE), this._content.appendChild(n), !this._language.startsWith("de") && !BrowserDetector.isSafari())) {
            const t = this._document.createElement("lt-span");
            t.classList.add("lt-card__beta-sign"), (t.textContent = "Beta"), n.appendChild(t);
        }
        if (
            (e.forEach((t) => {
                const e = this._document.createElement("lt-div");
                e.classList.add("lt-synonymscard__row");
                const n = this._document.createElement("lt-div");
                if (
                    (n.classList.add("lt-synonymscard__synonym-title"),
                    (n.textContent = t.title),
                    e.appendChild(n),
                    t.synonyms.forEach((t) => {
                        const n = this._document.createElement("lt-div");
                        n.classList.add("lt-synonymscard__synonym"),
                            (n.textContent = t.word),
                            this._eventListeners.push(addUseCaptureEvent(n, "click", this._onSynonymClick.bind(this, t.word))),
                            t.hints.forEach((t) => {
                                const e = this._document.createElement("lt-span");
                                e.classList.add("lt-card__hint"), (e.textContent = t), n.appendChild(e);
                            }),
                            e.appendChild(n);
                    }),
                    t.synonyms.length > this.MAX_SYNONYMS_PER_ROW)
                ) {
                    e.classList.add("lt-synonymscard__row__limited");
                    const t = this._document.createElement("lt-div");
                    t.classList.add("lt-synonymscard__row__expand"), (t.textContent = "…"), this._eventListeners.push(addUseCaptureEvent(t, "click", this._onShowMoreClick.bind(this))), e.appendChild(t);
                }
                this._content.appendChild(e);
            }),
            !this._language.startsWith("de") && this._content.lastElementChild)
        ) {
            const e = this._document.createElement("lt-div");
            e.classList.add("lt-synonymscard__info-text"), (e.innerHTML = "Source: ");
            const n = this._document.createElement("lt-span");
            (n.textContent = t.dataSource.sourceName),
                e.appendChild(n),
                this._eventListeners.push(
                    addUseCaptureEvent(n, "click", (e) => {
                        e.stopImmediatePropagation(), window.open(t.dataSource.sourceUrl, "_blank");
                    })
                ),
                this._content.lastElementChild.appendChild(e);
        }
        this._position();
    }
    _createHeadline(t, e) {
        const n = t.split(/'| /),
            s = this._document.createElement("lt-div");
        if ((s.classList.add("lt-synonymscard__header__headline"), n.length > 1)) {
            const e = this._document.createElement("lt-span");
            e.classList.add("lt-synonymscard__header__article"), (e.textContent = n[0] + (t.includes("'") ? "'" : "")), s.appendChild(e);
            const i = this._document.createElement("lt-span");
            i.classList.add("lt-synonymscard__header__word"), (i.textContent = n[1]), s.appendChild(i);
        } else {
            const t = this._document.createElement("lt-span");
            t.classList.add("lt-synonymscard__header__word"), (t.textContent = n[0]), s.appendChild(t);
        }
        if (e) {
            const t = this._document.createElement("lt-span");
            t.classList.add("lt-synonymscard__header__gender"), (t.textContent = `(${e})`), s.appendChild(t);
        }
        return s;
    }
    _onSynonymClick(t, e) {
        e.stopImmediatePropagation();
        const n = { synonymsCard: this, synonym: t, word: this._wordContext.word.trim(), selection: this.selection };
        dispatchCustomEvent(document, SynonymsCard.eventNames.synonymSelected, n);
    }
    _onReadOutLoudClicked(t) {
        TextToSpeech.isPlaying()
            ? (TextToSpeech.stop(), this._readIcon && this._readIcon.getElement().classList.remove("playing"))
            : (TextToSpeech.playMany(this._tts, this._language, () => {
                  var t;
                  null === (t = this._readIcon) || void 0 === t || t.getElement().classList.remove("playing");
              }),
              this._readIcon && this._readIcon.getElement().classList.add("playing"));
    }
    _onShowMoreClick(t) {
        const e = t.target.closest(".lt-synonymscard__row");
        e && (e.classList.add("lt-synonymscard__row--expanded"), this._position());
    }
    _onBadgeClicked(t) {
        t.stopImmediatePropagation();
        const e = { synonymsCard: this };
        dispatchCustomEvent(document, SynonymsCard.eventNames.badgeClicked, e);
    }
    _onLogoClicked(t) {
        t.stopImmediatePropagation();
        const e = { synonymsCard: this };
        dispatchCustomEvent(document, SynonymsCard.eventNames.logoClicked, e);
    }
    _onCloseClicked(t) {
        t.stopImmediatePropagation(), this.destroy();
    }
    _onKeyDown(t) {
        "Escape" === t.key && (this.destroy(), t.stopImmediatePropagation());
    }
    _onUnload() {
        this.destroy();
    }
    destroy() {
        (this._destroyed = !0), this._container && (this._container.remove(), (this._container = null));
        const t = { synonymsCard: this, word: this._wordContext.word.trim() };
        dispatchCustomEvent(document, SynonymsCard.eventNames.destroyed, t),
            window.removeEventListener("pagehide", this._onUnload, !0),
            this._eventListeners.forEach((t) => {
                t.destroy();
            }),
            (this._eventListeners = []);
    }
}
(SynonymsCard.CONTAINER_ELEMENT_NAME = "lt-card"),
    (SynonymsCard.eventNames = { synonymSelected: "lt-synonymsCard.synonymSelected", badgeClicked: "lt-synonymsCard.badgeClicked", logoClicked: "lt-synonymsCard.logoClicked", destroyed: "lt-synonymsCard.destroyed" }),
    (SynonymsCard.BLOCK_ID = "synonyms-card"),
    (SynonymsCard._isInitialized = !1),
    SynonymsCard._constructor();
