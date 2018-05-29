var settings = {

    spsave: {
        username: "develina.devsson@mydevtenant.onmicrosoft.com",
        password: "pass@word1",
        siteUrl: "https://mydevtenant.sharepoint.com/"
    },
    testing: {
        enableWebTests: true,
        sp: {
            id: "{ client id }",
            secret: "{ client secret }",
            url: "{ site collection url }",
            notificationUrl: "{ notification url }",
        },
        graph: {
            tenant: "{tenant.onmicrosoft.com}",
            id: "{your app id}",
            secret: "{your secret}"
        },
    }
}

module.exports = settings;
