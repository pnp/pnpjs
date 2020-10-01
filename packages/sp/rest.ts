import { RuntimeConfig2, IConfigOptions, ISPFXContext, Config2 } from "@pnp/common";
import {
    setup2 as _setup,
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
    constructor(private _options: IConfigOptions = {}, private _baseUrl = "", private _runtime = RuntimeConfig2) { }

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
            });
        } else {
            _setup(<ISPConfiguration>config);
        }
    }

    public async createdIsolatedRuntime(cloneGlobalConfig = true, options: IConfigOptions = {}, baseUrl = ""): Promise<SPRest> {

        const runtime = cloneGlobalConfig ? new Config2(RuntimeConfig2.export()) : new Config2();

        return new SPRest(options, baseUrl, runtime);
    }

    protected childConfigHook<T>(callback: ({ options: IConfigOptions, baseUrl: string, runtime: Config2 }) => T): T {
        return callback({ options: this._options, baseUrl: this._baseUrl, runtime: this._runtime});
    }
}

export const sp = new SPRest();
