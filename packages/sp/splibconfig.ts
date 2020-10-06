import {
    ILibraryConfiguration,
    ITypedHash,
    IHttpClientImpl,
    FetchClient,
    DefaultRuntime,
    onRuntimeCreate,
    Runtime,
} from "@pnp/common";

export const emptyGuid = "00000000-0000-0000-0000-000000000000";

export interface ISPConfigurationPart {
    sp?: ISPConfigurationProps;
}

export interface ISPConfigurationProps {
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
}

export interface ISPConfiguration extends ILibraryConfiguration, ISPConfigurationPart { }

onRuntimeCreate((runtime: Runtime) => {
    runtime.assign<Required<ISPConfigurationPart>>({
        sp: {
            fetchClientFactory: () => new FetchClient(),
        },
    });
});

export function setup(config: ISPConfiguration, runtime = DefaultRuntime): void {
    runtime.assign(config);
}
