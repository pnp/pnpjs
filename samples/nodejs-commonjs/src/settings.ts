const privateKey = `-----BEGIN RSA PRIVATE KEY-----

{your key here}

-----END RSA PRIVATE KEY-----
`;

const msalInit = {
    auth: {
        authority: "https://login.microsoftonline.com/{tenant id}/",
        clientCertificate: {
            thumbprint: "{cert thumbprint}",
            privateKey: privateKey,
        },
        clientId: "{client id}",
    },
};

export const settings = {
    testing: {
        sp: {
            url: "{absolute site url}",
            msal: {
                init: msalInit,
                scopes: ["https://{tenant name}.sharepoint.com/.default"],
            },
        },
        graph: {
            msal: {
                init: msalInit,
                scopes: ["https://graph.microsoft.com/.default"],
            },
        },
    },
};
