import { IConfigOptions, ISPFXContext } from "@pnp/common";
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
    constructor(protected _options: IConfigOptions = {}, protected _baseUrl = "") { }

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
}

export const sp = new SPRest();
