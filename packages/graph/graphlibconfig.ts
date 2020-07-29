import { ILibraryConfiguration, ITypedHash, RuntimeConfig, IHttpClientImpl, SPFxAdalClient } from "@pnp/common";

export interface IGraphConfigurationPart {
    graph?: {

        /**
         * The base url used for all requests (default: none)
         */
        baseUrl?: string;

        /**
         * Any headers to apply to all requests
         */
        headers?: ITypedHash<string>;

        /**
         * Defines a factory method used to create fetch clients
         */
        fetchClientFactory?: () => IHttpClientImpl;
    };
}

export interface IGraphConfiguration extends ILibraryConfiguration, IGraphConfigurationPart { }

export function setup(config: IGraphConfiguration): void {
    RuntimeConfig.assign(config);
}

export class GraphRuntimeConfigImpl {

    public get headers(): ITypedHash<string> {

        const graphPart = RuntimeConfig.get("graph");
        if (graphPart !== undefined && graphPart.headers !== undefined) {
            return graphPart.headers;
        }

        return {};
    }

    public get baseUrl(): string {
        const graphPart = RuntimeConfig.get("graph");
        if (graphPart !== undefined && graphPart.baseUrl !== undefined) {
            return graphPart.baseUrl;
        }

        return null;
    }

    public get fetchClientFactory(): () => IHttpClientImpl {

        const graphPart = RuntimeConfig.get("graph");
        // use a configured factory firt
        if (graphPart !== undefined && graphPart.fetchClientFactory !== undefined) {
            return graphPart.fetchClientFactory;
        }

        // then try and use spfx context if available
        if (RuntimeConfig.spfxContext !== undefined) {
            return () => new SPFxAdalClient(RuntimeConfig.spfxContext);
        }

        throw Error("There is no Graph Client available, either set one using configuraiton or provide a valid SPFx Context using setup.");
    }
}

export let GraphRuntimeConfig = new GraphRuntimeConfigImpl();
