import { Site } from "@microsoft/microsoft-graph-types";
import { combine } from "@pnp/core";
import { ISite } from "@pnp/graph/sites";
import { Context, Suite } from "mocha";

const idCache = new Map<string, Site>();

export default async function getTestingGraphSPSite(ctx: Context | Suite): Promise<ISite> {

    const { hostname, pathname } = new URL(ctx.pnp.settings.sp.testWebUrl);
    const webUrl = `${hostname}:${combine("/", pathname)}`;

    const siteIdentifier = ctx.pnp.settings.graph.id || webUrl;

    let siteInfo: Site = null;

    if (idCache.has(siteIdentifier)) {
        siteInfo = idCache.get(siteIdentifier);
    } else {
        // validate identifier - if this call doesn't throw the id is good
        siteInfo = await ctx.pnp.graph.sites.getById(siteIdentifier)();
        idCache.set(siteIdentifier, siteInfo);
    }

    // rebase using the returned id from the service
    return ctx.pnp.graph.sites.getById(siteInfo.id);
}
