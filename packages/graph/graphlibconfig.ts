import { ILibraryConfiguration, ITypedHash, IHttpClientImpl, SPFxAdalClient, DefaultRuntime, ISPFXContext, onRuntimeCreate, Runtime, objectDefinedNotNull } from "@pnp/common";

export interface IGraphConfigurationPart {
    graph?: IGraphConfigurationProps;
}

export interface IGraphConfigurationProps {
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
}

export interface IGraphConfiguration extends ILibraryConfiguration, IGraphConfigurationPart { }

onRuntimeCreate((runtime: Runtime) => {

    const existing = runtime.get<IGraphConfigurationPart>("graph");

    const graphPart = Object.assign({}, {
        fetchClientFactory: () => {
            // we keep a ref to the runtime within which we are assigned
            const context = runtime.get<ILibraryConfiguration, ISPFXContext>("spfxContext");
            if (objectDefinedNotNull(context)) {
                return new SPFxAdalClient(context);
            }
            throw Error("There is no Graph Client available, either set one using configuraiton or provide a valid SPFx Context.");
        },
    }, existing);

    runtime.assign(graphPart);
});

export function setup(config: IGraphConfiguration, runtime = DefaultRuntime): void {
    runtime.assign(config);
}
