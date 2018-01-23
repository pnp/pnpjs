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
    constructor(private sourceWeb: Web, private sourceListTitle = "config", private keyFieldName = "Title", private valueFieldName = "Value") {
    }

    /**
     * Gets the url of the SharePoint site, where the configuration list is located
     *
     * @return {string} Url address of the site
     */
    public get web(): Web {
        return this.sourceWeb;
    }

    /**
     * Gets the title of the SharePoint list, which contains the configuration settings
     *
     * @return {string} List title
     */
    public get listTitle(): string {
        return this.sourceListTitle;
    }

    /**
     * Loads the configuration values from the SharePoint list
     *
     * @return {Promise<TypedHash<string>>} Promise of loaded configuration values
     */
    public getConfiguration(): Promise<TypedHash<string>> {

        return this.web.lists.getByTitle(this.listTitle).items.select(this.keyFieldName, this.valueFieldName)
            .get<any[]>().then((data) => data.reduce((c: any, item: any) => {

                return Object.defineProperty(c, item[this.keyFieldName], {
                    configurable: false,
                    enumerable: false,
                    value: item[this.valueFieldName],
                    writable: false,
                });
            }, {}));
    }

    /**
     * Wraps the current provider in a cache enabled provider
     *
     * @return {CachingConfigurationProvider} Caching providers which wraps the current provider
     */
    public asCaching(): CachingConfigurationProvider {
        const cacheKey = `splist_${this.web.toUrl()}+${this.listTitle}`;
        return new CachingConfigurationProvider(this, cacheKey);
    }
}
