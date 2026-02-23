# Project Config/Services Setup

Due to the introduction of [selective imports](./selective-imports.md) it can be somewhat frustrating to import all of the needed dependencies every time you need them across many files. Instead the preferred approach, especially for SPFx, is to create a project config file or establish a service to manage your PnPjs interfaces. Doing so centralizes the imports, configuration, and optionally extensions to PnPjs in a single place.

> If you have multiple projects that share dependencies on PnPjs you can benefit from creating a [custom bundle](./custom-bundle.md) and using them across your projects.

These steps reference an [SPFx](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview) solution, but apply to any solution.

## Using a config file

Within the src directory create a new file named `pnpjs-config.ts` and copy in the below content.

```TypeScript
import { WebPartContext } from "@microsoft/sp-webpart-base";

// import pnp, pnp logging system, and any other selective imports needed
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

var _sp: SPFI = null;

export const getSP = (context?: WebPartContext): SPFI => {
  if (context != null) {
    //You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
    // The LogLevel set's at what level a message will be written to the console
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }
  return _sp;
};
```

To initialize the configuration, from the `onInit` function (or whatever function runs first in your code) make a call to getSP passing in the SPFx context object (or whatever configuration you would require for your setup).

```TypeScript
protected async onInit(): Promise<void> {
  this._environmentMessage = this._getEnvironmentMessage();

  super.onInit();

  //Initialize our _sp object that we can then use in other packages without having to pass around the context.
  //  Check out pnpjsConfig.ts for an example of a project setup file.
  getSP(this.context);
}
```

Now you can consume your configured `_sp` object from anywhere else in your code by simply referencing the `pnpjs-presets.ts` file via an import statement and then getting a local instance of the `_sp` object using the `getSP()` method without passing any context.

```TypeScript
import { getSP } from './pnpjs-config.ts';
...
export default class PnPjsExample extends React.Component<IPnPjsExampleProps, IIPnPjsExampleState> {
  
  private _sp: SPFI;

  constructor(props: IPnPjsExampleProps) {
    super(props);
    // set initial state
    this.state = {
      items: [],
      errors: []
    };
    this._sp = getSP();
  }

  ...

}
```

### Use a service class

Because you do not have full access to the context object within a service you need to setup things a little differently.

```TypeScript
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { AadTokenProviderFactory } from "@microsoft/sp-http";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { graphfi, GraphFI, SPFx as gSPFx } from "@pnp/graph";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";

export interface ISampleService {
    getLists(): Promise<any[]>;
}

export class SampleService {

    public static readonly serviceKey: ServiceKey<ISampleService> = ServiceKey.create<ISampleService>('SPFx:SampleService', SampleService);
    private _sp: SPFI;
    private _graph: GraphFI;

    constructor(serviceScope: ServiceScope) {

        serviceScope.whenFinished(() => {

        const pageContext = serviceScope.consume(PageContext.serviceKey);
        const aadTokenProviderFactory = serviceScope.consume(AadTokenProviderFactory.serviceKey);

        //SharePoint
        this._sp = spfi().using(spSPFx({ pageContext }));

        //Graph
        this._graph = graphfi().using(gSPFx({ aadTokenProviderFactory }));
    }

    public getLists(): Promise<any[]> {
        return this._sp.web.lists();
    }
}
```

Depending on the architecture of your solution you can also opt to export the service as a global. If you choose this route you would need to modify the service to create an Init function where you would pass the service scope instead of doing so in the constructor. You would then export a constant that creates a global instance of the service.

```ts
export const mySampleService = new SampleService();
```

For a full sample, please see our [PnPjs Version 3 Sample Project](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-pnp-js-sample)
