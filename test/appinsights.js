describe('appinsights', () => {
    // Enable "unit test" mode
    require("../src-packed/settings").isTests = true;

    const appinsights = require('../src-packed/appinsights')

    it('trackEvent', () => {
        appinsights.trackEvent("test event 3", { key: "value" });
    });

    const data = {
        baseData: { name:"", uri: "" },
        tags: { }
    };

    it('pageView not specified', () => {
        data.baseData.name = "Don't show this";
        data.baseData.uri = "https://somesite.com/should/not/show";
        appinsights.telemetryInitializer (data);

        expect(data.baseData.name).to.be.equal('not_specified');
        expect(data.baseData.uri).to.be.equal('not_specified');
        expect(data.tags['organization']).to.be.equal(undefined);
    });

    it('pageView null uri', () => {
        data.baseData.name = undefined;
        data.baseData.uri = undefined;
        appinsights.telemetryInitializer (data);

        expect(data.baseData.name).to.be.equal(undefined);
        expect(data.baseData.uri).to.be.equal(undefined);
    });

    it('pageView for github', () => {
        data.baseData.name = "Don't show this";
        data.baseData.uri = "https://github.com/jonathanpeppers/inclusive-code-comments/issues/new";
        appinsights.telemetryInitializer (data);

        expect(data.baseData.name).to.be.equal('github');
        expect(data.baseData.uri).to.be.equal('https://github.com/jonathanpeppers/inclusive-code-comments');
    });

    it('pageView for github missing parts', () => {
        data.baseData.name = "Don't show this";
        data.baseData.uri = "https://github.com";
        appinsights.telemetryInitializer (data);

        expect(data.baseData.name).to.be.equal('github');
        expect(data.baseData.uri).to.be.equal('https://github.com');
    });

    it('pageView for devdiv azdo', () => {
        data.baseData.name = "Don't show this";
        data.baseData.uri = "https://devdiv.visualstudio.com/DevDiv/_build?definitionId=13330&_a=summary";
        appinsights.telemetryInitializer (data);

        expect(data.baseData.name).to.be.equal('azdo');
        expect(data.baseData.uri).to.be.equal('https://devdiv.visualstudio.com/DevDiv/_build?definitionId=13330&_a=summary');
    });

    it('pageView for dnceng azdo', () => {
        data.baseData.name = "Don't show this";
        data.baseData.uri = "https://dev.azure.com/dnceng/public/_packaging?_a=feed&feed=dotnet6";
        appinsights.telemetryInitializer (data);

        expect(data.baseData.name).to.be.equal('azdo');
        expect(data.baseData.uri).to.be.equal('https://dev.azure.com/dnceng/public/_packaging?_a=feed&feed=dotnet6');
    });

    it('pageView for azure azdo', () => {
        data.baseData.name = "Don't show this";
        data.baseData.uri = "https://msazure.visualstudio.com/AzureGrafanaService/_git/ResourceProvider/pullrequests?_a=mine";
        appinsights.telemetryInitializer (data);

        expect(data.baseData.name).to.be.equal('azdo');
        expect(data.baseData.uri).to.be.equal('https://msazure.visualstudio.com/AzureGrafanaService/_git/ResourceProvider/pullrequests?_a=mine');
    });
});
