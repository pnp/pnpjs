import { AuthenticationParameters, Configuration, UserAgentApplication } from "msal";
import { BearerTokenFetchClient, isUrlAbsolute, IFetchOptions } from "@pnp/common";

/**
 * Modifies the msal libray type Configuration, omitting the "framework" property
 */
export type MsalConfiguration = Omit<Configuration, "framework">;

/**
 * Function Binder suitable for creating a factory function used in setup to create MsalClient instances
 * 
 * @param config The MSAL configuration object
 * @param scopes The scope this client should request
 */
export function MsalClientSetup(config: MsalConfiguration, scopes: string[]): () => MsalClient {

    // optimized to share an app per configuration (hopefully)
    const app = new UserAgentApplication(config);
    return () => new MsalClient(config, scopes, app);
}

/**
 * Wrapper for MSAL authentication for use in the browser
 */
export class MsalClient extends BearerTokenFetchClient {

    /**
     * Creates a new instance of the MsalClient
     * 
     * @param config the MSAL configuration used to create the client. see: https://github.com/AzureAD/microsoft-authentication-library-for-js
     * @param scopes [optional] The AAD Permission scope names this client should request
     * @param app [optional] If supplied will be used instead of creating a new UserAgentApplication specific to this client
     */
    constructor(config: MsalConfiguration, public scopes: string[] = [], public app: UserAgentApplication = null) {
        super(null);
        if (app === null) {
            this.app = new UserAgentApplication(config);
        }
    }

    /**
     * Conducts the fetch opertation against the AAD secured resource
     * 
     * @param url Absolute URL for the request
     * @param options Any fetch options passed to the underlying fetch implementation
     */
    public async fetch(url: string, options: IFetchOptions): Promise<Response> {

        if (!isUrlAbsolute(url)) {
            throw Error("You must supply absolute urls to MsalClient.fetch.");
        }

        // the url we are calling is the resource
        this.token = await this.getToken();
        return super.fetch(url, options);
    }

    /**
     * Gets an authentication token from the UserAgentApplication
     * 
     * @param scopes [optional] The AAD Permission scope names this client should request
     * @description You must define scopes when calling this method, or when constructing the MsalClient instance, or both
     * @todo a way to control the fall back behavior
     */
    public async getToken(scopes?: string[]): Promise<string> {

        // use the passed params or default to the constructor params
        const authParams: AuthenticationParameters = {
            scopes: scopes || this.scopes,
        };

        try {

            // see if we have already the idtoken saved
            const resp = await this.app.acquireTokenSilent(authParams);
            return resp.accessToken;

        } catch (e) {

            // per examples we fall back to popup
            const resp = await this.app.loginPopup(authParams);
            if (resp.idToken) {
                const resp2 = await this.app.acquireTokenSilent(authParams);
                return resp2.accessToken;
            }
            // throw the error that brought us here
            throw e;
        }
    }
}
