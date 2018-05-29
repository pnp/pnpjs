import * as AuthenticationContext from "adal-angular";
import { BearerTokenFetchClient, FetchOptions } from "./netutil";
import { ISPFXContext } from "./spfxContextInterface";
import { combinePaths, isUrlAbsolute } from "./util";

/**
 * Azure AD Client for use in the browser
 */
export class AdalClient extends BearerTokenFetchClient {

    /**
     * Our auth context
     */
    private static _authContext: AuthenticationContext | null = null;

    /**
     * Callback used by the adal auth system
     */
    private _displayCallback: (url: string) => void | null;

    /**
     * Promise used to ensure the user is logged in
     */
    private _loginPromise: Promise<void> | null;

    /**
     * Creates a new instance of AdalClient
     * @param clientId Azure App Id
     * @param tenant Office 365 tenant (Ex: {tenant}.onmicrosoft.com)
     * @param redirectUri The redirect url used to authenticate the 
     */
    constructor(public clientId: string, public tenant: string, public redirectUri: string) {
        super(null);
    }

    /**
     * Creates a new AdalClient using the values of the supplied SPFx context
     * 
     * @param spfxContext Current SPFx context
     * @param clientId Optional client id to use instead of the built-in SPFx id
     * @description Using this method and the default clientId requires that the features described in
     * this article https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aadhttpclient are activated in the tenant. If not you can
     * creat your own app, grant permissions and use that clientId here along with the SPFx context
     */
    public static fromSPFxContext(spfxContext: ISPFXContext | any, cliendId = "c58637bb-e2e1-4312-8a00-04b5ffcd3403"): AdalClient {

        // this "magic" client id is the one to which permissions are granted behind the scenes
        // this redirectUrl is the page as used by spfx
        return new AdalClient(cliendId, spfxContext.pageContext.aadInfo.tenantId.toString(), combinePaths(window.location.origin, "/_forms/spfxsinglesignon.aspx"));
    }

    /**
     * Conducts the fetch opertation against the AAD secured resource
     * 
     * @param url Absolute URL for the request
     * @param options Any fetch options passed to the underlying fetch implementation
     */
    public fetch(url: string, options: FetchOptions): Promise<Response> {

        if (!isUrlAbsolute(url)) {
            throw new Error("You must supply absolute urls to AdalClient.fetch.");
        }

        // the url we are calling is the resource
        return this.getToken(this.getResource(url)).then(token => {
            this.token = token;
            return super.fetch(url, options);
        });
    }

    /**
     * Gets a token based on the current user
     * 
     * @param resource The resource for which we are requesting a token
     */
    public getToken(resource: string): Promise<string> {

        return new Promise((resolve, reject) => {

            this.ensureAuthContext().then(_ => this.login()).then(_ => {

                AdalClient._authContext.acquireToken(resource, (message: string, token: string) => {

                    if (message) {
                        return reject(new Error(message));
                    }

                    resolve(token);
                });

            }).catch(reject);
        });
    }

    /**
     * Ensures we have created and setup the adal AuthenticationContext instance
     */
    private ensureAuthContext(): Promise<void> {

        return new Promise(resolve => {

            if (AdalClient._authContext === null) {
                AdalClient._authContext = AuthenticationContext.inject({
                    clientId: this.clientId,
                    displayCall: (url: string) => {
                        if (this._displayCallback) {
                            this._displayCallback(url);
                        }
                    },
                    navigateToLoginRequestUrl: false,
                    redirectUri: this.redirectUri,
                    tenant: this.tenant,
                });
            }

            resolve();
        });
    }

    /**
     * Ensures the current user is logged in
     */
    private login(): Promise<void> {

        if (this._loginPromise) {
            return this._loginPromise;
        }

        this._loginPromise = new Promise((resolve, reject) => {

            if (AdalClient._authContext.getCachedUser()) {
                return resolve();
            }

            this._displayCallback = (url: string) => {

                const popupWindow = window.open(url, "login", "width=483, height=600");

                if (!popupWindow) {
                    return reject(new Error("Could not open pop-up window for auth. Likely pop-ups are blocked by the browser."));
                }

                if (popupWindow && popupWindow.focus) {
                    popupWindow.focus();
                }

                const pollTimer = window.setInterval(() => {

                    if (!popupWindow || popupWindow.closed || popupWindow.closed === undefined) {
                        window.clearInterval(pollTimer);
                    }

                    try {
                        if (popupWindow.document.URL.indexOf(this.redirectUri) !== -1) {
                            window.clearInterval(pollTimer);
                            AdalClient._authContext.handleWindowCallback(popupWindow.location.hash);
                            popupWindow.close();
                            resolve();
                        }
                    } catch (e) {
                        reject(e);
                    }
                }, 30);
            };

            // this triggers the login process
            this.ensureAuthContext().then(_ => {
                (<any>AdalClient._authContext)._loginInProgress = false;
                AdalClient._authContext.login();
                this._displayCallback = null;
            });
        });

        return this._loginPromise;
    }

    /**
     * Parses out the root of the request url to use as the resource when getting the token
     * 
     * After: https://gist.github.com/jlong/2428561
     * @param url The url to parse
     */
    private getResource(url: string): string {
        const parser = <HTMLAnchorElement>document.createElement("a");
        parser.href = url;
        return `${parser.protocol}//${parser.hostname}`;
    }
}
