/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
{
    const t = document.getElementById("status-box"),
        e = document.getElementById("status-headline"),
        a = document.getElementById("status-text"),
        s = document.getElementById("status-button"),
        n = document.getElementById("text-field");
    let r = !1,
        o = null;
    const i = StorageController.create();
    function initText() {
        const t = new URL(window.location.href).searchParams.get("id");
        if (t) {
            const e = { command: "GET_VALIDATOR_DATA", id: t };
            chrome.runtime
                .sendMessage(e)
                .then((t) => {
                    t && isGetValidatorDataResult(t) && (t.text && (n.innerText = t.text), history.replaceState({}, "", location.pathname));
                })
                .catch(() => {
                    Tracker.trackError("js", "validator_failed", "promise");
                })
                .then(() => {
                    Tracker.trackPageView();
                });
        } else (n.innerText = localStorage.getItem("validator-text") || ""), Tracker.trackPageView();
    }
    function onLTAssistantStateUpdated(s) {
        r || ((r = !0), t.setAttribute("data-initialized", "true"));
        const n = s.detail;
        if (JSON.stringify(n) === JSON.stringify(o)) return;
        const { hasPaidSubscription: d } = i.getUIState();
        o = n;
        const l = n.validationStatus;
        (t.className = "validator__status-box"),
            l === VALIDATION_STATUS.TEXT_TOO_SHORT
                ? (t.classList.add("validator__status-box--no-errors"), (e.textContent = i18nManager.getMessage("validatorNoTextStatus")), (a.textContent = ""))
                : l === VALIDATION_STATUS.TEXT_TOO_LONG
                ? (d ? (t.classList.add("validator__status-box--has-exception"), (a.textContent = "")) : (t.classList.add("validator__status-box--has-premium-errors"), (a.textContent = i18nManager.getMessage("dialogTextTooLongText"))),
                  (e.textContent = i18nManager.getMessage("validatorTextTooLongStatus")))
                : l === VALIDATION_STATUS.IN_PROGRESS
                ? (t.classList.add("validator__status-box--in-progress"), (e.textContent = i18nManager.getMessage("validatorLoadingHint")), (a.textContent = ""))
                : l === VALIDATION_STATUS.COMPLETED
                ? n.displayedErrors && n.displayedErrors.length
                    ? (t.classList.add("validator__status-box--has-errors"),
                      (e.textContent = 1 === n.displayedErrors.length ? i18nManager.getMessage("validatorHasMistakesHeadlineSingular") : i18nManager.getMessage("validatorHasMistakesHeadlinePlural", [n.displayedErrors.length])),
                      (a.textContent = i18nManager.getMessage("validatorHasMistakesText")))
                    : n.premiumErrors && n.premiumErrors.length
                    ? (t.classList.add("validator__status-box--has-premium-errors"),
                      (e.textContent = 1 === n.premiumErrors.length ? i18nManager.getMessage("validatorHasPremiumErrorsHeadlineSingular") : i18nManager.getMessage("validatorHasPremiumErrorsHeadlinePlural", [n.premiumErrors.length])),
                      (a.textContent = i18nManager.getMessage("validatorHasPremiumErrorsText")))
                    : (t.classList.add("validator__status-box--no-errors"), (e.textContent = i18nManager.getMessage("validatorNoMistakesHeadline")), (a.textContent = ""))
                : l === VALIDATION_STATUS.UNSUPPORTED_LANGUAGE
                ? (t.classList.add("validator__status-box--has-exception"), (e.textContent = i18nManager.getMessage("dialogUnsupportedLanguageHeadline")), (a.textContent = i18nManager.getMessage("dialogUnsupportedLanguageText")))
                : l === VALIDATION_STATUS.FAILED && n.validationErrorMessage
                ? ((a.textContent = ""), (e.textContent = n.validationErrorMessage), t.classList.add("validator__status-box--has-exception"))
                : ((a.textContent = ""), (e.textContent = i18nManager.getMessage("statusIconError")), t.classList.add("validator__status-box--has-exception"));
    }
    function onStatusButtonClick() {
        if (!o) return;
        let t = "https://languagetool.org/premium?pk_campaign=addon2-validator-premium-errors";
        (t += `&grammarMatches=${o.premiumErrors.filter((t) => !t.isStyleError).length}`), (t += `&styleMatches=${o.premiumErrors.filter((t) => t.isStyleError).length}`), window.open(t, "_target");
    }
    function onBeforeUnload() {
        localStorage.setItem("validator-text", n.innerText);
    }
    i.onReady(() => {
        i.getUIState().hasPaidSubscription || i.isUsedCustomServer() || document.getElementById("sidebar").classList.remove("validator__sidebar--collapsed"), i.startChangelogCoupon();
        const t = i.getActiveCoupon();
        t && (document.querySelector("#validator-upgrade-button").textContent = i18nManager.getMessage("upgradeTeaserDiscount", [t.percent])), initText();
    }),
        translateSection(document.documentElement),
        n.addEventListener(LTAssistant.events.UPDATE, onLTAssistantStateUpdated),
        s.addEventListener("click", onStatusButtonClick),
        window.addEventListener("beforeunload", onBeforeUnload),
        n.focus();
}
