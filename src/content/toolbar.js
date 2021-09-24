/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class Toolbar {
    constructor(t, e, s = null, o = { validationStatus: VALIDATION_STATUS.IN_PROGRESS, errorsCount: 0, premiumErrorsCount: 0, isIncompleteResult: !1, validationErrorMessage: "", showNotification: !1 }) {
        (this._currentStyles = null), (this._renderOutsideIframe = !1), (this._inputArea = t), (this._targetElement = t), (this._document = t.ownerDocument), (this._appearance = e), (this._mirror = s);
        const i = getFrameElement(window);
        i &&
            this._inputArea === this._inputArea.ownerDocument.body &&
            isLTAvailable(window.parent) &&
            ((this._targetElement = i), (this._document = this._targetElement.ownerDocument), (this._renderOutsideIframe = !0), (this._onUnload = this._onUnload.bind(this)), window.addEventListener("pagehide", this._onUnload, !0)),
            (this._controls = { container: null, wrapper: null, statusIcon: null, premiumIcon: null }),
            (this._visible = !1),
            (this._sizeDecreased = !1),
            (this._hasNotifiedAboutPremiumIcon = !1),
            (this._domMeasurement = new DomMeasurement(this._document)),
            (this._eventListeners = []),
            this.updateState(o);
        const r = GoogleDocs.isPage(this._inputArea);
        (this._renderInterval = setAnimationFrameInterval(() => this._updateDisplaying(!0), r ? 2 * config.RENDER_INTERVAL : config.RENDER_INTERVAL)),
            r || (this._decreaseSizeInterval = setAnimationFrameInterval(() => this._decreaseSizeIfNeeded(), config.TOOLBAR_DECREASE_SIZE_INTERVAL)),
            (this._scrollObserver = observeScrollableAncestors(this._targetElement, () => this._updateDisplaying(!1)));
    }
    static _cacheMessages() {
        Toolbar.MESSAGES = {
            STATUS_ICON_RELOAD_MESSAGE: i18nManager.getMessage("statusIconReload"),
            STATUS_ICON_TOOLTIP: i18nManager.getMessage("statusIconToolTip"),
            STATUS_ICON_PERMISSION_REQUIRED: i18nManager.getMessage("statusIconPermissionRequired"),
            STATUS_ICON_TEXT_TOO_LONG: i18nManager.getMessage("textTooLong"),
            STATUS_ICON_DISABLED: i18nManager.getMessage("statusIconEnableLT"),
            STATUS_ICON_FAIL: i18nManager.getMessage("statusIconError"),
            STATUS_ICON_MORE_ERRORS: i18nManager.getMessage("statusIconMoreErrors"),
            STATUS_ICON_LANGUAGE_UNSUPPORTED: i18nManager.getMessage("dialogUnsupportedLanguageHeadline"),
        };
    }
    static _constructor() {
        Toolbar._isInitialized || (Toolbar._cacheMessages(), i18nManager.addEventListener(i18nManagerClass.eventNames.localeChanged, Toolbar._cacheMessages.bind(Toolbar)), (Toolbar._isInitialized = !0));
    }
    _render() {
        if (this._destroyed) return;
        const t = ["lt-toolbar__status-icon"],
            e = ["lt-toolbar__premium-icon"];
        let s = Toolbar.MESSAGES.STATUS_ICON_TOOLTIP,
            o = "";
        if (!this._controls.container) {
            (this._rootElement = "BODY" === this._targetElement.tagName ? this._document.documentElement : this._document.body),
                (this._controls.container = createContainerElement(this._document, Toolbar.CONTAINER_ELEMENT_NAME)),
                (this._controls.container.style.display = "none"),
                isCKEditor(this._inputArea) && this._controls.container.setAttribute("data-cke-temp", "1"),
                (this._controls.wrapper = this._document.createElement("lt-div")),
                this._controls.wrapper.classList.add("lt-toolbar__wrapper");
            const t = this._appearance.getClassName(this._inputArea);
            t && this._controls.wrapper.classList.add(t), (this._controls.statusIcon = this._document.createElement("lt-div")), (this._controls.premiumIcon = this._document.createElement("lt-div"));
            const e = [this._controls.statusIcon, this._controls.premiumIcon];
            this._eventListeners.push(addUseCaptureEvent(this._controls.wrapper, "click", this._onClick.bind(this))),
                this._controls.wrapper.appendChild(this._controls.premiumIcon),
                this._controls.wrapper.appendChild(this._controls.statusIcon),
                this._controls.container.appendChild(this._controls.wrapper),
                e.forEach((t) => {
                    this._eventListeners.push(
                        addUseCaptureEvent(t, "mousedown", (t) => {
                            t.stopImmediatePropagation(), t.preventDefault();
                        }),
                        addUseCaptureEvent(t, "mouseup", (t) => {
                            t.stopImmediatePropagation();
                        }),
                        addUseCaptureEvent(t, "pointerdown", (t) => {
                            t.stopImmediatePropagation();
                        }),
                        addUseCaptureEvent(t, "pointerup", (t) => {
                            t.stopImmediatePropagation();
                        })
                    );
                }),
                (this._visible = !0);
        }
        switch ((clearTimeout(this._premiumIconTimeout), this._state.validationStatus)) {
            case VALIDATION_STATUS.IN_PROGRESS:
                t.push("lt-toolbar__status-icon-in-progress");
                break;
            case VALIDATION_STATUS.COMPLETED:
            case VALIDATION_STATUS.TEXT_TOO_SHORT:
                0 === this._state.errorsCount
                    ? t.push("lt-toolbar__status-icon-has-no-errors")
                    : (t.push("lt-toolbar__status-icon-has-errors"),
                      this._state.isIncompleteResult
                          ? (t.push("lt-toolbar__status-icon-has-more-errors"), (s = Toolbar.MESSAGES.STATUS_ICON_MORE_ERRORS))
                          : this._state.errorsCount >= 9
                          ? t.push("lt-toolbar__status-icon-has-9plus-errors")
                          : t.push(`lt-toolbar__status-icon-has-${this._state.errorsCount}-errors`)),
                    this._state.premiumErrorsCount > 0 &&
                        (e.push("lt-toolbar__premium-icon--visible"),
                        (this._premiumIconTimeout = window.setTimeout(() => this._notifyAboutPremiumIcon(), 3e3)),
                        this._state.premiumErrorsCount < 9 ? e.push(`lt-toolbar__premium-icon-has-${this._state.premiumErrorsCount}-errors`) : e.push("lt-toolbar__premium-icon-has-9plus-errors"),
                        0 === this._state.errorsCount && e.push("lt-toolbar__premium-icon--prominent")),
                    this._state.showNotification && 0 === this._state.premiumErrorsCount && t.push("lt-toolbar__status-icon-has-notification");
                break;
            case VALIDATION_STATUS.PERMISSION_REQUIRED:
                t.push("lt-toolbar__status-icon--permission-required"), (s = Toolbar.MESSAGES.STATUS_ICON_PERMISSION_REQUIRED);
                break;
            case VALIDATION_STATUS.DISABLED:
                t.push("lt-toolbar__status-icon-disabled"), (s = Toolbar.MESSAGES.STATUS_ICON_DISABLED);
                break;
            case VALIDATION_STATUS.TEXT_TOO_LONG:
                t.push("lt-toolbar__status-icon-text-too-long"), (s = Toolbar.MESSAGES.STATUS_ICON_TEXT_TOO_LONG);
                break;
            case VALIDATION_STATUS.UNSUPPORTED_LANGUAGE:
                t.push("lt-toolbar__status-icon--language-unsupported"), (s = Toolbar.MESSAGES.STATUS_ICON_LANGUAGE_UNSUPPORTED);
                break;
            case VALIDATION_STATUS.FAILED:
                t.push("lt-toolbar__status-icon--failed", "wp-exclude-emoji"), (s = this._state.validationErrorMessage || Toolbar.MESSAGES.STATUS_ICON_FAIL), (o = "✖");
                break;
            case VALIDATION_STATUS.DISCONNECTED:
                t.push("lt-toolbar__status-icon-disconnected", "wp-exclude-emoji"), (s = Toolbar.MESSAGES.STATUS_ICON_RELOAD_MESSAGE), (o = "✖");
        }
        (this._controls.statusIcon.className = t.join(" ")),
            (this._controls.statusIcon.title = s),
            (this._controls.statusIcon.textContent = o),
            (this._controls.premiumIcon.className = e.join(" ")),
            this._rootElement && this._rootElement.children[this._rootElement.children.length - 1] !== this._controls.container && this._rootElement.appendChild(this._controls.container);
    }
    _updateDisplaying(t = !1) {
        if (this._destroyed) return;
        if (!this._controls.wrapper) return;
        if (this._renderOutsideIframe && !this._document.contains(this._targetElement)) return void this._hide();
        if ((this._domMeasurement.clearCache(), !this._appearance.isVisible(this._targetElement, this._domMeasurement))) return void this._hide();
        const e = this._domMeasurement.isRTL(this._targetElement),
            s = this._appearance.getPosition(this._targetElement, this._rootElement, this._domMeasurement, e, Toolbar.TOOLBAR_SIZE);
        if (!s) return void this._hide();
        const o = { left: s.left };
        s.fixed
            ? ((o.position = "fixed !important"), s.top ? ((o.top = `${s.top} !important`), (o.bottom = "auto !important")) : ((o.top = "auto !important"), (o.bottom = "12px !important")))
            : ((o.position = "absolute !important"), (o.top = `${s.top} !important`), (o.bottom = "auto !important")),
            t && (o["z-index"] = (this._appearance.getZIndex(this._targetElement, this._rootElement, this._domMeasurement) || "auto").toString()),
            isSameObjects(this._currentStyles, o) ? this._show() : ((this._currentStyles = o), this._domMeasurement.setStyles(this._controls.wrapper, o));
    }
    _hide() {
        this._controls.wrapper && this._visible && ((this._visible = !1), this._controls.wrapper.classList.add("lt-toolbar__wrapper-hide"));
    }
    _show() {
        this._controls.wrapper && (this._visible || ((this._visible = !0), this._controls.wrapper.classList.remove("lt-toolbar__wrapper-hide")));
    }
    _decreaseSizeIfNeeded() {
        if (!this._controls.wrapper) return;
        if (!this._visible) return;
        if (this._destroyed) return;
        const t = this._domMeasurement.getBorderBox(this._controls.wrapper, !1);
        if (this._renderOutsideIframe) {
            const e = this._domMeasurement.getContentBox(this._targetElement, !1);
            (t.left -= e.left), (t.top -= e.top), (t.bottom -= e.top), (t.right -= e.left);
        }
        if (t.top < 0 || t.bottom > window.innerHeight) return;
        const e = { left: t.left - 6, top: t.top, right: t.right, bottom: t.bottom - 2 },
            s = { x: t.left, y: Math.round(t.top) },
            o = { x: Math.round(t.left + t.width / 2), y: Math.round(t.top + t.height / 2) },
            i = { x: t.left, y: Math.round(t.bottom) };
        this.disableRangeMeasurements(), this._mirror && this._mirror.enableRangeMeasurements();
        const r = getRangeAtPoint(s);
        let a = getRangeAtPoint(o),
            n = getRangeAtPoint(i);
        this.enableRangeMeasurements(), this._mirror && this._mirror.disableRangeMeasurements();
        let l = null;
        a && a.startOffset > 0 && ((l = new Range()).setStart(a.startContainer, a.startOffset - 1), l.setEnd(a.startContainer, a.startOffset - 1));
        const _ = this._mirror ? this._mirror.getCloneElement() : this._inputArea;
        if (r && contains(_, r.startContainer)) {
            const t = r.getBoundingClientRect();
            if (isRectsIntersect(t, e)) return void this._decreaseSize();
        }
        if ((isSameRange(a, r) && (a = null), a && contains(_, a.startContainer))) {
            const t = a.getBoundingClientRect();
            if (isRectsIntersect(t, e)) return void this._decreaseSize();
        }
        if (((isSameRange(n, r) || isSameRange(n, a)) && (n = null), n && contains(_, n.startContainer))) {
            const t = n.getBoundingClientRect();
            if (isRectsIntersect(t, e)) return void this._decreaseSize();
        }
        if (((isSameRange(l, r) || isSameRange(l, a) || isSameRange(l, n)) && (l = null), l && contains(_, l.startContainer))) {
            const t = l.getBoundingClientRect();
            if (isRectsIntersect(t, e)) return void this._decreaseSize();
        }
        this._increaseSize();
    }
    _decreaseSize() {
        this._controls.wrapper && (this._sizeDecreased || ((this._sizeDecreased = !0), this._controls.wrapper.classList.add("lt-toolbar-small")));
    }
    _increaseSize() {
        this._controls.wrapper && this._sizeDecreased && ((this._sizeDecreased = !1), this._controls.wrapper.classList.remove("lt-toolbar-small"));
    }
    _notifyAboutPremiumIcon() {
        if (this._hasNotifiedAboutPremiumIcon) return;
        this._hasNotifiedAboutPremiumIcon = !0;
        const t = { toolbar: this };
        dispatchCustomEvent(document, Toolbar.eventNames.notifyAboutPremiumIcon, t);
    }
    _onUnload() {
        this.destroy();
    }
    _onClick(t) {
        window.aiTrackPageView();
        const e = t.target;
        if (![this._controls.wrapper, this._controls.statusIcon, this._controls.premiumIcon].includes(e)) return;
        t.stopImmediatePropagation();
        const s = { toolbar: this };
        if (this._state.validationStatus === VALIDATION_STATUS.PERMISSION_REQUIRED) dispatchCustomEvent(document, Toolbar.eventNames.permissionRequiredIconClicked, s);
        else if (this._state.validationStatus === VALIDATION_STATUS.FAILED) Tracker.trackEvent("Action", "dialog:opened", "FAILED"), dispatchCustomEvent(document, Toolbar.eventNames.toggleDialog, s);
        else {
            let t = this._state.validationStatus;
            t === VALIDATION_STATUS.COMPLETED && this._state.errorsCount > 0 ? (t = "HAS_ERRORS") : t === VALIDATION_STATUS.COMPLETED && this._state.premiumErrorsCount > 0 && (t = "HAS_ONLY_PREMIUM_ERRORS"),
                Tracker.trackEvent("Action", "dialog:opened", t),
                dispatchCustomEvent(document, Toolbar.eventNames.toggleDialog, s);
        }
    }
    updateState(t) {
        if (isSameObjects(this._stateForComparison, t)) return;
        this._stateForComparison = t;
        const e = void 0 === t.validationStatus ? this._state.validationStatus : t.validationStatus;
        let s = 0,
            o = 0;
        e === VALIDATION_STATUS.COMPLETED && ((s = void 0 === t.errorsCount ? this._state.errorsCount : t.errorsCount), (o = void 0 === t.errorsCount ? this._state.premiumErrorsCount : t.premiumErrorsCount));
        let i = void 0 === t.isIncompleteResult ? this._state.isIncompleteResult : t.isIncompleteResult,
            r = "";
        e === VALIDATION_STATUS.FAILED && (r = void 0 === t.validationErrorMessage ? this._state.validationErrorMessage : t.validationErrorMessage),
            (this._state = { validationStatus: e, errorsCount: s, premiumErrorsCount: o, isIncompleteResult: i, validationErrorMessage: r, showNotification: t.showNotification }),
            (this._animationFrame = window.requestAnimationFrame(() => {
                this._render(), this._updateDisplaying();
            }));
    }
    enableRangeMeasurements() {
        this._controls.wrapper && (this._renderOutsideIframe || this._controls.wrapper.classList.remove("lt-toolbar-disable-range-measurement"));
    }
    disableRangeMeasurements() {
        this._controls.wrapper && (this._renderOutsideIframe || this._controls.wrapper.classList.add("lt-toolbar-disable-range-measurement"));
    }
    getState() {
        return this._state;
    }
    getContainer() {
        return this._controls.wrapper;
    }
    destroy() {
        (this._destroyed = !0),
            this._eventListeners.forEach((t) => {
                t.destroy();
            }),
            (this._eventListeners = []);
        for (const t in this._controls) this._controls[t] && (this._controls[t].remove(), (this._controls[t] = null));
        this._domMeasurement.clearCache(),
            this._renderInterval && this._renderInterval.destroy(),
            this._decreaseSizeInterval && this._decreaseSizeInterval.destroy(),
            window.removeEventListener("pagehide", this._onUnload, !0),
            cancelAnimationFrame(this._animationFrame),
            clearTimeout(this._premiumIconTimeout),
            this._scrollObserver && this._scrollObserver.destroy();
    }
}
(Toolbar.CONTAINER_ELEMENT_NAME = "lt-toolbar"),
    (Toolbar.TOOLBAR_SIZE = { width: 20, height: 20 }),
    (Toolbar.eventNames = { permissionRequiredIconClicked: "lt-toolbar.permissionRequiredIconClicked", toggleDialog: "lt-toolbar.toggleDialog", notifyAboutPremiumIcon: "lt-toolbar.notifyAboutPremiumIcon" }),
    (Toolbar._isInitialized = !1),
    Toolbar._constructor();
