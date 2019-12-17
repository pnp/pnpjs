import { TypedHash, mergeMaps, objectToMap } from "./collections";
import { ISPFXContext } from "./spfxcontextinterface";

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

// lable mapping for known config values
const s = [
    "defaultCachingStore",
    "defaultCachingTimeoutSeconds",
    "globalCacheDisable",
    "enableCacheExpiration",
    "cacheExpirationIntervalMilliseconds",
    "spfxContext",
];

export class RuntimeConfigImpl {

    constructor(private _v = new Map<string, any>()) {

        // setup defaults
        this._v.set(s[0], "session");
        this._v.set(s[1], 60);
        this._v.set(s[2], false);
        this._v.set(s[3], false);
        this._v.set(s[4], 750);
        this._v.set(s[5], null);
    }

    /**
     * 
     * @param config The set of properties to add to the globa configuration instance
     */
    public extend(config: TypedHash<any>): void {
        this._v = mergeMaps(this._v, objectToMap(config));
    }

    public get(key: string): any {
        return this._v.get(key);
    }

    public get defaultCachingStore(): "session" | "local" {
        return this.get(s[0]);
    }

    public get defaultCachingTimeoutSeconds(): number {
        return this.get(s[1]);
    }

    public get globalCacheDisable(): boolean {
        return this.get(s[2]);
    }

    public get enableCacheExpiration(): boolean {
        return this.get(s[3]);
    }

    public get cacheExpirationIntervalMilliseconds(): number {
        return this.get(s[4]);
    }

    public get spfxContext(): ISPFXContext {
        return this.get(s[5]);
    }
}

const _runtimeConfig = new RuntimeConfigImpl();

export let RuntimeConfig = _runtimeConfig;
