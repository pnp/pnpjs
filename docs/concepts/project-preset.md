# Project Presets

Due to the introduction of [selective imports](./selective-imports.md) it can be somewhat frustrating to import all of the needed dependencies every time you need them across many files. Instead the preferred approach, especially for SPFx, is to create a project preset file. This centralizes the imports, configuration, and optionally extensions to PnPjs in a single place.

> If you have multiple projects that share dependencies on PnPjs you can benefit from creating a [custom bundle](./custom-bundle.md) and using them across your projects.

These steps reference an [SPFx](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview) solution, but apply to any solution.

## Install the library

`npm install @pnp/sp --save`

## Create a Preset File

Within the src directory create a new file named `pnpjs-presets.ts` and copy in the below content.

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
  if (_sp === null && context != null) {
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
import { getSP } from './pnpjs-resets.ts';
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

For a full sample, please see our [PnPjs Version 3 Sample Project](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-pnp-js-sample)
