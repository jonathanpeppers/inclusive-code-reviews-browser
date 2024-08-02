const { appinsights_key } = require("./secrets");
const { isTests } = require("./settings");

import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appinsights = new ApplicationInsights({
    config: {
        connectionString: appinsights_key,
        // Uncomment to diagnose issues with App Insights
        //loggingLevelConsole: 2,
        //enableDebug: true,
    }
});

var appinsights_user_id = null;

// Don't enable these in "unit test" mode
if (!isTests) {
    retrieveUserId();
    appinsights.loadAppInsights();
    appinsights.addTelemetryInitializer(telemetryInitializer);
}

function retrieveUserId() {
    chrome.storage.sync.get('inclusive-code-reviews-userid', function(items) {
        if (items.userid) {
            appinsights_user_id = items.userid;
        } else {
            appinsights_user_id = self.crypto.randomUUID();
            chrome.storage.sync.set({userid: appinsights_user_id});
        }
    });
}

export function getUserId() {
    return appinsights_user_id;
}

export function telemetryInitializer (envelope) {
    envelope.tags["ai.application.ver"] = '3.1.4';
    if (appinsights_user_id)
        envelope.tags["ai.user.id"] = appinsights_user_id;

    // We don't want to report full URLs
    if (envelope.baseData.uri) {
        var url = new URL(envelope.baseData.uri);
        if (url.hostname == "github.com") {
            var parts = url.pathname.split('/');
            envelope.baseData.name = 'github';
            if (parts.length > 2) {
                envelope.baseData.uri = 'https://github.com/' + parts[1] + "/" + parts[2];
            } else {
                envelope.baseData.uri = 'https://github.com';
            }
        } else if (url.hostname == 'dev.azure.com') {
            envelope.baseData.name = 'azdo';
        } else if (url.hostname == 'devdiv.visualstudio.com') {
            envelope.baseData.name = 'azdo';
        } else if (url.hostname == 'msazure.visualstudio.com') {
            envelope.baseData.name = 'azdo';
        } else {
            envelope.baseData.name = 'not_specified';
            envelope.baseData.uri = 'not_specified';
        }
    }

    // Try to clear other information
    envelope.tags["ai.operation.name"] = envelope.baseData.name;
    if (envelope.baseData.refUri)
        envelope.baseData.refUri = envelope.baseData.uri;
    if (envelope.ext && envelope.ext.trace && envelope.ext.trace.name)
        envelope.ext.trace.name = envelope.baseData.name;
}

export function trackPageView(url) {
    if (url) {
        appinsights.trackPageView(url);
    } else {
        appinsights.trackPageView();
    }
}

export function trackEvent(name, customDimensions) {
    appinsights.trackEvent({ name: name }, customDimensions);
}

// For use inside the extension (which isn't using webpack)
// The best I came up with for now is to add these functions to globalThis.
// https://developer.mozilla.org/en-US/docs/Glossary/Global_object
globalThis.aiTrackPageView = trackPageView;
globalThis.aiTrackEvent = trackEvent;