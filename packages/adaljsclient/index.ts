import { BearerTokenFetchClient, IFetchOptions, ISPFXContext, isUrlAbsolute, SPFxAdalClient, getADALResource } from "@pnp/common";
// @ts-ignore
import * as adal from "adal-angular/dist/adal.min.js";

/**
 * Azure AD Client for use in the browser
 */
export class AdalClient extends BearerTokenFetchClient {

    /**
     * Our auth context
     */
    private static _authContext: adal.AuthenticationContext | null = null;

    /**
     * Callback used by the adal auth system
     */
    private _displayCallback: ((url: string) => void) | null;

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
        this._displayCallback = null;
        this._loginPromise = null;
    }

    /**
     * Creates a new AdalClient using the values of the supplied SPFx context (requires SPFx >= 1.6)
     * 
     * @param spfxContext Current SPFx context
     * @description Using this method requires that the features described in this article
     * https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aadhttpclient are activated in the tenant.
     */
    public static fromSPFxContext(spfxContext: ISPFXContext | any): SPFxAdalClient {

        return new SPFxAdalClient(spfxContext);
    }

    /**
     * Conducts the fetch opertation against the AAD secured resource
     * 
     * @param url Absolute URL for the request
     * @param options Any fetch options passed to the underlying fetch implementation
     */
    public async fetch(url: string, options: IFetchOptions): Promise<Response> {

        if (!isUrlAbsolute(url)) {
            throw Error("You must supply absolute urls to AdalClient.fetch.");
        }

        // the url we are calling is the resource
        const token = await this.getToken(getADALResource(url));
        this.token = token;
        return super.fetch(url, options);
    }

    /**
     * Gets a token based on the current user
     * 
     * @param resource The resource for which we are requesting a token
     */
    public async getToken(resource: string): Promise<string> {

        await this.login();

        return new Promise((resolve, reject) => {

            AdalClient._authContext.acquireToken(resource, (message: string, token: string) => {

                if (message) {
                    reject(Error(message));
                } else {
                    resolve(token);
                }
            });
        });
    }

    /**
     * Ensures we have created and setup the adal AuthenticationContext instance
     */
    private async ensureAuthContext(): Promise<void> {

        if (AdalClient._authContext === null) {
            AdalClient._authContext = adal.inject({
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
    }

    /**
     * Ensures the current user is logged in
     */
    private login(): Promise<void> {

        if (this._loginPromise) {
            return this._loginPromise;
        }

        this._loginPromise = new Promise((resolve, reject) => {

            // this triggers the login process
            this.ensureAuthContext().then(_ => {

                if (AdalClient._authContext.getCachedUser()) {
                    return resolve();
                }

                this._displayCallback = (url: string) => {

                    const popupWindow = window.open(url, "login", "width=483, height=600");

                    if (!popupWindow) {
                        return reject(Error("Could not open pop-up window for auth. Likely pop-ups are blocked by the browser."));
                    }

                    if (popupWindow && popupWindow.focus) {
                        popupWindow.focus();
                    }

                    const pollTimer = window.setInterval(() => {

                        try {

                            if (!popupWindow || popupWindow.closed || popupWindow.closed === undefined) {
                                throw Error("No popup window.");
                            }

                            if (popupWindow.document.URL.indexOf(this.redirectUri) !== -1) {
                                AdalClient._authContext.handleWindowCallback(popupWindow.location.hash);
                                popupWindow.close();
                                resolve();
                            }
                        } catch (e) {
                            reject(e);
                        } finally {
                            window.clearInterval(pollTimer);
                        }
                    }, 300);
                };

                (<any>AdalClient._authContext)._loginInProgress = false;
                AdalClient._authContext.login();
                this._displayCallback = null;
            });
        });

        return this._loginPromise;
    }
}
