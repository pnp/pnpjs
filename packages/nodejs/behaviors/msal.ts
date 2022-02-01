import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import { objectDefinedNotNull, TimelinePipe } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

export function MSAL(config: Configuration, scopes: string[] = ["https://graph.microsoft.com/.default"]): TimelinePipe<Queryable> {

    const confidentialClient = new ConfidentialClientApplication(config);

    return (instance: Queryable) => {

        instance.on.auth(async (url: URL, init: RequestInit) => {

            const token = await confidentialClient.acquireTokenByClientCredential({ scopes });

            if (objectDefinedNotNull(token)) {
                init.headers = { ...init.headers, Authorization: `${token.tokenType} ${token.accessToken}` };
            }

            return [url, init];
        });

        return instance;
    };
}
