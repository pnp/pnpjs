import { spfi } from "@pnp/sp/index.js";
import { graphfi } from "@pnp/graph/index.js";
import { LogLevel  } from "@pnp/logging/index.js";
import { SPDefault, GraphDefault } from "@pnp/nodejs/index.js";

import {readFileSync} from 'fs';
import "@pnp/sp/webs/index.js";
import "@pnp/graph/users/index.js";

const buffer = readFileSync("c:/temp/key.pem");

const config:any = {
    auth: {
        authority: "https://login.microsoftonline.com/{my tenant}/",
        clientId: "{application (client) id}",
        clientCertificate: {
            thumbprint: "{certificate thumbprint, displayed in AAD}",
            privateKey: buffer.toString(),
        },
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel: any, message: any, containsPii: any) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Verbose
        }
    }
};

async function makeGraphRequest() {
    const graph = graphfi()
    .using(GraphDefault({
        baseUrl: 'https://graph.microsoft.com/v1.0',
        msal: {
            config: config,
            scopes: [ 'https://graph.microsoft.com/.default' ]
        }
    }));

    const first = await graph.users.top(1)();
    console.log(JSON.stringify(first, null, 2));
}

async function makeSPRequest() {
    const sp = spfi('{site url}')
    .using(SPDefault({
        baseUrl: '{site url}',
        msal: {
            config: config,
            scopes: [ 'https://{my tenant}.sharepoint.com/.default' ]
        }
    }));

    const w = await sp.web();
    console.log(JSON.stringify(w, null, 2));
}

makeGraphRequest();

// makeSPRequest();

