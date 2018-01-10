import { TypedHash, Dictionary } from "./collections";
import { ISPFXContext } from "./spfxContextInterface";

export interface LibraryConfiguration {

    /**
     * Allows caching to be global disabled, default: false
     */
    globalCacheDisable?: boolean;

    /**
     * Defines the default store used by the usingCaching method, default: session
     */
    defaultCachingStore?: "session" | "local";

    /**
     * Defines the default timeout in seconds used by the usingCaching method, default 30
     */
    defaultCachingTimeoutSeconds?: number;

    /**
     * If true a timeout expired items will be removed from the cache in intervals determined by cacheTimeoutInterval
     */
    enableCacheExpiration?: boolean;

    /**
     * Determines the interval in milliseconds at which the cache is checked to see if items have expired (min: 100)
     */
    cacheExpirationIntervalMilliseconds?: number;

    /**
     * Used to supply the current context from an SPFx webpart to the library
     */
    spfxContext?: any;
}

export function setup(config: LibraryConfiguration): void {
    RuntimeConfig.extend(config);
}

export class RuntimeConfigImpl {

    private _v: Dictionary<any>;

    constructor() {

        this._v = new Dictionary();

        // setup defaults
        this._v.add("defaultCachingStore", "session");
        this._v.add("defaultCachingTimeoutSeconds", 60);
        this._v.add("globalCacheDisable", false);
        this._v.add("enableCacheExpiration", false);
        this._v.add("cacheExpirationIntervalMilliseconds", 750);
        this._v.add("spfxContext", null);
    }

    /**
     * 
     * @param config The set of properties to add to the globa configuration instance
     */
    public extend(config: TypedHash<any>): void {

        Object.keys(config).forEach((key: string) => {
            this._v.add(key, config[key]);
        });
    }

    public get(key: string): any {
        return this._v.get(key);
    }

    public get defaultCachingStore(): "session" | "local" {
        return this.get("defaultCachingStore");
    }

    public get defaultCachingTimeoutSeconds(): number {
        return this.get("defaultCachingTimeoutSeconds");
    }

    public get globalCacheDisable(): boolean {
        return this.get("globalCacheDisable");
    }

    public get enableCacheExpiration(): boolean {
        return this.get("enableCacheExpiration");
    }

    public get cacheExpirationIntervalMilliseconds(): number {
        return this.get("cacheExpirationIntervalMilliseconds");
    }

    public get spfxContext(): ISPFXContext {
        return this.get("spfxContext");
    }
}

const _runtimeConfig = new RuntimeConfigImpl();

export let RuntimeConfig = _runtimeConfig;
