import { combine, ILibraryConfiguration, ISPFXContext, isUrlAbsolute, objectDefinedNotNull, DefaultRuntime, stringIsNullOrEmpty } from "@pnp/common";
import { IGraphConfigurationPart, IGraphConfigurationProps } from "../graphlibconfig.js";

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

    let baseUrl = runtime.get<IGraphConfigurationPart, IGraphConfigurationProps>("graph")?.baseUrl;

    if (!stringIsNullOrEmpty(baseUrl)) {
        // base url specified either with baseUrl of spfxContext config property
        return combine(baseUrl, candidateUrl);
    }

    const spFxContext = runtime.get<ILibraryConfiguration, ISPFXContext>("spfxContext");

    if (objectDefinedNotNull(spFxContext)) {

        try {

            // this may let us read the url from the graph context
            const client = await spFxContext.msGraphClientFactory.getClient();
            baseUrl = (<any>client)?.constructor?._graphBaseUrl;

            if (!stringIsNullOrEmpty(baseUrl)) {
                return combine(baseUrl, candidateUrl);
            }

            // tslint:disable-next-line: no-empty
        } catch (e) { }
    }

    // try one last time with the default
    return combine("https://graph.microsoft.com", candidateUrl);
}
