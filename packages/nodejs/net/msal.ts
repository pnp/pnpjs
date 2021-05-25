import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import { Queryable2 } from "@pnp/queryable";

export function MSAL(config: Configuration, scopes: string[] = ["https://graph.microsoft.com/.default"]): (instance: Queryable2) => Queryable2 {

    const confidentialClient = new ConfidentialClientApplication(config);

    return (instance: Queryable2) => {

        instance.on.auth(async (url: string, init: RequestInit) => {

            const token = await confidentialClient.acquireTokenByClientCredential({ scopes });

            // eslint-disable-next-line @typescript-eslint/dot-notation
            init.headers["Authorization"] = `${token.tokenType} ${token.accessToken}`;

            return [url, init];
        });

        return instance;
    };
}
