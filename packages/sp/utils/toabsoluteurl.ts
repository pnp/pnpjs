import { combine, isUrlAbsolute, DefaultRuntime, stringIsNullOrEmpty, ILibraryConfiguration, ISPFXContext, hOP, safeGlobal } from "@pnp/common";
import { ISPConfigurationPart, ISPConfigurationProps } from "../splibconfig.js";

/**
 * Ensures that a given url is absolute for the current web based on context
 *
 * @param candidateUrl The url to make absolute
 *
 */
export async function toAbsoluteUrl(candidateUrl: string, runtime = DefaultRuntime): Promise<string> {

    if (isUrlAbsolute(candidateUrl)) {
        // if we are already absolute, then just return the url
        return candidateUrl;
    }

    const baseUrl = runtime.get<ISPConfigurationPart, ISPConfigurationProps>("sp")?.baseUrl;
    const fetchClientFactory = runtime.get<ISPConfigurationPart, ISPConfigurationProps>("sp")?.fetchClientFactory;

    if (!stringIsNullOrEmpty(baseUrl)) {
        // base url specified either with baseUrl of spfxContext config property
        return combine(baseUrl, candidateUrl);
    }

    // use a passed context if provided, if not see if we get one from the current runtime
    const context = runtime.get<ILibraryConfiguration, ISPFXContext>("spfxContext");
    if (context) {
        return combine(context.pageContext.web.absoluteUrl, candidateUrl);
    }

    // to make the existing node client work in a backwards compatible way we do the following (hacky thing)
    // get the client
    // see if it has a siteUrl property
    // use that to absolute the url
    if (fetchClientFactory) {
        const tempClient = fetchClientFactory();
        if (hOP(tempClient, "siteUrl")) {
            return combine((<{ siteUrl: string }><unknown>tempClient).siteUrl, candidateUrl);
        }
    }

    if (safeGlobal._spPageContextInfo !== undefined) {

        // operating in classic pages
        if (hOP(safeGlobal._spPageContextInfo, "webAbsoluteUrl")) {
            return combine(safeGlobal._spPageContextInfo.webAbsoluteUrl, candidateUrl);
        } else if (hOP(safeGlobal._spPageContextInfo, "webServerRelativeUrl")) {
            return combine(safeGlobal._spPageContextInfo.webServerRelativeUrl, candidateUrl);
        }
    }

    // does window.location exist and have a certain path part in it?
    if (safeGlobal.location !== undefined) {
        const location = safeGlobal.location.toString().toLowerCase();
        ["/_layouts/", "/siteassets/", "/sitepages/"].forEach((s: string) => {
            const index = location.indexOf(s);
            if (index > 0) {
                return combine(location.substr(0, index), candidateUrl);
            }
        });
    }

    return candidateUrl;
}
