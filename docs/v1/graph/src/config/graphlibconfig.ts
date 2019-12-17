import { LibraryConfiguration, TypedHash, RuntimeConfig, HttpClientImpl, AdalClient } from "@pnp/common";

export interface GraphConfigurationPart {
    graph?: {
        /**
         * Any headers to apply to all requests
         */
        headers?: TypedHash<string>;

        /**
         * Defines a factory method used to create fetch clients
         */
        fetchClientFactory?: () => HttpClientImpl;
    };
}

export interface GraphConfiguration extends LibraryConfiguration, GraphConfigurationPart { }

export function setup(config: GraphConfiguration): void {
    RuntimeConfig.extend(config);
}

export class GraphRuntimeConfigImpl {

    public get headers(): TypedHash<string> {

        const graphPart = RuntimeConfig.get("graph");
        if (graphPart !== undefined && graphPart !== null && graphPart.headers !== undefined) {
            return graphPart.headers;
        }

        return {};
    }

    public get fetchClientFactory(): () => HttpClientImpl {

        const graphPart = RuntimeConfig.get("graph");
        // use a configured factory firt
        if (graphPart !== undefined && graphPart !== null && graphPart.fetchClientFactory !== undefined) {
            return graphPart.fetchClientFactory;
        }

        // then try and use spfx context if available
        if (RuntimeConfig.spfxContext !== undefined) {
            return () => AdalClient.fromSPFxContext(RuntimeConfig.spfxContext);
        }

        throw Error("There is no Graph Client available, either set one using configuraiton or provide a valid SPFx Context using setup.");
    }
}

export let GraphRuntimeConfig = new GraphRuntimeConfigImpl();
