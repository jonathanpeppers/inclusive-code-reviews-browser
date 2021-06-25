/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class Highlighter {
    constructor(t, e, i, s, h, n) {
        (this._highlightingAreas = []),
            (this._width = 0),
            (this._height = 0),
            (this._currentZIndex = "auto"),
            (this._lastScrollingTimeStamp = 0),
            (this._inputArea = t),
            (this._inputAreaWrapper = e),
            (this._element = i),
            (this._isMirror = s),
            (this._tweaks = h),
            (this._clickEvent = n),
            (this._highlightedText = ""),
            (this._highlightedBlocks = []),
            (this._domMeasurement = new DomMeasurement(t.ownerDocument)),
            (this._onScrollableElementScroll = this._onScrollableElementScroll.bind(this)),
            (this._onCEElementClick = this._onCEElementClick.bind(this)),
            (this._onContentChanged = this._onContentChanged.bind(this)),
            (this._render = this._render.bind(this)),
            (this._enableHighlightingDebounce = new Debounce(this._enableHighlighting.bind(this), this._tweaks.scrollingThrottleLimit)),
            this._tweaks.addScrollEventListener(this._onScrollableElementScroll),
            this._element.addEventListener(this._clickEvent, this._onCEElementClick, !0),
            this._element.addEventListener(Mirror.eventNames.click, this._onCEElementClick),
            (this._contentChangedObserver = this._tweaks.createMutationObserver(this._onContentChanged));
        const o = { attributes: !0, attributeFilter: s ? ["style"] : ["style", "class", "size", "face", "align"], attributeOldValue: !1, characterData: !0, characterDataOldValue: !1, childList: !0, subtree: !s };
        this._contentChangedObserver.observe(this._element, o),
            window.ResizeObserver && ((this._ceElementResizeObserver = new window.ResizeObserver(this._render)), this._ceElementResizeObserver.observe(this._element)),
            (this._renderInterval = setAnimationFrameInterval(this._render, config.RENDER_INTERVAL)),
            this._render();
    }
    _toPageCoordinates(t, e) {
        const i = this._domMeasurement.getPaddingBox(e),
            s = this._getScrollPosition(!1),
            h = this._domMeasurement.getScaleFactor(e),
            n = this._domMeasurement.getZoom(e),
            o = Math.round((t.top - s.top) * h.y * n + i.top),
            r = Math.round((t.left - s.left) * h.x * n + i.left),
            l = Math.round(t.width * h.x * n),
            a = Math.round(t.height * h.y * n);
        return { top: o, right: r + l, bottom: o + a, left: r, width: l, height: a };
    }
    _toElementCoordinates(t, e) {
        const i = this._domMeasurement.getPaddingBox(e, !1),
            s = this._getScrollPosition(),
            h = this._domMeasurement.getScaleFactor(e),
            n = this._domMeasurement.getZoom(e);
        return { x: Math.round((t.x - i.left + s.left) / h.x / n), y: Math.round((t.y - i.top + s.top) / h.y / n) };
    }
    _getScrollPosition(t = !0, e = t, i = !0) {
        if (this._isMirror) {
            let i = 0,
                s = 0;
            return (
                t
                    ? ((i = e ? +this._element.dataset.ltScrollTopScaledAndZoomed : +this._element.dataset.ltScrollTopScaled), (s = e ? +this._element.dataset.ltScrollLeftScaledAndZoomed : +this._element.dataset.ltScrollLeftScaled))
                    : ((i = +this._element.dataset.ltScrollTop), (s = +this._element.dataset.ltScrollLeft)),
                { top: i, left: s }
            );
        }
        return i && this._domMeasurement.clearCache(), this._tweaks.getScrollPosition(this._domMeasurement, t, e);
    }
    _render() {
        if (!this._element.parentElement || !this._inputArea.parentElement) return;
        this._domMeasurement.clearCache();
        const t = this._inputArea.ownerDocument,
            e = this._tweaks.getTargetElement();
        if (!e.parentElement) return;
        if (!this._container) {
            (this._container = createContainerElement(t, Highlighter.CONTAINER_ELEMENT_NAME)),
                (this._container.style.display = "none"),
                isCKEditor(this._inputArea) && this._container.setAttribute("data-cke-temp", "1"),
                (this._wrapper = t.createElement("lt-div")),
                this._wrapper.setAttribute("spellcheck", "false"),
                (this._wrapper.className = "lt-highlighter__wrapper"),
                (this._scrollElement = t.createElement("lt-div")),
                (this._scrollElement.className = "lt-highlighter__scrollElement"),
                this._wrapper.appendChild(this._scrollElement),
                this._container.appendChild(this._wrapper);
            const i = this._domMeasurement.getStyle(e.parentElement, "display");
            ("grid" !== i && "inline-grid" !== i) || this._container.classList.add("lt-highlighter--grid-item");
        }
        const i = {};
        if (this._inputArea === t.body && t.scrollingElement === t.documentElement && "BackCompat" !== t.compatMode) {
            const t = this._domMeasurement.getStyles(this._inputArea, ["overflow-x", "overflow-y"]);
            (i["overflow-x"] = "hidden" === t["overflow-x"] ? "hidden" : "visible"), (i["overflow-y"] = "hidden" === t["overflow-y"] ? "hidden" : "visible");
        }
        const s = this._tweaks.getVisibleBox(this._domMeasurement);
        (i.width = s.width + "px"), (i.height = s.height + "px");
        const h = this._domMeasurement.getStyles(this._element, ["transform", "transform-origin", "zoom"]);
        (i.transform = h.transform), (i["transform-origin"] = h["transform-origin"]), (i.zoom = h.zoom), this._domMeasurement.setStyles(this._wrapper, i, !0);
        const n = this._isMirror ? this._inputArea : e,
            o = this._tweaks.getZIndex(n, this._domMeasurement);
        o !== this._currentZIndex &&
            ("auto" !== o && o > 0
                ? ((this._currentZIndex = o), this._domMeasurement.setStyles(this._container, { "z-index": String(o) }, !0))
                : "auto" !== this._currentZIndex && ((this._currentZIndex = "auto"), this._domMeasurement.setStyles(this._container, { "z-index": "auto" }, !0))),
            this._applyScrolling(),
            e.previousElementSibling !== this._container && e.parentElement.insertBefore(this._container, e);
        const r = this._domMeasurement.getPaddingBox(this._wrapper, !0, !1),
            l = s.top - r.top;
        if (Math.abs(l) > 0.05) {
            const t = this._domMeasurement.getScaleFactor(this._inputArea.parentElement);
            let e = parseFloat(this._domMeasurement.getStyle(this._wrapper, "margin-top"));
            (e += l / t.y), this._domMeasurement.setStyles(this._wrapper, { "margin-top": e + "px" }, !0);
        }
        const a = s.left - r.left;
        if (Math.abs(a) > 0.05) {
            const t = this._domMeasurement.getScaleFactor(this._inputArea.parentElement);
            let e = parseFloat(this._domMeasurement.getStyle(this._wrapper, "margin-left"));
            (e += a / t.x), this._domMeasurement.setStyles(this._wrapper, { "margin-left": e + "px" }, !0);
        }
        const c = this._tweaks.getScrollableElementSize(this._domMeasurement);
        if (this._width !== c.width || this._height !== c.height) {
            (this._width = c.width), (this._height = c.height);
            const t = this._width - s.width;
            t < 1 && t > 0 && (this._width = s.width);
            const e = this._height - s.height;
            e < 1 && e > 0 && (this._height = s.height), this._domMeasurement.setStyles(this._scrollElement, { width: this._width + "px", height: this._height + "px" }, !0), this._updateHighlightedAreas(), this._redraw(!1);
        }
    }
    _updateHighlightedAreas() {
        const t = [];
        for (let e = 0; e < this._width; e += Highlighter.CANVAS_MAX_WIDTH)
            for (let i = 0; i < this._height; i += Highlighter.CANVAS_MAX_HEIGHT) {
                const s = { top: i, right: e + Highlighter.CANVAS_MAX_WIDTH, bottom: i + Highlighter.CANVAS_MAX_HEIGHT, left: e, width: Highlighter.CANVAS_MAX_WIDTH, height: Highlighter.CANVAS_MAX_HEIGHT };
                let h = this._highlightingAreas.find((t) => isRectsEqual(t.cell, s));
                if (!h) {
                    const t = this._inputArea.ownerDocument.createElement("canvas");
                    (t.className = "lt-highlighter__canvas"), (t.width = 0), (t.height = 0), this._domMeasurement.setStyles(t, { display: "none" }), (h = { cell: s, canvas: t, context: t.getContext("2d"), drawnItems: {} });
                }
                t.push(h);
            }
        for (const e of this._highlightingAreas) !t.includes(e) && e.canvas.parentElement && e.canvas.parentElement.removeChild(e.canvas);
        this._highlightingAreas = t;
    }
    _redraw(t = !0) {
        if ((t && this._domMeasurement.clearCache(), !this._highlightingAreas.length)) return;
        this._highlightedText = this._inputAreaWrapper.getText();
        const e = this._getScrollPosition(!0, !1, !1),
            i = this._tweaks.getScrollableElementSize(this._domMeasurement);
        for (const t of this._highlightedBlocks)
            (t.textRanges = this._inputAreaWrapper.getTextRanges(t.offset, t.length)),
                (t.textBoxes = this._domMeasurement.getRelativeTextBoundingBoxes(t.textRanges, this._element, e)),
                t.textBoxes.forEach((t) => {
                    const e = t.width < 10 ? 3 : 1;
                    (t.left = Math.max(0, t.left - e)), (t.right = Math.min(i.width, t.right + e)), (t.width = t.right - t.left), (t.top = Math.max(0, t.top)), (t.bottom = Math.min(i.height, t.bottom)), (t.height = t.bottom - t.top);
                });
        const s = [];
        for (const t of this._highlightedBlocks)
            for (const e of t.textBoxes) {
                if (
                    (t.simulateSelection &&
                        s.push({
                            top: e.bottom - Highlighter.LINE_WIDTH / 2,
                            right: e.right,
                            bottom: e.bottom + Highlighter.LINE_WIDTH / 2,
                            left: e.left,
                            width: e.width,
                            height: Highlighter.LINE_WIDTH,
                            color: t.underlineColor,
                            textBox: e,
                        }),
                    t.isEmphasized)
                ) {
                    const i = e.bottom - Highlighter.LINE_WIDTH / 2;
                    s.push({ top: e.top, right: e.right, bottom: i, left: e.left, width: e.width, height: i - e.top, color: t.backgroundColor, textBox: e });
                }
                if (t.isUnderlined) {
                    let h = e.bottom - Highlighter.LINE_WIDTH / 2,
                        n = e.bottom + Highlighter.LINE_WIDTH / 2;
                    n > i.height && ((h -= 1), (n -= 1)), s.push({ top: h, right: e.right, bottom: n, left: e.left, width: e.width, height: Highlighter.LINE_WIDTH, color: t.underlineColor, textBox: e });
                }
            }
        for (const t of this._highlightingAreas) {
            const e = s.filter(isRectsIntersect.bind(null, t.cell));
            if (!e.length) {
                delete t.canvasBox, (t.drawnItems = {}), t.canvas.parentElement && t.canvas.parentElement.removeChild(t.canvas);
                continue;
            }
            let i = { top: Number.MAX_VALUE, right: 0, bottom: 0, left: Number.MAX_VALUE, width: 0, height: 0 };
            for (const t of e)
                (i.top = Math.min(i.top, t.top, t.textBox.top)), (i.right = Math.max(i.right, t.right, t.textBox.right)), (i.bottom = Math.max(i.bottom, t.bottom, t.textBox.bottom)), (i.left = Math.min(i.left, t.left, t.textBox.left));
            (i.top = Math.max(t.cell.top, i.top)),
                (i.right = Math.min(t.cell.right, i.right)),
                (i.bottom = Math.min(t.cell.bottom, i.bottom)),
                (i.left = Math.max(t.cell.left, i.left)),
                (i.width = i.right - i.left),
                (i.height = i.bottom - i.top);
            const h = !t.canvasBox || t.canvasBox.width < i.width || t.canvasBox.height < i.height || (t.canvasBox.width * t.canvasBox.height) / (i.width * i.height) >= 2,
                n = !h && !isRectContainsRect(t.canvasBox, i);
            if (h) {
                const e = !t.canvasBox || t.canvasBox.top !== i.top || t.canvasBox.left !== i.left;
                (t.canvas.width = i.width),
                    (t.canvas.height = i.height),
                    (t.canvasBox = i),
                    (t.drawnItems = {}),
                    e && this._domMeasurement.setStyles(t.canvas, { top: t.canvasBox.top + "px", left: t.canvasBox.left + "px" }, !0),
                    t.canvas.parentElement || this._scrollElement.appendChild(t.canvas);
            } else
                n &&
                    ((t.canvasBox.top = i.top),
                    (t.canvasBox.right = i.left + t.canvasBox.width),
                    (t.canvasBox.bottom = i.top + t.canvasBox.height),
                    (t.canvasBox.left = i.left),
                    this._domMeasurement.setStyles(t.canvas, { top: t.canvasBox.top + "px", left: t.canvasBox.left + "px" }, !0));
            let o = {};
            for (const i of e) {
                const e = Math.max(i.left - t.canvasBox.left, 0),
                    s = Math.min(i.right - t.canvasBox.left, t.canvasBox.width),
                    h = Math.max(i.top - t.canvasBox.top, 0),
                    n = { x: e, y: h, w: s - e, h: Math.min(i.bottom - t.canvasBox.top, t.canvasBox.height) - h, c: i.color };
                o[JSON.stringify(n)] = n;
            }
            let r = [],
                l = !1;
            for (const e in o) t.drawnItems[e] ? delete t.drawnItems[e] : (r.push(o[e]), (l = !0));
            let a = Object.values(t.drawnItems);
            const c = a.length;
            if ((c > 0 && (l = !0), c > 20 && ((t.canvas.width = t.canvasBox.width), (r = Object.values(o)), (a = []), (l = !0)), (t.drawnItems = o), l)) {
                for (const e of a) {
                    t.context.clearRect(e.x, e.y, e.w, e.h);
                    const i = { left: e.x, top: e.y, right: e.x + e.w, bottom: e.y + e.h };
                    for (const t in o) {
                        if (isRectsIntersect(i, { left: o[t].x, top: o[t].y, right: o[t].x + o[t].w, bottom: o[t].y + o[t].h })) {
                            const e = Math.max(o[t].x, i.left),
                                s = Math.min(o[t].x + o[t].w, i.right),
                                h = Math.max(o[t].y, i.top),
                                n = { x: e, y: h, w: s - e, h: Math.min(o[t].y + o[t].h, i.bottom) - h, c: o[t].c };
                            r.some((t) => t.x === n.x && t.y === n.y && t.w === n.w && t.h === n.h && t.c === n.c) || r.push(n);
                        }
                    }
                }
                for (const t of r) {
                    const e = { left: t.x, top: t.y, right: t.x + t.w, bottom: t.y + t.h };
                    let i = !1;
                    for (const s in o) {
                        if (t === o[s]) {
                            i = !0;
                            continue;
                        }
                        if (!i) continue;
                        if (isRectsIntersect(e, { left: o[s].x, top: o[s].y, right: o[s].x + o[s].w, bottom: o[s].y + o[s].h })) {
                            const t = Math.max(o[s].x, e.left),
                                i = Math.min(o[s].x + o[s].w, e.right),
                                h = Math.max(o[s].y, e.top),
                                n = Math.min(o[s].y + o[s].h, e.bottom);
                            r.push({ x: t, y: h, w: i - t, h: n - h, c: o[s].c });
                        }
                    }
                }
                for (const e of r) (t.context.fillStyle = e.c), t.context.fillRect(e.x, e.y, e.w, e.h);
            }
        }
    }
    _applyScrolling() {
        const t = this._getScrollPosition(!1),
            e = -t.top + "px",
            i = -t.left + "px";
        this._domMeasurement.setStyles(this._scrollElement, { top: e, left: i }, !0);
    }
    _disableHighlighting() {
        this._isHighlightingDisabled || ((this._isHighlightingDisabled = !0), this._wrapper && this._wrapper.classList.add("lt-highlighter__wrapper-unvisible"));
    }
    _enableHighlighting() {
        this._isHighlightingDisabled && ((this._isHighlightingDisabled = !1), this._wrapper && (this._render(), this._wrapper.classList.remove("lt-highlighter__wrapper-unvisible")));
    }
    _onScrollableElementScroll() {
        if (!this._container) return;
        const t = Date.now(),
            e = this._isHighlightingDisabled || (!!this._tweaks.scrollingThrottleLimit && t - this._lastScrollingTimeStamp < this._tweaks.scrollingThrottleLimit);
        (this._lastScrollingTimeStamp = t),
            e
                ? (this._disableHighlighting(), this._enableHighlightingDebounce.call())
                : window.requestAnimationFrame(() => {
                      this._applyScrolling();
                  });
    }
    _onCEElementClick(t) {
        const e = 0 === t.button;
        if ("click" !== t.type && !e) return;
        if (t.detail === GoogleDocs.MOUSE_EVENT_DETAIL) return;
        if ((this._isMirror && t.stopImmediatePropagation(), !this._container)) return;
        this._domMeasurement.clearCache();
        let i = { x: t.clientX, y: t.clientY };
        i = this._toElementCoordinates(i, this._element);
        let s = this._highlightedBlocks.length;
        for (; s--; ) {
            const t = this._highlightedBlocks[s];
            if (!t.textBoxes) continue;
            const e = t.textBoxes.find((t) => isPointInsideRect(t, i));
            if (e) {
                const i = { highlighter: this, blockId: t.id, clickedBox: this._toPageCoordinates(e, this._element) };
                return void dispatchCustomEvent(document, Highlighter.eventNames.blockClicked, i);
            }
        }
    }
    _onContentChanged(t) {
        if (!this._container) return;
        const e = this._inputAreaWrapper.getText(),
            i = t.some((t) => {
                if (this._tweaks.isMutationIgnored(t)) return !1;
                if ("attributes" === t.type) return !0;
                if (this._isMirror) return !1;
                return !!Array.from(t.addedNodes || []).some((t) => t.nodeType === document.ELEMENT_NODE) || !!Array.from(t.removedNodes || []).some((t) => t.nodeType === document.ELEMENT_NODE);
            });
        (this._highlightedText !== e || i) && this._redraw();
    }
    highlight(t = []) {
        (this._highlightedBlocks = t), this._redraw();
    }
    getTextBoxes(t) {
        const e = this._highlightedBlocks.find((e) => e.id === t);
        return e ? (e.textBoxes || []).map((t) => this._toPageCoordinates(t, this._element)) : [];
    }
    destroy() {
        this._tweaks.removeScrollEventListener(this._onScrollableElementScroll),
            this._element.removeEventListener(this._clickEvent, this._onCEElementClick, !0),
            this._element.removeEventListener(Mirror.eventNames.click, this._onCEElementClick),
            this._contentChangedObserver.disconnect(),
            this._renderInterval && this._renderInterval.destroy(),
            this._container && this._container.remove(),
            this._ceElementResizeObserver && this._ceElementResizeObserver.disconnect(),
            this._domMeasurement.clearCache();
    }
}
(Highlighter.CONTAINER_ELEMENT_NAME = "lt-highlighter"),
    (Highlighter.CANVAS_MAX_WIDTH = 1024),
    (Highlighter.CANVAS_MAX_HEIGHT = 1024),
    (Highlighter.LINE_WIDTH = 2),
    (Highlighter.eventNames = { blockClicked: "lt-highlighter.blockClicked" });
