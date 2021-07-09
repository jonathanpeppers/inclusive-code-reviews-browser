/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
!(function () {
    const e = document.getElementById("banner"),
        t = document.getElementById("login"),
        n = document.getElementById("login-options"),
        o = document.getElementById("logout-button"),
        s = document.getElementById("manage-account-button"),
        a = document.getElementById("login-popup-button"),
        i = document.getElementById("managed-login"),
        l = document.getElementById("managed-login-options"),
        d = document.getElementById("managed-login-button"),
        c = document.getElementById("managed-logout-button"),
        r = document.getElementById("lt-options-discount"),
        u = document.getElementById("toggleSynonymsSwitch"),
        g = document.getElementById("personalDictionary"),
        m = document.getElementById("personalDictionary-options"),
        p = document.getElementById("personalDictionaryList"),
        y = document.getElementById("personalDictionaryInput"),
        E = document.getElementById("addToPersonalDictionary"),
        h = document.getElementById("personalDictionary-options__clearAll"),
        v = document.getElementById("personalDictionary-options__copy"),
        k = document.getElementById("ignoredRules"),
        f = document.getElementById("ignoredRules-options"),
        b = document.getElementById("ignoredRulesList"),
        D = document.getElementById("ignoredRules-options__clearAll"),
        S = document.getElementById("disabledDomains"),
        I = document.getElementById("disabledDomains-options"),
        L = document.getElementById("disabledDomainsList"),
        _ = document.getElementById("disabledDomainsInput"),
        C = document.getElementById("addToDisabledDomains"),
        B = document.getElementById("disabledDomains-options__clearAll"),
        M = document.getElementById("experimental"),
        T = document.getElementById("experimental-options"),
        A = document.getElementById("serverUrl"),
        w = document.getElementById("serverType-cloud"),
        R = document.getElementById("serverType-local"),
        O = document.getElementById("serverType-custom"),
        U = document.getElementById("localServerAvailabilityWarning"),
        x = document.getElementById("retryLocalServer"),
        N = document.getElementById("customServerUrl"),
        P = document.getElementById("motherTongue"),
        V = document.getElementById("variant-en"),
        H = document.getElementById("variant-de"),
        $ = document.getElementById("variant-pt"),
        G = document.getElementById("variant-ca"),
        q = document.getElementById("autoCheckAllDomains"),
        Y = document.getElementById("autoCheckDomains-options"),
        F = document.getElementById("autoCheckDomains"),
        W = document.getElementById("autoCheckDomainInput"),
        z = document.getElementById("addToAutoCheckDomains"),
        j = document.getElementById("autoCheckDomains-options__clearAll"),
        J = document.getElementById("ignoredDomains-options"),
        K = document.getElementById("ignoredDomains"),
        Q = document.getElementById("ignoredDomainInput"),
        X = document.getElementById("addToIgnoredDomains"),
        Z = document.getElementById("ignoredDomains-options__clearAll"),
        ee = document.getElementById("copyright-link"),
        te = /^(https?:\/\/)?localhost(:[0-9]{1,5})?(\/.*)?$/i,
        ne = /^(https?:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,15}(:[0-9]{1,5})?(\/.*)?$/i,
        oe = /^(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}$/,
        se = StorageController.create();
    function ae(e) {
        return te.test(e) || ne.test(e) || oe.test(e);
    }
    function ie() {
        const { hasPaidSubscription: e } = se.getUIState();
        document.body.classList.toggle("lt-options--plus", e),
            (function () {
                // do nothing
            })(),
            le();
    }
    function le() {
        const { apiServerUrl: o, disablePersonalDictionary: a, disableIgnoredRules: d, loginUrl: c } = se.getManagedSettings(),
            { havePremiumAccount: r, username: u } = se.getSettings();
        a && ((g.style.display = "none"), (m.style.display = "none")),
            d && ((k.style.display = "none"), (f.style.display = "none")),
            o && ((A.style.display = "none"), (e.style.display = "none")),
            c && ((e.style.display = "none"), (t.style.display = "none"), (n.style.display = "none"), (s.style.display = "none"), (i.style.display = ""), (l.style.display = ""));
    }
    function de() {
        // do nothing
    }
    function ce() {
        // do nothing
    }
    function re(e = Dictionary.getSorted(), t = 0 === Dictionary.get().length) {
        p.innerHTML = "";
        for (const t of e) {
            const e = document.createElement("li");
            e.className = "lt-options__personalDictionary__item";
            const n = document.createElement("span");
            (n.className = "lt-options__personalDictionary__title"), (n.textContent = t), e.appendChild(n);
            const o = document.createElement("span");
            (o.className = "lt-options__personalDictionary__delete-button"), (o.dataset.word = t), o.addEventListener("click", me), e.appendChild(o), p.appendChild(e);
        }
        const n = document.getElementById("personalDictionary-optionsInside"),
            o = document.getElementById("personalDictionary-options__emptyState"),
            s = document.getElementById("personalDictionary-options__emptySearch");
        e.length > 0
            ? ((n.style.display = "block"), (o.style.display = "none"), (s.style.display = "none"))
            : t
            ? ((n.style.display = "none"), (o.style.display = "block"), (s.style.display = "none"))
            : ((n.style.display = "none"), (o.style.display = "none"), (s.style.display = "block"));
    }
    function ue() {
        const e = y.value;
        E.disabled = "" === e.trim();
        const t = Dictionary.getSorted(),
            n = [];
        for (const o of t) o.includes(e) && n.push(o);
        re(n, 0 === t.length);
    }
    function ge() {
        const e = y.value.trim();
        e && (Dictionary.add(e).then(() => re()), (y.value = ""), (E.disabled = !0));
    }
    function me(e) {
        const t = e.currentTarget.dataset.word;
        t && Dictionary.remove(t).then(ue);
    }
    function pe() {
        b.innerHTML = "";
        const e = se.getSettings().ignoredRules,
            t = i18nManager.getMessage("enableRuleTooltip");
        for (const n of e) {
            if (n.language) {
                const e = LanguageManager.getUserLanguageCodes().some((e) => n.language.toLowerCase().startsWith(e) || "*" === n.language);
                if (StorageControllerClass.getDefaultSettings().ignoredRules.some((e) => e.id === n.id) && !e) continue;
            }
            const e = document.createElement("li");
            e.className = "lt-options__rules__item";
            const o = document.createElement("span");
            (o.className = "lt-options__rules__title"), (o.textContent = "- " + (n.description || n.id)), e.appendChild(o);
            const s = document.createElement("span");
            (s.className = "lt-options__rules__enable-button"), s.setAttribute("title", t), (s.dataset.ruleId = n.id), (s.textContent = t), s.addEventListener("click", ye), e.appendChild(s), b.appendChild(e);
        }
        const n = document.getElementById("ignoredRules-optionsInside"),
            o = document.getElementById("ignoredRules-options__emptyState");
        e.length > 0 ? ((n.style.display = "block"), (o.style.display = "none")) : ((n.style.display = "none"), (o.style.display = "block"));
    }
    function ye(e) {
        const t = e.currentTarget.dataset.ruleId;
        if (t) {
            const e = se.getSettings().ignoredRules.filter((e) => e.id !== t);
            se.updateSettings({ ignoredRules: e }).then(pe);
        }
    }
    function Ee(e = se.getSettings().disabledDomains, t = se.getSettings().disabledDomains.length > 0) {
        L.innerHTML = "";
        const n = i18nManager.getMessage("settingsEnableDomain");
        for (const t of e) {
            const e = document.createElement("li");
            e.className = "lt-options__rules__item";
            const o = document.createElement("span");
            (o.className = "lt-options__rules__title"), (o.textContent = "● " + t), e.appendChild(o);
            const s = document.createElement("span");
            (s.className = "lt-options__rules__enable-button"), s.setAttribute("title", n), (s.dataset.domain = t), (s.textContent = n), s.addEventListener("click", ke), e.appendChild(s), L.appendChild(e);
        }
        const o = document.getElementById("disabledDomains-optionsInside"),
            s = document.getElementById("disabledDomains-options__emptyState"),
            a = document.getElementById("disabledDomains-options__emptySearch");
        e.length > 0
            ? ((o.style.display = "block"), (s.style.display = "none"), (a.style.display = "none"))
            : t
            ? ((o.style.display = "none"), (s.style.display = "block"), (a.style.display = "none"))
            : ((o.style.display = "none"), (s.style.display = "none"), (a.style.display = "block"));
    }
    function he() {
        const e = _.value;
        C.disabled = "" === e.trim();
        const t = se.getSettings().disabledDomains.sort((e, t) => e.toLowerCase().localeCompare(t.toLowerCase())),
            n = [];
        for (const o of t) o.includes(e) && n.push(o);
        Ee(n, 0 === t.length);
    }
    function ve() {
        const e = _.value.trim(),
            t = getDomain(e, "");
        if ("" === t.trim() || !ae(e)) return void alert(i18nManager.getMessage("settingsDomainInvalid"));
        (_.value = ""), (C.disabled = !0);
        const n = se.getSettings().disabledDomains;
        n.includes(t) ? Ee(n, !1) : (n.push(t), se.updateSettings({ disabledDomains: n }).then(() => Ee(n, !1)));
    }
    function ke(e) {
        const t = e.currentTarget.dataset.domain;
        if (t) {
            const e = se.getSettings().disabledDomains.filter((e) => e !== t);
            se.updateSettings({ disabledDomains: e }).then(he);
        }
    }
    function fe() {
        be(O.checked), R.checked ? De() : (U.style.display = "none");
    }
    function be(e = !1) {
        (N.style.display = e ? "block" : "none"), (N.required = e), e ? (N.value = N.dataset.prevValue || "") : ((N.dataset.prevValue = N.value), (N.value = ""));
    }
    function De() {
        fetch(config.LOCAL_SERVER_URL + "/languages", { method: "GET", mode: "cors" })
            .then(() => {
                U.style.display = "none";
            })
            .catch(() => {
                U.style.display = "block";
            });
    }
    function Se(e = !1) {
        (Y.style.display = e ? "none" : ""), (J.style.display = e ? "" : "none");
    }
    function Ie(e = se.getSettings().autoCheckOnDomains, t = 0 === se.getSettings().autoCheckOnDomains.length) {
        F.innerHTML = "";
        const n = i18nManager.getMessage("settingsDeleteAutoCheckDomain");
        for (const t of e) {
            const e = document.createElement("li");
            e.className = "lt-options__rules__item";
            const o = document.createElement("span");
            (o.className = "lt-options__rules__title"), (o.textContent = "● " + t), e.appendChild(o);
            const s = document.createElement("span");
            (s.className = "lt-options__rules__enable-button"), s.setAttribute("title", n), (s.dataset.domain = t), (s.textContent = n), s.addEventListener("click", Ce), e.appendChild(s), F.appendChild(e);
        }
        const o = document.getElementById("autoCheckDomains-optionsInside"),
            s = document.getElementById("autoCheckDomains-options__emptyState"),
            a = document.getElementById("autoCheckDomains-options__emptySearch");
        e.length > 0
            ? ((o.style.display = "block"), (s.style.display = "none"), (a.style.display = "none"))
            : t
            ? ((o.style.display = "none"), (s.style.display = "block"), (a.style.display = "none"))
            : ((o.style.display = "none"), (s.style.display = "none"), (a.style.display = "block"));
    }
    function Le() {
        const e = W.value;
        z.disabled = "" === e.trim();
        const t = se.getSettings().autoCheckOnDomains.sort((e, t) => e.toLowerCase().localeCompare(t.toLowerCase())),
            n = [];
        for (const o of t) o.includes(e) && n.push(o);
        Ie(n, 0 === t.length);
    }
    function _e() {
        const e = W.value.trim(),
            t = getDomain(e, "");
        if ("" === t.trim() || !ae(e)) return void alert(i18nManager.getMessage("settingsDomainInvalid"));
        (W.value = ""), (z.disabled = !0);
        const n = se.getSettings().autoCheckOnDomains;
        n.includes(t) ? Ie(n, !1) : (n.push(t), se.updateSettings({ autoCheckOnDomains: n }).then(() => Ie(n, !1)));
    }
    function Ce(e) {
        const t = e.currentTarget.dataset.domain;
        if (t) {
            const e = se.getSettings().autoCheckOnDomains.filter((e) => e !== t);
            se.updateSettings({ autoCheckOnDomains: e }).then(() => Ie(e, 0 === e.length));
        }
    }
    function Be(e = se.getSettings().ignoreCheckOnDomains, t = 0 === se.getSettings().ignoreCheckOnDomains.length) {
        K.innerHTML = "";
        const n = i18nManager.getMessage("settingsDeleteIgnoredDomain");
        for (const t of e) {
            const e = document.createElement("li");
            e.className = "lt-options__rules__item";
            const o = document.createElement("span");
            (o.className = "lt-options__rules__title"), (o.textContent = "● " + t), e.appendChild(o);
            const s = document.createElement("span");
            (s.className = "lt-options__rules__enable-button"), s.setAttribute("title", n), (s.dataset.domain = t), (s.textContent = n), s.addEventListener("click", Ae), e.appendChild(s), K.appendChild(e);
        }
        const o = document.getElementById("ignoredDomains-optionsInside"),
            s = document.getElementById("ignoredDomains-options__emptyState"),
            a = document.getElementById("ignoredDomains-options__emptySearch");
        e.length > 0
            ? ((o.style.display = "block"), (s.style.display = "none"), (a.style.display = "none"))
            : t
            ? ((o.style.display = "none"), (s.style.display = "block"), (a.style.display = "none"))
            : ((o.style.display = "none"), (s.style.display = "none"), (a.style.display = "block"));
    }
    function Me() {
        const e = Q.value;
        X.disabled = "" === e.trim();
        const t = se.getSettings().ignoreCheckOnDomains.sort((e, t) => e.toLowerCase().localeCompare(t.toLowerCase())),
            n = [];
        for (const o of t) o.includes(e) && n.push(o);
        Be(n, 0 === t.length);
    }
    function Te() {
        const e = Q.value.trim(),
            t = getDomain(e);
        if ("" === t.trim() || !ae(e)) return void alert(i18nManager.getMessage("settingsDomainInvalid"));
        (Q.value = ""), (X.disabled = !0);
        const n = se.getSettings().ignoreCheckOnDomains;
        n.includes(t) ? Be(n, !1) : (n.push(t), se.updateSettings({ ignoreCheckOnDomains: n }).then(() => Be(n, !1)));
    }
    function Ae(e) {
        const t = e.currentTarget.dataset.domain;
        if (t) {
            const e = se.getSettings().ignoreCheckOnDomains.filter((e) => e !== t);
            se.updateSettings({ ignoreCheckOnDomains: e }).then(() => Be(e, 0 === e.length));
        }
    }
    translateSection(document.documentElement),
        (document.getElementById("privacyPolicy").innerHTML = "<a target='_blank' href='https://languagetool.org/privacy/'>" + i18nManager.getMessage("privacyPolicy") + "</a>"),
        Array.from(document.querySelectorAll("[data-premium-link]")).forEach((e) => {
            e.addEventListener("click", (e) => {
                browser.runtime.sendMessage({ command: "OPEN_PREMIUM_PAGE", campaign: "addon2-options" }), e.preventDefault();
            });
        });
    const we = location.hash.replace(/\?.*$/, ""),
        Re = document.querySelector(we || "#login");
    let Oe;
    Re &&
        Re.nextElementSibling &&
        Re.nextElementSibling.classList.contains("lt-toggle-box") &&
        (Re.classList.add("lt-options-toggle-visible"), Re.nextElementSibling.classList.add("lt-options-visible"), we && document.documentElement.scrollTo(0, Re.offsetTop - 75)),
        LanguageManager.getUserLanguageCodes().some((e) => e.startsWith("de") || e.startsWith("fr") || e.startsWith("nl")) && (document.getElementById("made-in-potsdam").style.display = "inline"),
        se.onReady(function () {
            ie(), re(), pe(), Ee(), le();
            const e = se.getSettings();
            e.apiServerUrl === config.MAIN_SERVER_URL ? (w.checked = !0) : e.apiServerUrl === config.LOCAL_SERVER_URL ? (R.checked = !0) : (be(!0), (O.checked = !0), (N.value = e.apiServerUrl)),
                (P.value = e.motherTongue),
                (V.value = e.enVariant),
                (H.value = e.deVariant),
                ($.value = e.ptVariant),
                (G.value = e.caVariant),
                (q.checked = e.autoCheck),
                Se(e.autoCheck),
                e.hasSynonymsEnabled ? de() : ce(),
                Ie(),
                Be(),
                se.addEventListener(StorageControllerClass.eventNames.uiStateChanged, (e) => {
                    e.hasPaidSubscription && e.hasPaidSubscription.newValue && ie();
                });
        }),
        se.onReady(() => {
            se.startChangelogCoupon();
            const e = se.getActiveCoupon();
            e &&
                (window.clearInterval(Oe),
                (Oe = window.setInterval(() => {
                    (r.querySelector("#lt-options-dicount-percent").textContent = i18nManager.getMessage("upgradeTeaserDiscount", [e.percent])),
                        (r.querySelector("#lt-options-discount-expires").textContent = ` – ${i18nManager.getMessage("changelogDiscountExpires")} ${getCountdown(e.expires)}`),
                        r.classList.add("lt-options__discount--visible");
                }, 1e3)));
        }),
        Dictionary.init(se),
        Tracker.trackPageView(),
        g.addEventListener("click", () => {
            m.classList.toggle("lt-options-visible"), g.classList.toggle("lt-options-toggle-visible") && y.focus();
        }),
        y.addEventListener("keydown", (e) => {
            "Enter" === e.key && ge();
        }),
        y.addEventListener("input", () => {
            setTimeout(ue, 0);
        }),
        y.addEventListener("paste", function (e) {
            if (y.value) return;
            if (!e.clipboardData) return;
            const t = e.clipboardData.getData("text/plain");
            if (!t) return;
            const n = t.split(/\s+/);
            n.length <= 1 || (e.preventDefault(), Dictionary.addBatch(n).then(() => re()));
        }),
        E.addEventListener("click", ge),
        h.addEventListener("click", function () {
            confirm(i18nManager.getMessage("settingsAreYouSure")) && Dictionary.clear().then(() => re([], !0));
        }),
        v.addEventListener("click", function () {
            const e = Dictionary.getSorted(),
                t = document.createElement("textarea");
            (t.value = e.join("\n")), document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t);
            const n = document.getElementById("personalDictionary-options__copyMessage");
            (n.style.display = "block"),
                wait(3e3).then(() =>
                    fadeOut(n, () => {
                        (n.style.display = "none"), (n.style.opacity = "1");
                    })
                );
        }),
        k.addEventListener("click", () => {
            k.classList.toggle("lt-options-toggle-visible"), f.classList.toggle("lt-options-visible");
        }),
        D.addEventListener("click", function () {
            se.updateSettings({ ignoredRules: [] }).then(pe);
        }),
        S.addEventListener("click", () => {
            I.classList.toggle("lt-options-visible"), S.classList.toggle("lt-options-toggle-visible") && _.focus();
        }),
        _.addEventListener("keydown", (e) => {
            "Enter" === e.key && ve();
        }),
        _.addEventListener("input", () => {
            setTimeout(he, 0);
        }),
        _.addEventListener("paste", function (e) {
            if (_.value) return;
            if (!e.clipboardData) return;
            const t = e.clipboardData.getData("text/plain");
            if (!t) return;
            const n = t.split(/\s+/);
            if (n.length <= 1) return;
            e.preventDefault();
            const o = se.getSettings().disabledDomains;
            n.forEach((e) => {
                const t = getDomain(e, "");
                t.trim() && ae(e) && !o.includes(t) && o.push(t);
            }),
                se.updateSettings({ disabledDomains: o }).then(he);
        }),
        C.addEventListener("click", ve),
        B.addEventListener("click", function () {
            confirm(i18nManager.getMessage("settingsAreYouSure")) && se.updateSettings({ disabledDomains: [] }).then(() => Ee([], !0));
        }),
        M.addEventListener("click", (e) => {
            M.classList.toggle("lt-options-toggle-visible"), T.classList.toggle("lt-options-visible");
        }),
        w.addEventListener("click", fe),
        R.addEventListener("click", fe),
        O.addEventListener("click", fe),
        x.addEventListener("click", (e) => {
            e.preventDefault(), De();
        }),
        A.addEventListener("submit", (e) => {
            e.preventDefault(),
                (function () {
                    let e = "";
                    e = w.checked ? config.MAIN_SERVER_URL : R.checked ? config.LOCAL_SERVER_URL : N.value.trim();
                    const t = document.getElementById("serverUrl-success"),
                        n = document.getElementById("serverUrl-error");
                    se.updateSettings({ apiServerUrl: e })
                        .then(() => {
                            se.checkForPaidSubscription().then(() => {
                                ie();
                            }),
                                (t.style.display = "block"),
                                wait(3e3).then(() =>
                                    fadeOut(t, () => {
                                        (t.style.display = "none"), (t.style.opacity = "1");
                                    })
                                );
                        })
                        .catch(() => {
                            (n.style.display = "block"),
                                wait(3e3).then(() =>
                                    fadeOut(n, () => {
                                        (n.style.display = "none"), (n.style.opacity = "1");
                                    })
                                );
                        });
                })();
        }),
        P.addEventListener("change", function () {
            se.updateSettings({ motherTongue: P.value });
        }),
        V.addEventListener("change", function () {
            se.updateSettings({ enVariant: V.value });
        }),
        H.addEventListener("change", function () {
            se.updateSettings({ deVariant: H.value });
        }),
        $.addEventListener("change", function () {
            se.updateSettings({ ptVariant: $.value });
        }),
        G.addEventListener("change", function () {
            se.updateSettings({ caVariant: G.value });
        }),
        q.addEventListener("input", () => {
            se.updateSettings({ autoCheck: q.checked }), Se(q.checked);
        }),
        W.addEventListener("keydown", (e) => {
            "Enter" === e.key && _e();
        }),
        W.addEventListener("input", () => {
            setTimeout(Le, 0);
        }),
        W.addEventListener("paste", function (e) {
            if (W.value) return;
            if (!e.clipboardData) return;
            const t = e.clipboardData.getData("text/plain");
            if (!t) return;
            const n = t.split(/\s+/);
            if (n.length <= 1) return;
            e.preventDefault();
            const o = se.getSettings().autoCheckOnDomains;
            n.forEach((e) => {
                const t = getDomain(e, "");
                t.trim() && ae(e) && !o.includes(t) && o.push(t);
            }),
                se.updateSettings({ autoCheckOnDomains: o }).then(Le);
        }),
        z.addEventListener("click", _e),
        j.addEventListener("click", function () {
            confirm(i18nManager.getMessage("settingsAreYouSure")) && se.updateSettings({ autoCheckOnDomains: [] }).then(() => Ie([], !0));
        }),
        Q.addEventListener("keydown", (e) => {
            "Enter" === e.key && Te();
        }),
        Q.addEventListener("input", () => {
            setTimeout(Me, 0);
        }),
        Q.addEventListener("paste", function (e) {
            if (Q.value) return;
            if (!e.clipboardData) return;
            const t = e.clipboardData.getData("text/plain");
            if (!t) return;
            const n = t.split(/\s+/);
            if (n.length <= 1) return;
            e.preventDefault();
            const o = se.getSettings().ignoreCheckOnDomains;
            n.forEach((e) => {
                const t = getDomain(e);
                t.trim() && ae(e) && !o.includes(t) && o.push(t);
            }),
                se.updateSettings({ ignoreCheckOnDomains: o }).then(Me);
        }),
        X.addEventListener("click", Te),
        Z.addEventListener("click", function () {
            confirm(i18nManager.getMessage("settingsAreYouSure")) && se.updateSettings({ ignoreCheckOnDomains: [] }).then(() => Be([], !0));
        }),
        BrowserDetector.isSafari() && ee instanceof HTMLAnchorElement && (ee.href += ee.href.includes("?") ? "&hidePremium=true" : "?hidePremium=true"),
        se.onReady(() => {
            const e = document.querySelector("#heart");
            if (e) {
                const { showRuleId: t } = se.getUIState();
                let n = 0;
                (e.style.cursor = "default"),
                    (e.style.userSelect = "none"),
                    t && (e.style.color = "blue"),
                    e.addEventListener("click", (o) => {
                        4 == ++n && (t ? ((e.style.color = ""), se.updateUIState({ showRuleId: !1 })) : ((e.style.color = "blue"), se.updateUIState({ showRuleId: !0 }))), o.preventDefault();
                    });
            }
        });
})();
