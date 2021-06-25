import {
    setup as _setup,
    IGraphConfiguration,
} from "./graphlibconfig.js";
import { GraphBatch } from "./batch.js";
import { Runtime, IConfigOptions, ISPFXContext, ITypedHash, DefaultRuntime } from "@pnp/core";

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

    public async createIsolated<T = ITypedHash<any>>(init?: Partial<IGraphIsolatedInit<T>>): Promise<GraphRest> {

        // merge our defaults
        init = Object.assign<IGraphIsolatedInit<T>, Partial<IGraphIsolatedInit<T>>>({
            baseUrl: "v1.0",
            cloneGlobal: true,
            config: <T>{},
            options: {},
        }, init || {});

        const { baseUrl, cloneGlobal, options, config } = init;

        const runtime = cloneGlobal ? new Runtime(DefaultRuntime.export()) : new Runtime();

        runtime.assign(config);

        return new GraphRest(options, baseUrl, runtime);
    }

    protected childConfigHook<T>(callback: ({ options: IConfigOptions, baseUrl: string, runtime: Runtime }) => T): T {
        return callback({ options: this._options, baseUrl: this._baseUrl, runtime: this._runtime });
    }
}

export interface IGraphIsolatedInit<T> {
    cloneGlobal: boolean;
    config: T;
    options: IConfigOptions;
    baseUrl: "v1.0" | "beta";
}

export const graph = new GraphRest();
