import { _GraphQueryable } from "./graphqueryable";
import {
    setup as _setup,
    IGraphConfiguration,
} from "./graphlibconfig";
import { GraphBatch } from "./batch";
import { Runtime, IConfigOptions, ISPFXContext, ITypedHash, DefaultRuntime } from "@pnp/common";

export class GraphRest {

    /** 
     * Creates a new instance of the SPRest class
     * 
     * @param options Additional options
     * @param baseUrl A string that should form the base part of the url
     */
    constructor(private _options: IConfigOptions = {}, private _baseUrl: "v1.0" | "beta" = "v1.0", private _runtime = DefaultRuntime) {    }

    public createBatch(): GraphBatch {
        return new GraphBatch().setRuntime(this._runtime);
    }

    public setup(config: IGraphConfiguration | ISPFXContext) {

        if ((<ISPFXContext>config).pageContext) {
            _setup({
                spfxContext: <ISPFXContext>config,
            }, this._runtime);
        } else {
            _setup(<IGraphConfiguration>config, this._runtime);
        }
    }

    public async createIsolated<T = ITypedHash<any>>(init: Partial<IIsolatedInit<T>>): Promise<GraphRest> {

        // merge our defaults
        init = Object.assign<IIsolatedInit<T>, Partial<IIsolatedInit<T>>>({
            baseUrl: "v1.0",
            cloneGlobal: true,
            options: {},
            runtimeConfig: <T>{},
        }, init);

        const { baseUrl, cloneGlobal, options, runtimeConfig } = init;

        const runtime = cloneGlobal ? new Runtime(DefaultRuntime.export()) : new Runtime();

        runtime.assign(runtimeConfig);

        return new GraphRest(options, baseUrl, runtime);
    }

    protected childConfigHook<T>(callback: ({ options: IConfigOptions, baseUrl: string, runtime: Config2 }) => T): T {
        return callback({ options: this._options, baseUrl: this._baseUrl, runtime: this._runtime });
    }
}

export interface IIsolatedInit<T> {
    cloneGlobal: boolean;
    runtimeConfig: T;
    options: IConfigOptions;
    baseUrl: "v1.0" | "beta";
}

export let graph = new GraphRest();
