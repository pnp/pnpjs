import { combine, isUrlAbsolute, objectDefinedNotNull, RuntimeConfig, stringIsNullOrEmpty } from "@pnp/common";
import { GraphRuntimeConfig } from "../graphlibconfig";

/**
 * Ensures that a given url is absolute for the current web based on context
 *
 * @param candidateUrl The url to make absolute
 *
 */
export async function toAbsoluteUrl(candidateUrl: string): Promise<string> {

    if (isUrlAbsolute(candidateUrl)) {
        // if we are already absolute, then just return the url
        return candidateUrl;
    }

    if (!stringIsNullOrEmpty(GraphRuntimeConfig.baseUrl)) {
        // base url specified either with baseUrl of spfxContext config property
        return combine(GraphRuntimeConfig.baseUrl, candidateUrl);
    }

    if (objectDefinedNotNull(RuntimeConfig.spfxContext)) {

        try {

            // this may let us read the url from the graph context
            const client = await RuntimeConfig.spfxContext.msGraphClientFactory.getClient();
            const baseUrl: string | null = (<any>client)?.constructor?._graphBaseUrl;

            if (!stringIsNullOrEmpty(baseUrl)) {
                return combine(baseUrl, candidateUrl);
            }

            // tslint:disable-next-line: no-empty
        } catch (e) { }
    }

    // try one last time with the default
    return combine("https://graph.microsoft.com", candidateUrl);
}
