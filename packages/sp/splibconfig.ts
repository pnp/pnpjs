import {
    ILibraryConfiguration,
    ITypedHash,
    RuntimeConfig,
    IHttpClientImpl,
    FetchClient,
    objectDefinedNotNull,
} from "@pnp/common";

export const emptyGuid = "00000000-0000-0000-0000-000000000000";

export interface ISPConfigurationPart {
    sp?: {
        /**
         * Any headers to apply to all requests
         */
        headers?: ITypedHash<string>;

        /**
         * The base url used for all requests
         */
        baseUrl?: string;

        /**
         * Defines a factory method used to create fetch clients
         */
        fetchClientFactory?: () => IHttpClientImpl;
    };
}

export interface ISPConfiguration extends ILibraryConfiguration, ISPConfigurationPart { }

export function setup(config: ISPConfiguration): void {
    RuntimeConfig.assign(config);
}

export class SPRuntimeConfigImpl {

    public get headers(): ITypedHash<string> {

        const spPart = RuntimeConfig.get("sp");
        if (spPart !== undefined && spPart.headers !== undefined) {
            return spPart.headers;
        }

        return {};
    }

    public get baseUrl(): string | null {

        const spPart = RuntimeConfig.get("sp");
        if (spPart !== undefined && spPart.baseUrl !== undefined) {
            return spPart.baseUrl;
        }

        if (objectDefinedNotNull(RuntimeConfig.spfxContext)) {
            return RuntimeConfig.spfxContext.pageContext.web.absoluteUrl;
        }

        return null;
    }

    public get fetchClientFactory(): () => IHttpClientImpl {

        const spPart = RuntimeConfig.get("sp");
        if (spPart !== undefined && spPart.fetchClientFactory !== undefined) {
            return spPart.fetchClientFactory;
        } else {
            return () => new FetchClient();
        }
    }
}

export let SPRuntimeConfig = new SPRuntimeConfigImpl();
