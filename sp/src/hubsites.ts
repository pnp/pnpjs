import { SharePointQueryableInstance, SharePointQueryableCollection, defaultPath } from "./sharepointqueryable";
import { HubSite as IHubSite } from "./types";

/**
 * Describes a collection of Hub Sites
 *
 */
@defaultPath("_api/hubsites")
export class HubSites extends SharePointQueryableCollection<IHubSite[]> {

    /**	    
     * Gets a Hub Site from the collection by id	     
     *	    
     * @param id The Id of the Hub Site	    
     */
    public getById(id: string): HubSite {
        return new HubSite(this, `GetById?hubSiteId='${id}'`);

    }

}

export class HubSite extends SharePointQueryableInstance<IHubSite> { }
