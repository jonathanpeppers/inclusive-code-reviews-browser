/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
!(function () {
    const 
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
        ee = document.getElementById("copyright-link"),
        te = /^(https?:\/\/)?localhost(:[0-9]{1,5})?(\/.*)?$/i,
        ne = /^(https?:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,15}(:[0-9]{1,5})?(\/.*)?$/i,
        oe = /^(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}$/,
        se = StorageController.create();
    function ae(e) {
        return te.test(e) || ne.test(e) || oe.test(e);
    }
    function le() {
        const { apiServerUrl: o, disablePersonalDictionary: a, disableIgnoredRules: d, loginUrl: c } = se.getManagedSettings();
        a && ((g.style.display = "none"), (m.style.display = "none")),
            d && ((k.style.display = "none"), (f.style.display = "none")),
            o && ((A.style.display = "none"), (e.style.display = "none")),
            c && ((e.style.display = "none"), (t.style.display = "none"), (n.style.display = "none"), (s.style.display = "none"), (i.style.display = ""), (l.style.display = ""));
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
    function Ae(e) {
        const t = e.currentTarget.dataset.domain;
        if (t) {
            const e = se.getSettings().ignoreCheckOnDomains.filter((e) => e !== t);
            se.updateSettings({ ignoreCheckOnDomains: e }).then(() => Be(e, 0 === e.length));
        }
    }
    translateSection(document.documentElement),
        se.onReady(function () { re(), pe(), Ee(), le(); }),
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
