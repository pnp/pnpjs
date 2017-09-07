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

export class CommonRuntimeConfigKeys {
    public static readonly defaultCachingStore = "defaultCachingStore";
    public static readonly defaultCachingTimeoutSeconds = "defaultCachingTimeoutSeconds";
    public static readonly globalCacheDisable = "globalCacheDisable";
    public static readonly enableCacheExpiration = "enableCacheExpiration";
    public static readonly cacheExpirationIntervalMilliseconds = "cacheExpirationIntervalMilliseconds";
    public static readonly spfxContext = "spfxContext";
}

export class RuntimeConfigImpl {

    private _values: Dictionary<any>;

    constructor() {

        this._values = new Dictionary();

        // setup defaults
        this._values.add(CommonRuntimeConfigKeys.defaultCachingStore, "session");
        this._values.add(CommonRuntimeConfigKeys.defaultCachingTimeoutSeconds, 60);
        this._values.add(CommonRuntimeConfigKeys.globalCacheDisable, false);
        this._values.add(CommonRuntimeConfigKeys.enableCacheExpiration, false);
        this._values.add(CommonRuntimeConfigKeys.cacheExpirationIntervalMilliseconds, 750);
        this._values.add(CommonRuntimeConfigKeys.spfxContext, null);
    }

    /**
     * 
     * @param config The set of properties to add to the globa configuration instance
     */
    public extend(config: TypedHash<any>): void {

        Object.keys(config).forEach((key: string) => {
            this._values.add(key, config[key]);
        });
    }

    public get(key: string): any {
        return this._values.get(key);
    }

    public get defaultCachingStore(): "session" | "local" {
        return this.get(CommonRuntimeConfigKeys.defaultCachingStore);
    }

    public get defaultCachingTimeoutSeconds(): number {
        return this.get(CommonRuntimeConfigKeys.defaultCachingTimeoutSeconds);
    }

    public get globalCacheDisable(): boolean {
        return this.get(CommonRuntimeConfigKeys.globalCacheDisable);
    }

    public get enableCacheExpiration(): boolean {
        return this.get(CommonRuntimeConfigKeys.enableCacheExpiration);
    }

    public get cacheExpirationIntervalMilliseconds(): number {
        return this.get(CommonRuntimeConfigKeys.cacheExpirationIntervalMilliseconds);
    }

    public get spfxContext(): ISPFXContext {
        return this.get(CommonRuntimeConfigKeys.spfxContext);
    }
}

const _runtimeConfig = new RuntimeConfigImpl();

export let RuntimeConfig = _runtimeConfig;
