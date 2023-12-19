import type { Configuration, SilentRequest, PopupRequest } from "@azure/msal-browser";
import { PublicClientApplication } from "@azure/msal-browser";
import { Queryable } from "@pnp/queryable";

export interface MSALOptions {
    /**
     * The name of the MSAL instance to use
     * @default "main"
     */
    name?: string;

    /**
     * The configuration for the PCA
     */
    configuration: Configuration;

    /**
     * The authentication parameters to use
     */
    authParams: SilentRequest & PopupRequest;

    /**
     * Whether or not to log errors to the console
     * @default false
     */
    logErrors?: boolean;
}

/**
 * Store for MSAL instances in order to have full power over the PCA
 * @internal
 */
const instances = new Map<string, PublicClientApplication>();

/**
 * MSAL behavior for PnPjs
 * @param options The options to use when configuring MSAL
 * @returns Instance of the behavior
 *
 * @see https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/README.md#advanced-topics
 */
export function MSAL(options: MSALOptions): (instance: Queryable) => Queryable {

    const name = options.name || "main";

    return (instance: Queryable) => {

        instance.on.auth.replace(async (url: URL, init: RequestInit) => {
            let app = instances.get(name) as PublicClientApplication;

            if (!app) {
                instances.set(name, new PublicClientApplication(options.configuration));
                app = instances.get(name)!;
                await app.initialize();
            }

            let accessToken = "";

            try {
                // Attempt to get the token silently
                const tokenResponse = await app.acquireTokenSilent(options.authParams);
                accessToken = tokenResponse.accessToken;
            }catch (authError) {
                // If silent token acquisition fails with InteractionRequiredAuthError,
                // attempt to get the token interactively
                const loginResponse = await app.loginPopup(options.authParams).catch((loginError) => {

                    if (options.logErrors) {
                        console.error(loginError);
                    }

                    throw loginError;
                });

                if (loginResponse.accessToken) {
                    accessToken = loginResponse.accessToken;
                    app.setActiveAccount(loginResponse.account);
                }

                if (!accessToken) {

                    if (options.logErrors) {
                        console.error(authError);
                    }

                    throw authError;
                }
            }

            init.headers = { ...init.headers, Authorization: `Bearer ${accessToken}` };

            return [url, init];
        });

        return instance;
    };
}

/**
 * Get an MSAL instance by name
 * @param name The name of the instance to get (@default "main")
 * @returns The MSAL instance if found, otherwise throws an error
 *
 * @see https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/README.md#advanced-topics
 *
 * @example Log out of an MSAL instance
 * ```ts
 * const msalInstance = getMSAL();
 * const currentAccount = msalInstance.getActiveAccount();
 * msalInstance.logoutRedirect({ account: currentAccount });
 * ```
 */
export function getMSAL(name = "main"): PublicClientApplication {

    const pca = instances.get(name);

    if (!pca) {
        throw Error(`No MSAL instance found with name '${name}'`);
    }

    return pca;
}
