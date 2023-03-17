import { ISPQueryable, SPInit, spInvokableFactory, _SPInstance } from "../spqueryable.js";

export class _SitePageService extends _SPInstance implements ISitePageService {
    constructor(baseUrl: string | ISPQueryable, path = "_api/SP.Publishing.SitePageService") {
        super(baseUrl, path);
    }
    /**
    * Gets current user unified group memberships
    */
    public getCurrentUserMemberships(): Promise<string[]> {
        const q = SitePageService(this, null);
        q.concat(".GetCurrentUserMemberships");
        return q();
    }
}

export interface ISitePageService extends _SitePageService {}
export const SitePageService: (base: SPInit, path?: string) => ISitePageService = spInvokableFactory(_SitePageService);
