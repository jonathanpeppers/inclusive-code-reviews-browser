/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class TweaksManager {
    static _isElementCompatibleForGoogleServices(e) {
        return !e.closest("uf-describe-page") && TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
    }
    static _splitExcludedPart(e, t, a) {
        const r = [],
            n = e.substr(t, a);
        let s = 0,
            o = n.indexOf("\n");
        for (; - 1 !== o;) r.push({
            offset: t + s,
            length: o - s
        }), s = o + 1, o = n.indexOf("\n", o + 1);
        return r.push({
            offset: t + s,
            length: n.length - s
        }), r
    }
    static _getExcludedParts(e, t) {
        const a = [];
        for (const r of t) {
            const t = matchAll(e, r.pattern);
            for (const n of t) {
                let t = n.index;
                if (void 0 === r.excludedParts) {
                    const s = n[0].length;
                    r.preserveNewlineChars ? a.push(...TweaksManager._splitExcludedPart(e, t, s)) : a.push({
                        offset: t,
                        length: s
                    })
                } else
                    for (let s = 0; s < r.excludedParts.length; s++) {
                        if (void 0 === n[s + 1]) continue;
                        const o = n[s + 1].length,
                            i = r.excludedParts[s];
                        ("boolean" == typeof i ? i : i.test(n[s + 1])) && (r.preserveNewlineChars ? a.push(...TweaksManager._splitExcludedPart(e, t, o)) : a.push({
                            offset: t,
                            length: o
                        })), t += o
                    }
            }
        }
        return a
    }
    static _getEmail(e) {
        const t = TweaksManager.EMAIL_REGEXP.exec(e);
        return t ? t[0].replace(TweaksManager.EMAIL_DOMAIN_REGEXP, "@replaced.domain").trim() : ""
    }
    static _getFullName(e) {
        return e.replace(TweaksManager.EMAIL_REGEXP, "").replace(TweaksManager.ADDRESS_SPECIAL_CHARS_REGEXP, "").trim()
    }
    static getDefaultTweaks() {
        return this.DEFAULT_TWEAKS
    }
    static getTweaks(e) {
        function t(e, t, a = !1) {
            Array.isArray(t) || (t = [t]);
            for (const r of t)
                if ("string" == typeof r) {
                    if (e === r || a && e.startsWith(r)) return !0
                } else if (r.test(e)) return !0;
            return !1
        }
        const a = getDomain(e, "");
        if (!a) return TweaksManager.DEFAULT_TWEAKS;
        const r = getSubdomains(a),
            n = TweaksManager.SITE_TWEAKS.find(a => "hostname" in a.match ? r.some(e => t(e, a.match.hostname)) : "url" in a.match ? t(e, a.match.url) : void 0);
        return Object.assign({}, TweaksManager.DEFAULT_TWEAKS, n)
    }
}
TweaksManager.NON_COMPATIBLE_TAGS = ["TR", "TH", "TD", "THEAD", "TBODY", "TFOOT", "CAPTION", "IFRAME"], TweaksManager.SIGNATURE_ACTIVE_ATTRIBUTE = "data-lt-sig-active", TweaksManager.SIGNATURE_ATTRIBUTE = "data-lt-sig", TweaksManager.INLINE_DISPLAY_VALUES = ["inline", "inline-block"], TweaksManager.TEXT_IGNORING_DEFAULT_RULES = new Map([
    ["QUOTED_LINE", {
        pattern: /^[ \t]*>.*?(\n|$)/gm,
        preserveNewlineChars: !0
    }],
    ["HTML_CODE_BLOCK", {
        pattern: /\s?<code\b[^>]*>[^]*?<\/code>/gi,
        preserveNewlineChars: !0
    }],
    ["HTML_OPENING_TAG", {
        pattern: /<([a-z1-6]{1,10}|[A-Z1-6]{1,10}|[a-zA-Z1-6]+\:[a-zA-Z1-6]+)([ ]+[^>\n]*)?>/g,
        preserveNewlineChars: !0
    }],
    ["HTML_CLOSING_TAG", {
        pattern: /<\/([a-z1-6]{1,10}|[a-z1-6]+\:[a-z1-6]+)>/gi,
        preserveNewlineChars: !0
    }],
    ["MARKDOWN_BOLD_1", {
        pattern: /(^|\s|\s\()(_|~~)?(\*\*)([^\s\*](?:.*?\S)?)(\*\*)(\2)([\s.!?,:;\)]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !1, !0, !1, !0, !1, !1]
    }],
    ["MARKDOWN_BOLD_2", {
        pattern: /(^|\s|\s\()(\*|~~)?(__)([^\s_](?:.*?\S)?)(__)(\2)([\s.!?,:;\)]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !1, !0, !1, !0, !1, !1]
    }],
    ["MARKDOWN_ITALIC_1", {
        pattern: /(^|\s|\s\()(__|~~)?(\*)([^\s\*](?:.*?\S)?)(\*)(\2)([\s.!?,:;\)]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !1, !0, !1, !0, !1, !1]
    }],
    ["MARKDOWN_ITALIC_2", {
        pattern: /(^|\s|\s\()(\*\*|~~)?(_)([^\s_](?:.*?\S)?)(_)(\2)([\s.!?,:;\)]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !1, !0, !1, !0, !1, !1]
    }],
    ["MARKDOWN_BOLD_AND_ITALIC_1", {
        pattern: /(^|\s|\s\()(\*\*\*)([^\s\*](?:.*?\S)?)(\*\*\*)([\s.!?,:;\)]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !0, !1, !0, !1]
    }],
    ["MARKDOWN_BOLD_AND_ITALIC_2", {
        pattern: /(^|\s|\s\()(___)([^\s_](?:.*?\S)?)(___)([\s.!?,:;\)]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !0, !1, !0, !1]
    }],
    ["MARKDOWN_STRIKETHROUGH", {
        pattern: /(^|\s|\s\()(\*|\*\*|_|__)?(~~)([^\s~](?:.*?\S)?)(~~)(\2)([\s.!?,:;\)]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !1, !0, !1, !0, !1, !1]
    }],
    ["MARKDOWN_INLINE_CODE", {
        pattern: /(^|\s|\s\()(`)([^`\n]+)(`)([\s.!?,:;\)]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !1, !0, !1, !1]
    }],
    ["MARKDOWN_CODE_BLOCK", {
        pattern: /(^|[^`])(```)(?!`)([^]*?[^`])(```)(?=[^`]|$)/gm,
        preserveNewlineChars: !0,
        excludedParts: [/^\s$/, !0, !0, !0]
    }],
    ["MARKDOWN_IMAGE_WITHOUT_TITLE", {
        pattern: /(!\[(?:(?:Uploading\s)?(?:Screen\sShot\s|Bildschirmfoto\s)?)?)([^\[\]]+)(\]\(\s*[^()"'\s]*\s*\))/g,
        preserveNewlineChars: !0,
        excludedParts: [!0, !1, !0]
    }],
    ["MARKDOWN_IMAGE_WITH_TITLE", {
        pattern: /(!\[)([^\[\]]+)(\]\(\s*[^()"'\s]+)(\s+)(["'])([^]*?)(\5\s*\))/g,
        preserveNewlineChars: !0,
        excludedParts: [!0, !1, !0, !1, !0, !1, !0]
    }],
    ["MARKDOWN_LINK_WITHOUT_TITLE", {
        pattern: /(\[)([^\[\]]+)(\]\(\s*[^()"'\s]+\s*\))/g,
        preserveNewlineChars: !0,
        excludedParts: [!0, !1, !0]
    }],
    ["MARKDOWN_LINK_WITH_TITLE", {
        pattern: /(\[)([^\[\]]+)(\]\(\s*[^()"'\s]+)(\s+)(["'])([^]*?)(\5\s*\))/g,
        preserveNewlineChars: !0,
        excludedParts: [!0, !1, !0, !1, !0, !1, !0]
    }],
    ["BBCODE_CODE_BLOCK", {
        pattern: /\s?\[code\][^]*?\[\/code\]/gi,
        preserveNewlineChars: !0
    }],
    ["BBCODE_OPENING_TAG", {
        pattern: /\[(img|url|email|post|quote|list|youtube|vimeo|googlemaps|googlewidget|code|modalurl|topic|highlight|left|center|right|font|size|color|s|u|i|b|style|table|tr|td)\b[^\]\n]*\]/gi,
        preserveNewlineChars: !0
    }],
    ["BBCODE_CLOSING_TAG", {
        pattern: /\[\/(img|url|email|post|quote|list|youtube|vimeo|googlemaps|googlewidget|code|modalurl|topic|highlight|left|center|right|font|size|color|s|u|i|b|style|table|tr|td)\]/gi,
        preserveNewlineChars: !0
    }],
    ["WORDPRESS_TAG", {
        pattern: /\[[a-z0-9_\-]+\s[a-z0-9_\-]+=.+?\]/gi,
        preserveNewlineChars: !0
    }],
    ["JIRA_CODE_BLOCK", {
        pattern: /\s?{code(:[a-z0-9#]+)?}[^]*?{code}/gi,
        preserveNewlineChars: !0
    }],
    ["JIRA_OPENING_OR_CLOSING_TAG", {
        pattern: /{(color|code|noformat|quote)(:[a-z0-9#]+)?}/gi,
        preserveNewlineChars: !0
    }],
    ["TEXTILE_STRIKETHROUGH", {
        pattern: /(\s|^)(~)([^\s~](?:.*?\S)?)(~)([\s.!?,:;]|$)/g,
        preserveNewlineChars: !0,
        excludedParts: [!1, !0, !1, !0, !1]
    }],
    ["TEXTILE_BLOCK_TAG", {
        pattern: /^(h[1-6]|bq|bc|p|pre|###|notextile)\./gim,
        preserveNewlineChars: !0
    }],
    ["WIKITEXT_LINK_WITHOUT_TITLE", {
        pattern: /(\[\[)([a-z:][^|\]\n]*)(\]\])/gi,
        preserveNewlineChars: !0,
        excludedParts: [!0, !1, !0]
    }],
    ["WIKITEXT_LINK_WITH_TITLE", {
        pattern: /(\[\[[a-z:][^|\]\n]*\|)([^\]\n]+)(]])/gi,
        preserveNewlineChars: !0,
        excludedParts: [!0, !1, !0]
    }],
    ["EMOTICONS_LTR", {
        pattern: /(^|\s+)([:;|=][-~^]?[()\[\]\\/|@$*#&XxDOoPp])(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
        preserveNewlineChars: !0
    }],
    ["EMOTICONS_LTR_2", {
        pattern: /(^|\s+)([8B%][-~^][D()\[\]])(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
        preserveNewlineChars: !0
    }],
    ["EMOTICONS_LTR_3", {
        pattern: /(^|\s+)([:;%|=][-~^]?3)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
        preserveNewlineChars: !0
    }],
    ["EMOTICONS_RTL", {
        pattern: /(^|\s+)([()[\]\\/|@$*#&XxDOo][-~^]?[:;%|])(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
        preserveNewlineChars: !0
    }],
    ["XD_SMILE", {
        pattern: /(^|\s+)([xX]D)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
        preserveNewlineChars: !0
    }],
    ["HEART_SMILE", {
        pattern: /(^|\s+)(<[\\/]?3)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
        preserveNewlineChars: !0
    }],
    ["EMOJI", {
        pattern: /(^|\s+)(\:\w+\:)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
        preserveNewlineChars: !0
    }],
    ["JIRA_SMILEYS", {
        pattern: /(^|\s+)\(([-+!?ynxi]|(\*[rgby]?)|on|off|flag|flagoff)\)(\s+(?=[,.!?)]|$)|(?=[\s,.!?)]|$))/gm,
        preserveNewlineChars: !0
    }]
]), TweaksManager.EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi, TweaksManager.EMAIL_DOMAIN_REGEXP = /@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i, TweaksManager.ADDRESS_SPECIAL_CHARS_REGEXP = /["'`<>]/g, TweaksManager.DEFAULT_TWEAKS = {
    init() {
        document.documentElement.setAttribute("data-lt-installed", "true")
    },
    destroy() {
        document.documentElement && document.documentElement.removeAttribute("data-lt-installed")
    },
    supported: () => !0,
    unsupportedMessage: () => "",
    beta: () => !1,
    onElement(e) {},
    onElementDestroy(e, t) {
        onElementDisabled(e, t), onElementRemoved(e, t)
    },
    isElementCompatible(e) {
        if (TweaksManager.NON_COMPATIBLE_TAGS.includes(e.tagName)) return !1;
        if (!((isFormElement(e) || isCEElement(e)) && !e.readOnly)) return !1;
        if ("true" === e.getAttribute("data-lt-active")) return !0;
        if ("false" === e.getAttribute("data-lt-active")) return !1;
        if (isTextInput(e)) return !1;
        if (e.classList.contains("ck-editor__nested-editable") && e.parentElement && e.parentElement.closest(".cke_editable")) return !1;
        if (e.classList.contains("cke_editable")) return !0;
        if (e.classList.contains("ve-ce-documentNode")) return !0;
        if (e.classList.contains("fr-element") && !e.classList.contains("wsc-instance")) return !0;
        if (e.parentElement && e.parentElement.classList.contains("wp-block-code")) return !1;
        return !!(window.innerHeight >= 20 && window.innerWidth >= 100) && "false" !== e.getAttribute("spellcheck")
    },
    initElement: e => ({
        destroy() {}
    }),
    getInputAreaWrapperTweaks: e => ({
        createMutationObserver: (e, t) => new MutationObserver(t),
        getParsingDetector(e) {
            const t = document.body && document.body.dataset && document.body.dataset.id && document.body.dataset.id.includes("ZmHtmlEditor");
            let a = location.href.includes("/owa/") || !!document.querySelector(".owa-font-compose");
            try {
                a = a || window.parent.location.href.includes("/owa/") || !!window.parent.document.querySelector(".owa-font-compose")
            } catch (e) {}
            let r = !1;
            try {
                r = !!window.parent.document.title.match(/roundcube/i) || !!window.parent.location.href.match(/_action=compose/i)
            } catch (e) {}
            return {
                isIgnored(e) {
                    const t = e.tagName.toUpperCase();
                    return !!CEElementInspector.SKIPPING_TAGS.includes(t) || ("BLOCKQUOTE" === t || ("false" === e.getAttribute("contenteditable") || "false" === e.getAttribute("spellcheck") ? !e.hasAttribute("data-mention-id") && !e.hasAttribute("usertype") && !e.classList.contains("ql-mention") && !e.classList.contains("user-hover") && !e.classList.contains("cke_widget_mention-box") && !((!e.firstElementChild || 1 === e.childElementCount && e.offsetWidth > 0) && "inline" === window.getComputedStyle(e).display) : "SUP" === t && e.textContent ? CEElementInspector.SUP_REGEXP.test(e.textContent.trim()) : e.classList.contains("ql-code-block") || e.classList.contains("ql-formula")))
                },
                isSignature: e => t ? !!(e.dataset && e.dataset.marker && e.dataset.marker.includes("_SIG_")) : a ? "signature" === e.id.toLowerCase() : !!r && "_rc_sig" === e.id,
                isQuote: e => t ? !!(e.dataset && e.dataset.marker && e.dataset.marker.includes("_QUOTED_")) : !!a && ("divRplyFwdMsg" === e.id || !!e.previousElementSibling && "divRplyFwdMsg" === e.previousElementSibling.id),
                getReplacementText(e, t, a) {
                    if (!TweaksManager.INLINE_DISPLAY_VALUES.includes(t)) return "";
                    const r = e.tagName.toUpperCase();
                    return "BR" === r ? "" : "IMG" === r ? "⁣" : "CODE" === r ? "⁣" : "false" === e.getAttribute("spellcheck") ? "⁣" : "false" === e.contentEditable ? "⁣" : ""
                },
                isBlock: (e, t) => CEElementInspector.DISPLAY_BLOCK_VALUES.includes(t.display || ""),
                createMutationObserver: e => new MutationObserver(e),
                replaceText: (e, t, a) => (e = removeZWC(e), e = normalizeWhiteSpaces(e)),
                isWhiteSpace: e => isWhiteSpace(e)
            }
        },
        getFullTextInfo: (e, t) => ({
            text: t,
            offset: 0
        }),
        getSelectedText: () => getSelectedText(),
        getSelection() {
            const e = window.getSelection();
            return e ? {
                startNode: e.anchorNode,
                startOffset: e.anchorOffset,
                endNode: e.focusNode,
                endOffset: e.focusOffset,
                isCollapsed: e.isCollapsed
            } : null
        }
    }),
    getHighlighterTweaks(e, t, a) {
        const r = Boolean(t.firstElementChild && t.firstElementChild.hasAttribute("data-contents")),
            n = t.classList.contains("ms-rtestate-write"),
            s = Boolean(t.classList.contains("ql-editor") && t.closest(".ql-editor")),
            o = Boolean(t.classList.contains("control-contenteditable__area") && t.closest(".js-control-contenteditable, .js-control-contenteditable-amojo")),
            i = Boolean(t.closest(".app-Talk, .app-talk")),
            l = Boolean(t.closest(".ce-redactor .ce-block .ce-block__content"));
        return {
            getTargetElement: () => a ? t : r && t.parentNode && t.parentNode.parentNode ? t.parentNode : n ? t.closest("table[id*=WikiField]") || t : s ? t.closest(".ql-container") || t : o ? t.closest(".js-control-contenteditable, .js-control-contenteditable-amojo") || t : i ? t.closest(".new-message-form") ? t.parentElement : t : l && t.closest(".ce-block__content") || t,
            getZIndex(e, t) {
                let a = t.getStyle(e, "z-index");
                return (a = parseInt(a) || 0) > 0 || t.isStackingContext(e) ? a + 1 : "auto"
            },
            addScrollEventListener(t) {
                e.addEventListener("scroll", t)
            },
            removeScrollEventListener(t) {
                e.removeEventListener("scroll", t)
            },
            getVisibleBox: e => e.getPaddingBox(t, !0, !1),
            getScrollableElementSize: t => t.getScrollDimensions(e, !1),
            getScrollPosition: (t, a, r) => t.getScrollPosition(e, a, r),
            createMutationObserver: e => new MutationObserver(e),
            isMutationIgnored: e => !1
        }
    },
    getToolbarAppearance(e) {
        const t = [Dialog.CONTAINER_ELEMENT_NAME, ErrorCard.CONTAINER_ELEMENT_NAME].join(", "),
            a = "chat-input-control" === e.id && e.classList.contains("window__chatInputControl");
        return {
            isVisible(e, t, n = 32) {
                if (a) return !1;
                let s = !0;
                if (s = isTextArea(e) || isTextInput(e) ? !e.value.trim() : !e.textContent.trim(), e.classList.contains("editor-rich-text__editable") && s) return !1;
                const o = t.getPaddingBox(e);
                return !(s && o.height < n) && (o.width >= 160 && o.height >= 18)
            },
            getPosition(e, a, r, n, s, o = 18, i = 44) {
                const l = e.ownerDocument.documentElement,
                    c = e.ownerDocument.body;
                if (e === c) {
                    return {
                        fixed: !0,
                        left: (n ? 6 : l.clientWidth - s.width - 6) + "px"
                    }
                }
                const g = l.clientHeight,
                    d = getVisibleTopAndBottom(e, r, g, t),
                    p = d.bottom - d.top;
                if (p < o) return null;
                let m = r.getPaddingBox(e);
                if ("IFRAME" === e.tagName) {
                    let t = null;
                    try {
                        t = e.contentWindow.document.documentElement
                    } catch (e) {}
                    if (!t) return null;
                    n = r.isRTL(t.ownerDocument.body), m.width = t.clientWidth, m.height = t.clientHeight, m.right = m.left + m.width, m.bottom = m.top + m.height
                }
                const u = r.getScaleFactor(a),
                    T = r.getZoom(a),
                    E = u.x * T,
                    S = u.y * T;
                let b = (m.top + d.bottom) / S - 6 - s.height,
                    A = n ? m.left / E + 6 : m.right / E - 6 - s.width;
                if (p <= i) {
                    b = (m.top + d.bottom - p / 2) / S - s.height / 2
                }
                const h = m.height >= 250,
                    x = (l.scrollTop || c.scrollTop) + g;
                if (h && m.top + d.bottom >= x && m.top + s.height + 12 < x) return {
                    fixed: !0,
                    left: Math.round(A) + "px"
                };
                if (b > x) return null;
                const f = x - s.height - 8;
                return b = Math.min(b, f), {
                    fixed: !1,
                    left: Math.round(A) + "px",
                    top: Math.round(b) + "px"
                }
            },
            getZIndex: (e, t, a) => a.getZIndex(e, t),
            getClassName: () => null
        }
    },
    getDialogAppearance: () => ({
        isPositionVisible: () => !0,
        canDisplayAllSuggestions: () => !0
    }),
    getMessagePopupAppearance: () => ({
        isVisible: () => !0
    }),
    persistTemporarySettings: () => !1,
    getEditorGroupId(e) {
        try {
            return new URL(e).pathname
        } catch (e) {
            return "unknown"
        }
    },
    getMaxTextLength: (e, t) => t.isUsedCustomServer() ? config.MAX_TEXT_LENGTH_CUSTOM_SERVER : t.getUIState().hasPaidSubscription ? config.MAX_TEXT_LENGTH_PREMIUM : config.MAX_TEXT_LENGTH,
    getClickEvent: () => "click",
    isClickIgnored: e => !e.isTrusted,
    getSelectedText: () => getSelectedText(),
    getReplacedParts: (e, t) => TweaksManager._getExcludedParts(t, Array.from(TweaksManager.TEXT_IGNORING_DEFAULT_RULES.values())),
    getRecipientInfo(e) {
        try {
            if ("TEXTAREA" === e.tagName && "composebody" === e.id) {
                const e = window.parent.document.getElementById("_from"),
                    t = window.parent.document.getElementById("compose-subject"),
                    a = window.parent.document.getElementById("_to");
                if (e && t && a) {
                    const e = TweaksManager._getEmail(a.value),
                        t = TweaksManager._getFullName(a.value);
                    return Promise.resolve({
                        address: e,
                        fullName: t
                    })
                }
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    },
    shouldUsePartialValidationCaching: e => !0,
    getValidationOptions: (e, t) => ({
        useFullValidation: !0
    }),
    filterErrors: (e, t, a) => a,
    applyFix(e) {
        const {
            offset: t,
            length: a,
            replacementText: r,
            editor: n
        } = e;
        return n.inputAreaWrapper.replaceText(t, a, r)
    }
}, TweaksManager.SITE_TWEAKS = [{
    match: {
        hostname: ["1und1.de", "gmx.net", "gmx.com", "web.de"]
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (a, r) => t.createMutationObserver(e, r),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => "string" == typeof e.className && e.className.includes("signature"),
                    isQuote: e => "quote" === e.getAttribute("name"),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    },
    getRecipientInfo(e) {
        try {
            const e = document.querySelector(".objectivation-address[title]") || window.parent.document.querySelector(".objectivation_name[title]");
            if (e) {
                const t = (e.getAttribute("title") || "").replace(/"/g, ""),
                    a = TweaksManager._getEmail(t),
                    r = TweaksManager._getFullName(t);
                return Promise.resolve({
                    address: a,
                    fullName: r
                })
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        hostname: "mail.aol.com"
    },
    isElementCompatible: e => e.classList.contains("contentEditDiv") && "true" === e.getAttribute("contenteditable") || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => "clear:both" === e.getAttribute("style"),
                    isQuote: e => Boolean("DIV" === e.tagName && e.previousElementSibling && "BR" === e.previousElementSibling.tagName && e.textContent && e.textContent.startsWith("-----")),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: "atlassian.net"
    },
    isElementCompatible: e => !!(e instanceof HTMLElement && e.isContentEditable && e.className.includes("ProseMirror")) || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),
    getHighlighterTweaks(e, t, a) {
        const r = location.href.match(/\/(wiki|projects|issues)\//),
            n = TweaksManager.DEFAULT_TWEAKS.getHighlighterTweaks(e, t, a);
        return {
            getTargetElement: () => n.getTargetElement(),
            getZIndex(e, t) {
                const a = n.getZIndex(e, t);
                return r && e.classList.contains("ProseMirror") ? "auto" === a ? 1 : a + 1 : a
            },
            addScrollEventListener(e) {
                n.addScrollEventListener(e)
            },
            removeScrollEventListener(e) {
                n.removeScrollEventListener(e)
            },
            getVisibleBox: e => n.getVisibleBox(e),
            getScrollableElementSize: e => n.getScrollableElementSize(e),
            getScrollPosition: (e, t, a) => n.getScrollPosition(e, t, a),
            createMutationObserver: e => n.createMutationObserver(e),
            isMutationIgnored: e => n.isMutationIgnored(e)
        }
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => e.className.includes("ProseMirror") || t.isVisible(e, a),
            getPosition: (e, a, r, n, s) => t.getPosition(e, a, r, n, s),
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    },
    persistTemporarySettings: () => !0,
    getEditorGroupId(e) {
        const t = e.match(/\/pages.*?\/(\d{3,})($|\/|\?|#)/);
        return t ? t[1] : TweaksManager.DEFAULT_TWEAKS.getEditorGroupId(e)
    },
    filterErrors: (e, t, a) => a.filter(e => !["FALSCHES_ANFUEHRUNGSZEICHEN", "TYPOGRAPHIC_QUOTES"].includes(e.rule.id) && !e.rule.id.endsWith("UNPAIRED_BRACKETS") || !["“", "”"].includes(e.originalPhrase))
}, {
    match: {
        url: /\/jira\/|jira\./i
    },
    getHighlighterTweaks(e, t, a) {
        const r = TweaksManager.DEFAULT_TWEAKS.getHighlighterTweaks(e, t, a);
        return {
            getTargetElement: () => r.getTargetElement(),
            getZIndex: (e, t) => e.classList.contains("richeditor-cover") ? "auto" : r.getZIndex(e, t),
            addScrollEventListener(e) {
                r.addScrollEventListener(e)
            },
            removeScrollEventListener(e) {
                r.removeScrollEventListener(e)
            },
            getVisibleBox: e => r.getVisibleBox(e),
            getScrollableElementSize: e => r.getScrollableElementSize(e),
            getScrollPosition: (e, t, a) => r.getScrollPosition(e, t, a),
            createMutationObserver: e => r.createMutationObserver(e),
            isMutationIgnored: e => r.isMutationIgnored(e)
        }
    }
}, {
    match: {
        url: /backoffice.*?\.check24\.de|mietwagen.*?\.check24\.de/
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = /^\s*(dem erhalt von e-mails hinsichtlich|sie haben noch fragen|war diese e-mail hilfreich)/i,
                    r = t.getParsingDetector(e);
                return {
                    isIgnored: e => r.isIgnored(e),
                    isSignature: e => "TABLE" === e.tagName && !!a.test(e.textContent),
                    isQuote: e => !1,
                    getReplacementText: (e, t, a) => r.getReplacementText(e, t, a),
                    isBlock: (e, t) => r.isBlock(e, t),
                    createMutationObserver: e => r.createMutationObserver(e),
                    replaceText: (e, t, a) => r.replaceText(e, t, a),
                    isWhiteSpace: e => r.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: "basecamp.com"
    },
    getToolbarAppearance(e) {
        const t = document.querySelector(".chat__tools"),
            a = t ? t.offsetWidth : 0,
            r = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => r.isVisible(e, t),
            getPosition(e, t, n, s, o) {
                const i = r.getPosition(e, t, n, !1, o);
                return i && i.top && i.left && Object.assign(i, {
                    left: parseInt(i.left) - a - 8 + "px",
                    top: parseInt(i.top) - 6 + "px"
                }), i
            },
            getZIndex: (e, t, a) => r.getZIndex(e, t, a),
            getClassName: e => r.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "canva.com"
    },
    isElementCompatible(e) {
        const t = /rotate\([1-9\-]/;
        let a = e.closest("[style*=rotate]");
        for (; a && a !== e.ownerDocument.body;) {
            if (a.style.transform && a.style.transform.match(t)) return !1;
            a = a.parentElement && a.parentElement.closest("[style*=rotate]")
        }
        return TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
    }
}, {
    match: {
        hostname: "clickfunnels.com"
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
    match: {
        hostname: ["onlinebanking.deutschebank.be", "mabanque.bnpparibas"]
    },
    isElementCompatible: e => !1
}, {
    match: {
        hostname: "deepl.com"
    },
    isElementCompatible: e => !e.className.includes("target_textarea") && TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),
    applyFix(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.applyFix(e);
        return e.editor.inputAreaWrapper.simulateInput(e.replacementText), t
    }
}, {
    match: {
        hostname: "paper.dropbox.com"
    },
    persistTemporarySettings: () => !0,
    getEditorGroupId(e) {
        const t = e.match(/\/doc\/(.+?)($|\/|\?|#)/i);
        return t ? t[1] : TweaksManager.DEFAULT_TWEAKS.getEditorGroupId(e)
    },
    getHighlighterTweaks(e, t, a) {
        const r = TweaksManager.DEFAULT_TWEAKS.getHighlighterTweaks(e, t, a);
        return {
            getTargetElement: () => r.getTargetElement(),
            getZIndex(e, t) {
                const a = r.getZIndex(e, t);
                return e.classList.contains("ace-editor") ? "auto" === a ? 1 : a + 1 : a
            },
            addScrollEventListener(e) {
                r.addScrollEventListener(e)
            },
            removeScrollEventListener(e) {
                r.removeScrollEventListener(e)
            },
            getVisibleBox: e => r.getVisibleBox(e),
            getScrollableElementSize: e => r.getScrollableElementSize(e),
            getScrollPosition: (e, t, a) => r.getScrollPosition(e, t, a),
            createMutationObserver: e => r.createMutationObserver(e),
            isMutationIgnored: e => r.isMutationIgnored(e)
        }
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => !(e instanceof HTMLElement && e.offsetHeight < 30 && e.classList.contains("editor-blank")) && t.isVisible(e, a),
            getPosition: (e, a, r, n, s) => t.getPosition(e, a, r, n, s),
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "dropbox.com"
    },
    isElementCompatible: e => Boolean("true" === e.getAttribute("contenteditable") && e.closest(".sc-comment-editor-draft")) || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => t.isVisible(e, a, 60),
            getPosition: (e, a, r, n, s) => t.getPosition(e, a, r, n, s),
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "editor.reedsy.com"
    },
    getToolbarAppearance(e) {
        const t = !!e.closest("#redit-text-editor"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => a.isVisible(e, t),
            getPosition(e, r, n, s, o) {
                if (t) {
                    const t = n.getBorderBox(e, !1),
                        a = e.ownerDocument.documentElement.clientHeight;
                    if (t.bottom >= a) return {
                        left: t.right - o.width - 6 + "px",
                        fixed: !0
                    }
                }
                return a.getPosition(e, r, n, s, o)
            },
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        url: /www\.facebook\.com\/plugins\/feedback/
    },
    isElementCompatible: e => "false" === e.getAttribute("spellcheck") && "true" === e.getAttribute("contenteditable") || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: ["facebook.com", "messenger.com"]
    },
    getToolbarAppearance(e) {
        const t = !!e.closest(".fbDockWrapper, [data-pagelet=ChatTab]"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => !(t && !e.textContent.trim()) && a.getPaddingBox(e).width >= 120,
            getPosition(e, r, n, s, o) {
                const i = a.getPosition(e, r, n, !1, o, 15);
                return i && i.top && t ? Object.assign(i, {
                    top: parseInt(i.top) - n.getDocumentScroll().top + "px",
                    fixed: !0
                }) : i
            },
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "addons.mozilla.org"
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("addonsSiteNotSupported")
}, {
    match: {
        hostname: /ads\.google\.com/
    },
    isElementCompatible: e => !(!isTextInput(e) || !e.closest("[eta-headline], .headline-field-group, .long-headline-field, .description-field-group")) || TweaksManager._isElementCompatibleForGoogleServices(e),
    getToolbarAppearance(e) {
        const t = !!e.closest("[eta-headline], .headline-field-group, .long-headline-field, .description-field-group") && isTextInput(e),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, r) => !!t || a.isVisible(e, r),
            getPosition: (e, t, r, n, s) => a.getPosition(e, t, r, n, s, 15),
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "chrome.google.com"
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("webstoreSiteNotSupported")
}, {
    match: {
        hostname: "crowdsource.google.com"
    },
    isElementCompatible: e => !(!isTextInput(e) || !e.closest("#question")) || TweaksManager._isElementCompatibleForGoogleServices(e),
    getToolbarAppearance(e) {
        const t = isTextInput(e) && !!e.closest("#question"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, r) => t || a.isVisible(e, r),
            getPosition: (e, t, r, n, s) => a.getPosition(e, t, r, n, s),
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        url: /docs\.google\.com\/spreadsheets/
    },
    supported: () => !1,
    unsupportedMessage: () => chrome.i18n.getMessage("siteCannotBeSupported")
}, {
    match: {
        url: /docs\.google\.com\/sharing/
    },
    isElementCompatible: e => !e.classList.contains("apps-share-chips-input") && TweaksManager._isElementCompatibleForGoogleServices(e)
}, {
    match: {
        hostname: "keep.google.com"
    },
    isElementCompatible: e => TweaksManager._isElementCompatibleForGoogleServices(e),
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => t.isVisible(e, a),
            getPosition(e, a, r, n, s) {
                const o = t.getPosition(e, a, r, !1, s);
                return "list item" === e.getAttribute("aria-label") && o && o.left && (o.left = parseInt(o.left) - 30 + "px"), o
            },
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "mail.google.com"
    },
    isElementCompatible: e => e.matches(".editable[contenteditable=true]") || TweaksManager._isElementCompatibleForGoogleServices(e),
    initElement(e) {
        const t = e => {
                e.target instanceof Element && e.target.closest("[aria-invalid=grammar], [aria-invalid=spelling]") && e.stopImmediatePropagation()
            },
            a = () => {
                const e = document.querySelectorAll("[data-overlay-action=spellreplace]");
                e && Array.from(e).forEach(e => {
                    const t = e.closest(".pl");
                    t && t.remove()
                })
            };
        e.addEventListener("keyup", a), e.addEventListener("click", t, !0), e.addEventListener("contextmenu", t, !0);
        const r = (Number(document.documentElement.getAttribute("data-lt-gmail-tweaks")) || 0) + 1;
        return document.documentElement.setAttribute("data-lt-gmail-tweaks", String(r)), {
            destroy() {
                const r = (Number(document.documentElement.getAttribute("data-lt-gmail-tweaks")) || 0) - 1;
                r <= 0 ? document.documentElement.removeAttribute("data-lt-gmail-tweaks") : document.documentElement.setAttribute("data-lt-gmail-tweaks", String(r)), e.removeEventListener("keyup", a), e.removeEventListener("click", t, !0), e.removeEventListener("contextmenu", t, !0)
            }
        }
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e),
                    r = /\s+/g;

                function n(e) {
                    return e.replace(r, "")
                }
                let s = null;
                const o = document.querySelector("[class*=gmail_signature], [data-smartmail=gmail_signature]");
                return o && (s = n(o.textContent || ""), o.setAttribute("data-lt-sig", "1")), {
                    isIgnored: e => ("BLOCKQUOTE" !== e.tagName || "40px" !== e.style.marginLeft) && a.isIgnored(e),
                    isSignature(t) {
                        let a = t.getAttribute("data-lt-sig");
                        if (a && ("1" === a && null !== s && s !== n(t.textContent || "") && (t.setAttribute("data-lt-sig", "0"), a = "0"), "0" === a)) return !1;
                        return "string" == typeof t.className && (t.className.includes("gmail_signature") || "gmail_signature" === t.getAttribute("data-smartmail") || (t.getAttribute("style") || "").includes("color:WISESTAMP_SIG") || "mixmax-signature" === t.getAttribute("content")) && e.firstElementChild !== t
                    },
                    isQuote(t) {
                        const a = t.className;
                        if ("string" != typeof a) return !1;
                        if (a.includes("gmail_attr")) return !0;
                        if (a.includes("gmail_quote")) {
                            if (e.firstElementChild === t) return !1;
                            let a = !1;
                            for (let e = 0; e < t.children.length; e++) {
                                if ("BLOCKQUOTE" === t.children[e].tagName) {
                                    a = !0;
                                    break
                                }
                            }
                            if (!a && t.firstElementChild) {
                                if (t.firstElementChild.className.includes("gmail_attr")) return !0
                            }
                        }
                        return !1
                    },
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    },
    getRecipientInfo(e) {
        try {
            if ("DIV" === e.tagName) {
                let t = closestElement(e, ".nH[role=dialog]");
                if (t || (t = closestElement(e, "td.I5")), t) {
                    const e = t.querySelector("input[name=to]");
                    if (e) {
                        const t = TweaksManager._getEmail(e.value),
                            a = TweaksManager._getFullName(e.value);
                        return Promise.resolve({
                            address: t,
                            fullName: a
                        })
                    }
                }
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        hostname: "tagmanager.google.com"
    },
    isElementCompatible: e => !e.closest(".gtm-veditor_entity-name") && TweaksManager._isElementCompatibleForGoogleServices(e)
}, {
    match: {
        url: /translate\.google\.[a-z]{2,3}(\.[a-z]{2,3})?\/community/
    },
    isElementCompatible: e => !(!isTextInput(e) || !e.classList.contains("paper-input")) || TweaksManager._isElementCompatibleForGoogleServices(e),
    getToolbarAppearance(e) {
        const t = isTextInput(e) && e.classList.contains("paper-input"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, r) => t || a.isVisible(e, r),
            getPosition: (e, t, r, n, s) => a.getPosition(e, t, r, n, s),
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        url: /translate\.google\.[a-z]{2,3}(\.[a-z]{2,3})?/
    },
    isElementCompatible: e => "TEXTAREA" === e.tagName || TweaksManager._isElementCompatibleForGoogleServices(e)
}, {
    match: {
        hostname: /google\.[a-z]{2,3}(\.[a-z]{2,3})?/
    },
    isElementCompatible: e => "tw-source-text-ta" === e.id && "TEXTAREA" === e.tagName || TweaksManager._isElementCompatibleForGoogleServices(e)
}, {
    match: {
        hostname: ["gingersoftware.com", "iblogbox.com", "prowritingaid.com", "grammar.com"]
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
    match: {
        hostname: "hootsuite.com"
    },
    getToolbarAppearance(e) {
        const t = Boolean(e.parentElement && e.parentElement.closest(".rc-TextArea")),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => a.isVisible(e, t),
            getPosition(e, r, n, s, o) {
                const i = a.getPosition(e, r, n, !1, o);
                return t && i && i.left ? Object.assign({}, i, {
                    left: parseInt(i.left) - 28 + "px"
                }) : i
            },
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "app.karbonhq.com"
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => "string" == typeof e.className && e.className.includes("karbon-email-sig"),
                    isQuote: e => a.isQuote(e),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: ["languagetoolplus.com", "languagetool.com", "languagetool.org"]
    },
    init() {
        if (!/^(www\.)?languagetool(plus)?\.(com|org)/.test(location.hostname)) return TweaksManager.DEFAULT_TWEAKS.init();
        document.documentElement.setAttribute("data-lt-extension-installed", "true");
        const e = StorageController.create();
        e.onReady(() => {
            const t = e.getActiveCoupon();
            t && document.documentElement && (document.documentElement.setAttribute("data-lt-coupon", t.code), document.documentElement.setAttribute("data-lt-coupon-expires", String(t.expires)), document.documentElement.setAttribute("data-lt-coupon-percent", String(t.percent)), dispatchCustomEvent(document, "lt-update-coupon"))
        }), document.addEventListener("lt-upgrade", () => {
            e.onReady(() => {
                if (e.getUIState().hasPaidSubscription) return;
                Tracker.trackEvent("Action", "upgrade"), e.checkForPaidSubscription().catch(e => {
                    Tracker.trackError("js", `Error checking paid subscripton: ${e&&e.reason} - ${e&&e.status}`)
                });
                const {
                    firstVisit: t
                } = e.getStatistics();
                if (t) {
                    const e = Math.floor((Date.now() - 1e3 * t) / 1e3 / 60 / 60 / 24);
                    let a = String(e);
                    e > 365 ? a = "365+" : e > 90 ? a = "90+" : e > 60 ? a = "60+" : e > 30 ? a = "60+" : e > 14 ? a = "14+" : e > 7 && (a = "7+"), Tracker.trackEvent("Action", "upgrade:days_since_installation", `days:${a}`)
                }
            })
        }), document.addEventListener("lt-update-dictionary", () => {
            EnvironmentAdapter.updateDictionary()
        }), document.addEventListener("lt-open-options", () => {
            EnvironmentAdapter.openOptionsPage(void 0, "external")
        });
        const t = document.querySelector("#lt-addon-user-token"),
            a = document.querySelector("#lt-addon-user-email"),
            r = document.querySelector("#lt-addon-user-id"),
            n = document.querySelector("#lt-addon-force-update");
        t && a && r && e.onReady(() => {
            if (Tracker.trackEvent("Action", "auto_login:prepare"), e.isUsedCustomServer()) return;
            const {
                havePremiumAccount: s,
                username: o,
                token: i
            } = e.getSettings();
            !s || n ? (e.updateSettings({
                havePremiumAccount: !0,
                username: a.value,
                password: "",
                token: t.value,
                userId: Number(r.value),
                knownEmail: a.value
            }).then(() => {
                EnvironmentAdapter.startDictionarySync(), e.checkForPaidSubscription().catch(e => {
                    Tracker.trackError("js", `Error checking paid subscripton: ${e&&e.reason} - ${e&&e.status}`)
                })
            }), Tracker.trackEvent("Action", "auto_login:success")) : s && a.value.toLowerCase() === o.toLowerCase() ? e.updateSettings({
                username: a.value,
                password: "",
                token: t.value,
                userId: Number(r.value)
            }).then(() => {
                e.checkForPaidSubscription().catch(e => {
                    Tracker.trackError("js", `Error checking paid subscripton: ${e&&e.reason} - ${e&&e.status}`)
                })
            }) : s && t.value && a.value && t.value === i && e.updateSettings({
                username: a.value
            })
        }), location.href.includes("/premium") && e.onReady(() => {
            const {
                premiumClicks: t
            } = e.getStatistics();
            e.updateStatistics({
                premiumClicks: t + 1
            }), Tracker.trackEvent("Action", "pricing_table:view")
        });
        const s = new URL(window.location.href).searchParams.get("temp_text_id");
        if (s) {
            const e = {
                command: "GET_VALIDATOR_DATA",
                id: s
            };
            chrome.runtime.sendMessage(e).then(e => {
                e && isGetValidatorDataResult(e) && waitFor(() => document.querySelector("[data-lt-editor-input]")).then(t => {
                    t.innerText = e.text;
                    const a = new window.InputEvent("input", {
                        bubbles: !0,
                        cancelable: !1,
                        inputType: "insertText",
                        data: ""
                    });
                    t.dispatchEvent(a)
                })
            })
        }
        return e.onReady(() => {
            const {
                username: t,
                token: a
            } = e.getSettings();
            t && a && Array.from(document.querySelectorAll("[data-lt-login-link]")).forEach(e => {
                e.addEventListener("click", e => {
                    location.href = getAutoLoginUrl(t, a), e.preventDefault()
                }, !0)
            })
        }), TweaksManager.DEFAULT_TWEAKS.init()
    },
    isElementCompatible: e => TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "linkedin.com"
    },
    getToolbarAppearance(e) {
        const t = !!e.closest("#msg-overlay"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => !document.querySelector(".msg-form__hovercard.active") && a.isVisible(e, t),
            getPosition(e, r, n, s, o) {
                const i = a.getPosition(e, r, n, !1, o);
                return i && i.top && t ? Object.assign(i, {
                    top: parseInt(i.top) - n.getDocumentScroll().top + "px",
                    fixed: !0
                }) : i
            },
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "liveworksheets.com"
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible(e, t) {
                const a = t.getBorderBox(e);
                return a.width >= 300 && a.height >= 75
            },
            getPosition: (e, a, r, n, s) => t.getPosition(e, a, r, n, s),
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "e.mail.ru"
    },
    isElementCompatible: e => "content" !== e.dataset.signatureWidget && TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),
    getRecipientInfo(e) {
        try {
            if (e.classList.contains("cke_editable")) {
                const t = closestElement(e, "div.compose-app_popup");
                if (t) {
                    const e = t.querySelector("div[class*=contactsContainer] div[class*=contact][data-type=to] > * > div[class*=status_base][title]");
                    if (e) {
                        const t = e.querySelector("span[class*=text]");
                        if (t) {
                            const a = TweaksManager._getEmail(e.title),
                                r = TweaksManager._getFullName(t.textContent || "");
                            return Promise.resolve({
                                address: a,
                                fullName: r
                            })
                        }
                    }
                }
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        url: /\/appsuite/
    },
    initElement: e => (e.setAttribute("data-lt-tweaks", "openxchange"), {
        destroy() {
            e.removeAttribute("data-lt-tweaks")
        }
    }),
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => "string" == typeof e.className && e.className.includes("ox-signature"),
                    isQuote: e => !1,
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    },
    getRecipientInfo(e) {
        try {
            if ("TEXTAREA" === e.tagName && e.parentElement && e.parentElement.classList.contains("editor")) {
                const t = closestElement(window.frameElement || e, ".window-container[role=dialog]");
                if (t) {
                    const e = t.querySelector(".tokenfield .token span.token-label");
                    if (e) {
                        const t = TweaksManager._getEmail(e.title),
                            a = TweaksManager._getFullName(e.title);
                        return Promise.resolve({
                            address: t,
                            fullName: a
                        })
                    }
                }
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        url: /\/statamic/
    },
    getHighlighterTweaks(e, t, a) {
        const r = e.closest(".bard-editor"),
            n = TweaksManager.DEFAULT_TWEAKS.getHighlighterTweaks(e, t, a);
        return {
            getTargetElement: () => n.getTargetElement(),
            getZIndex(e, t) {
                let a = n.getZIndex(e, t);
                if ("auto" !== a && r && r.parentElement) {
                    const e = r.parentElement.querySelector(".bard-link-toolbar");
                    if (e && e.offsetHeight > 0) return a - 1
                }
                return a
            },
            addScrollEventListener(e) {
                n.addScrollEventListener(e)
            },
            removeScrollEventListener(e) {
                n.removeScrollEventListener(e)
            },
            getVisibleBox: e => n.getVisibleBox(e),
            getScrollableElementSize: e => n.getScrollableElementSize(e),
            getScrollPosition: (e, t, a) => n.getScrollPosition(e, t, a),
            createMutationObserver: e => n.createMutationObserver(e),
            isMutationIgnored: e => n.isMutationIgnored(e)
        }
    }
}, {
    match: {
        hostname: "minds.com"
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => t.isVisible(e, a),
            getPosition(e, a, r, n, s) {
                const o = t.getPosition(e, a, r, !1, s);
                return o && o.left && e.closest(".m-modal-remind-composer") && (o.left = parseInt(o.left) - 27 + "px"), o
            },
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "onedrive.live.com"
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("msOnlineOfficeNotSupported", "https://appsource.microsoft.com/product/office/WA104381727")
}, {
    match: {
        url: /\/otrs/
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => !1,
                    isQuote: e => "cite" === e.getAttribute("type"),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: ["outlook.live.com", "outlook.office365.com", "outlook.office.com"]
    },
    isElementCompatible: e => !("true" !== e.getAttribute("contenteditable") || !/nachricht|mensaje|missatge|message|mensagem|bericht|messaggio|wiadomości|meddelandetext|brødtekst|meldingstekst/i.test(e.getAttribute("aria-label") || "")) || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),
    initElement(e) {
        const t = (Number(e.getAttribute("data-lt-outlook-tweaks")) || 0) + 1;
        return document.documentElement.setAttribute("data-lt-outlook-tweaks", String(t)), {
            destroy() {
                const t = (Number(e.getAttribute("data-lt-outlook-tweaks")) || 0) - 1;
                t <= 0 ? document.documentElement.removeAttribute("data-lt-outlook-tweaks") : document.documentElement.setAttribute("data-lt-outlook-tweaks", String(t))
            }
        }
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e),
                    r = e.querySelector("#signature, #Signature");
                if (r && !r.hasAttribute(TweaksManager.SIGNATURE_ACTIVE_ATTRIBUTE)) {
                    r.setAttribute(TweaksManager.SIGNATURE_ACTIVE_ATTRIBUTE, "");
                    let e = [r];
                    (e = (e = e.concat(Array.from(r.querySelectorAll("*")))).concat(Array.from(r.children))).forEach(e => {
                        hasTextNodeChildWithContent(e) && e.setAttribute(TweaksManager.SIGNATURE_ATTRIBUTE, "")
                    })
                }
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => e.hasAttribute(TweaksManager.SIGNATURE_ATTRIBUTE),
                    isQuote: e => "divRplyFwdMsg" === e.id || !!e.previousElementSibling && "divRplyFwdMsg" === e.previousElementSibling.id,
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    },
    getRecipientInfo(e) {
        try {
            if ("DIV" === e.tagName && "textbox" === e.getAttribute("role")) {
                const t = document.querySelector(".ms-BasePicker-text [aria-label]");
                if (t) {
                    const e = t.getAttribute("aria-label") || "",
                        a = TweaksManager._getEmail(e),
                        r = TweaksManager._getFullName(e);
                    return Promise.resolve({
                        address: a,
                        fullName: r
                    })
                }
                const a = e.closest(".customScrollBar");
                if (a) {
                    const e = a.querySelector(".allowTextSelection span.lpc-hoverTarget[role=button][aria-haspopup=dialog] span");
                    if (e) {
                        const t = e.textContent || "",
                            a = TweaksManager._getEmail(t),
                            r = TweaksManager._getFullName(t);
                        return Promise.resolve({
                            address: a,
                            fullName: r
                        })
                    }
                }
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        hostname: "prezi.com"
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
    match: {
        hostname: "mail.protonmail.com"
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => "string" == typeof e.className && e.className.includes("protonmail_signature"),
                    isQuote: e => !1,
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    createMutationObserver: e => a.createMutationObserver(e),
                    isBlock: (e, t) => a.isBlock(e, t),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: "rambler.ru"
    },
    getRecipientInfo(e) {
        try {
            if ("TEXTAREA" === e.tagName && e.classList.contains("QuickReply-textarea-3R")) {
                const e = document.querySelector("div[class*=LetterHeader-from] span[class*=ContactWithDropdown-headerEmail]"),
                    t = document.querySelector("div[class*=LetterHeader-from] span[class*=ContactWithDropdown-headerName]");
                if (e && t) {
                    const a = TweaksManager._getEmail(e.textContent || ""),
                        r = TweaksManager._getFullName(t.textContent || "");
                    return Promise.resolve({
                        address: a,
                        fullName: r
                    })
                }
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        hostname: "reverso.net"
    },
    isElementCompatible: e => "txtSource" === e.id && "TEXTAREA" === e.tagName || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => t.isVisible(e, a),
            getPosition(e, a, r, n, s) {
                const o = t.getPosition(e, a, r, !1, s);
                return o && o.top && "txtSource" === e.id && document.querySelector("#lnkSpeller:not(.bottom)") && (o.top = parseInt(o.top) - 28 + "px"), o
            },
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "slack.com"
    },
    isElementCompatible(e) {
        const t = e.parentElement;
        return !(!t || "focusable_search_input" === t.getAttribute("data-qa")) && ("message_input" === t.getAttribute("data-qa") || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e))
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => "TS-MENTION" !== e.tagName && a.isIgnored(e),
                    isSignature: e => !1,
                    isQuote: e => !1,
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    },
    getToolbarAppearance(e) {
        const t = e.closest("[data-view-context='message-pane'], [data-view-context='threads-flexpane'], [data-qa='message_editor']"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return t && e.classList.contains("ql-editor") ? {
            isVisible: e => !0,
            getPosition(e, t, a, r, n) {
                let s = parseInt(a.getStyle(e, "padding-top")),
                    o = parseInt(a.getStyle(e, "padding-bottom"));
                const i = a.getBorderBox(e);
                s > 0 && 0 === o && (o = s, i.bottom += s, i.height += s);
                const l = parseInt(a.getStyle(e, "padding-right")) + 2,
                    c = parseInt(a.getStyle(e, "line-height")) + s + o;
                return {
                    fixed: !1,
                    left: Math.round(i.right - l - n.width) + "px",
                    top: Math.round(i.bottom - n.height + (n.height - c) / 2) + "px"
                }
            },
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        } : a
    }
}, {
    match: {
        hostname: "my.smashdocs.net"
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
    match: {
        hostname: "spanishdict.com"
    },
    isElementCompatible: e => "query" !== e.id && TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "pipedrive.com"
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => e.hasAttribute("data-pipedrivesignature"),
                    isQuote: e => "blockQuoteWrapper" === e.getAttribute("data-type"),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: "tabtter.jp"
    },
    getToolbarAppearance(e) {
        const t = isTextArea(e) && "tweetbody" === e.id,
            a = document.querySelector("span.tweetform_rightbottom_opts"),
            r = a ? a.offsetWidth : 0,
            n = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => n.isVisible(e, t),
            getPosition(e, a, s, o, i) {
                const l = n.getPosition(e, a, s, o, i);
                if (!t) return l;
                if (null === l || l.fixed || "string" != typeof l.top || "string" != typeof l.left) return l;
                const c = parseInt(l.top),
                    g = parseInt(l.left);
                return l.top = c + 4 + "px", l.left = g - r + "px", l
            },
            getZIndex: (e, t, a) => n.getZIndex(e, t, a),
            getClassName: e => n.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "email.t-online.de"
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => !1,
                    isQuote: e => "P" === e.tagName && e.textContent.trim().startsWith("-----Original-Nachricht"),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    },
    getRecipientInfo(e) {
        try {
            const e = window.parent.document.querySelector(".multiObjectInputfield-object-text");
            if (e) {
                const t = TweaksManager._getEmail(e.getAttribute("title") || ""),
                    a = TweaksManager._getFullName(e.textContent || "");
                return Promise.resolve({
                    address: t,
                    fullName: a
                })
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        hostname: "mail.missiveapp.com"
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => Boolean(e.matches && e.matches("[data-missive-marker=signature_start] ~ *")),
                    isQuote: e => !1,
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: "web.telegram.org"
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => t.isVisible(e, a),
            getPosition(e, a, r, n, s) {
                if (e.classList.contains("composer_rich_textarea")) {
                    let t = r.getPaddingBox(e),
                        a = t.bottom - 4 - s.height,
                        n = t.right - 4 - s.width;
                    return {
                        fixed: !1,
                        left: Math.round(n) + "px",
                        top: Math.round(a) + "px"
                    }
                }
                return t.getPosition(e, a, r, n, s)
            },
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "trello.com"
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => !document.querySelector(".pop-over.is-shown") && t.isVisible(e, a),
            getPosition: (e, a, r, n, s) => t.getPosition(e, a, r, n, s),
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "twitch.tv"
    },
    getToolbarAppearance(e) {
        const t = e.getAttribute("data-a-target"),
            a = "chat-input" === t,
            r = "video-chat-input" === t,
            n = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => n.isVisible(e, t),
            getPosition(e, t, s, o, i) {
                const l = n.getPosition(e, t, s, !1, i);
                if (a && l && l.left) {
                    const t = !(!e.parentElement || !e.parentElement.querySelector("[data-a-target=bits-button]"));
                    return Object.assign(l, {
                        left: parseInt(l.left) - (t ? 60 : 25) + "px"
                    })
                }
                return r && l && l.left && l.top ? Object.assign(l, {
                    left: parseInt(l.left) + 3 + "px",
                    top: parseInt(l.top) + 5 + "px"
                }) : l
            },
            getZIndex: (e, t, a) => n.getZIndex(e, t, a),
            getClassName: e => n.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "twitter.com"
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => t.isVisible(e, a, 20),
            getPosition: (e, a, r, n, s) => t.getPosition(e, a, r, n, s),
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "upwork.com"
    },
    getToolbarAppearance(e) {
        const t = window.innerWidth >= 768 && e.classList.contains("msg-composer-input"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible(e, t) {
                const a = t.getBorderBox(e);
                return a.width >= 160 && a.height >= 19
            },
            getPosition(e, r, n, s, o) {
                if (t) {
                    const t = -54,
                        a = 0,
                        r = n.getBorderBox(e);
                    return {
                        fixed: !1,
                        left: Math.round(r.right - t - o.width) + "px",
                        top: Math.round(r.bottom - a - o.height) + "px"
                    }
                }
                return a.getPosition(e, r, n, s, o)
            },
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "vk.com"
    },
    getToolbarAppearance(e) {
        const t = e.classList.contains("reply_field"),
            a = !!e.closest(".im-page--chat-input"),
            r = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible(e, t) {
                if ("post_field" === e.id) {
                    const a = 50;
                    return t.getBorderBox(e).height >= a
                }
                return !e.classList.contains("page_status_input") && r.isVisible(e, t)
            },
            getPosition(e, n, s, o, i) {
                const l = r.getPosition(e, n, s, !1, i);
                if (!l || !l.top) return l;
                if (t) {
                    const t = parseInt(s.getStyle(e, "padding-right"));
                    return Object.assign(l, {
                        left: Math.round(parseInt(l.left) - t) + "px"
                    })
                }
                if (a) {
                    const t = parseInt(s.getStyle(e, "padding-right"));
                    return Object.assign(l, {
                        left: Math.round(parseInt(l.left) - t) + "px",
                        top: parseInt(l.top) - s.getDocumentScroll().top + "px",
                        fixed: !0
                    })
                }
                return l
            },
            getZIndex: (e, t, a) => r.getZIndex(e, t, a),
            getClassName: e => r.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "web.whatsapp.com"
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => a.getPaddingBox(e).width > 350 || t.isVisible(e, a),
            getPosition: (e, a, r, n, s) => t.getPosition(e, a, r, n, s),
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "writeandimprove.com"
    },
    isElementCompatible: e => !(!e.hasAttribute("data-question-id") || "TEXTAREA" !== e.tagName) || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "mail.yahoo.com"
    },
    isElementCompatible: e => !(!e.parentElement || "editor-container" !== e.parentElement.id || "true" !== e.getAttribute("contenteditable")) || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e),
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => "string" == typeof e.className && e.className.includes("signature"),
                    isQuote: e => "string" == typeof e.className && e.className.includes("yahoo_quoted"),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    },
    getRecipientInfo(e) {
        try {
            const e = document.querySelector("[data-test-id='email-pill'] [data-test-id='pill']");
            if (e) return Promise.resolve({
                address: TweaksManager._getEmail(e.getAttribute("title") || ""),
                fullName: e.innerText.trim()
            })
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        hostname: ["mail.yandex.com", "mail.yandex.ru", "mail.yandex.uz", "mail.yandex.lv", "mail.yandex.ua", "mail.yandex.co.il"]
    },
    isClickIgnored(e) {
        const t = e.target;
        return !!t && isTextArea(t) && "editor1" === t.id
    },
    getRecipientInfo(e) {
        try {
            if ("DIV" === e.tagName && e.classList.contains("cke_wysiwyg_div") && e.classList.contains("cke_editable")) {
                const e = document.querySelector("div[name=to] span[bubble][data-yabble-email]");
                if (e) {
                    const t = TweaksManager._getEmail(e.dataset.yabbleEmail || ""),
                        a = TweaksManager._getFullName(e.dataset.yabbleName || "");
                    return Promise.resolve({
                        address: t,
                        fullName: a
                    })
                }
                const t = document.querySelector("span.mail-Message-Sender-Email"),
                    a = document.querySelector("span.mail-Message-Sender-Name");
                if (t && a) {
                    const e = TweaksManager._getEmail(t.textContent || ""),
                        r = TweaksManager._getFullName(a.textContent || "");
                    return Promise.resolve({
                        address: e,
                        fullName: r
                    })
                }
            }
        } catch (e) {}
        return Promise.resolve({
            address: "",
            fullName: ""
        })
    }
}, {
    match: {
        hostname: ["translate.yandex.com", "translate.yandex.ru", "translate.yandex.uz", "translate.yandex.lv", "translate.yandex.ua", "translate.yandex.co.il"]
    },
    isElementCompatible: e => "fakeArea" === e.id && isCEElement(e) || "textarea" === e.id && "TEXTAREA" === e.nodeName || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: ["zen.yandex.com", "zen.yandex.ru", "zen.yandex.uz", "zen.yandex.lv", "zen.yandex.ua", "zen.yandex.co.il"]
    },
    getToolbarAppearance(e) {
        const t = isTextArea(e) && e.classList.contains("comment-editor__editor"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => a.isVisible(e, t),
            getPosition(e, r, n, s, o) {
                if (!t) return a.getPosition(e, r, n, s, o);
                const i = a.getPosition(e, r, n, s, o, void 0, 0);
                if (null === i || i.fixed || "string" != typeof i.top || "string" != typeof i.left) return i;
                if (e.parentElement) {
                    const t = e.parentElement.querySelector(".comment-editor__editor-controls");
                    if (t) {
                        const e = parseInt(n.getStyle(t, "width")),
                            a = parseInt(i.top),
                            r = parseInt(i.left);
                        i.top = a + 2 + "px", i.left = r - e - 5 + "px"
                    }
                }
                return i
            },
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "youtube.com"
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => t.isVisible(e, a, 20),
            getPosition: (e, a, r, n, s) => t.getPosition(e, a, r, n, s),
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: ["mail.zoho.com", "mail.zoho.eu"]
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e);
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => e.id.startsWith("Zm-_Id_-Sgn"),
                    isQuote: e => e.classList.contains("zmail_extra"),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: ["dynamics.com"]
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e),
                    r = /\s*\-{6,}\s.+?\s\-{6,}/,
                    n = Array.from(e.querySelectorAll("font")).find(e => r.test(e.textContent || ""));
                if (n) {
                    n.setAttribute("data-lt-quote", "");
                    let e = n;
                    for (; e = e.nextElementSibling;) e.setAttribute("data-lt-quote", "")
                }
                return {
                    isIgnored: e => a.isIgnored(e),
                    isSignature: e => e.id.startsWith("signatureFullPage"),
                    isQuote: e => e.id.startsWith("mailHistory") || e.hasAttribute("data-lt-quote"),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, r) => a.replaceText(e, t, r),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: ["social.zoho.com", "social.zoho.eu"]
    },
    getToolbarAppearance(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, a) => t.isVisible(e, a),
            getPosition(e, a, r, n, s) {
                const o = t.getPosition(e, a, r, !1, s);
                return o && o.left && e.classList.contains("inputBox") && (o.left = parseInt(o.left) - 26 + "px"), o
            },
            getZIndex: (e, a, r) => t.getZIndex(e, a, r),
            getClassName: e => t.getClassName(e)
        }
    }
}, {
    match: {
        hostname: ["writer.zoho.com", "writer.zoho.eu"]
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
    match: {
        hostname: "xing.com"
    },
    getToolbarAppearance(e) {
        const t = !!e.closest("[class*='presentational-message-composer'"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => a.isVisible(e, t),
            getPosition: (e, t, r, n, s) => a.getPosition(e, t, r, n, s),
            getZIndex(e, r, n) {
                const s = a.getZIndex(e, r, n);
                return t ? Math.max(3, Number(s) || 0) : s
            },
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "yicat.vip"
    },
    isElementCompatible: e => !("true" !== e.getAttribute("contenteditable") || !e.classList.contains("atoms-edit")) || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "zybuluo.com"
    },
    isElementCompatible: e => "TEXTAREA" === e.tagName && "wmd-input" === e.id || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "blogger.com"
    },
    isElementCompatible: e => "postingHtmlBox" !== e.id && TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "pad.riseup.net"
    },
    isElementCompatible: e => "innerdocbody" === e.id || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "duolingo.com"
    },
    isElementCompatible: e => !("TEXTAREA" !== e.tagName || !e.closest("[data-test*=challenge]")) || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "coda.io"
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
    match: {
        hostname: ["kialo.com", "kialo-edu.com", "kialo-pro.com"]
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}, {
    match: {
        hostname: "smartcat.com"
    },
    isElementCompatible: e => !!(e instanceof HTMLElement && e.isContentEditable && e.classList.contains("l-content-editor")) || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "xeno.app"
    },
    isElementCompatible: e => !e.closest("#container-textarea") && TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: "wikipedia.org"
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = t.getParsingDetector(e),
                    r = {
                        e: "ᵉ",
                        er: "ᵉʳ",
                        re: "ʳᵉ",
                        ers: "ᵉʳˢ",
                        res: "ʳᵉˢ",
                        d: "ᵈ",
                        de: "ᵈᵉ",
                        des: "ᵈᵉˢ"
                    };
                return {
                    isIgnored(e) {
                        if (!["SPAN", "TIME", "SMALL", "ABBR", "A"].includes(e.tagName)) return a.isIgnored(e);
                        const t = e.getAttribute("typeof");
                        return !(t && ["mw:DisplaySpace", "mw:Entity", "mw:Transclusion"].includes(t) || e.classList.contains("ve-ce-mwTransclusionNode")) && a.isIgnored(e)
                    },
                    isSignature: e => a.isSignature(e),
                    isQuote: e => a.isQuote(e),
                    getReplacementText: (e, t, r) => a.getReplacementText(e, t, r),
                    isBlock: (e, t) => a.isBlock(e, t),
                    createMutationObserver: e => a.createMutationObserver(e),
                    replaceText: (e, t, n) => r[e] && "SUP" === n.tagName ? r[e] : a.replaceText(e, t, n),
                    isWhiteSpace: e => a.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        hostname: "wikitree.com"
    },
    isElementCompatible: e => e.classList.contains("CodeMirror-code") && "true" === e.getAttribute("contenteditable") || TweaksManager.DEFAULT_TWEAKS.isElementCompatible(e)
}, {
    match: {
        hostname: ["mastodon.social", "mastodon.cloud", "mamot.fr", "mastodon.online", "mstdn.jp", "switter.at", "pawoo.net", "sinblr.com", "social.tchncs.de"]
    },
    getToolbarAppearance(e) {
        const t = !!e.closest(".columns-area__panels__pane__inner"),
            a = TweaksManager.DEFAULT_TWEAKS.getToolbarAppearance(e);
        return {
            isVisible: (e, t) => a.isVisible(e, t),
            getPosition(e, r, n, s, o) {
                const i = a.getPosition(e, r, n, s, o);
                return i && i.top && t ? Object.assign(i, {
                    top: parseInt(i.top) - n.getDocumentScroll().top + "px",
                    fixed: !0
                }) : i
            },
            getZIndex: (e, t, r) => a.getZIndex(e, t, r),
            getClassName: e => a.getClassName(e)
        }
    }
}, {
    match: {
        hostname: "hey.com"
    },
    getInputAreaWrapperTweaks(e) {
        const t = TweaksManager.DEFAULT_TWEAKS.getInputAreaWrapperTweaks(e);
        return {
            createMutationObserver: (e, a) => t.createMutationObserver(e, a),
            getParsingDetector(e) {
                const a = /^\s*On\s+(\w+)\s+\d+,\s+\d+,\s+.+\s+wrote:\s*$/,
                    r = t.getParsingDetector(e);
                return {
                    isIgnored: e => r.isIgnored(e),
                    isSignature: e => r.isSignature(e),
                    isQuote: e => r.isQuote(e),
                    getReplacementText: (e, t, a) => r.getReplacementText(e, t, a),
                    isBlock: (e, t) => r.isBlock(e, t),
                    createMutationObserver: e => r.createMutationObserver(e),
                    replaceText: (e, t, n) => (e = e.replace(a, e => "\ufeff".repeat(e.length)), r.replaceText(e, t, n)),
                    isWhiteSpace: e => r.isWhiteSpace(e)
                }
            },
            getFullTextInfo: (e, a) => t.getFullTextInfo(e, a),
            getSelectedText: () => t.getSelectedText(),
            getSelection: () => t.getSelection()
        }
    }
}, {
    match: {
        url: /thunderbird.net|thunderbird-mail.de|\/thunderbird/
    },
    init() {
        const e = StorageController.create();
        e.onReady(() => {
            e.updateStatistics({
                isThunderbirdUser: !0
            })
        }), TweaksManager.DEFAULT_TWEAKS.init()
    }
}, {
    match: {
        hostname: ["clubdesk.com", "clubdesk.de"]
    },
    supported: () => !1,
    unsupportedMessage: () => i18nManager.getMessage("siteCannotBeSupported")
}], "undefined" != typeof module && (module.exports = TweaksManager);
