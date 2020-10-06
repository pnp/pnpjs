import { DefaultRuntime, IConfigOptions, ISPFXContext, Runtime, ITypedHash } from "@pnp/common";
import {
    setup as _setup,
    ISPConfiguration,
} from "./splibconfig";

/**
 * Root of the SharePoint REST module
 */
export class SPRest {

    /** 
     * Creates a new instance of the SPRest class
     * 
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    constructor(private _options: IConfigOptions = {}, private _baseUrl = "", private _runtime = DefaultRuntime) { }

    /**
     * Configures instance with additional options and baseUrl.
     * Provided configuration used by other objects in a chain
     * 
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    public configure(options: IConfigOptions, baseUrl = ""): SPRest {
        return new SPRest(options, baseUrl);
    }

    /**
     * Global SharePoint configuration options
     * 
     * @param config The SharePoint configuration to apply
     */
    public setup(config: ISPConfiguration | ISPFXContext) {

        if ((<ISPFXContext>config).pageContext) {
            _setup({
                spfxContext: <ISPFXContext>config,
            }, this._runtime);
        } else {
            _setup(<ISPConfiguration>config, this._runtime);
        }
    }

    public async createIsolated<T = ITypedHash<any>>(init: Partial<IIsolatedInit<T>>): Promise<SPRest> {

        // merge our defaults
        init = Object.assign<IIsolatedInit<T>, Partial<IIsolatedInit<T>>>({
            baseUrl: "",
            cloneGlobal: true,
            options: {},
            runtimeConfig: <T>{},
        }, init);

        const { baseUrl, cloneGlobal, options, runtimeConfig } = init;

        const runtime = cloneGlobal ? new Runtime(DefaultRuntime.export()) : new Runtime();

        runtime.assign(runtimeConfig);

        return new SPRest(options, baseUrl, runtime);
    }

    protected childConfigHook<T>(callback: ({ options: IConfigOptions, baseUrl: string, runtime: Config2 }) => T): T {
        return callback({ options: this._options, baseUrl: this._baseUrl, runtime: this._runtime });
    }
}

export interface IIsolatedInit<T> {
    cloneGlobal: boolean;
    runtimeConfig: T;
    options: IConfigOptions;
    baseUrl: string;
}

export const sp = new SPRest();
