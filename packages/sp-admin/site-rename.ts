import { body } from "@pnp/queryable";
import { _SPQueryable, SPInit, defaultPath, encodePath, spGet, spPost, spInvokableFactory } from "@pnp/sp";
import { ISiteRenameJobCreationProps, ISiteRenameJobInfo, SiteRenameOptions } from "./types.js";

@defaultPath("_api/SiteRenameJobs")
class _SiteRenameJobs extends _SPQueryable {

    constructor(base: SPInit, path?: string) {
        super(base, path);
        // set here so every request from this class includes it
        this.query.set("api-version", "1.4.7");
    }

    /**
     * Queues a job to change a site's address, and optionally its title
     *
     * @param props The source url, target url and optional settings
     * @returns Details of the queued job
     */
    public add(props: ISiteRenameJobCreationProps): Promise<ISiteRenameJobInfo> {
        return spPost(this, body({
            TargetSiteTitle: null,
            Option: SiteRenameOptions.None,
            Reserve: null,
            OperationId: "00000000-0000-0000-0000-000000000000",
            ...props,
            // the service takes a string, so multiple values are comma separated
            SkipGestures: props.SkipGestures?.join(",") || null,
        }));
    }

    /**
     * Gets the rename jobs for a site
     *
     * @param siteUrl Absolute url of the source site, it will be url encoded for you
     * @returns The rename jobs for the site
     */
    public getJobsBySiteUrl(siteUrl: string): Promise<ISiteRenameJobInfo[]> {
        return spGet(SiteRenameJobs(this, `GetJobsBySiteUrl(url='${encodePath(siteUrl)}')`));
    }
}
export interface ISiteRenameJobs extends _SiteRenameJobs { }
export const SiteRenameJobs = spInvokableFactory<ISiteRenameJobs>(_SiteRenameJobs);
