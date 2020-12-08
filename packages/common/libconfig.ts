import { ITypedHash, mergeMaps, objectToMap } from "./collections.js";
import { ISPFXContext } from "./spfxcontextinterface.js";

export interface ILibraryConfiguration {

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
    spfxContext?: ISPFXContext;

    /**
     * Used to place the library in ie11 compat mode. Some features may not work as expected
     */
    ie11?: boolean;
}

export function setup<T = ILibraryConfiguration>(config: T, runtime = DefaultRuntime): void {
    runtime.assign(config);
}

// lable mapping for known config values
const s = [
    "defaultCachingStore",
    "defaultCachingTimeoutSeconds",
    "globalCacheDisable",
    "enableCacheExpiration",
    "cacheExpirationIntervalMilliseconds",
    "spfxContext",
    "ie11",
];

const runtimeCreateHooks: ((runtime: Runtime) => void)[] = [];

export function onRuntimeCreate(hook: (runtime: Runtime) => void) {
    if (runtimeCreateHooks.indexOf(hook) < 0) {
        // apply hook logic to default runtime
        hook(DefaultRuntime);
        runtimeCreateHooks.push(hook);
    }
}

export class Runtime {

    constructor(private _v = new Map<string | number | symbol, any>()) {
        const defaulter = (key: string, def: any) => {
            if (!this._v.has(key)) {
                this._v.set(key, def);
            }
        };
        // setup defaults
        defaulter(s[0], "session");
        defaulter(s[1], 60);
        defaulter(s[2], false);
        defaulter(s[3], false);
        defaulter(s[4], 750);
        defaulter(s[5], null);
        defaulter(s[6], false);

        runtimeCreateHooks.forEach(hook => hook(this));
    }

    /**
     * 
     * @param config The set of properties to add to this runtime instance
     */
    public assign<T = ITypedHash<any>>(config: T): void {
        this._v = mergeMaps(this._v, objectToMap(config));
    }

    /**
     * Gets a runtime value using T to define the available keys, and R to define the type returned by that key
     * 
     * @param key 
     */
    public get<T = ILibraryConfiguration, R = any>(key: keyof T): R {
        return this._v.get(key);
    }

    /**
     * Exports the internal Map representing this runtime
     */
    public export(): Map<string | number | symbol, any> {

        const expt = new Map<string | number | symbol, any>();

        for (const [key, value] of this._v) {
            if (key !== "__isDefault__") {
                expt.set(key, value);
            }
        }

        return expt;
    }
}

// default runtime used globally
const _runtime = new Runtime(new Map([["__isDefault__", true]]));
export let DefaultRuntime = _runtime;
