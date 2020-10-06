import { ILibraryConfiguration, ITypedHash, IHttpClientImpl, SPFxAdalClient, DefaultRuntime, ISPFXContext, onRuntimeCreate, Runtime } from "@pnp/common";

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

    const errText = "There is no Graph Client available, either set one using configuraiton or provide a valid SPFx Context.";
    const context = runtime.get<ILibraryConfiguration, ISPFXContext>("spfxContext");

    runtime.assign<Required<IGraphConfigurationPart>>({
        graph: {
            fetchClientFactory: context ? () => new SPFxAdalClient(context) : () => { throw Error(errText); },
        },
    });
});

export function setup(config: IGraphConfiguration, runtime = DefaultRuntime): void {
    runtime.assign(config);
}
