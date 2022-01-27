/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class InputAreaWrapper {
    constructor(e, t, s, n = Number.MAX_SAFE_INTEGER) {
        if (
            ((this._inputAreaObserver = null),
            (this._scrollToInterval = null),
            (this._lastKey = null),
            (this._inputArea = e),
            (this._element = t),
            (this._tweaks = s),
            (this._textLengthThreshold = n),
            (this._ceElementInspector = new CEElementInspector(t, this._tweaks.getParsingDetector(e), !isFormElement(this._inputArea))),
            (this._domMeasurement = new DomMeasurement(this._inputArea.ownerDocument)),
            this._updateText(),
            (this._scrollToInterval = null),
            (this._onScroll = this._onScroll.bind(this)),
            (this._onBlur = this._onBlur.bind(this)),
            (this._onPaste = this._onPaste.bind(this)),
            (this._onDblClick = this._onDblClick.bind(this)),
            (this._onInput = this._onInput.bind(this)),
            (this._onKeyUp = this._onKeyUp.bind(this)),
            this._inputArea.addEventListener("scroll", this._onScroll),
            "BODY" === this._inputArea.nodeName && window.addEventListener("scroll", this._onScroll),
            this._inputArea.addEventListener("blur", this._onBlur),
            this._inputArea.addEventListener("paste", this._onPaste),
            this._inputArea.addEventListener("dblclick", this._onDblClick),
            this._inputArea.addEventListener("keyup", this._onKeyUp),
            (this._scrollTop = this._inputArea.scrollTop),
            (this._scrollLeft = this._inputArea.scrollLeft),
            !isFormElement(this._inputArea))
        ) {
            const t = Overleaf.isEditor(this._inputArea);
            (this._inputAreaObserver = this._tweaks.createMutationObserver(this._inputArea, (s) => {
                s.filter(
                    (s) =>
                        (this._inputArea !== s.target || "class" !== s.attributeName || "attributes" !== s.type) &&
                        !(
                            "style" === s.attributeName &&
                            "attributes" === s.type &&
                            s.target instanceof HTMLElement &&
                            (s.target.classList.contains("kix-table-column-border-dragger") || s.target.classList.contains("kix-table-row-border-dragger"))
                        ) &&
                        (!t || !Overleaf.isMutationIgnored(this._inputArea, s))
                ).length && this._onInput();
            })),
                this._inputAreaObserver.observe(this._inputArea, InputAreaWrapper.INPUT_AREA_OBSERVER_CONFIG);
        }
        this._element.addEventListener(Mirror.eventNames.input, this._onInput);
    }
    static _endsWithWhitespace(e) {
        return e.endsWith(" ");
    }
    static _selectText(e, t = 0, s = e.nodeValue.length) {
        (t = Math.max(t, 0)), (s = Math.min(s, e.nodeValue.length));
        const n = window.getSelection();
        n.removeAllRanges();
        const r = new Range();
        r.setStart(e, t), r.setEnd(e, s), n.addRange(r);
    }
    static _simulateMouseDown(e) {
        const t = new MouseEvent("mousedown", { bubbles: !0, cancelable: !1 });
        e.dispatchEvent(t);
    }
    static _simulateMouseUp(e) {
        const t = new MouseEvent("mouseup", { bubbles: !0, cancelable: !1 });
        e.dispatchEvent(t);
    }
    static _simulateSelection(e) {
        this._simulateMouseDown(e);
        const t = window.getSelection();
        t.removeAllRanges();
        const s = new Range();
        s.setStart(e, 0), s.collapse(!1), t.addRange(s), this._simulateMouseUp(e);
    }
    _getTextChunkIndex(e) {
        let t = 0,
            s = this._textChunks.length,
            n = 0;
        for (; t < s; ) {
            n = t + Math.floor((s - t) / 2);
            const r = this._textChunks[t];
            if (r.parsedTextOffset <= e && e <= r.parsedTextOffset + r.parsedText.length) return t;
            const i = this._textChunks[n];
            i.parsedTextOffset + i.parsedText.length >= e ? (s = n) : (t = n + 1);
        }
        return t < this._textChunks.length ? t : -1;
    }
    _offsetInRawText(e, t, s) {
        if (((s = Math.min(e.length, s)), isFormElement(this._inputArea))) {
            const t = indexOfZWC(e);
            if (-1 === t || s < t) return s;
            let n = t,
                r = t;
            do {
                if ((isZWC(e[n]) || r++, r > s)) break;
                n++;
            } while (n < e.length);
            return n;
        }
        {
            let n = 0,
                r = 0;
            do {
                const i = e[n],
                    a = t[r];
                if (i === a) r++;
                else if (this._ceElementInspector.isWhiteSpace(i) || "\n" === i) " " === a && r++;
                else if (!isZWC(i)) break;
                if (r > s) break;
                n++;
            } while (n < e.length);
            return n;
        }
    }
    _offsetInParsedText(e, t, s) {
        if (isFormElement(this._inputArea)) {
            let t = 0;
            for (let n = 0; n < Math.min(e.length, s); n++) isZWC(e[n]) && t++;
            return s - t;
        }
        {
            let n = 0,
                r = 0;
            for (; n < s; ) {
                const s = e[n],
                    i = t[r];
                if (s === i) r++;
                else if (this._ceElementInspector.isWhiteSpace(s) || "\n" === s) " " === i && r++;
                else if (!isZWC(s)) break;
                n++;
            }
            return r;
        }
    }
    _updateText() {
        const e = [];
        let t = 0,
            s = 0,
            n = void 0,
            r = "";
        const i = DOMWalker.create(this._element);
        let a = !1;
        do {
            const o = i.currentNode;
            void 0 === n && (n = this._ceElementInspector.getParagraphLastValuableNode(o)), (a = !1);
            let l = !1,
                h = "";
            if (isElementNode(o))
                if (
                    ((r += h = this._ceElementInspector.getReplacementText(o)),
                    o === n && ((n = null), this._ceElementInspector.isTextEndsWithLineBreak(o) && ((n = void 0), (r = ""), (h += "\n\n"))),
                    this._ceElementInspector.isSkippingElement(o))
                ) {
                    if (((a = !0), !h)) continue;
                } else
                    this._ceElementInspector.isBlock(o)
                        ? ((n = void 0), (r = ""), !h && this._ceElementInspector.isBlockElementRelevant(o) && (h = "\n\n"))
                        : this._ceElementInspector.isBr(o) && ((n = void 0), (r = ""), !h && this._ceElementInspector.isBRElementRelevant(o) && (h = "\n"));
            else if (isTextNode(o) && ((l = !0), (h = this._ceElementInspector.getParsedText(o)))) {
                const e = null === n || n === o;
                this._ceElementInspector.getParsingOptions(o).preserveWhitespaces ||
                    (("" === r || InputAreaWrapper._endsWithWhitespace(r)) && (h = h.replace(InputAreaWrapper.LEADING_WHITESPACES_REGEXP, "")), e && (h = h.replace(InputAreaWrapper.TRAILING_WHITESPACES_REGEXP, ""))),
                    (r += h),
                    n === o && ((n = null), this._ceElementInspector.isTextEndsWithLineBreak(o) && ((n = void 0), (r = ""), (h += "\n\n")));
            }
            if ((e.push({ node: o, isTextNode: l, rawText: l ? o.nodeValue : "", rawTextOffset: t, parsedText: h, parsedTextOffset: s }), l && (t += o.nodeValue.length), (s += h.length) > this._textLengthThreshold)) break;
        } while (i.next(a));
        (this._textChunks = e), (this._parsedText = this._textChunks.map((e) => e.parsedText).join(""));
        const o = this._tweaks.getFullTextInfo(this._inputArea, this._parsedText),
            l = !this._fullTextInfo || this._fullTextInfo.text !== o.text;
        return (this._fullTextInfo = o), l;
    }
    _getTextPosition(e) {
        const t = this._getTextChunkIndex(e);
        if (-1 === t) return null;
        const s = this._textChunks[t];
        return (e -= s.parsedTextOffset), { textNode: s.node, offset: this._offsetInRawText(s.rawText, s.parsedText, e) };
    }
    _getTextOffset(e, t) {
        let s = null,
            n = 0;
        if (isElementNode(e)) {
            const r = DOMWalker.create(this._element);
            do {
                const n = r.currentNode;
                if (n === e.childNodes[t]) break;
                isTextNode(n) && n.textContent && (s = n);
            } while (r.next());
            if (!s) return -1;
            n = s.textContent.length;
        } else isTextNode(e) && ((s = e), (n = t));
        const r = this._textChunks.find((e) => e.node === s);
        return r ? r.parsedTextOffset + this._offsetInParsedText(r.rawText, r.parsedText, n) : -1;
    }
    _hasSpaceBefore(e) {
        if (e <= 0) return !1;
        if (isFormElement(this._inputArea)) {
            const t = this._textChunks.find((e) => e.isTextNode),
                s = this._offsetInRawText(t.rawText, t.parsedText, e - 1),
                n = this._offsetInRawText(t.rawText, t.parsedText, e);
            return InputAreaWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(t.rawText.substring(s, n));
        }
        {
            const t = this.getTextRanges(e - 1, 1)[0];
            return Boolean(t && t.textNode.nodeValue && InputAreaWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(t.textNode.nodeValue.substring(t.start, t.end)));
        }
    }
    _hasSpaceAfter(e) {
        if (isFormElement(this._inputArea)) {
            const t = this._textChunks.find((e) => e.isTextNode),
                s = this._offsetInRawText(t.rawText, t.parsedText, e),
                n = this._offsetInRawText(t.rawText, t.parsedText, e + 1);
            return InputAreaWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(t.rawText.substring(s, n));
        }
        {
            const t = this.getTextRanges(e, 1)[0];
            return Boolean(t && t.textNode.nodeValue && InputAreaWrapper.VISIBLE_WHITE_SPACE_REGEXP.test(t.textNode.nodeValue.substring(t.start, t.end)));
        }
    }
    _applyReplacement(e, t = !0) {
        let s = Promise.resolve();
        return (
            t && (s = s.then(() => InputAreaWrapper._simulateSelection(e.textNode.parentNode)).then(() => wait())),
            (s = s
                .then(() => {
                    if (
                        (InputAreaWrapper._simulateMouseDown(this._inputArea),
                        InputAreaWrapper._selectText(e.textNode, e.from, e.to),
                        InputAreaWrapper._simulateMouseUp(this._inputArea),
                        isSlateEditor(this._inputArea) || isOpenXchangeEditor(this._inputArea) || isTrixEditor(this._inputArea) || isCodeMirror(this._inputArea))
                    )
                        return wait(201);
                })
                .then(() => {
                    if (!(BrowserDetector.isTrident() || (isTrixEditor(this._inputArea) && BrowserDetector.isFirefox())))
                        if (isOpenXchangeEditor(this._inputArea)) this.simulatePaste(e.replacementText);
                        else if (isSlateEditor(this._inputArea) && BrowserDetector.isFirefox()) this.simulatePaste(e.replacementText);
                        else {
                            const t = new window.InputEvent("beforeinput", { bubbles: !0, cancelable: !0, inputType: "insertText", data: e.replacementText });
                            this._inputArea.dispatchEvent(t) && document.execCommand("insertText", !1, e.replacementText);
                        }
                })),
            (BrowserDetector.isTrident() || (BrowserDetector.isFirefox() && (e.replacementText.includes(InputAreaWrapper.NBSP) || isTrixEditor(this._inputArea)))) &&
                (s = s.then(() => {
                    const t = new window.InputEvent("beforeinput", { bubbles: !0, cancelable: !1, inputType: "insertText", data: e.replacementText });
                    this._inputArea.dispatchEvent(t), (e.textNode.nodeValue = e.newText), this.simulateInput(e.replacementText);
                })),
            s
        );
    }
    _onScroll() {
        let e = 0,
            t = 0;
        if (
            ("BODY" === this._inputArea.nodeName
                ? ((e = (document.body && document.body.scrollTop) || (document.documentElement && document.documentElement.scrollTop) || 0),
                  (t = (document.body && document.body.scrollLeft) || (document.documentElement && document.documentElement.scrollLeft) || 0))
                : ((e = this._inputArea.scrollTop), (t = this._inputArea.scrollLeft)),
            this._scrollTop === e && this._scrollLeft === t)
        )
            return;
        (this._scrollTop = e), (this._scrollLeft = t);
        const s = { inputAreaWrapper: this };
        dispatchCustomEvent(document, InputAreaWrapper.eventNames.scroll, s);
    }
    _onBlur() {
        const e = { inputAreaWrapper: this };
        dispatchCustomEvent(document, InputAreaWrapper.eventNames.blur, e);
    }
    _onKeyUp(e) {
        if (Math.random() > 0.01) return;
        const t = BrowserDetector.getOS();
        if ("ArrowDown" === e.key && e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey) return void Tracker.trackEvent("Stat", `key:${t}:alt_arrow_down`);
        if ("ArrowDown" === e.key && e.altKey && e.ctrlKey && !e.shiftKey && !e.metaKey) return void Tracker.trackEvent("Stat", `key:${t}:alt_ctrl_arrow_down`);
        if ("ArrowDown" === e.key && e.shiftKey && e.altKey && !e.ctrlKey && !e.metaKey) return void Tracker.trackEvent("Stat", `key:${t}:shift_alt_arrow_down`);
        if ("Shift" === e.key && e.ctrlKey && !e.ctrlKey && !e.metaKey) return void Tracker.trackEvent("Stat", `key:${t}:ctrl_shift`);
        if ("Alt" === e.key && e.ctrlKey && !e.shiftKey && !e.metaKey) return void Tracker.trackEvent("Stat", `key:${t}:alt_control`);
        let s = null;
        if (("Control" !== e.key || e.altKey || e.shiftKey || e.metaKey ? "Alt" !== e.key || e.ctrlKey || e.shiftKey || e.metaKey || (s = "alt") : (s = "ctrl"), !s)) return void (this._lastKey = null);
        const n = Date.now();
        this._lastKey ? (n - this._lastKey.timestamp > 400 || this._lastKey.key !== s ? (this._lastKey = { key: s, timestamp: n }) : Tracker.trackEvent("Stat", `key:${t}:double_${s}`)) : (this._lastKey = { key: s, timestamp: n });
    }
    _onDblClick(e) {
        const t = removeZWC(this._tweaks.getSelectedText()),
            s = this.getSelection();
        if (!t || !s) return;
        const n = s.end || s.start,
            r = this.getTextRanges(s.start, n - s.start);
        if (!r.length) return;
        this._domMeasurement.clearCache();
        const i = this._domMeasurement.getTextBoundingBoxes(r, this._element),
            a = this._domMeasurement.getTextBoundingBoxes(r, this._element, !1);
        if (!i.length) return;
        if (!a.some((t) => isPointInsideRect(t, e.clientX, e.clientY))) return;
        const o = { inputAreaWrapper: this, selectedText: t, selection: s, clickedRectangles: i };
        dispatchCustomEvent(document, InputAreaWrapper.eventNames.dblclick, o);
    }
    _onInput() {
        const e = this._fullTextInfo.text;
        if (!this._updateText()) return;
        const t = { inputAreaWrapper: this, previousText: e, text: this._fullTextInfo.text };
        dispatchCustomEvent(document, InputAreaWrapper.eventNames.textChanged, t);
    }
    _onPaste(e) {
        const t = e.clipboardData,
            s = { inputAreaWrapper: this, isSignificantTextChange: (t ? t.getData("Text") : "").length > 200 };
        dispatchCustomEvent(document, InputAreaWrapper.eventNames.paste, s);
    }
    getText() {
        return this._fullTextInfo.text;
    }
    getTextRanges(e, t) {
        if ((e -= this._fullTextInfo.offset) < 0) return [];
        const s = this._getTextChunkIndex(e);
        if (-1 === s) return [];
        const n = [];
        for (let r = s; r < this._textChunks.length; r++) {
            const { node: s, isTextNode: i, rawText: a, parsedText: o, parsedTextOffset: l } = this._textChunks[r],
                h = Math.max(e - l, 0);
            if (!i) {
                t -= o.length - h;
                continue;
            }
            const u = this._offsetInRawText(a, o, h),
                p = this._offsetInRawText(a, o, h + t);
            if (u !== p && (n.push({ textNode: s, start: u, end: p }), (t -= o.length - h) <= 0)) break;
        }
        return n;
    }
    replaceText(e, t, s) {
        if ((e -= this._fullTextInfo.offset) < 0) return Promise.resolve();
        const n = e + s.length;
        if (("" === s && (this._hasSpaceBefore(e) || 0 === e) && this._hasSpaceAfter(e + t) && ((e = Math.max(e - 1, 0)), (t += 1)), !isFormElement(this._inputArea))) {
            let r = Promise.resolve();
            const i = !(
                isTinyMCE(this._inputArea) ||
                isGutenberg(this._inputArea) ||
                isTrixEditor(this._inputArea) ||
                isCodeMirror(this._inputArea) ||
                isProseMirror(this._inputArea) ||
                isLTEditor(this._inputArea) ||
                isWriterDuet(this._inputArea) ||
                isOpenXchangeEditor(this._inputArea) ||
                isSlateEditor(this._inputArea)
            );
            return (
                i && r.then(() => InputAreaWrapper._simulateSelection(this._inputArea)),
                r
                    .then(() => wait(50))
                    .then(() => {
                        const r = [],
                            a = this._getTextChunkIndex(e);
                        if (-1 === a) return Promise.resolve();
                        e -= this._textChunks[a].parsedTextOffset;
                        for (let n = a; n < this._textChunks.length; n++) {
                            const { node: i, isTextNode: a, rawText: o, parsedText: l } = this._textChunks[n];
                            if (a && e < l.length) {
                                const n = l.substr(0, e) + s + l.substr(e + t);
                                if (o !== n) {
                                    const a = this._offsetInRawText(o, l, e),
                                        h = this._offsetInRawText(o, l, e + t);
                                    r.push({ textNode: i, from: a, to: h, replacementText: s, newText: n });
                                }
                                (t = Math.max(t - (l.length - e), 0)), (e = 0), (s = "");
                            } else e -= l.length;
                            if (0 === t && "" === s) break;
                        }
                        r.reverse()
                            .reduce((e, t) => e.then(() => this._applyReplacement(t, i)), Promise.resolve())
                            .then(() => {
                                this.setSelection({ start: n });
                            })
                            .then(() => this.simulateChange());
                    })
            );
        }
        {
            this.setSelection({ start: e, end: e + t });
            let r = document.execCommand("insertText", !1, s);
            "" === s && BrowserDetector.isFirefox() && (r = !1);
            const i = BrowserDetector.isFirefox() && s.includes(InputAreaWrapper.NBSP);
            if (r) {
                if (i) {
                    const t = this._inputArea.value,
                        n = this._textChunks.find((e) => e.isTextNode),
                        r = this._offsetInRawText(t, n.parsedText, e),
                        i = this._offsetInRawText(t, n.parsedText, e + s.length),
                        a = t.substring(0, r) + s + t.substring(i);
                    this._inputArea.value = a;
                }
            } else {
                const n = this._textChunks.find((e) => e.isTextNode),
                    r = this._offsetInRawText(n.rawText, n.parsedText, e),
                    i = this._offsetInRawText(n.rawText, n.parsedText, e + t),
                    a = n.rawText.substring(0, r) + s + n.rawText.substring(i);
                this._inputArea.value = a;
            }
            this.setSelection({ start: n }), r || this.simulateInput(s);
        }
        return Promise.resolve();
    }
    simulatePaste(e) {
        if (BrowserDetector.isFirefox()) {
            const t = new ClipboardEvent("paste", { bubbles: !0, data: e, dataType: "text/plain" });
            this._inputArea.dispatchEvent(t);
        } else {
            const t = new ClipboardEvent("paste", { clipboardData: new DataTransfer(), bubbles: !0 });
            t.clipboardData.setData("text/plain", e), this._inputArea.dispatchEvent(t);
        }
    }
    simulateInput(e = "") {
        const t = new window.InputEvent("input", { bubbles: !0, cancelable: !1, inputType: "insertText", data: e });
        this._inputArea.dispatchEvent(t);
    }
    simulateChange() {
        const e = new Event("change", { bubbles: !0, cancelable: !1 });
        this._inputArea.dispatchEvent(e);
    }
    getSelection() {
        if (isFormElement(this._inputArea)) {
            if (this._inputArea !== document.activeElement) return null;
            const e = this.getText();
            return {
                start: this._offsetInParsedText(this._inputArea.value, e, this._inputArea.selectionStart) + this._fullTextInfo.offset,
                end: this._offsetInParsedText(this._inputArea.value, e, this._inputArea.selectionEnd) + this._fullTextInfo.offset,
            };
        }
        {
            const e = this._tweaks.getSelection();
            if (!e || !e.startNode) return null;
            if (!this._inputArea.contains(e.startNode)) return null;
            const t = this._getTextOffset(e.startNode, e.startOffset) + this._fullTextInfo.offset;
            return { start: t, end: e.isCollapsed || !e.endNode ? t : this._getTextOffset(e.endNode, e.endOffset) + this._fullTextInfo.offset };
        }
    }
    setSelection(e) {
        const t = e.start - this._fullTextInfo.offset,
            s = void 0 === e.end ? t : e.end - this._fullTextInfo.offset;
        if ((this._inputArea.focus(), isFormElement(this._inputArea))) {
            const e = this._textChunks.find((e) => e.isTextNode);
            (this._inputArea.selectionStart = this._offsetInRawText(e.rawText, e.parsedText, t)), (this._inputArea.selectionEnd = this._offsetInRawText(e.rawText, e.parsedText, s));
        } else {
            const e = this._getTextPosition(t);
            if (!e) return;
            const n = window.getSelection();
            n.removeAllRanges();
            const r = new Range();
            if ((r.setStart(e.textNode, e.offset), t !== s)) {
                const e = this._getTextPosition(s);
                if (!e) return;
                r.setEnd(e.textNode, e.offset);
            } else r.collapse(!1);
            n.addRange(r);
        }
    }
    resetText() {
        if (isFormElement(this._inputArea)) {
            const e = this._inputArea.value;
            (this._inputArea.value = ""), (this._inputArea.value = e);
        } else {
            this._inputAreaObserver.disconnect();
            const e = DOMWalker.create(this._inputArea);
            do {
                const t = e.currentNode;
                isTextNode(t) && (t.textContent = t.textContent);
            } while (e.next());
            this._inputAreaObserver.observe(this._inputArea, InputAreaWrapper.INPUT_AREA_OBSERVER_CONFIG);
        }
    }
    scrollToText(e, t, s = 300, n = "nearest", r) {
        if ((e -= this._fullTextInfo.offset) < 0) return;
        function i(e, t, s, n) {
            return (e /= n / 2) < 1 ? (s / 2) * e * e + t : (-s / 2) * (--e * (e - 2) - 1) + t;
        }
        this._domMeasurement.clearCache();
        const a = () => {
                r && setTimeout(() => r(), 50);
            },
            o = this.getTextRanges(e, t);
        if (isFormElement(this._inputArea)) {
            this._scrollToInterval && (this._scrollToInterval.destroy(), (this._scrollToInterval = null));
            const e = this._inputArea.scrollTop,
                t = this._inputArea.scrollLeft,
                r = this._domMeasurement.getRelativeTextBoundingBox(o, this._element),
                l = this._inputArea.getBoundingClientRect();
            let h = this._inputArea.scrollTop + r.top;
            "center" === n && ((h -= this._inputArea.clientHeight / 2), (h -= r.height / 2)), l.top < 0 && (h += l.top);
            let u = this._inputArea.scrollLeft + r.left;
            l.left < 0 && (u += l.left);
            const p = h - e,
                c = u - t;
            let _ = 0;
            this._scrollToInterval = setAnimationFrameInterval(() => {
                const n = i((_ += InputAreaWrapper.SCROLL_TO_FRAME_INTERVAL), e, p, s),
                    r = i(_, t, c, s);
                (this._inputArea.scrollTop = n), (this._inputArea.scrollLeft = r), _ >= s && (this._scrollToInterval && (this._scrollToInterval.destroy(), (this._scrollToInterval = null)), a());
            }, InputAreaWrapper.SCROLL_TO_FRAME_INTERVAL);
        } else {
            if (!o.length) return;
            try {
                const e = new Range();
                e.setStart(o[0].textNode, o[0].start), e.setEnd(o[o.length - 1].textNode, o[o.length - 1].end), window.scrollRangeIntoView(e, { behavior: "smooth", block: n }, a);
            } catch (e) {}
        }
    }
    destroy() {
        this._inputArea.removeEventListener("scroll", this._onScroll),
            this._inputArea.removeEventListener("blur", this._onBlur),
            this._inputArea.removeEventListener("paste", this._onPaste),
            this._inputArea.removeEventListener("dblclick", this._onDblClick),
            this._inputArea.removeEventListener("keyup", this._onKeyUp),
            window.removeEventListener("scroll", this._onScroll),
            this._element.removeEventListener(Mirror.eventNames.input, this._onInput),
            this._ceElementInspector.destroy(),
            this._scrollToInterval && this._scrollToInterval.destroy(),
            this._inputAreaObserver && this._inputAreaObserver.disconnect();
    }
}
(InputAreaWrapper.eventNames = { textChanged: "lt-inputAreaWrapper.textChanged", scroll: "lt-inputAreaWrapper.scroll", paste: "lt-inputAreaWrapper.paste", blur: "lt-inputAreaWrapper.blur", dblclick: "lt-inputAreaWrapper.dblclick" }),
    (InputAreaWrapper.SCROLL_TO_FRAME_INTERVAL = 20),
    (InputAreaWrapper.NBSP = String.fromCharCode(160)),
    (InputAreaWrapper.VISIBLE_WHITE_SPACE_REGEXP = /\u00A0|\u0020|\u2009|\u202F/),
    (InputAreaWrapper.LEADING_WHITESPACES_REGEXP = new RegExp(/^ /)),
    (InputAreaWrapper.TRAILING_WHITESPACES_REGEXP = new RegExp(/ $/)),
    (InputAreaWrapper.INPUT_AREA_OBSERVER_CONFIG = { attributes: !0, attributeOldValue: !1, characterData: !0, characterDataOldValue: !1, childList: !0, subtree: !0, attributeFilter: ["id", "class", "style"] });
