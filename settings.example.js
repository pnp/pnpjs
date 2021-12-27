export const settings = {

    testing: {
        enableWebTests: true,
        // AAD login for test user
        testUser: "i:0#.f|membership|user@consto.com",
        sp: {
            // legacy client id (optional if using msal)
            id: "{ client id }",
            // legacy client secret (optional if using msal)
            secret: "{ client secret }",
            // required for legacy or msal auth
            url: "{ site collection url }",
            // optional: tests of webhooks will fail if not provided
            notificationUrl: "{ notification url }",
            // for new deployments we recommend the msal settings that can then be applied to both graph and SharePoint
            msal: {
                init: {
                    // any of the settings available for msal-node client, passed to the constructor
                    // https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node

                    // PnP example: https://pnp.github.io/pnpjs/authentication/server-nodejs/#call-sharepoint
                },
                // set your scopes as needed here
                scopes: ["https://{tenant}.sharepoint.com/.default"]
            },
        },
        // all are optional if using msal
        graph: {
            // all three of these are optional if using msal
            tenant: "{tenant.onmicrosoft.com}",
            id: "{your app id}",
            secret: "{your secret}",
            // for new deployments we recommend the msal settings that can then be applied to both graph and SharePoint
            msal: {
                init: {
                    // any of the settings available for msal-node client, passed to the constructor
                    // https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node

                    // PnP example: https://pnp.github.io/pnpjs/authentication/server-nodejs/#call-sharepoint
                },
                // set your scopes as needed here
                scopes: ["https://graph.microsoft.com/.default"]
            },
        },
    }
}
