import { AuthenticationParameters, Configuration, UserAgentApplication } from "msal";
import { Queryable } from "@pnp/queryable";

export function MSAL(config: Configuration, authParams: AuthenticationParameters = { scopes: ["https://graph.microsoft.com/.default"] }): (instance: Queryable) => Queryable {

    const app = new UserAgentApplication(config);

    return (instance: Queryable) => {

        instance.on.auth.replace(async (url: URL, init: RequestInit) => {

            let accessToken: string;

            try {

                // see if we have already the idtoken saved
                const resp = await app.acquireTokenSilent(authParams);
                accessToken = resp.accessToken;

            } catch (e) {

                // per examples we fall back to popup
                const resp = await app.loginPopup(authParams);
                if (resp.idToken) {
                    const resp2 = await app.acquireTokenSilent(authParams);
                    accessToken = resp2.accessToken;
                } else {
                    // throw the error that brought us here
                    throw e;
                }
            }

            init.headers = { ...init.headers, Authorization: `Bearer ${accessToken}` };

            return [url, init];
        });

        return instance;
    };
}
