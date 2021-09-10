const { appinsights_key } = require("./secrets");

import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appinsights = new ApplicationInsights({
    config: {
        connectionString: appinsights_key,
        // Uncomment to diagnose issues with App Insights
        //loggingLevelConsole: 2,
        //enableDebug: true,
    }
});
appinsights.loadAppInsights();
appinsights.addTelemetryInitializer(function (envelope) {
    envelope.tags["ai.application.ver"] = '0.1.0';
});
appinsights.trackPageView();

export function trackEvent(name, customDimensions) {
    appinsights.trackEvent({ name: name }, customDimensions);
}
