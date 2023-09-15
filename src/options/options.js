/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
!(function () {
    const
        disabledDomains = document.getElementById("disabledDomains"),
        disabledDomainsOptions = document.getElementById("disabledDomains-options"),
        disabledDomainsList = document.getElementById("disabledDomainsList"),
        disabledDomainsInput = document.getElementById("disabledDomainsInput"),
        addToDisabledDomains = document.getElementById("addToDisabledDomains"),
        disabledDomainsClearAll = document.getElementById("disabledDomains-options__clearAll"),
        copyrightLink = document.getElementById("copyright-link"),
        regex1 = /^(https?:\/\/)?localhost(:[0-9]{1,5})?(\/.*)?$/i,
        regex2 = /^(https?:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,15}(:[0-9]{1,5})?(\/.*)?$/i,
        regex3 = /^(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}$/,
        storageController = StorageController.create();
    function isValidDomain(e) {
        return regex1.test(e) || regex2.test(e) || regex3.test(e);
    }
    function updateDisplay() {
        const { apiServerUrl: o, loginUrl: c } = storageController.getManagedSettings();
            o && ((A.style.display = "none"), (e.style.display = "none")),
            c && ((e.style.display = "none"), (t.style.display = "none"), (n.style.display = "none"), (s.style.display = "none"), (i.style.display = ""), (l.style.display = ""));
    }
    function updateDisabledDomains(e = storageController.getSettings().disabledDomains, t = storageController.getSettings().disabledDomains.length > 0) {
        disabledDomainsList.innerHTML = "";
        const n = i18nManager.getMessage("settingsEnableDomain");
        for (const t of e) {
            const e = document.createElement("li");
            e.className = "lt-options__rules__item";
            const o = document.createElement("span");
            (o.className = "lt-options__rules__title"), (o.textContent = "● " + t), e.appendChild(o);
            const s = document.createElement("span");
            (s.className = "lt-options__rules__enable-button"), s.setAttribute("title", n), (s.dataset.domain = t), (s.textContent = n), s.addEventListener("click", addDisabledDomain), e.appendChild(s), disabledDomainsList.appendChild(e);
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
    function updateDisabledDomainsInput() {
        const e = disabledDomainsInput.value;
        addToDisabledDomains.disabled = "" === e.trim();
        const t = storageController.getSettings().disabledDomains.sort((e, t) => e.toLowerCase().localeCompare(t.toLowerCase())),
            n = [];
        for (const o of t) o.includes(e) && n.push(o);
        updateDisabledDomains(n, 0 === t.length);
    }
    function ve() {
        const e = disabledDomainsInput.value.trim(),
            t = getDomain(e, "");
        if ("" === t.trim() || !isValidDomain(e)) return void alert(i18nManager.getMessage("settingsDomainInvalid"));
        (disabledDomainsInput.value = ""), (addToDisabledDomains.disabled = !0);
        const n = storageController.getSettings().disabledDomains;
        n.includes(t) ? updateDisabledDomains(n, !1) : (n.push(t), storageController.updateSettings({ disabledDomains: n }).then(() => updateDisabledDomains(n, !1)));
    }
    function addDisabledDomain(e) {
        const t = e.currentTarget.dataset.domain;
        if (t) {
            const e = storageController.getSettings().disabledDomains.filter((e) => e !== t);
            storageController.updateSettings({ disabledDomains: e }).then(updateDisabledDomainsInput);
        }
    }
    function Ie(e = storageController.getSettings().autoCheckOnDomains, t = 0 === storageController.getSettings().autoCheckOnDomains.length) {
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
    function Ce(e) {
        const t = e.currentTarget.dataset.domain;
        if (t) {
            const e = storageController.getSettings().autoCheckOnDomains.filter((e) => e !== t);
            storageController.updateSettings({ autoCheckOnDomains: e }).then(() => Ie(e, 0 === e.length));
        }
    }
    function Be(e = storageController.getSettings().ignoreCheckOnDomains, t = 0 === storageController.getSettings().ignoreCheckOnDomains.length) {
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
            const e = storageController.getSettings().ignoreCheckOnDomains.filter((e) => e !== t);
            storageController.updateSettings({ ignoreCheckOnDomains: e }).then(() => Be(e, 0 === e.length));
        }
    }
    translateSection(document.documentElement),
        storageController.onReady(function () { updateDisabledDomains(), updateDisplay(); }),
        Dictionary.init(storageController),
        Tracker.trackPageView(),
        disabledDomains.addEventListener("click", () => {
            disabledDomainsOptions.classList.toggle("lt-options-visible"), disabledDomains.classList.toggle("lt-options-toggle-visible") && disabledDomainsInput.focus();
        }),
        disabledDomainsInput.addEventListener("keydown", (e) => {
            "Enter" === e.key && ve();
        }),
        disabledDomainsInput.addEventListener("input", () => {
            setTimeout(updateDisabledDomainsInput, 0);
        }),
        disabledDomainsInput.addEventListener("paste", function (e) {
            if (disabledDomainsInput.value) return;
            if (!e.clipboardData) return;
            const t = e.clipboardData.getData("text/plain");
            if (!t) return;
            const n = t.split(/\s+/);
            if (n.length <= 1) return;
            e.preventDefault();
            const o = storageController.getSettings().disabledDomains;
            n.forEach((e) => {
                const t = getDomain(e, "");
                t.trim() && isValidDomain(e) && !o.includes(t) && o.push(t);
            }),
                storageController.updateSettings({ disabledDomains: o }).then(updateDisabledDomainsInput);
        }),
        addToDisabledDomains.addEventListener("click", ve),
        disabledDomainsClearAll.addEventListener("click", function () {
            confirm(i18nManager.getMessage("settingsAreYouSure")) && storageController.updateSettings({ disabledDomains: [] }).then(() => updateDisabledDomains([], !0));
        }),
        BrowserDetector.isSafari() && copyrightLink instanceof HTMLAnchorElement && (copyrightLink.href += copyrightLink.href.includes("?") ? "&hidePremium=true" : "?hidePremium=true"),
        storageController.onReady(() => {
            const e = document.querySelector("#heart");
            if (e) {
                const { showRuleId: t } = storageController.getUIState();
                let n = 0;
                (e.style.cursor = "default"),
                    (e.style.userSelect = "none"),
                    t && (e.style.color = "blue"),
                    e.addEventListener("click", (o) => {
                        4 == ++n && (t ? ((e.style.color = ""), storageController.updateUIState({ showRuleId: !1 })) : ((e.style.color = "blue"), storageController.updateUIState({ showRuleId: !0 }))), o.preventDefault();
                    });
            }
        });
})();
