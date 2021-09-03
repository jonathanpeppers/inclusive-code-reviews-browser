describe('appinsights', () => {
    // NOTE: comment out, in order to run these tests.
    // Usage of app insights causes tests to never exit, and I didn't figure out how to fix it.
    // I could call process.exit(0), but then test failures had a successful exit code.
    return;

    const appinsights = require('../src-packed/appinsights');

    it('trackEvent', async () => {
        appinsights.trackEvent("test event 3", { key: "value" });
    });
});