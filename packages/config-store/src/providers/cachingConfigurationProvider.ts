import { IConfigurationProvider } from "../configuration";
import { TypedHash } from "../../collections/collections";
import * as storage from "../../utils/storage";
import { NoCacheAvailableException } from "../../utils/exceptions";

/**
 * A caching provider which can wrap other non-caching providers
 *
 */
export default class CachingConfigurationProvider implements IConfigurationProvider {
    private wrappedProvider: IConfigurationProvider;
    private store: storage.PnPClientStore;
    private cacheKey: string;

    /**
     * Creates a new caching configuration provider
     * @constructor
     * @param {IConfigurationProvider} wrappedProvider Provider which will be used to fetch the configuration
     * @param {string} cacheKey Key that will be used to store cached items to the cache
     * @param {IPnPClientStore} cacheStore OPTIONAL storage, which will be used to store cached settings.
     */
    constructor(wrappedProvider: IConfigurationProvider, cacheKey: string, cacheStore?: storage.PnPClientStore) {
        this.wrappedProvider = wrappedProvider;
        this.store = (cacheStore) ? cacheStore : this.selectPnPCache();
        this.cacheKey = `_configcache_${cacheKey}`;
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
        // Cache not available, pass control to  the wrapped provider
        if ((!this.store) || (!this.store.enabled)) {
            return this.wrappedProvider.getConfiguration();
        }

        // Value is found in cache, return it directly
        const cachedConfig = this.store.get(this.cacheKey);
        if (cachedConfig) {
            return new Promise<TypedHash<string>>((resolve) => {
                resolve(cachedConfig);
            });
        }

        // Get and cache value from the wrapped provider
        const providerPromise = this.wrappedProvider.getConfiguration();
        providerPromise.then((providedConfig) => {
            this.store.put(this.cacheKey, providedConfig);
        });
        return providerPromise;
    }

    private selectPnPCache(): storage.PnPClientStore {
        const pnpCache = new storage.PnPClientStorage();
        if ((pnpCache.local) && (pnpCache.local.enabled)) {
            return pnpCache.local;
        }
        if ((pnpCache.session) && (pnpCache.session.enabled)) {
            return pnpCache.session;
        }
        throw new NoCacheAvailableException();
    }
}
