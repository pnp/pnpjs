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

    const existing = runtime.get<ISPConfigurationPart, ISPConfigurationProps>("sp");
    
    // const y = existing && existing.fetchClientFactory ? existing.fetchClientFactory : null;

    const spPart = Object.assign({}, {
            fetchClientFactory: () => new FetchClient(),
    }, existing);

    // if (existing && existing.fetchClientFactory) {
    //     spPart.fetchClientFactory = y;
    // }

    runtime.assign({ sp: spPart });
});

export function setup(config: ISPConfiguration, runtime = DefaultRuntime): void {
    runtime.assign(config);
}
