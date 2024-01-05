/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
function isPageLoadedMessage(n) {
    return "PAGE_LOADED" === n.command;
}
function isPageView(n) {
    return "TRACK_PAGE_VIEW" === n.command;
}
function isTrackCustomEvent(n) {
    return "TRACK_CUSTOM_EVENT" === n.command;
}
function isAppliedSuggestion(n) {
    return "APPLIED_SUGGESTION" === n.command;
}
function isLTAssistantStatusChangedMessage(n) {
    return "LTASSISTANT_STATUS_CHANGED" === n.command;
}
function isCheckForPaidSubscriptionMessage(n) {
    return "CHECK_FOR_PAID_SUBSCRIPTION" === n.command;
}
function isTrackTextLengthMessage(n) {
    return "TRACK_TEXT_LENGTH" === n.command;
}
function isTrackEventMessage(n) {
    return "TRACK_EVENT" === n.command;
}
function isOpenFeedbackFormMessage(n) {
    return "OPEN_FEEDBACK_FORM" === n.command;
}
function isSendFeedbackMessage(n) {
    return "SEND_FEEDBACK" === n.command;
}
function isOpenOptionsMessage(n) {
    return "OPEN_OPTIONS" === n.command;
}
function isOpenPrivacyConfirmationMessage(n) {
    return "OPEN_PRIVACY_CONFIRMATION" === n.command;
}
function isCloseCurrentTabMessage(n) {
    return "CLOSE_CURRENT_TAB" === n.command;
}
function isValidateTextMessage(n) {
    return "VALIDATE_TEXT" === n.command;
}
function isLaunchEditorMessage(n) {
    return "LAUNCH_EDITOR" === n.command;
}
function isGetValidatorDataMessage(n) {
    return "GET_VALIDATOR_DATA" === n.command;
}
function isStartDictionarySyncMessage(n) {
    return "START_DICTIONARY_SYNC" === n.command;
}
function isGetPreferredLanguagesMessage(n) {
    return "GET_PREFERRED_LANGUAGES" === n.command;
}
function isRemoveWordFromDictionaryMessage(n) {
    return "REMOVE_WORD_FROM_DICTIONARY" === n.command;
}
function isAskAnAIMessage(n) {
    return "ASK_AN_AI" === n.command;
}
function isAddWordToDictionaryMessage(n) {
    return "ADD_WORD_TO_DICTIONARY" === n.command;
}
function isBatchAddWordToDictionaryMessage(n) {
    return "BATCH_ADD_WORDS_TO_DICTIONARY" === n.command;
}
function isClearDictionaryMessage(n) {
    return "CLEAR_DICTIONARY" === n.command;
}
function isLoadSynonymsMessage(n) {
    return "LOAD_SYNONYMS" === n.command;
}
function isUpdateDictionaryMessage(n) {
    return "UPDATE_DICTIONARY" === n.command;
}
function isOpenURLMessage(n) {
    return "OPEN_URL" === n.command;
}
function isGetSelectedTextMessage(n) {
    return "GET_SELECTED_TEXT" === n.command;
}
function isDestroyMessage(n) {
    return "DESTROY" === n.command;
}
function isCheckHealthMessage(n) {
    return "CHECK_HEALTH" === n.command;
}
function isOpenPremiumPageMessage(n) {
    return "OPEN_PREMIUM_PAGE" === n.command;
}
function isLoginUserMessage(n) {
    return "LOGIN" === n.command;
}
function isOnLoginUserMessage(n) {
    return "ON_LOGIN" === n.command;
}
function isLogoutUserMessage(n) {
    return "LOGOUT" === n.command;
}
function isOnLogoutUserMessage(n) {
    return "ON_LOGOUT" === n.command;
}
function isCheckForPaidSubscriptionResult(n) {
    return "CHECK_FOR_PAID_SUBSCRIPTION" === n.initialCommand && n.isSuccessful;
}
function isCheckForPaidSubscriptionError(n) {
    return "CHECK_FOR_PAID_SUBSCRIPTION" === n.initialCommand && !n.isSuccessful;
}
function isValidateTextResult(n) {
    return "VALIDATE_TEXT" === n.initialCommand && n.isSuccessful;
}
function isValidateTextError(n) {
    return "VALIDATE_TEXT" === n.initialCommand && !n.isSuccessful;
}
function isGetValidatorDataResult(n) {
    return "GET_VALIDATOR_DATA" === n.initialCommand && n.isSuccessful;
}
