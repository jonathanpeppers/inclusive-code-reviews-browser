/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
function isCEElement(t) {
    return t instanceof HTMLElement && (t.isContentEditable || ("BODY" === t.nodeName && hasFirefoxDesignMode(t)));
}
function isFormElement(t) {
    return isTextArea(t) || isTextInput(t);
}
function isTextArea(t) {
    return t instanceof HTMLTextAreaElement;
}
function isTextInput(t) {
    return t instanceof HTMLInputElement && ("text" === t.type || "search" === t.type);
}
function isElementNode(t) {
    return t.nodeType === Node.ELEMENT_NODE;
}
function isTextNode(t) {
    return t.nodeType === Node.TEXT_NODE;
}
function wait(t = 25, e = null) {
    return new Promise((n) => setTimeout(() => n(e), t));
}
function setAnimationFrameTimeout(t, e) {
    let n = null,
        o = !1;
    const r = window.setTimeout(() => {
        o || (n = window.requestAnimationFrame(() => t()));
    }, e);
    return {
        destroy: () => {
            (o = !0), window.clearTimeout(r), n && window.cancelAnimationFrame(n);
        },
    };
}
function setAnimationFrameInterval(t, e) {
    let n = null,
        o = !1;
    const r = () => {
        n = setAnimationFrameTimeout(() => {
            o || (t(), r());
        }, e);
    };
    return (
        r(),
        {
            destroy: () => {
                (o = !0), n && (n.destroy(), (n = null));
            },
        }
    );
}
function isIntersect(t, e, n, o, r = !1) {
    return r ? t <= o && e >= n : t < o && e > n;
}
function compareNumberAndSegment(t, e, n, o = !1) {
    if (o) {
        if (e <= t && t < n) return 0;
    } else if (e <= t && t <= n) return 0;
    return t - e;
}
function compareSegments(t, e, n = !1) {
    return isIntersect(t.start, t.end, e.start, e.end, n) ? 0 : t.start - e.start;
}
function isRectsEqual(t, e) {
    return t.top === e.top && t.right === e.right && t.bottom === e.bottom && t.left === e.left;
}
function isRectContainsRect(t, e) {
    return t.left <= e.left && t.right >= e.right && t.top <= e.top && t.bottom >= e.bottom;
}
function isRectsIntersect(t, e) {
    return !(t.left > e.right || t.right < e.left || t.top > e.bottom || t.bottom < e.top);
}
function isPointInsideRect(t, e, n) {
    return void 0 === n && ((n = e.y), (e = e.x)), t.left <= e && e <= t.right && t.top <= n && n <= t.bottom;
}
function createContainerElement(t, e) {
    const n = t.createElement(e);
    return n.setAttribute("contenteditable", "false"), navigator.userAgent.includes("Mac OS") && n.classList.add("lt--mac-os"), n;
}
function contains(t, e) {
    return "object" == typeof e ? t !== e && t.contains(e) : t instanceof Element && !!t.querySelector(e);
}
function closestElement(t, e) {
    if (t.closest) return t.closest(e);
    {
        let n = t;
        for (; n; ) {
            if (n.matches(e)) return n;
            n = n.parentElement;
        }
    }
    return null;
}
function getCommonParent(t, e) {
    let n = t.parentElement;
    for (; n; ) {
        if (contains(n, e)) return n;
        n = n.parentElement;
    }
    return null;
}
function hasTextNodeChildWithContent(t) {
    return Array.from(t.childNodes).some((t) => Boolean(t.nodeType === Node.TEXT_NODE && t.nodeValue && t.nodeValue.trim()));
}
function getFrameElement(t) {
    return t.frameElement;
}
function isScrollable(t) {
    const e = window.getComputedStyle(t);
    return "auto" === e.overflowY || "scroll" === e.overflowY;
}
function hasFirefoxDesignMode(t) {
    return Boolean(t.ownerDocument && "on" === t.ownerDocument.designMode && "read-write" === t.ownerDocument.defaultView.getComputedStyle(t)["-moz-user-modify"]);
}
function hasFocus(t) {
    return t.matches(":focus") || ("BODY" === t.nodeName && hasFirefoxDesignMode(t) && t.ownerDocument.hasFocus());
}
const getVisibleTopAndBottom = (() => {
    const t = (t, e, n, o) => {
        const r = t.ownerDocument;
        let i = r.elementFromPoint(n, o);
        if (!i) return !1;
        if (t === i || t.contains(i)) return !0;
        if (!e.length) return !1;
        const s = e.find((t) => t.contains(i));
        return s && (i = r.elementsFromPoint(n, o).find((t) => !s.contains(t)) || null), Boolean(i && (t === i || t.contains(i)));
    };
    return (e, n, o, r) => {
        const i = n.getPaddingBox(e, !1);
        if (i.bottom < 0 || i.top > o) return { top: 0, bottom: i.height };
        let s = [];
        r && (s = Array.from(e.ownerDocument.querySelectorAll(r)));
        let a = i.left + Math.round((i.width / 100) * 33);
        const l = Math.max(i.top, 0);
        let c = l;
        for (;;) {
            if (t(e, s, a, c)) {
                if (c === l) break;
                for (; c--; )
                    if (!t(e, s, a, c)) {
                        c++;
                        break;
                    }
                break;
            }
            if (c === i.bottom) break;
            c = Math.min(i.bottom, c + 6);
        }
        const u = Math.min(i.bottom, o);
        let f = u;
        for (;;) {
            if (t(e, s, a, f - 1)) {
                if (f === u) break;
                for (; f++ < u; )
                    if (!t(e, s, a, f - 1)) {
                        f--;
                        break;
                    }
                break;
            }
            if (f === c) break;
            f = Math.max(c, f - 6);
        }
        return { top: Math.round(Math.max(0, c - i.top)), bottom: Math.round(Math.max(0, f - i.top)) };
    };
})();
function isVisible(t) {
    return (t.offsetWidth > 0 || t.offsetHeight > 0) && "hidden" !== new DomMeasurement(document).getStyle(t, "visibility");
}
function fadeOut(t, e) {
    let n = 1;
    const o = new DomMeasurement(t.ownerDocument),
        r = setAnimationFrameInterval(() => {
            if ((n -= 0.08) <= 0) return r.destroy(), void (e && e());
            o.setStyles(t, { opacity: n + " !important" });
        }, 16);
}
function fadeOutAndRemove(t, e) {
    let n = 1;
    const o = new DomMeasurement(t.ownerDocument),
        r = setAnimationFrameInterval(() => {
            if ((n -= 0.08) <= 0) return t.remove(), r.destroy(), void (e && e());
            o.setStyles(t, { opacity: n + " !important" });
        }, 16);
}
function dispatchCustomEvent(t, e, n = {}) {
    const o = new CustomEvent(e, { detail: n });
    t.dispatchEvent(o);
}
function addUseCaptureEvent(t, e, n) {
    const o = t instanceof HTMLDocument ? t : t.ownerDocument,
        r = (e) => {
            if (!e.target) return;
            const o = e.target;
            (isElementNode(o) || isTextNode(o)) && t.contains(o) && n(e);
        };
    return (
        o.defaultView.addEventListener(e, r, !0),
        {
            destroy() {
                o.defaultView.removeEventListener(e, r, !0);
            },
        }
    );
}
function observeScrollableAncestors(t, e) {
    const n = new DomMeasurement(t.ownerDocument);
    const o = (function (t) {
        const e = [];
        let o = t.parentElement;
        for (; o && o !== document.body && o !== document.documentElement; ) {
            const t = n.getStyles(o, ["overflow-x", "overflow-y"]),
                r = t["overflow-x"],
                i = t["overflow-y"];
            ("auto" !== i && "scroll" !== i && "auto" !== r && "scroll" !== r) || e.push(o), (o = o.parentElement);
        }
        return e;
    })(t);
    let r = !1;
    const i = () => {
        r ||
            ((r = !0),
            window.requestAnimationFrame(() => {
                (r = !1), e();
            }));
    };
    return (
        o.forEach((t) => {
            t.addEventListener("scroll", i);
        }),
        {
            destroy() {
                o.forEach((t) => {
                    t.removeEventListener("scroll", i);
                }),
                    (r = !0);
            },
        }
    );
}
const onElementDisabled = (() => {
        let t;
        const e = [];
        return (n, o) => {
            e.push({ element: n, callback: o }),
                (t =
                    t ||
                    window.setInterval(() => {
                        const n = [];
                        e.forEach((t) => {
                            (t.element.readOnly || t.element.disabled || !isVisible(t.element)) && (n.push(t), t.callback(t.element));
                        }),
                            n.forEach((t) => {
                                e.splice(e.indexOf(t), 1);
                            }),
                            e.length || (clearInterval(t), (t = null));
                    }, 600));
        };
    })(),
    onElementRemoved = (() => {
        let t;
        const e = [];
        return (n, o) => {
            e.push({ element: n, callback: o }),
                t ||
                    (t = new MutationObserver((n) => {
                        const o = [];
                        e.forEach((t) => {
                            n.find((e) => Array.prototype.indexOf.call(e.removedNodes, t.element) > -1) && (o.push(t), t.callback(t.element));
                        }),
                            o.forEach((t) => {
                                e.splice(e.indexOf(t), 1);
                            }),
                            e.length || (t.disconnect(), (t = null));
                    })).observe(document.documentElement, { childList: !0, subtree: !0 });
        };
    })();
let getWordPosition, getWordContext;
function getValuableText(t, e) {
    if (0 === e.length) return { text: t, originalText: t, usedParts: [{ start: 0, end: t.length, originalStart: 0, originalEnd: t.length, posDiff: 0, length: t.length, text: t }], ignoredParts: [] };
    e.sort((t, e) => t.offset - e.offset);
    let n = 0;
    for (; n < e.length - 1; ) {
        const t = e[n],
            o = e[n + 1];
        void 0 === t.replacingText && void 0 === o.replacingText ? (t.offset + t.length < o.offset ? n++ : ((e[n] = { offset: t.offset, length: Math.max(t.offset + t.length, o.offset + o.length) - t.offset }), e.splice(n + 1, 1))) : n++;
    }
    const o = [];
    let r = 0,
        i = 0;
    for (const n of e) {
        if (i < n.offset) {
            const e = n.offset - i;
            o.push({ start: r, end: r + e, originalStart: i, originalEnd: i + e, posDiff: i - r, length: e, text: t.substr(i, e) }), (r += e);
        }
        if (void 0 !== n.replacingText) {
            let t = n.offset;
            void 0 !== n.offsetShift && (t += n.offsetShift),
                o.push({ start: r, end: r + n.length, originalStart: t, originalEnd: t + n.length, posDiff: t - r, length: n.length, text: n.replacingText.padEnd(n.length, " ") }),
                (r += n.length);
        }
        i = n.offset + n.length;
    }
    if (i < t.length) {
        const e = t.length - i;
        o.push({ start: r, end: r + e, originalStart: i, originalEnd: i + e, posDiff: i - r, length: e, text: t.substr(i) });
    }
    return { text: o.map((t) => t.text).join(""), originalText: t, usedParts: o, ignoredParts: e.map((t) => ({ start: t.offset, end: t.offset + t.length, length: t.length })) };
}
function getTextsDiff(t, e) {
    if (t === e) return null;
    let n = 0;
    const o = Math.max(t.length, e.length);
    for (n = 0; n < o && t[n] === e[n]; n++);
    let r = 0;
    const i = Math.min(t.length, e.length);
    for (; n + r < i; ) {
        if (t[t.length - r - 1] !== e[e.length - r - 1]) break;
        r++;
    }
    return { from: n, oldFragment: t.substring(n, t.length - r), newFragment: e.substring(n, e.length - r) };
}
function isTextsCompletelyDifferent(t, e) {
    const n = t.split("\n"),
        o = e.split("\n");
    for (const t of n) if (o.some((e) => e === t)) return !1;
    return !0;
}
function getParagraphsDiff(t, e) {
    const n = [],
        o = t.split("\n"),
        r = e.split("\n");
    let i = 0;
    const s = Math.max(o.length, r.length);
    for (i = 0; i < s && o[i] === r[i]; i++);
    let a = 0;
    const l = Math.min(o.length, r.length);
    for (; i + a < l; ) {
        if (o[o.length - a - 1] !== r[r.length - a - 1]) break;
        a++;
    }
    let c = 0;
    for (let t = 0; t < i; t++) c += o[t].length + 1;
    let u = c;
    for (let t = i; t < s - a; t++) {
        const e = t < o.length - a ? o[t] : null,
            i = t < r.length - a ? r[t] : null;
        (e === i && c === u) || n.push({ oldText: e, newText: i, oldOffset: c, newOffset: u, textDiff: getTextsDiff(e || "", i || "") }), null !== e && (c += e.length + 1), null !== i && (u += i.length + 1);
    }
    if (c !== u)
        for (let t = a - 1; t >= 0; t--) {
            const e = o[o.length - t - 1],
                i = r[r.length - t - 1];
            n.push({ oldText: e, newText: i, oldOffset: c, newOffset: u, textDiff: null }), (c += e.length + 1), (u += i.length + 1);
        }
    return n;
}
function matchAll(t, e, n = 0) {
    const o = [];
    e.lastIndex = n;
    let r = e.exec(t);
    for (; r; ) o.push(r), (r = e.exec(t));
    return o;
}
function isCapitalized(t) {
    const e = t.charAt(0);
    return e.toUpperCase() === e;
}
function startsWithUppercase(t) {
    const e = t.charAt(0);
    return e === e.toUpperCase() && e !== e.toLowerCase();
}
!(function () {
    let t, e, n;
    const o = /(?:\S+\s+){0,4}\S+$/,
        r = /^\S+(?:\s+\S+){0,4}/;
    try {
        (t = new RegExp("\\p{L}", "iu")), (e = new RegExp("^\\s*(-?\\p{L}+)*-?\\s*$", "iu")), (n = new RegExp("^\\s*\\p{L}+(-\\p{L}+)*\\s*$", "iu"));
    } catch (o) {
        (t = /[a-zäöüß]/i), (e = /^\s*(-?[a-zäöüß]+)*-?\s*$/i), (n = /^\s*[a-zäöüß]+(-[a-zäöüß]+)*\s*$/i);
    }
    (getWordPosition = (o, r, i = r) => {
        const s = o.substring(r, i);
        if (!e.test(s)) return null;
        let a = 0 === s.length || t.test(s[0]),
            l = "-" === s[0],
            c = r;
        if (a || l)
            for (; c > 0; ) {
                const e = o[c - 1],
                    n = t.test(e),
                    r = "-" === e;
                if (!n && !r) break;
                if (r && l) return null;
                c--, (a = n), (l = r);
            }
        (a = t.test(s[s.length - 1])), (l = s.endsWith("-"));
        let u = i;
        if (a || l)
            for (; u < o.length; ) {
                const e = o[u],
                    n = t.test(e),
                    r = "-" === e;
                if (!n && !r) break;
                if (r && l) return null;
                u++, (a = n), (l = r);
            }
        const f = s.match(/\s+$/);
        f && (u -= f[0].length);
        const d = o.substring(c, u);
        return n.test(d) ? { start: c, end: u } : null;
    }),
        (getWordContext = (t, e, n) => {
            const i = getWordPosition(t, e, n);
            if (!i) return null;
            const s = o.exec(t.substring(0, i.start).trim()),
                a = s ? s[0] : "",
                l = r.exec(t.substring(i.end).trim()),
                c = l ? l[0] : "";
            return { word: t.substring(i.start, i.end), position: i, beforeText: a, afterText: c };
        });
})();
const isAllUppercase = (function () {
    const t = /^[A-ZÈÉÊÁÀÂÓÒÔÚÙÛÍÌÎÄÜÖ]+[A-ZÈÉÊÁÀÂÓÒÔÚÙÛÍÌÎÄÜÖ\-!?#@=%().:;<>'’´`"”“*+,\s]+[A-ZÈÉÊÁÀÂÓÒÔÍÌÎÄÜÖ]$/;
    return function (e) {
        return t.test(e);
    };
})();
function toLowercaseFirstChar(t) {
    return t.charAt(0).toLowerCase() + t.substr(1);
}
function includesWhiteSpace(t) {
    return /\s/.test(t);
}
let isWhiteSpace, normalizeWhiteSpaces, isZWC, indexOfZWC, removeZWC;
function escapeHTML(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/`/g, "&#x60;").replace(/\//g, "&#x2F;");
}
function translateElement(t, e) {
    "string" == typeof t && (t = document.querySelector(t)),
        "string" == typeof e && (e = { key: e }),
        e.isHTML ? (t.innerHTML = i18nManager.getMessage(e.key, e.interpolations)) : e.attr ? (t[e.attr] = i18nManager.getMessage(e.key, e.interpolations)) : (t.textContent = i18nManager.getMessage(e.key, e.interpolations));
}
function translateSection(t) {
    Array.from(t.querySelectorAll("[data-t]")).forEach((t) => {
        translateElement(t, t.getAttribute("data-t"));
    }),
        Array.from(t.querySelectorAll("[data-t-placeholder]")).forEach((t) => {
            translateElement(t, { key: t.getAttribute("data-t-placeholder"), attr: "placeholder" });
        }),
        Array.from(t.querySelectorAll("[data-t-html]")).forEach((t) => {
            translateElement(t, { key: t.getAttribute("data-t-html"), isHTML: !0 });
        }),
        Array.from(t.querySelectorAll("[data-t-title]")).forEach((t) => {
            translateElement(t, { key: t.getAttribute("data-t-title"), attr: "title" });
        });
}
function openPopup(t, e, n) {
    const o = void 0 !== window.screenLeft ? window.screenLeft : window.screenX,
        r = void 0 !== window.screenTop ? window.screenTop : window.screenY,
        i = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
        s = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
        a = i / window.screen.availWidth,
        l = (i - e) / 2 / a + o,
        c = (s - n) / 2 / a + r;
    return window.open(t, Date.now().toString(), `\n      scrollbars=yes,\n\t  resizable=yes,\n      width=${e / a},\n      height=${n / a},\n      top=${c},\n      left=${l}\n      `);
}
function binarySearch(t, e) {
    let n = 0,
        o = t.length - 1;
    for (; n <= o; ) {
        const r = n + Math.ceil((o - n) / 2),
            i = e(t[r]);
        if (i > 0) n = r + 1;
        else {
            if (!(i < 0)) {
                for (let n = r; n > 0; n--) if (0 !== e(t[n - 1])) return t[n];
                return t[0];
            }
            o = r - 1;
        }
    }
    return null;
}
function binarySearchIndex(t, e) {
    let n = 0,
        o = t.length - 1;
    for (; n <= o; ) {
        const r = n + Math.ceil((o - n) / 2),
            i = t[r];
        if (i < e) n = r + 1;
        else {
            if (!(i > e)) {
                for (let n = r; n > 0; n--) if (t[n - 1] !== e) return n;
                return 0;
            }
            o = r - 1;
        }
    }
    return -1;
}
function getRandomNumberInRange(t, e) {
    return (t = Math.ceil(t)), (e = Math.floor(e)), Math.floor(Math.random() * (e - t + 1)) + t;
}
function uniq(t) {
    const e = [];
    return (
        t.forEach((t) => {
            -1 === e.indexOf(t) && e.push(t);
        }),
        e
    );
}
function isSameObjects(t, e) {
    return t === e || JSON.stringify(t) === JSON.stringify(e);
}
function clone(t) {
    if (null === t || "object" != typeof t) return t;
    if (t instanceof Date) return new Date(t);
    if (t instanceof RegExp) return new RegExp(t);
    const e = Array.isArray(t) ? [] : {};
    for (const n in t) e[n] = clone(t[n]);
    return e;
}
function waitFor(t, e = 400, n = 15) {
    return new Promise((o, r) => {
        let i = 0;
        const s = () => {
                const e = t();
                null !== e && void 0 !== e && (clearInterval(a), o(e)), ++i >= n && (clearInterval(a), r());
            },
            a = setInterval(s, e);
        s();
    });
}
function getRangeAtPoint(t) {
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(t.x, t.y);
    if (document.caretPositionFromPoint) {
        const e = document.caretPositionFromPoint(t.x, t.y);
        if (!e || !e.offsetNode) return null;
        try {
            const t = new Range();
            return t.setStart(e.offsetNode, e.offset), t.setEnd(e.offsetNode, e.offset), t;
        } catch (t) {
            return null;
        }
    }
    return null;
}
function isSameRange(t, e) {
    return !(!t || !e || t.startContainer !== e.startContainer || t.startOffset !== e.startOffset || t.endOffset !== e.endOffset || t.endContainer !== e.endContainer);
}
function getSelectedText() {
    const t = document.activeElement,
        e = t ? t.tagName.toLowerCase() : null;
    return "textarea" === e || ("input" === e && /^(?:text|search|password|tel|url)$/i.test(t.type) && "number" == typeof t.selectionStart)
        ? t.value.slice(t.selectionStart, t.selectionEnd)
        : window.getSelection && window.getSelection()
        ? window.getSelection().toString()
        : "";
}
function loadHTML(t) {
    const e = EnvironmentAdapter.getURL(t);
    return fetch(e).then((t) => t.text());
}
function loadStylesheet(t) {
    const e = document.createElement("link");
    (e.rel = "stylesheet"), (e.type = "text/css"), (e.href = EnvironmentAdapter.getURL(t)), (document.head || document.body).appendChild(e);
}
function createStylesheet(t) {
    const e = document.createElement("style");
    return (e.type = "text/css"), e.appendChild(document.createTextNode(t)), (document.head || document.body).appendChild(e), e;
}
function generateStackTrace(t) {
    if (!t.stack) return;
    let e = [];
    if (
        (t.stack.split(/\n/).forEach((t) => {
            const n = t.match(/([\w_<>]+)\s+\(.+?([\w_\-]+\.(js|html))/);
            n && e.push(`${n[2]}:${n[1]}`);
        }),
        !e.length)
    ) {
        const n = t.stack.match(/([\w_\-]+\.(js|html))/);
        n && e.push(n[1]);
    }
    return e.join(",").substr(0, 140);
}
function isLTAvailable(t) {
    try {
        return t.document.documentElement.hasAttribute("data-lt-installed");
    } catch (t) {}
    return !1;
}
function isCssContentScriptsLoaded(t) {
    const e = t.document.createElement("div");
    (e.className = "lt-test-element"), t.document.documentElement.appendChild(e);
    const n = "absolute" === t.getComputedStyle(e).position;
    return e.remove(), n;
}
function getCountdown(t) {
    let e = t - Date.now();
    e < 0 && (e = 0);
    const n = Math.floor((e / 1e3) % 60),
        o = Math.floor((e / 1e3 / 60) % 60);
    return `${pad(Math.floor(e / 1e3 / 60 / 60))}:${pad(o)}:${pad(n)}`;
}
function pad(t) {
    const e = t.toString();
    return 1 === e.length ? "0" + e : e;
}
!(function () {
    const t = new RegExp("^[\b\t          ‏　]$"),
        e = new RegExp("[\b\t          ‏　]", "g");
    (isWhiteSpace = function (e) {
        return t.test(e);
    }),
        (normalizeWhiteSpaces = function (t) {
            return t.replace(e, " ");
        });
})(),
    (function () {
        const t = new RegExp("^[​‌‍­]$"),
            e = new RegExp("[​‌‍­]"),
            n = new RegExp("[​‌‍­]", "g");
        (isZWC = function (e) {
            return t.test(e);
        }),
            (indexOfZWC = function (t) {
                const n = t.match(e);
                return n ? n.index : -1;
            }),
            (removeZWC = function (t) {
                return t.replace(n, "");
            });
    })();
const goToManagedLogin = (function () {
        let t,
            e = null;
        const n = (e) => {
            e.origin.match(/^chrome|moz|safari/) && t(e.data);
        };
        return function (o, r) {
            const i = window;
            let s = null;
            t = function (t) {
                const [e, n] = JSON.parse(t);
                e && n && (a(), r(e, n));
            };
            const a = function () {
                e && window.clearInterval(e), i.removeEventListener("message", n);
                try {
                    browser.storage.local.remove("managedLoginCredentials");
                } catch (t) {}
                try {
                    s && s.close();
                } catch (t) {}
            };
            a(),
                (e = window.setInterval(() => {
                    browser.storage.local
                        .get("managedLoginCredentials")
                        .then((e) => {
                            e.managedLoginCredentials && t(e.managedLoginCredentials);
                        })
                        .catch(() => null);
                }, 400)),
                i.addEventListener("message", n);
            const l = browser.runtime.getURL("/privacyConfirmationDialog/managedLoginRedirectUri.html"),
                c = o + (o.includes("?") ? "&" : "?") + "redirect_uri=" + encodeURIComponent(l);
            s = openPopup(c, 640, 480);
        };
    })(),
    goToLogin = (function () {
        let t,
            e = null;
        const n = (e) => {
            t(e.data);
        };
        return function (o, r) {
            const i = window;
            let s = null;
            t = function (t) {
                const [e, n] = JSON.parse(t);
                e && n && (a(), r(e, n));
            };
            const a = function () {
                e && window.clearInterval(e), i.removeEventListener("message", n);
                try {
                    browser.storage.local.remove("loginCredentials");
                } catch (t) {}
                try {
                    s && s.close();
                } catch (t) {}
            };
            a(),
                (e = window.setInterval(() => {
                    browser.storage.local
                        .get("loginCredentials")
                        .then((e) => {
                            e.loginCredentials && t(e.loginCredentials);
                        })
                        .catch(() => null);
                }, 400)),
                i.addEventListener("message", n);
            const l = browser.runtime.getURL("/privacyConfirmationDialog/loginRedirectUri.html"),
                c = o + (o.includes("?") ? "&" : "?") + "callback_uri=" + encodeURIComponent(l);
            s = openPopup(c, 640, 480);
        };
    })();
function dataURItoBlob(t) {
    const e = atob(t.split(",")[1]),
        n = t.split(",")[0].split(":")[1].split(";")[0],
        o = new ArrayBuffer(e.length),
        r = new Uint8Array(o);
    for (let t = 0; t < e.length; t++) r[t] = e.charCodeAt(t);
    return new Blob([o], { type: n });
}
const getColorLuminosity = (function () {
    const t = / /g,
        e = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
        n = /^#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})$/i,
        o = /^rgba?\(/i,
        r = /rgba?\((\d+),(\d+),(\d+)/i,
        i = /^hsla?\(/i,
        s = /hsla?\(\d+,\d+%,(\d+)%/i;
    function a(t, e, n) {
        const o = Math.max(t, e, n) / 255,
            r = Math.min(t, e, n) / 255;
        return Math.round(((o + r) / 2) * 100);
    }
    return function (l) {
        if ("string" != typeof l) return a(l[0], l[1], l[2]);
        if (((l = l.replace(t, "")), e.test(l))) {
            const t = n.exec(l);
            if (t) {
                return a(parseInt(2 === t[1].length ? t[1] : t[1] + t[1], 16), parseInt(2 === t[2].length ? t[2] : t[2] + t[2], 16), parseInt(2 === t[3].length ? t[3] : t[3] + t[3], 16));
            }
        } else if (o.test(l)) {
            const t = r.exec(l);
            if (t) {
                return a(+t[1], +t[2], +t[3]);
            }
        } else if (i.test(l)) {
            const t = s.exec(l);
            if (t) return +t[1];
        }
        return 100;
    };
})();
function isCKEditor(t) {
    return t.classList.contains("cke_editable");
}
function isSlateEditor(t) {
    return t.hasAttribute("data-slate-editor");
}
function isWriterDuet(t) {
    return location.href.includes("writerduet.com");
}
function isQuillEditor(t) {
    return t.classList.contains("ql-editor");
}
function isOpenXchangeEditor(t) {
    return !!t.closest("[data-app-name='io.ox/office/text']");
}
function isProseMirror(t) {
    return t.classList.contains("ProseMirror");
}
function isGutenberg(t) {
    return t.classList.contains("editor-rich-text__editable") || t.classList.contains("block-editor-rich-text__editable");
}
function isTrixEditor(t) {
    return "trix-editor" === t.nodeName.toLowerCase();
}
function isGoogleDocsEditor(t) {
    return t.classList.contains("kix-page");
}
function isLTEditor(t) {
    return t.classList.contains("lt-textarea__textarea");
}
function isCodeMirror(t) {
    return t.classList.contains("CodeMirror-code");
}
function getCurrentUrl() {
    if ("about:blank" === location.href || "about:srcdoc" === location.href)
        try {
            return window.parent.location.href;
        } catch (t) {}
    return location.href;
}
function getDomain(t, e = t) {
    t && !/^([a-z\-]+:\/\/)/i.test(t) && (t = "http://" + t);
    try {
        return new URL(t).hostname;
    } catch (t) {
        return e;
    }
}
function getCurrentDomain() {
    const t = document.location || document.defaultView.location;
    if (t && t.hostname) return t.hostname.replace(/^www\./, "");
    try {
        return window.parent.location.hostname.replace(/^www\./, "");
    } catch (t) {}
    return "";
}
function formatNumber(t, e) {
    return t.toLocaleString(e);
}
function getMainPageDomain() {
    let t;
    return window.parent !== window && document.referrer && (t = getDomain(document.referrer)), t || (t = getCurrentDomain()), t;
}
function getSubdomains(t) {
    const e = [t];
    for (; t.split(".").length > 2; ) {
        const n = t.indexOf(".");
        (t = t.substr(n + 1)), e.push(t);
    }
    return e;
}
const getAutoLoginUrl = function (t, e, n) {
    let o = `https://languagetool.org/webextension/login?email=${encodeURIComponent(t)}&addon_token=${encodeURIComponent(e)}`;
    return n && (o += `&temp_text_id=${encodeURIComponent(n)}`), o;
};
function isErrorIgnoredByDictionary(t, e) {
    if (!t.isSpellingError) return !1;
    let n = t.originalPhrase;
    if ((/^\w+\.$/.test(n) && (n = n.substring(0, n.length - 1)), e.includes(n))) return !0;
    if (startsWithUppercase(n)) {
        const t = toLowercaseFirstChar(n);
        if (e.includes(t)) return !0;
    }
    return !1;
}
function isErrorRuleIgnored(t, e) {
    const n = LanguageManager.getPrimaryLanguageCode(t.language.code);
    return e.some((e) => {
        return !(e.id !== t.rule.id || ("*" !== e.language && e.language !== n)) && (!e.phrase || e.phrase.toLowerCase() === t.originalPhrase.toLowerCase());
    });
}
"undefined" != typeof module &&
    ((module.exports.getWordPosition = getWordPosition),
    (module.exports.getWordContext = getWordContext),
    (module.exports.matchAll = matchAll),
    (module.exports.getDomain = getDomain),
    (module.exports.getSubdomains = getSubdomains),
    (module.exports.getValuableText = getValuableText),
    (module.exports.isIntersect = isIntersect),
    (module.exports.compareSegments = compareSegments),
    (module.exports.binarySearch = binarySearch),
    (module.exports.binarySearchIndex = binarySearchIndex),
    (module.exports.getColorLuminosity = getColorLuminosity));
