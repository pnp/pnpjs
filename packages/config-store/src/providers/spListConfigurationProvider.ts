import { IConfigurationProvider } from "../configuration";
import { TypedHash } from "@pnp/common";
import { default as CachingConfigurationProvider } from "./cachingConfigurationProvider";
import { Web } from "@pnp/sp";

/**
 * A configuration provider which loads configuration values from a SharePoint list
 *
 */
export default class SPListConfigurationProvider implements IConfigurationProvider {
    /**
     * Creates a new SharePoint list based configuration provider
     * @constructor
     * @param {string} webUrl Url of the SharePoint site, where the configuration list is located
     * @param {string} listTitle Title of the SharePoint list, which contains the configuration settings (optional, default: "config")
     * @param {string} keyFieldName The name of the field in the list to use as the setting key (optional, default: "Title")
     * @param {string} valueFieldName The name of the field in the list to use as the setting value (optional, default: "Value")
     */
    constructor(public readonly web: Web, public readonly listTitle = "config", private keyFieldName = "Title", private valueFieldName = "Value") { }

    /**
     * Loads the configuration values from the SharePoint list
     *
     * @return {Promise<TypedHash<string>>} Promise of loaded configuration values
     */
    public getConfiguration(): Promise<TypedHash<string>> {

        return this.web.lists.getByTitle(this.listTitle).items.select(this.keyFieldName, this.valueFieldName).get<any[]>()
            .then((data) => data.reduce((c: any, item: any) => {
                c[item[this.keyFieldName]] = item[this.valueFieldName];
                return c;
            }, {}));
    }

    /**
     * Wraps the current provider in a cache enabled provider
     *
     * @return {CachingConfigurationProvider} Caching providers which wraps the current provider
     */
    public asCaching(cacheKey = `pnp_configcache_splist_${this.web.toUrl()}+${this.listTitle}`): CachingConfigurationProvider {
        return new CachingConfigurationProvider(this, cacheKey);
    }
}
