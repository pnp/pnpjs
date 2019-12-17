import { IConfigurationProvider } from "../configuration";
import { TypedHash, PnPClientStore, PnPClientStorage } from "@pnp/common";

/**
 * A caching provider which can wrap other non-caching providers
 *
 */
export default class CachingConfigurationProvider implements IConfigurationProvider {

    private store: PnPClientStore;

    /**
     * Creates a new caching configuration provider
     * @constructor
     * @param {IConfigurationProvider} wrappedProvider Provider which will be used to fetch the configuration
     * @param {string} cacheKey Key that will be used to store cached items to the cache
     * @param {IPnPClientStore} cacheStore OPTIONAL storage, which will be used to store cached settings.
     */
    constructor(private wrappedProvider: IConfigurationProvider, private cacheKey: string, cacheStore?: PnPClientStore) {
        this.wrappedProvider = wrappedProvider;
        this.store = (cacheStore) ? cacheStore : this.selectPnPCache();
    }

    /**
     * Gets the wrapped configuration providers
     *
     * @return {IConfigurationProvider} Wrapped configuration provider
     */
    public getWrappedProvider(): IConfigurationProvider {
        return this.wrappedProvider;
    }

    /**
     * Loads the configuration values either from the cache or from the wrapped provider
     *
     * @return {Promise<TypedHash<string>>} Promise of loaded configuration values
     */
    public getConfiguration(): Promise<TypedHash<string>> {
        // Cache not available, pass control to the wrapped provider
        if ((!this.store) || (!this.store.enabled)) {
            return this.wrappedProvider.getConfiguration();
        }

        return this.store.getOrPut(this.cacheKey, () => {
            return this.wrappedProvider.getConfiguration().then((providedConfig) => {
                this.store.put(this.cacheKey, providedConfig);
                return providedConfig;
            });
        });
    }

    private selectPnPCache(): PnPClientStore {
        const pnpCache = new PnPClientStorage();
        if ((pnpCache.local) && (pnpCache.local.enabled)) {
            return pnpCache.local;
        }
        if ((pnpCache.session) && (pnpCache.session.enabled)) {
            return pnpCache.session;
        }
        throw Error("Cannot create a caching configuration provider since cache is not available.");
    }
}
