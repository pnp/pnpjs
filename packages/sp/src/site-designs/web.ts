import { _Web } from "../webs/types";
import { ISiteDesignRun, SiteDesigns, ISiteDesignTask, ISiteScriptActionStatus } from "./types";

declare module "../webs/types" {

    interface _Web {
        getSiteDesignRuns(siteDesignId?: string): Promise<ISiteDesignRun[]>;
        addSiteDesignTask(siteDesignId: string): Promise<ISiteDesignTask>;
        getSiteDesignRunStatus(runId: string): Promise<ISiteScriptActionStatus[]>;
    }

    interface IWeb {
        /**
         * Retrieves a list of site design that have run on the current web
         * @param siteDesignId (Optional) the site design ID, if not provided will return all site design runs
         */
        getSiteDesignRuns(siteDesignId?: string): Promise<ISiteDesignRun[]>;
        /**
         * Adds a site design task on the current web to be invoked asynchronously.
         * @param siteDesignId The ID of the site design to create a task for
         */
        addSiteDesignTask(siteDesignId: string): Promise<ISiteDesignTask>;
        /**
         * Retrieves the status of a site design that has been run or is still running
         * @param runId the run ID
         */
        getSiteDesignRunStatus(runId: string): Promise<ISiteScriptActionStatus[]>;
    }
}

_Web.prototype.getSiteDesignRuns = function (this: _Web, siteDesignId?: string): Promise<ISiteDesignRun[]> {
    return SiteDesigns(this, "").getSiteDesignRun(undefined, siteDesignId);
};

_Web.prototype.addSiteDesignTask = function (this: _Web, siteDesignId: string): Promise<ISiteDesignTask> {
    return SiteDesigns(this, "").addSiteDesignTaskToCurrentWeb(siteDesignId);
};

_Web.prototype.getSiteDesignRunStatus = function (this: _Web, runId: string): Promise<ISiteScriptActionStatus[]> {
    return SiteDesigns(this, "").getSiteDesignRunStatus(undefined, runId);
};
