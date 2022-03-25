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

// Don't enable these in "unit test" mode
if (!isTests) {
    appinsights.loadAppInsights();
    appinsights.addTelemetryInitializer(telemetryInitializer);
}

export function telemetryInitializer (envelope) {
    envelope.tags["ai.application.ver"] = '0.1.1';

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
// The best I came up with for now is to add these functions to window.
window.aiTrackPageView = trackPageView;
window.aiTrackEvent = trackEvent;