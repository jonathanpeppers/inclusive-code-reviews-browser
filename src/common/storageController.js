/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class StorageControllerClass {
    constructor(e) {
        (this._eventBus = new EventBus()), (this._onReadyCallbacks = []), e && this._onReadyCallbacks.push(e);
    }
    static _combineObjects(e, n) {
        const a = clone(e);
        for (const e in a) n.hasOwnProperty(e) && (a[e] = n[e]);
        return a;
    }
    static _dec2hex(e) {
        return ("0" + e.toString(16)).substr(-2);
    }
    static _generateUniqueId() {
        const e = new Uint8Array(8);
        return self.crypto.getRandomValues(e), Array.from(e, StorageControllerClass._dec2hex).join("");
    }
    static _normalizeDomain(e = "") {
        return e
            .toLowerCase()
            .trim()
            .replace(/^www\./, "");
    }
    static _isListContainsDomain(e, n) {
        const a = StorageControllerClass._normalizeDomain(n);
        return (e || []).some((e) => {
            const n = StorageControllerClass._normalizeDomain(e);
            return n === a || a.endsWith("." + n);
        });
    }
    static getDefaultSettings() {
        return clone(StorageControllerClass.DEFAULT_SETTINGS);
    }
    static getDefaultPrivacySettings() {
        return clone(StorageControllerClass.DEFAULT_PRIVACY_SETTINGS);
    }
    addEventListener(e, n) {
        this._eventBus.subscribe(e, n);
    }
    disableDomain(e) {
        const n = StorageControllerClass._normalizeDomain(e),
            a = this.getSettings(),
            t = "object" == typeof a.disabledDomains ? a.disabledDomains : [];
        return t.push(n), this.updateSettings({ disabledDomains: t });
    }
    enableDomain(e) {
        const n = StorageControllerClass._normalizeDomain(e),
            a = this.getSettings();
        let t = "object" == typeof a.disabledDomains ? a.disabledDomains : [];
        return (
            (t = t.filter((e) => {
                const a = StorageControllerClass._normalizeDomain(e);
                return a !== n && !n.endsWith("." + a);
            })),
            this.updateSettings({ disabledDomains: t })
        );
    }
    disableEditorGroup(e, n) {
        const a = StorageControllerClass._normalizeDomain(e),
            t = this.getSettings(),
            i = "object" == typeof t.disabledEditorGroups ? t.disabledEditorGroups : [];
        return i.push({ domain: a, editorGroupId: n }), this.updateSettings({ disabledEditorGroups: i });
    }
    enableEditorGroup(e, n) {
        const a = StorageControllerClass._normalizeDomain(e),
            t = this.getSettings();
        let i = "object" == typeof t.disabledEditorGroups ? t.disabledEditorGroups : [];
        return (i = i.filter((e) => !(e.domain === a && e.editorGroupId === n))), this.updateSettings({ disabledEditorGroups: i });
    }
    enableDomainAndEditorGroup(e, n) {
        return this.getValidationSettings(e, n).isEditorGroupDisabled && this.enableEditorGroup(e, n), this.enableDomain(e);
    }
    disableCapitalization(e) {
        const n = StorageControllerClass._normalizeDomain(e),
            a = this.getSettings(),
            t = "object" == typeof a.disabledDomainsCapitalization ? a.disabledDomainsCapitalization : [];
        return t.push(n), this.updateSettings({ disabledDomainsCapitalization: t });
    }
    enableCapitalization(e) {
        const n = StorageControllerClass._normalizeDomain(e),
            a = this.getSettings();
        let t = "object" == typeof a.disabledDomainsCapitalization ? a.disabledDomainsCapitalization : [];
        return (
            (t = t.filter((e) => {
                const a = StorageControllerClass._normalizeDomain(e);
                return a !== n && !n.endsWith("." + a);
            })),
            this.updateSettings({ disabledDomainsCapitalization: t })
        );
    }
    destroy() {
        this._eventBus.destroy(), (this._onReadyCallbacks = []);
    }
}
(StorageControllerClass.eventNames = {
    settingsChanged: "lt-storageController.settingsChanged",
    configurationChanged: "lt-storageController.configurationChanged",
    privacySettingsChanged: "lt-storageController.privacySettingsChanged",
    uiStateChanged: "lt-storageController.uiStateChanged",
}),
    (StorageControllerClass.DEFAULT_SETTINGS = {
        apiServerUrl: config.MAIN_SERVER_URL,
        autoCheck: !0,
        havePremiumAccount: !1,
        knownEmail: "",
        username: "",
        password: "",
        token: "",
        userId: null,
        motherTongue: "",
        geoIpLanguages: [],
        geoIpCountry: "",
        enVariant: LanguageManager.getPreferredLanguageVariant(["en-US", "en-GB", "en-AU", "en-CA", "en-NZ", "en-ZA"]) || "en-US",
        deVariant: LanguageManager.getPreferredLanguageVariant(["de-DE", "de-AT", "de-CH"]) || "de-DE",
        ptVariant: LanguageManager.getPreferredLanguageVariant(["pt-PT", "pt-BR", "pt-MZ", "pt-AO"]) || "pt-BR",
        caVariant: "ca-ES",
        dictionary: [],
        hasSynonymsEnabled: !1,
        isDictionarySynced: !1,
        ignoredRules: [
            { id: "PUNCTUATION_PARAGRAPH_END", language: "*", description: "No punctuation mark at the end of paragraph", turnOffDate: null },
            { id: "DASH_RULE", language: "*", description: "Hyphen, n-dash and m-dash", turnOffDate: null },
            { id: "MULTIPLICATION_SIGN", language: "*", description: "Multiplication sign instead of '*' or 'x'" },
            { id: "FINAL_PUNCTUATION", language: "pt", description: "Pontuagão final em falta", turnOffDate: null },
            { id: "FINAL_STOPS", language: "pt", description: "Pontuação: pontuação final em falta", turnOffDate: null },
            { id: "SMART_QUOTES", language: "pt", description: "Aspas inteligentes (“”)", turnOffDate: null },
            { id: "ELLIPSIS", language: "pt", description: "Reticências inteligentes (…)", turnOffDate: null },
            { id: "DASH_SPACE_RULES", language: "pt", description: "Travessão em enumerações", turnOffDate: null },
            { id: "HIPHEN_SPACE_RULES", language: "pt", description: "Espaçamento em hífens e travessões", turnOffDate: null },
            { id: "REPEATED_WORDS", language: "pt", description: "Palavras repetidas (2x)", turnOffDate: null },
            { id: "E_NO_COMECO", language: "pt", description: "Frase começa com 'E', 'Mas' ou 'Ou'", turnOffDate: null },
            { id: "NO_VERB", language: "pt", description: "Síntaxe: ausência de verbo", turnOffDate: null },
            { id: "EN_QUOTES", language: "en", description: "Smart quotes (“”)", turnOffDate: null },
            { id: "SENTENCE_FRAGMENT", language: "en", description: "Possible punctuation (comma) error, sentence looks like a fragment", turnOffDate: null },
            { id: "TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN", language: "de", description: "Typografische Anführungszeichen und Prime", turnOffDate: null },
            { id: "FALSCHE_VERWENDUNG_DES_BINDESTRICHS", language: "de", description: "Mögliche falsche Verwendung des Bindestrichs", turnOffDate: null },
            { id: "BISSTRICH", language: "de", description: "Bis-Strich vs. Bindestrich", turnOffDate: null },
            { id: "AUSLASSUNGSPUNKTE", language: "de", description: "Auslassungspunkte", turnOffDate: null },
            { id: "ABKUERZUNG_LEERZEICHEN", language: "de", description: 'Geschütztes Leerzeichen bei Abkürzungen wie "z. B."', turnOffDate: null },
            { id: "EINDE_ZIN_ONVERWACHT", language: "nl", description: "Onverwacht einde zin", turnOffDate: null },
            { id: "BACKTICK", language: "nl", description: "Geen ` (backtick)", turnOffDate: null },
            { id: "PNT_PNT_PNT", language: "nl", description: "… (beletselteken)", turnOffDate: null },
            { id: "GEDACHTESTREEPJE", language: "nl", description: "Gedachtestreepje", turnOffDate: null },
            { id: "OPTIONAL_HYPHEN", language: "nl", description: "Optioneel koppelteken", turnOffDate: null },
            { id: "KORT_1", language: "nl", description: "Zin van 1 woord", turnOffDate: null },
            { id: "KORT_2", language: "nl", description: "Zinnen van 2 woorden", turnOffDate: null },
            { id: "PUNT_FINAL", language: "ca", description: "Falta el punt final en frases llargues", turnOffDate: null },
            { id: "FINAL_STOP", language: "es", description: "Punto final que falta", turnOffDate: null },
            { id: "TIRE", language: "ru", description: "Дефис вместо тире", turnOffDate: null },
            { id: "BRAK_KROPKI", language: "pl", description: "Brak kropki na końcu zdania", turnOffDate: null },
            { id: "DYWIZ", language: "pl", description: "Dywiz zamiast myślnika", turnOffDate: null },
            { id: "CUDZYSLOW_DRUKARSKI", language: "pl", description: 'Zmiana cudzysłowu komputerowego (") na drukarskie', turnOffDate: null },
            { id: "short_vs_long_dash", language: "uk", description: "Дефіс замість тире", turnOffDate: null },
        ],
        disabledDomains: [],
        disabledEditorGroups: [],
        disabledDomainsCapitalization: [],
        ignoreCheckOnDomains: [],
        autoCheckOnDomains: [],
    }),
    (StorageControllerClass.PICKY_RULE_IDS = StorageControllerClass.DEFAULT_SETTINGS.ignoredRules.map((e) => e.id)),
    (StorageControllerClass.DEFAULT_MANAGED_SETTINGS = { apiServerUrl: "", loginUrl: "", disablePrivacyConfirmation: !0, disablePersonalDictionary: !1, disableIgnoredRules: !1 }),
    (StorageControllerClass.DEFAULT_CONFIGURATION = { unsupportedDomains: [] }),
    (StorageControllerClass.DEFAULT_PRIVACY_SETTINGS = { allowRemoteCheck: !1 }),
    (StorageControllerClass.DEFAULT_STATISTICS = {
        usageCount: 0,
        sessionCount: 0,
        appliedSuggestions: 0,
        appliedSynonyms: 0,
        hiddenErrors: [],
        firstVisit: null,
        lastActivity: null,
        ratingValue: null,
        premiumClicks: 0,
        isOverleafUser: !1,
        isThunderbirdUser: !1,
        isGoogleSlidesUser: !1,
    }),
    (StorageControllerClass.DEFAULT_UI_STATE = {
        hasSeenPrivacyConfirmationDialog: !1,
        hasPaidSubscription: !1,
        hasRated: !1,
        hasUsedValidator: !1,
        hasSeenOnboarding: !1,
        isNewUser: !1,
        hasSeenNewOverleafTeaser: !1,
        hasSeenNewGoogleDocsTeaser: !1,
        hasSeenNewGoogleSlidesTeaser: !1,
        hasSeenGoogleDocsMenuBarHint: !1,
        hasSeenSynonymsTutorial: !1,
        lastChangelog2021Seen: null,
        changelog2021CountdownEnd: null,
        changelog2021Coupon: null,
        showRuleId: !1,
        dialogPosition: "default",
        countMode: "characters",
        hasSeenTurnOnMessagePopup: !1,
    }),
    (StorageControllerClass.DEFAULT_TEST_FLAGS = {});
class StorageController {
    static init(e) {
        this._instanceFactory = e;
    }
    static create() {
        return this._instanceFactory();
    }
}
