import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import { QueryablePreObserver, Queryable2 } from "@pnp/queryable";

export function MSAL2(config: Configuration, scopes: string[] = ["https://graph.microsoft.com/.default"]): (instance: Queryable2) => Promise<void> {
    return async (instance: Queryable2) => {
        instance.on.pre(MSAL(config, scopes));
    };
}

export function MSAL(config: Configuration, scopes: string[] = ["https://graph.microsoft.com/.default"]): QueryablePreObserver {

    const confidentialClient = new ConfidentialClientApplication(config);

    return async function (url: string, init: RequestInit, result: any): Promise<[string, RequestInit, any]> {

        const token = await confidentialClient.acquireTokenByClientCredential({ scopes });

        // eslint-disable-next-line @typescript-eslint/dot-notation
        init.headers["Authorization"] = `${token.tokenType} ${token.accessToken}`;

        return [url, init, result];
    };
}
