import {
    Logger,
    LogLevel,
} from "@pnp/logging";

import {
    LibraryConfiguration,
    TypedHash,
    RuntimeConfig,
    SPfxClient,
    HttpClientImpl,
} from "@pnp/common";

export interface TeamsConfigurationPart {
    teams?: {
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

export interface TeamsConfiguration extends LibraryConfiguration, TeamsConfigurationPart { }

export function setup(config: TeamsConfiguration): void {
    RuntimeConfig.extend(config);
}

export class NoTeamsClientAvailableException extends Error {

    constructor(msg = "There is no Teams Client available, either set one using configuraiton or provide a valid SPFx Context using setup.") {
        super(msg);
        this.name = "NoTeamsClientAvailableException";
        Logger.log({ data: null, level: LogLevel.Error, message: this.message });
    }
}

export class TeamsRuntimeConfigImpl {

    public get headers(): TypedHash<string> {

        const teamsPart = RuntimeConfig.get("teams");
        if (typeof teamsPart !== "undefined" && teamsPart !== null && typeof teamsPart.headers !== "undefined") {
            return teamsPart.headers;
        }

        return {};
    }

    // public get baseUrl(): string | null {

    //     const spPart = RuntimeConfig.get("sp");
    //     if (spPart !== null && typeof spPart.baseUrl !== "undefined") {
    //         return spPart.baseUrl;
    //     }

    //     if (RuntimeConfig.spfxContext !== null) {
    //         return RuntimeConfig.spfxContext.pageContext.web.absoluteUrl;
    //     }

    //     return null;
    // }

    public get fetchClientFactory(): () => HttpClientImpl {

        const graphPart = RuntimeConfig.get("graph");
        // use a configured factory firt
        if (typeof graphPart !== "undefined" && typeof graphPart.fetchClientFactory !== "undefined") {
            return graphPart.fetchClientFactory;
        }

        // then try and use spfx context if available
        if (typeof RuntimeConfig.spfxContext !== "undefined") {
            return () => new SPfxClient(RuntimeConfig.spfxContext.graphHttpClient);
        }

        throw new NoTeamsClientAvailableException();
    }
}

export let TeamsRuntimeConfig = new TeamsRuntimeConfigImpl();
