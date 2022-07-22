/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
var __awaiter =
    (this && this.__awaiter) ||
    function (e, t, r, s) {
        return new (r || (r = Promise))(function (i, a) {
            function n(e) {
                try {
                    E(s.next(e));
                } catch (e) {
                    a(e);
                }
            }
            function o(e) {
                try {
                    E(s.throw(e));
                } catch (e) {
                    a(e);
                }
            }
            function E(e) {
                var t;
                e.done
                    ? i(e.value)
                    : ((t = e.value),
                      t instanceof r
                          ? t
                          : new r(function (e) {
                                e(t);
                            })).then(n, o);
            }
            E((s = s.apply(e, t || [])).next());
        });
    };
class Validator {
    static _constructor() {
        this._isInitialized || ((this._checkForException = this._checkForException.bind(Validator)), (this._isInitialized = !0));
    }
    static getServerBaseUrl(e = !1, t = !0) {
        return this._storageController.isUsedCustomServer() ?
            this._storageController.getCustomServerUrl() : config.MAIN_SERVER_URL
    }
    static _getServerFullUrl(e, t = !1, r = !1) {
        let s = this.getServerBaseUrl(t);
        (s += s.endsWith("/") ? "check" : "/check"), (s += "?c=1"), (t && !e.usePartialValidationCaching) || (s += `&instanceId=${encodeURIComponent(e.instanceId)}`), r && (s += "&languageChanged=true");
        const i = EnvironmentAdapter.getVersion();
        return (s += `&v=${encodeURIComponent(i)}`);
    }
    static _abortValidationRequest(e) {
        this._validationAbortControllers[e] && (this._validationAbortControllers[e].abort(), delete this._validationAbortControllers[e]);
    }
    static _abortPartialValidationRequest(e) {
        this._partialValidationAbortControllers[e] && (this._partialValidationAbortControllers[e].abort(), delete this._partialValidationAbortControllers[e]);
    }
    static _abortLanguageDetectionRequest(e) {
        this._languageDetectionAbortControllers[e] && (this._languageDetectionAbortControllers[e].abort(), delete this._languageDetectionAbortControllers[e]);
    }
    static _prepareText(e) {
        return e.replace(this.ZWNJ_REGEXP, this.ZWS);
    }
    static _joinInChunks(e, t = config.PARTIAL_VALIDATION_CHUNK_LENGTH) {
        (e = [...e]).sort((e, t) => t.text.length - e.text.length);
        const r = [],
            s = [];
        for (const i of e) {
            let e = -1;
            for (let a = 0; a < r.length; a++) s[a] + i.text.length > t || ((-1 === e || s[e] < s[a]) && (e = a));
            -1 !== e ? (r[e].push(i), (s[e] += i.text.length)) : (r.push([i]), s.push(i.text.length));
        }
        return r;
    }
    static _getRequestData(e, t, r, s) {
        const i = new URLSearchParams(),
            { username: a, password: n, token: o, motherTongue: E, apiServerUrl: _, enVariant: l, deVariant: u, ptVariant: c, caVariant: d } = this._storageController.getSettings(),
            { hasPaidSubscription: h } = this._storageController.getUIState(),
            A = { text: e };
        (s.recipientInfo.address || s.recipientInfo.fullName) && (A.metaData = { EmailToAddress: s.recipientInfo.address, FullName: s.recipientInfo.fullName }), i.append("data", JSON.stringify(A));
        const g = h;
        g && a && n ? (i.append("username", a), i.append("password", n)) : g && a && o && (i.append("username", a), i.append("tokenV2", o)),
            i.append("textSessionId", s.instanceId),
            h || i.append("enableHiddenRules", "true"),
            E && i.append("motherTongue", E),
            "normal" !== s.checkLevel && i.append("level", s.checkLevel.replace("hidden-", ""));
        if (t) i.append("language", t.code);
        else {
            i.append("language", "auto"), i.append("noopLanguages", r.join(",")), i.append("preferredLanguages", r.join(","));
            const e = this._getPreferredVariants(l, u, c, d);
            e.length > 0 && i.append("preferredVariants", e.toString());
        }
        return i.append("disabledRules", "WHITESPACE_RULE,CONSECUTIVE_SPACES"), i.append("useragent", BrowserDetector.getUserAgentIdentifier()), i;
    }
    static _getPreferredVariants(e, t, r, s) {
        const i = [];
        return e && i.push(e), t && i.push(t), r && i.push(r), s && i.push(s), i;
    }
    static _getValidationRequestData(e, t, r, s) {
        const i = this._getRequestData(e, t, r, s);
        return i.append("mode", "textLevelOnly"), i;
    }
    static _getPartialValidationRequestData(e, t, r, s, i) {
        const a = this._getRequestData(e, t, r, s);
        return a.append("mode", "allButTextLevelOnly"), a.append("allowIncompleteResults", i.toString()), a;
    }
    static async _sendRequest(e, t, r = config.VALIDATION_REQUEST_TIMEOUT) {
        var matches = [];
        if (t.body.get('mode') == 'textLevelOnly') {
            // TODO: This is terrible, but the request is already JSON at this point
            // If we parse the JSON, and look at the 'text' property. This is the data.
            var text = JSON.parse(t.body.get('data')).text;
            try {
                await window.getMatches(window.ort, text, matches);
            } catch (exc) {
                console.error(`Error calling getMatches: ${exc}`);
                throw exc;
            }
        }

        var response = {
            "language": { "name": "English (US)", "code": "en-US", "detectedLanguage": { "name": "English (US)", "code": "en-US", "confidence": 0.8 } },
            "matches": matches
        };

        return Promise.resolve(response);
    }
    static _checkForException(e) {
        return e.ok
            ? e
            : e
                  .text()
                  .catch(() => "")
                  .then((t) => {
                      const r = t.toLowerCase();
                      if (r.includes("too many error")) throw { status: e.status, message: i18nManager.getMessage("tooManyErrors"), response: t };
                      if (413 === e.status || r.includes("text exceeds the limit")) throw { status: e.status, message: i18nManager.getMessage("textTooLong"), response: t };
                      if (t.toLowerCase().includes("checking took longer than")) throw { status: e.status, message: i18nManager.getMessage("timeoutError", [e.url ? e.url.replace(/\?.*/, "?...") : "unknown"]), response: t };
                      if (429 === e.status) throw { status: e.status, message: i18nManager.getMessage("tooManyRequests"), response: t };
                      if (403 === e.status) {
                          if (r.includes("client request size limit") || r.includes("client request limit") || r.includes("ip request limit") || r.includes("ip request size limit"))
                              throw { status: e.status, message: i18nManager.getMessage("tooManyRequests"), response: t };
                          if (r.includes("authexception")) throw { status: e.status, message: i18nManager.getMessage("invalidUsernameOrPassword"), response: t };
                          throw { status: e.status, message: i18nManager.getMessage("accessDeniedError2"), response: t };
                      }
                      if (r.includes("checking took longer than")) throw { status: e.status, message: i18nManager.getMessage("timeoutError", [e.url ? e.url.replace(/\?.*/, "?...") : "unknown"]), response: t };
                      throw { status: e.status, message: i18nManager.getMessage("unknownError") + " (" + e.status + ")", response: t };
                  });
    }
    static _isConnectionOrServerIssue(e) {
        return config.SWITCH_TO_FALLBACK_SERVER_ERRORS.includes(e.status) || ["ConnectionError", "TimeoutError"].includes(e.reason);
    }
    static _getGraphemesCount(e, t, r = 0) {
        for (let s = r; s < e.length; s++) {
            if (t <= 0) return s - r;
            t -= e[s].length;
        }
        return e.length - r;
    }
    static _getCodepointsCount(e, t, r = 0) {
        let s = 0;
        for (let i = r; i < Math.min(e.length, r + t); i++) s += e[i].length;
        return s;
    }
    static _correctMatches(e, t, r) {
        if (t !== r) {
            const s = new GraphemeSplitter(),
                i = s.splitGraphemes(t),
                a = s.splitGraphemes(r);
            for (const t of e) {
                const e = Validator._getGraphemesCount(i, t.offset),
                    r = Validator._getGraphemesCount(i, t.length, e);
                (t.offset = Validator._getCodepointsCount(a, e)), (t.length = Validator._getCodepointsCount(a, r, e));
            }
        }
        return e;
    }
    static _getLeftText(e, t, r, s = 15) {
        let i = Math.max(t - s, 0);
        if (r) {
            const r = e.lastIndexOf("\n", t);
            r >= i && (i = r + 1);
        }
        let a = e.substring(i, t);
        return 0 === i || (r && "\n" === e[i - 1]) || (a = "..." + a), a;
    }
    static _getRightText(e, t, r, s = 15) {
        let i = Math.min(t + s, e.length);
        if (r) {
            const r = e.indexOf("\n", t);
            -1 !== r && r <= i && (i = r);
        }
        let a = e.substring(t, i);
        return i === e.length || (r && "\n" === e[i]) || (a += "..."), a;
    }
    static _transformMatches(e, t, r, s = !1) {
        return e.map((e) => {
            const i = this.SPELLING_RULES_ID.some((t) => e.rule.id.includes(t)),
                a = this.STYLE_ISSUE_TYPES.some((t) => e.rule.issueType === t),
                n = ("typographical" === e.rule.issueType && "CASING" !== e.rule.category.id) || "PUNCTUATION" === e.rule.category.id || "TYPOGRAPHY" === e.rule.category.id || e.rule.category.id.includes("KOMMA"),
                o = (e.rule.tags && e.rule.tags.includes("picky")) || StorageControllerClass.PICKY_RULE_IDS.includes(e.rule.id),
                E = t.substr(e.offset, e.length),
                _ = `${Validator._getLeftText(t, e.offset, s)}|${E}|${Validator._getRightText(t, e.offset + e.length, s)}`,
                l = Validator._getLeftText(t, e.offset, !0, 60),
                u = Validator._getRightText(t, e.offset + e.length, !0, 60),
                c = `${escapeHTML(l)}<lt-em>${escapeHTML(E)}</lt-em>${escapeHTML(u)}`;
            let d = "";
            e.shortMessage && e.shortMessage.length < 60 && e.shortMessage !== e.message && (d = e.shortMessage.replace(this.PUNCTUATION_AT_END, ""));
            const h = e.replacements.map((e) => ({ value: e.value, prefix: e.prefix, suffix: e.suffix, type: e.type, shortDescription: e.shortDescription }));
            return {
                isPartialValidation: s,
                rule: e.rule,
                isSpellingError: i,
                isStyleError: a,
                isPunctuationError: n,
                isPicky: o,
                contextForSureMatch: e.contextForSureMatch,
                language: { code: r.code, name: r.name },
                description: e.message,
                shortDescription: d,
                start: e.offset,
                end: e.offset + e.length,
                length: e.length,
                originalPhrase: E,
                contextPhrase: _,
                longContextPhrase: c,
                fixes: h,
            };
        });
    }
    static _adjustErrors(e, t, r, s, i) {
        const a = this._storageController.getValidationSettings(r, "unknown"),
            n = s.split(" ").filter((e) => e),
            o = this._storageController.getSettings().dictionary;
        return e.filter((e) => {
            if (!a.shouldCapitalizationBeChecked) {
                if (e.fixes.some((t) => t.value.toLowerCase() === e.originalPhrase.toLowerCase())) return !1;
                if ("UPPERCASE_SENTENCE_START" === e.rule.id) return !1;
            }
            if (
                ((e.fixes = e.fixes.filter(
                    (t) =>
                        t.value !== "(" + e.originalPhrase + ")" &&
                        t.value !== e.originalPhrase &&
                        "(suggestion limit reached)" !== t.value &&
                        "(se ha alcanzado el límite de sugerencias)" !== t.value &&
                        "(Vorschlagslimit erreicht)" !== t.value
                )),
                e.language.code.startsWith("en") &&
                    isAllUppercase(e.originalPhrase) &&
                    !/[a-z]/i.test(e.contextPhrase) &&
                    e.fixes.forEach((t) => {
                        t.value.toLowerCase() !== e.originalPhrase.toLowerCase() && (t.value = t.value.toUpperCase());
                    }),
                ("PT_CLICHE_REPLACE" !== e.rule.id && "PT_WORDINESS_REPLACE" !== e.rule.id) ||
                    e.fixes.forEach((t) => {
                        (t.value.startsWith("REFORMULAR") || t.value.startsWith("APAGAR") || t.value.startsWith("ESPECIFICAR")) &&
                            ((e.description = e.description.replace(/\sÉ preferível dizer.+(REFORMULAR|APAGAR|ESPECIFICAR).+$/, "")), (t.value = ""));
                    }),
                this.EMAIL_SIGNATURE_SEPARATOR_REGEXP.test(e.originalPhrase))
            )
                return !1;
            if (this.ZWS_REGEXP.test(e.originalPhrase)) return !1;
            if (e.rule.id.endsWith("WORD_REPEAT_BEGINNING_RULE") && this.ONLY_NUMBERS_REGEXP.test(e.originalPhrase)) return !1;
            if ("LEERZEICHEN_HINTER_DOPPELPUNKT" === e.rule.id && this.COLON_WHITESPACE_REGEXP.test(e.originalPhrase)) return !1;
            const r = t.substring(e.start - 25, e.start),
                s = t.substr(e.end, 25);
            if (i && "UPPERCASE_SENTENCE_START" === e.rule.id && this.MID_SENTENCE_LINE_BREAK.test(r)) return !1;
            if ("DE_CASE" === e.rule.id && this.BULLET_POINT_REGEXP.test(r)) return !1;
            if ("DE_CASE" === e.rule.id && this.NUMBER_WITH_PARENTHESIS_AT_END_REGEXP.test(r)) return !1;
            if ("DE_CASE" === e.rule.id && this.PIPE_AT_END_REGEXP.test(r)) return !1;
            if ("DE_CASE" === e.rule.id && this.MARKDOWN_HEADLINE_REGEXP.test(r)) return !1;
            if ("DE_CASE" === e.rule.id && this.EMOJI_SENTENCE_START_REGEXP.test(r)) return !1;
            if ("PUNKT_ENDE_DIREKTE_REDE" === e.rule.id && !s.trim()) return !1;
            if ("LEERZEICHEN_HINTER_DOPPELPUNKT" === e.rule.id && this.MARKDOWN_INLINE_FORMAT_AT_BEGINNING_REGEXP.test(s)) return !1;
            if (e.rule.id.endsWith("UNPAIRED_BRACKETS") && ("!" === e.originalPhrase || "?" === e.originalPhrase) && (r.endsWith("!") || r.endsWith("?"))) return !1;
            if (e.rule.id.endsWith("UNPAIRED_BRACKETS") && this.ONE_LETTER_AT_END_REGEXP.test(r)) return !1;
            if (e.rule.id.endsWith("UNPAIRED_BRACKETS") && this.NUMBER_WITH_DOT_AT_END_REGEXP.test(r)) return !1;
            if ("SENTENCE_WHITESPACE" === e.rule.id && r.endsWith("{!")) return !1;
            if ("SENTENCE_WHITESPACE" === e.rule.id && this.SINGLE_UPPERCASE_LETTER_REGEXP.test(e.originalPhrase) && this.ABBREVIATION_AT_END_REGEXP.test(r)) return !1;
            if ("SENTENCE_WHITESPACE" === e.rule.id && "net" === e.originalPhrase.toLowerCase()) return !1;
            if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && this.NET_AT_BEGINNING_REGEXP.test(s)) return !1;
            if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && e.originalPhrase.endsWith(")") && r.endsWith(this.ZWS)) return !1;
            if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && e.originalPhrase.endsWith(".") && this.FILE_TYPE_AT_BEGINNING_REGEXP.test(s)) return !1;
            if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && r.endsWith("(") && (",)" === e.originalPhrase || ".)" === e.originalPhrase)) return !1;
            if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && r.endsWith("\n") && [")", "}", "]", "."].includes(e.originalPhrase)) return !1;
            if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && s.startsWith("/")) return !1;
            if ("COMMA_PARENTHESIS_WHITESPACE" === e.rule.id && e.originalPhrase.includes(this.ZWS)) return !1;
            if ("WORT1_BINDESTRICH_SPACE_WORT2" === e.rule.id && e.originalPhrase.endsWith(this.ZWS)) return !1;
            if ("MULTIPLICATION_SIGN" === e.rule.id && (this.AT_LEAST_TWO_LETTERS_AT_END_REGEXP.test(r) || !s || this.PUNCTUATION_AT_BEGINNING_REGEXP.test(s))) return !1;
            if ("ZBEDNA_SPACJA_PRZED" === e.rule.id && e.originalPhrase.includes(this.ZWS)) return !1;
            if ("UNLIKELY_OPENING_PUNCTUATION" === e.rule.id && this.PUNCTUATION_SPACE_AT_END_REGEXP.test(r)) return !1;
            if (
                "WORD_CONTAINS_UNDERSCORE" === e.rule.id &&
                (!this.LOWERCASE_REGEXP.test(e.originalPhrase) || e.originalPhrase.includes("-") || e.originalPhrase.includes("__") || this.SLASH_AT_END_REGEXP.test(r) || this.SLASH_AT_BEGINNING_REGEXP.test(s))
            )
                return !1;
            if ("WORD_CONTAINS_UNDERSCORE" === e.rule.id && r.endsWith("[") && s.startsWith("]")) return !1;
            if ("WORD_CONTAINS_UNDERSCORE" === e.rule.id && this.QUOTE_AT_END_REGEXP.test(r) && this.QUOTE_AT_BEGINNING_REGEXP.test(s)) return !1;
            if ("WORD_CONTAINS_UNDERSCORE" === e.rule.id && (r.endsWith("=") || r.endsWith("&") || r.endsWith("?"))) return !1;
            if (("PT_WEASELWORD_REPLACE" === e.rule.id && (e.fixes.length = 0), e.isSpellingError || "WORD_CONTAINS_UNDERSCORE" === e.rule.id)) {
                const t = e.originalPhrase.charAt(0),
                    i = e.originalPhrase.toLowerCase();
                if (isErrorIgnoredByDictionary(e, o)) return !1;
                if (s.startsWith("_") || r.endsWith("_")) return !1;
                if (e.originalPhrase.startsWith("$") && s.startsWith("}") && r.endsWith("{")) return !1;
                if (e.originalPhrase.startsWith("$") && e.originalPhrase.endsWith("$")) return !1;
                if ((this.HTML_ENTITIES.includes(e.originalPhrase) && r.endsWith("&")) || this.HTML_ENTITIES_WITH_AND.includes(e.originalPhrase) || this.HTML_ENTITIES_WITH_AND.includes("&" + e.originalPhrase)) return !1;
                if (this.COMMON_TLDS.some((e, t) => i.endsWith("." + e) || this.COMMON_TLD_WITH_DOT_REGEXPS[t].test(s))) return !1;
                if (this.DOT_WITH_PREFIX_REGEXP.test(r) && this.COMMON_TLDS.includes(i)) return !1;
                if (this.COMMON_FILE_TYPES.some((e, t) => i.endsWith("." + e) || this.COMMON_FILE_TYPE_WITH_DOT_REGEXPS[t].test(s))) return !1;
                if (this.DOT_WITH_PREFIX_REGEXP.test(r) && this.COMMON_FILE_TYPES.includes(i)) return !1;
                const a = "@" === t || this.MENTION_SYMBOL_AT_BEGINNING_REGEXP.test(r),
                    E = "#" === t || this.HASH_SYMBOL_AT_BEGINNING_REGEXP.test(r);
                if (a || E) return !1;
                if (n.some((t) => t === e.originalPhrase)) return !1;
                if (this.WAVY_DASH_REGEXP.test(e.originalPhrase)) return !1;
                for (const t of n)
                    if (t.toLowerCase() === e.originalPhrase.toLowerCase() && !e.fixes.some((e) => e.value === t)) {
                        e.fixes.unshift({ value: t });
                        break;
                    }
            }
            return !0;
        });
    }
    static _processResponse(e, t, r, s, i = !1) {
        e.matches = this._correctMatches(e.matches, t, r);
        let a = this._transformMatches(e.matches, r, e.language, i);
        a = this._adjustErrors(a, r, getDomain(s.url), s.recipientInfo.fullName, s.ignoreUppercaseErrors);
        let n = [],
            o = [],
            E = [];
        const { hasPaidSubscription: _, showRuleId: l } = this._storageController.getUIState();
        return (
            !_ && !this._storageController.isUsedCustomServer() && e.language && e.language.code.startsWith("nl") && (a = a.filter((e) => !this.NL_PREMIUM_RULES.includes(e.rule.id) || (n.push(e), !1))),
            !_ && !this._storageController.isUsedCustomServer() && e.language && e.language.code.startsWith("pl") && (a = a.filter((e) => !this.PL_PREMIUM_RULES.includes(e.rule.id) || (n.push(e), !1))),
            _ &&
                a.forEach((e) => {
                    this.NL_PREMIUM_RULES.includes(e.rule.id) && (e.rule.isPremium = !0), this.PL_PREMIUM_RULES.includes(e.rule.id) && (e.rule.isPremium = !0);
                }),
            l &&
                a.forEach((e) => {
                    e.description = (e.rule.isPremium ? "prem:" : "") + e.rule.id + "[" + (e.rule.subId || "") + "] " + e.description;
                }),
            e.hiddenMatches && (n = n.concat(this._transformMatches(e.hiddenMatches, r, e.language, i))),
            "hidden-picky" === s.checkLevel && ((a = a.filter((e) => !e.isPicky || (E.push(e), !1))), e.hiddenMatches && (n = n.filter((e) => !e.isPicky || (o.push(e), !1)))),
            { errors: a, premiumErrors: n, pickyErrors: E, premiumPickyErrors: o }
        );
    }
    static _correctErrorOffsets(e, t) {
        const r = [];
        let s = 0;
        for (const i of e) {
            const e = i.text.length;
            for (const a of t)
                if (a.start >= s && a.end <= s + e) {
                    const e = Object.assign({}, a);
                    (e.start = e.start - s + i.offset), (e.end = e.start + e.length), r.push(e);
                }
            s += e + 2;
        }
        return r;
    }
    static validate(e, t, r, s, i = !1) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(e = this._prepareText(e)).trim() || /^( *\n)* *$/g.test(e)) return { language: t, errors: [], premiumErrors: [], pickyErrors: [], premiumPickyErrors: [] };
            this._abortValidationRequest(s.instanceId),
                (this._validationAbortControllers[s.instanceId] = new AbortController()),
                this._useValidationFallbackServer && Date.now() - this._mainServerUnavailabilityTimeStamp >= config.MAIN_SERVER_RECHECK_INTERVAL && (this._useValidationFallbackServer = !1);
            const a = e.normalize(),
                n = this._getServerFullUrl(s, !1, i),
                o = { method: "post", mode: "cors", credentials: "omit", body: this._getValidationRequestData(a, t, r, s), signal: this._validationAbortControllers[s.instanceId].signal };
            return this._sendRequest(n, o)
                .then((t) => {
                    const { errors: r, premiumErrors: i, pickyErrors: n, premiumPickyErrors: o } = this._processResponse(t, a, e, s);
                    return { language: { code: t.language.code, name: t.language.name }, errors: r, premiumErrors: i, pickyErrors: n, premiumPickyErrors: o };
                })
                .catch((i) => {
                    if (this._isConnectionOrServerIssue(i)) {
                        this._abortValidationRequest(s.instanceId);
                        const a = this.getServerBaseUrl(!1, !1);
                        if (((i.message = i.message || i18nManager.getMessage("connectionProblem", a) + " (#1, code=" + i.status + ")"), !this._storageController.isUsedCustomServer() && !this._useValidationFallbackServer))
                            return (this._useValidationFallbackServer = !0), (this._mainServerUnavailabilityTimeStamp = Date.now()), this.validate(e, t, r, s);
                    }
                    throw i;
                });
        });
    }
    static partialValidate(e, t, r, s, i = !1) {
        return __awaiter(this, void 0, void 0, function* () {
            if (
                (e.forEach((e) => {
                    e.text = this._prepareText(e.text);
                }),
                !e.some((e) => !!e.text.trim()))
            )
                return { language: t, errors: [], premiumErrors: [], pickyErrors: [], premiumPickyErrors: [], isIncompleteResult: !1 };
            this._abortPartialValidationRequest(s.instanceId),
                (this._partialValidationAbortControllers[s.instanceId] = new AbortController()),
                this._usePartialValidationFallbackServer && Date.now() - this._mainServerUnavailabilityTimeStamp >= config.MAIN_SERVER_RECHECK_INTERVAL && (this._usePartialValidationFallbackServer = !1);
            const a = this._getServerFullUrl(s, !0),
                n = this._joinInChunks(e),
                o = [];
            for (const e of n) {
                const n = e.map((e) => e.text).join("\n\n"),
                    E = n.normalize(),
                    _ = { method: "post", mode: "cors", credentials: "omit", body: this._getPartialValidationRequestData(E, t, r, s, i), signal: this._partialValidationAbortControllers[s.instanceId].signal },
                    l = this._sendRequest(a, _).then((t) => {
                        const { errors: r, premiumErrors: i, pickyErrors: a, premiumPickyErrors: o } = this._processResponse(t, E, n, s, !0),
                            _ = this._correctErrorOffsets(e, r),
                            l = this._correctErrorOffsets(e, i),
                            u = this._correctErrorOffsets(e, a),
                            c = this._correctErrorOffsets(e, o);
                        return { language: { code: t.language.code, name: t.language.name }, errors: _, premiumErrors: l, pickyErrors: u, premiumPickyErrors: c, isIncompleteResult: !!t.warnings && t.warnings.incompleteResults };
                    });
                o.push(l);
            }
            return Promise.all(o)
                .then((e) => {
                    return {
                        language: e[0].language,
                        errors: Array.prototype.concat.apply(
                            [],
                            e.map((e) => e.errors)
                        ),
                        premiumErrors: Array.prototype.concat.apply(
                            [],
                            e.map((e) => e.premiumErrors)
                        ),
                        premiumPickyErrors: Array.prototype.concat.apply(
                            [],
                            e.map((e) => e.premiumPickyErrors)
                        ),
                        pickyErrors: Array.prototype.concat.apply(
                            [],
                            e.map((e) => e.pickyErrors)
                        ),
                        isIncompleteResult: e.some((e) => e.isIncompleteResult),
                    };
                })
                .catch((a) => {
                    if (this._isConnectionOrServerIssue(a)) {
                        this._abortPartialValidationRequest(s.instanceId);
                        const n = this.getServerBaseUrl(!0, !1);
                        if (((a.message = i18nManager.getMessage("connectionProblem", n) + " (#2, code=" + a.status + ")"), !this._storageController.isUsedCustomServer() && !this._usePartialValidationFallbackServer))
                            return (this._usePartialValidationFallbackServer = !0), (this._mainServerUnavailabilityTimeStamp = Date.now()), this.partialValidate(e, t, r, s, i);
                    }
                    throw a;
                });
        });
    }
    static detectLanguage(e, t, r, s) {
        return __awaiter(this, void 0, void 0, function* () {
            // do nothing
        });
    }
    static checkForPaidSubscription() {
    }
}
(Validator.NL_PREMIUM_RULES = [
    "FAAG_VAAG",
    "TOO_LONG_SENTENCE",
    "_2_LEESTEKENS",
    "WEEKEND",
    "CASU_QUO",
    "MOMENTEEL",
    "SLECHTS",
    "LOSSE_LETTERS",
    "LEENWOORDEN",
    "KOMMA_HOOR",
    "RELEVANT",
    "ZAL_ZUL",
    "HINTS",
    "OR_EENH_GETAL",
    "CHECKEN",
    "ALLEEN_BE",
    "MACHTE",
    "ECHTER",
    "COMMUNICEREN",
    "DESIGN",
    "SANDAAL_ZANDAAL",
    "N",
    "MIDDELS",
    "INTEGREREN",
    "PRIMAIR",
    "OVERIGENS",
    "BETREFFENDE",
    "AGENDA",
    "ERGO",
    "TEN_BEHOEVE",
    "KOMMA_AANH",
    "TM",
    "IE",
    "TER_ZAKE",
    "SIGNIFICANT",
    "GELIEVE",
    "BEHOREN",
    "NAAR_AANLEIDING_VAN",
    "VAN_PLAN_ZIJN",
    "HEDEN",
    "TEN_DODE",
    "VREEMD_VRZ_HIJ",
    "DES",
    "IMPACT",
    "IMMER",
    "BOVENSTAAND",
    "XXXYJE",
    "DUTCH_WRONG_WORD_IN_CONTEXT",
    "LANCEREN",
    "MET_BEHULP_VAN",
    "PRIORITEIT",
    "UWENTWEGE",
    "CATEGORIE",
    "CRITERIUM",
    "GEMOTIVEERD",
]),
    (Validator.PL_PREMIUM_RULES = [
        "BOWIEM_ZAS",
        "ZE_Z_SPOL",
        "SPACJA_ZNAK_ROWNOSCI",
        "BRAK_PRZECINKA_GDY",
        "PYTANIE_CO",
        "BRAK_PRZECINKA_JESLI",
        "PRZECINEK_ANI",
        "SKROTOWCE_BEZ_DYWIZU",
        "NIEZGODNOSC_PRZYPADKU_PO_LICZEBNIKU",
        "PODMIOT_ORZECZENIE",
        "ROWNIE_JAK",
        "JAK_I",
        "PRZECINEK_POROWNANIE",
        "WOLACZ_BEZ_PRZECINKA",
        "ODNOSNIE_DO",
        "GENERALNIE",
        "BOWIEM_ZAS_PRZECINEK",
        "WYDAWAC_SIE_BYC",
        "POSIADAC_MIEC",
        "PL_GUILLEMET",
        "ITP_ITD",
        "SPACJA_PROCENT",
        "PO",
        "W_TEMACIE",
        "PL_DWA_WYRAZY",
        "W_NAWIAZANIU_DO",
        "WE_W",
        "POKI_CO",
        "VS",
        "DZIEN_DZISIEJSZY",
        "WIELOKROTNE_WYSTPIENIE_TEGO_SAMEGO_WYRAENIA_PRZYIMKOWEGO",
        "I_LUB",
        "PELNIC_ROLE",
        "OKRES_CZASU",
        "UZNAC_JAKO",
        "EFEKT_KONCOWY",
        "DLATEGO_PONIEWAZ",
        "NA_DZIEN_DZISIEJSZY",
        "DODATKOWO_CO_WIECEJ",
        "OWY_W",
        "DZIEN_JUTRZEJSZY",
        "ADRES_ZAMIESZKANIA",
        "W_CHWILI_OBECNEJ",
        "BYC_ZNAJDOWAC_SIE_W_POSIADANIU",
        "DO_TERAZ",
        "PROTOKOL_Z_CZEGO",
        "PO_NAJMNIEJSZEJ_LINII",
        "POTRAFIACY",
        "zarowno_jak_rowniez",
        "GRAC_FAIR_PLAY",
        "DRUGI_NAJWIEKSZY",
        "COFAC_SIE_DO_TYLU",
        "DZIEN_WCZORAJSZY",
        "NA_PRZESTRZENI",
        "IDENTYCZNY_JAK",
        "ZA_WYJATKIEM",
        "MAPA_DROGOWA",
        "W_PRZECIGU_TYGODNIA_W_CIGU",
        "NAPOTKAC_NA",
        "PRZERWA_KAWOWA",
        "WYSOKA_FREKWENCJA",
        "UBRAC_ZALOZYC",
        "PRZY_UDZIALE",
        "W_SLAD_ZA",
        "WYRAZIC_POPARCIE",
        "W_TYM_WZGLEDZIE",
        "PO_PIERWSZE_PRIMO",
        "DOMYSLEC_SIE",
        "WARTY",
        "IDENTYCZNY_DO",
        "W_DRODZE_WYJATKU",
        "PRZEDKLADAC_WNIOSEK",
        "POD_RZAD",
        "PRZYJAZNY_DLA_UZYTKOWNIKA",
        "NA_WSKUTEK",
        "SWIECIC_SUKCESY",
        "W_WEGRZECH",
        "KONDYCJA_FINANSOWA",
        "RULE_NIEMNIEJ",
        "FORMULA_KREMU",
        "PODDAWAC_W_WATPLIWOSC",
        "OPATRZEC_SIE",
        "ODGRYWAC_ZNACZENIE",
        "INFORMACJE_WRAZLIWE",
        "DO_DZIS_DZIEN",
        "CO_I_RAZ",
        "OKRAGLY_ROK",
        "SZERSZE_INFORMACJE",
        "WYSOKA_FORMA",
        "CZEKAC_ZA",
        "BYNAJMNIEJ",
        "WYWIERAC_PIETNO",
        "DOPATRZEC_SIE",
        "ZLA_RENOMA",
        "W_PELNYM_TEGO",
        "W_KAZDYM_BADZ",
        "KOSZTOWAC_TANIEJ",
        "DYGITALNY",
    ]),
    (Validator.SPELLING_RULES_ID = ["SPELLER_RULE", "MORFOLOGIK_RULE", "HUNSPELL", "SPELLING_RULE"]),
    (Validator.STYLE_ISSUE_TYPES = ["style", "locale-violation", "register"]),
    (Validator.EMAIL_SIGNATURE_SEPARATOR_REGEXP = /^[\‐|\-]{2,}|[\‐|\-]{2,}$/),
    (Validator.ONLY_NUMBERS_REGEXP = /^[0-9]+$/),
    (Validator.COLON_WHITESPACE_REGEXP = /^[;:]\s/),
    (Validator.ONE_LETTER_AT_END_REGEXP = /\b[a-z]\s?$/i),
    (Validator.NUMBER_WITH_DOT_AT_END_REGEXP = /\d\.?\s?$/),
    (Validator.NUMBER_WITH_PARENTHESIS_AT_END_REGEXP = /\d\.?\)\s$/),
    (Validator.PUNCTUATION_AT_END = /(\.|\!)$/),
    (Validator.BULLET_POINT_REGEXP = /(\u25b6\ufe0e|\u25BA|\*|-|–|\u2606|\u2605|\u25cf|\u2022|\u25e6|\u27A4|\u2714)\s+$/),
    (Validator.LOWERCASE_REGEXP = /[a-z]/),
    (Validator.DOT_WITH_PREFIX_REGEXP = /\w\.$/),
    (Validator.SLASH_AT_END_REGEXP = /(\/|\\)$/),
    (Validator.AT_LEAST_TWO_LETTERS_AT_END_REGEXP = /[a-z]{2}$/i),
    (Validator.SLASH_AT_BEGINNING_REGEXP = /^(\/|\\)/),
    (Validator.QUOTE_AT_END_REGEXP = /[\"\“\”\„]$/),
    (Validator.QUOTE_AT_BEGINNING_REGEXP = /^[\"\“\”\„]/),
    (Validator.PUNCTUATION_AT_BEGINNING_REGEXP = /^\s?[\.\!\?,:…]/),
    (Validator.PUNCTUATION_SPACE_AT_END_REGEXP = /[\.…\?\!]\s+/),
    (Validator.MARKDOWN_HEADLINE_REGEXP = /^#{1,6}\s/m),
    (Validator.MARKDOWN_INLINE_FORMAT_AT_BEGINNING_REGEXP = /^[\*\~\_\^\+\%\@]/m),
    (Validator.PIPE_AT_END_REGEXP = /\|\s+$/),
    (Validator.MENTION_SYMBOL_AT_BEGINNING_REGEXP = /@[a-z\.\-]*$/i),
    (Validator.HASH_SYMBOL_AT_BEGINNING_REGEXP = /#[a-z\.\-]*$/i),
    (Validator.EMOJI_SENTENCE_START_REGEXP = /(\.|!|\?|^)\s?(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])\s+/),
    (Validator.ABBREVIATION_AT_END_REGEXP = /(\s|\(|^)[A-Z]\.$/),
    (Validator.NET_AT_BEGINNING_REGEXP = /^net\b/i),
    (Validator.SINGLE_UPPERCASE_LETTER_REGEXP = /^[A-Z]$/),
    (Validator.HTML_ENTITIES = ["amp", "nbsp", "gt", "lt", "bull", "euro", "copy", "laquo", "raquo", "hellip", "middot"]),
    (Validator.HTML_ENTITIES_WITH_AND = Validator.HTML_ENTITIES.map((e) => `&${e}`)),
    (Validator.WAVY_DASH_REGEXP = /^\u3030+$/),
    (Validator.ZWS_REGEXP = /^\uFEFF+$/),
    (Validator.ZWNJ_REGEXP = /\u200B|\u200C/g),
    (Validator.ZWS = "\ufeff"),
    (Validator.MID_SENTENCE_LINE_BREAK = /[\wáàâóòìíéèùúâôîêûäöüß,][\u0020\u00A0\uFEFF]*\n\n\n?[\u0020\u00A0\uFEFF]*$/),
    (Validator.COMMON_TLDS = [
        "com",
        "co",
        "org",
        "net",
        "de",
        "info",
        "biz",
        "es",
        "fr",
        "be",
        "in",
        "gov",
        "nl",
        "ca",
        "com.br",
        "br",
        "at",
        "us",
        "au",
        "ru",
        "pl",
        "ly",
        "it",
        "cat",
        "edu",
        "jp",
        "ko",
        "cn",
        "se",
        "no",
        "mil",
        "ch",
        "dk",
        "com.mx",
        "mx",
        "eu",
        "co.uk",
        "uk",
        "ir",
        "cz",
        "ua",
        "kr",
        "gr",
        "tw",
        "nz",
        "co.nz",
        "za",
        "ro",
        "vn",
        "io",
        "tr",
        "me",
        "fi",
        "tv",
        "xyz",
        "pt",
        "ie",
        "app",
    ]),
    (Validator.COMMON_TLD_WITH_DOT_REGEXPS = Validator.COMMON_TLDS.map((e) => new RegExp(`^\\.${e.replace(".", "\\.")}\\b`, "i"))),
    (Validator.COMMON_FILE_TYPES = [
        "jpeg",
        "jpg",
        "gif",
        "png",
        "bmp",
        "svg",
        "ai",
        "sketch",
        "ico",
        "ps",
        "psd",
        "tiff",
        "tif",
        "mp3",
        "wav",
        "midi",
        "mid",
        "aif",
        "mpa",
        "ogg",
        "wma",
        "wpl",
        "cda",
        "7z",
        "arj",
        "deb",
        "pkg",
        "plist",
        "rar",
        "rpm",
        "tar.gz",
        "tar",
        "zip",
        "bin",
        "dmg",
        "iso",
        "toast",
        "vcd",
        "csv",
        "dat",
        "db",
        "log",
        "mdb",
        "sav",
        "sql",
        "xml",
        "apk",
        "bat",
        "bin",
        "cgi",
        "com",
        "exe",
        "gadget",
        "jar",
        "py",
        "js",
        "jsx",
        "json",
        "wsf",
        "ts",
        "tsx",
        "fnt",
        "fon",
        "otf",
        "ttf",
        "woff",
        "woff2",
        "rb",
        "java",
        "php",
        "html",
        "asp",
        "aspx",
        "cer",
        "cfm",
        "cgi",
        "pl",
        "css",
        "scss",
        "htm",
        "jsp",
        "part",
        "rss",
        "xhtml",
        "key",
        "odp",
        "pps",
        "ppt",
        "pptx",
        "class",
        "cpp",
        "cs",
        "h",
        "sh",
        "swift",
        "vb",
        "ods",
        "odt",
        "xlr",
        "xls",
        "xlsx",
        "xlt",
        "xltx",
        "bak",
        "cab",
        "cfg",
        "cpl",
        "cur",
        "dll",
        "dmp",
        "msi",
        "ini",
        "tmp",
        "3g2",
        "3gp",
        "avi",
        "flv",
        "h264",
        "m4v",
        "mkv",
        "mov",
        "mp4",
        "mpg",
        "mpeg",
        "rm",
        "swf",
        "vob",
        "wmv",
        "doc",
        "docx",
        "dot",
        "dotx",
        "pdf",
        "rtf",
        "srx",
        "text",
        "tex",
        "wks",
        "wps",
        "wpd",
        "txt",
        "yaml",
        "yml",
        "csl",
        "md",
        "adm",
    ]),
    (Validator.COMMON_FILE_TYPE_WITH_DOT_REGEXPS = Validator.COMMON_FILE_TYPES.map((e) => new RegExp(`^[\\wáàâóòìíéèùúâôîêûäöüß\\-\\.\\(\\)]*?\\.${e}\\b`, "i"))),
    (Validator.FILE_TYPE_AT_BEGINNING_REGEXP = new RegExp(`(${Validator.COMMON_FILE_TYPES.join("|")})\b`, "i")),
    (Validator._storageController = StorageController.create()),
    (Validator._validationAbortControllers = new Map()),
    (Validator._partialValidationAbortControllers = new Map()),
    (Validator._languageDetectionAbortControllers = new Map()),
    (Validator._useValidationFallbackServer = !1),
    (Validator._usePartialValidationFallbackServer = !1),
    (Validator._useLanguageDetectionFallbackServer = !1),
    (Validator._mainServerUnavailabilityTimeStamp = 0),
    (Validator._isInitialized = !1),
    Validator._constructor();
