import { LibraryConfiguration, TypedHash, RuntimeConfig, HttpClientImpl, AdalClient } from "@pnp/common";
import { Logger, LogLevel } from "@pnp/logging";

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

export class NoGraphClientAvailableException extends Error {

    constructor(msg = "There is no Graph Client available, either set one using configuraiton or provide a valid SPFx Context using setup.") {
        super(msg);
        this.name = "NoGraphClientAvailableException";
        Logger.log({ data: null, level: LogLevel.Error, message: this.message });
    }
}

export class GraphRuntimeConfigImpl {

    public get headers(): TypedHash<string> {

        const graphPart = RuntimeConfig.get("graph");
        if (graphPart !== null && typeof graphPart !== "undefined" && typeof graphPart.headers !== "undefined") {
            return graphPart.headers;
        }

        return {};
    }

    public get fetchClientFactory(): () => HttpClientImpl {

        const graphPart = RuntimeConfig.get("graph");
        // use a configured factory firt
        if (graphPart !== null && typeof graphPart.fetchClientFactory !== "undefined") {
            return graphPart.fetchClientFactory;
        }

        // then try and use spfx context if available
        if (typeof RuntimeConfig.spfxContext !== "undefined") {
            return () => AdalClient.fromSPFxContext(RuntimeConfig.spfxContext);
        }

        throw new NoGraphClientAvailableException();
    }
}

export let GraphRuntimeConfig = new GraphRuntimeConfigImpl();
