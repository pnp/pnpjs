# PnPjs Configuration

This article describes the configuration architecture used by the library as well as the settings available.

> Starting with version 2.1.0 we updated our configuration design to support the ability to isolate settings to individual objects. The first part of this article discusses the newer design, you can read about the [pre v2.1.0 configuration](#prior-to-v210) further down.

# Post v2.1.0

## Architecture

Starting from v2.1.0 we have modified our configuration design to allow for configuring individual queryable objects.

## Backward Compatibility

If you have no need to use the isolated runtimes introduced in 2.1.0 then you should see no change in library behavior from prior versions. You can continue to refer to the [pre v2.1.0 configuration](#prior-to-v210) section - and if you see any issues please let us know.

All of the available settings as described below remain, unchanged.

> If you previously used our internal configuration classes directly RuntimeConfigImpl, SPRuntimeConfigImpl, or GraphRuntimeConfigImpl they no longer exist. We do not consider this a breaking change as they were meant to be internal and their direct use was not documented. This includes the concrete default instances RuntimeConfig, SPRuntimeConfig, and GraphRuntimeConfig.

## Isolated Runtimes

You can create an isolated runtime when using either the sp or graph libraries. What this does is create an isolated set of properties and behaviors specific to a given fluent chain. Have a look at this basic example below:

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";

// create an isolated sp root instance
const isolatedSP = await sp.createIsolated();

// this configuraiton applies to all objects created from "sp"
sp.setup({
  sp: {
    baseUrl: "https://mytenant.sharepoint.com/",
  },
});

// this configuraiton applies to all objects created from "isolatedSP"
isolatedSP.setup({
  sp: {
    baseUrl: "https://mytenant.sharepoint.com/sites/dev",
  },
});

// details for the web at https://mytenant.sharepoint.com/
const web1 = await sp.web();

// details for the web at https://mytenant.sharepoint.com/sites/dev
const web2 = await isolatedSP.web();
```

This configuration is supplied to all objects down a given fluent chain:

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

// create an isolated sp root instance
const isolatedSP = await sp.createIsolated();

// this configuraiton applies to all objects created from "sp"
sp.setup({
  sp: {
    baseUrl: "https://mytenant.sharepoint.com/",
  },
});

// this configuraiton applies to all objects created from "isolatedSP"
isolatedSP.setup({
  sp: {
    baseUrl: "https://mytenant.sharepoint.com/sites/dev",
  },
});

// details for the lists at https://mytenant.sharepoint.com/
const lists1 = await sp.web.lists();

// details for the lists at https://mytenant.sharepoint.com/sites/dev
const lists2 = await isolatedSP.web.lists();
```

## createIsolated

The createIsolated method is used to establish the isolated runtime for a given instance of either the sp or graph libraries. Once created it is no longer connected to the default instance and if you have common settings that must be updated you would need to update them across each isolated instance, this is by design. Currently sp and graph createIsolated methods accept the same init, but we have broken them out to make thing clear. All properties of the init object are optional. Any properties provided will overwrite those cloned from the default if cloneGlobal is true. If cloneGlobal is false you start with an empty config containing only the [core defaults](#common-configuration).

### sp.createIsolated

```TypeScript
import { sp, ISPConfiguration } from "@pnp/sp";

// accept all the defaults, will clone any settings from sp
const isolatedSP = await sp.createIsolated();

// - specify all the config options, using the ISPConfiguration interface to type the config
// - setting baseUrl in the root is equivelent to setting it with sp: { baseUrl: }, it is provided as a shortcut as this seemed to be a common use case
//   - if you set them both the baseUrl in the root will be used.
// - you can set some or all of the settings in config and if you clone from the global the ones you specify will overwrite the cloned values
//   - for example your global config can specify everything and your isolated config could specify a different fetchClientFactory, see node example below
const isolatedSP = await sp.createIsolated<ISPConfiguration>({
  baseUrl: "https://mytenant.sharepoint.com",
  cloneGlobal: false,
  config: {
    cacheExpirationIntervalMilliseconds: 1000,
    sp: {
      baseUrl: "https://mytenant.sharepoint.com",
      fetchClientFactory: () => void(0),
      headers: {
        "X-AnotherHeader": "54321",
      },
    },
    spfxContext: this.context, // only valid within SPFx
  },
  options: {
    headers: {
      "X-SomeHeader": "12345",
    },
  },
});
```

*Defaults*

| Name        | Default |
| ----------- | ------- |
| baseUrl     | ""      |
| cloneGlobal | true    |
| config      | {}      |
| options     | {}      |


### graph.createIsolated

```TypeScript
import { graph, IGraphConfiguration } from "@pnp/graph";

// - specify all the config options, using the IGraphConfiguration interface to type the config
// - setting baseUrl in the root is restricted to "v1.0" or "beta". If you need to specify a different absolute url should use config.graph.baseUrl
//   - in practice you should use one or the other. You can always swap Graph api version using IGraphQueryable.setEndpoint
// - you can set some or all of the settings in config and if you clone from the global the ones you specify will overwrite the cloned values
//   - for example your global config can specify everything and your isolated config could specify a different fetchClientFactory, see node example below
const isolatedGraph = await graph.createIsolated<IGraphConfiguration>({
  baseUrl: "v1.0",
  cloneGlobal: false,
  config: {
    cacheExpirationIntervalMilliseconds: 1000,
    graph: {
      baseUrl: "https://graph.microsoft.com",
      fetchClientFactory: () => void(0),
      headers: {
        "X-AnotherHeader": "54321",
      },
    },
    spfxContext: this.context, // only valid within SPFx
  },
  options: {
    headers: {
      "X-SomeHeader": "12345",
    },
  },
});
```

#### Defaults

| name        | Default |
| ----------- | ------- |
| baseUrl     | "v1.0"  |
| cloneGlobal | true    |
| config      | {}      |
| options     | {}      |

## Additional Examples

### MSAL with Node multiple site requests

_MSAL Support Added in 2.0.11_

In this example you can see how you can setup the MSAL client once and then set a different baseUrl for an isolated instance. [More information specific to setting up the MSAL client is available](../authentication/derver-nodejs.md).

```TypeScript
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import { readFileSync } from "fs";

// read in our private key
const buffer = readFileSync("c:/temp/key.pem");

// configure node options
sp.setup({
  sp: {
    baseUrl: "https://{my tenant}.sharepoint.com/sites/dev/",
    fetchClientFactory: () => {
      return new MsalFetchClient({
        auth: {
          authority: "https://login.microsoftonline.com/{tenant id or common}",
          clientCertificate: {
            thumbprint: "{certificate thumbprint, displayed in AAD}",
            privateKey: buffer.toString(),
          },
          clientId: "{client id}",
        }
      }, ["https://{my tenant}.sharepoint.com/.default"]); // you must set the scope for SharePoint access
    },
  },
});

const isolatedSP = await sp.createIsolated<ISPConfigurationPart>({
  config: {
    sp: {
      baseUrl: "https://{my tenant}.sharepoint.com/sites/dev2/",
    },
  },
});
```

### Node multiple site requests

Isolated configuration was most requested for scenarios in node where you need to access information in multiple sites. This example shows setting up the global configuration and then creating an isolated config with only the baseUrl updated.

```TypeScript
import { SPFetchClient } from "@pnp/nodejs";
import { ISPConfigurationPart, sp } from "@pnp/sp";

sp.setup({
  cacheExpirationIntervalMilliseconds: 1000,
  defaultCachingStore: "local",
  sp: {
    fetchClientFactory: () => {
      return new SPFetchClient("https://mytenant.sharepoint.com/", "id", "secret");
    },
    headers: {
      "X-MyRequiredHeader": "SomeValue",
      "X-MyRequiredHeader2": "SomeValue",
    },
  },
});

const isolatedSP = await sp.createIsolated<ISPConfigurationPart>({
  config: {
    sp: {
      fetchClientFactory: () => {
        return new SPFetchClient("https://mytenant.sharepoint.com/site/dev", "id", "secret");
      },
    },
  },
});
```

## Batching

All batching functionality works as expected, but you must take care to only associate requests from the *same* isolated instance as you create the batch. Mixing requests across isolation boundaries is not supported. This applies to sp and graph batching.

```TypeScript
sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("url1", "id", "secret");
        },
    },
});

const isolated = await sp.createIsolated<ISPConfiguration>({
    config: {
        sp: {
            fetchClientFactory: () => {
                return new SPFetchClient("url2", "id", "secret");
            },
        },
    },
});

const batch1 = sp.createBatch();
sp.web.lists.select("Title").top(3).inBatch(batch1)().then(r => console.log(`here 1: ${JSON.stringify(r, null, 2)}`));
sp.web.select("Title").inBatch(batch1)().then(r => console.log(`here 2: ${JSON.stringify(r, null, 2)}`));
await batch1.execute();

const batch2 = isolated.createBatch();
isolated.web.lists.select("Title").top(3).inBatch(batch2)().then(r => console.log(`here 3: ${JSON.stringify(r, null, 2)}`));
isolated.web.select("Title").inBatch(batch2)().then(r => console.log(`here 4: ${JSON.stringify(r, null, 2)}`));
await batch2.execute();
```

## IE11 Mode

The IE11 mode setting is always global. There is no scenario we care to support where once instance needs to run in ie11 mode and another does not. Your code either does or does not run in ie11.

# Prior to v2.1.0

## Architecture

PnPjs uses an additive configuration design with multiple libraries sharing a single global configuration instance. If you need non-global configuration [please see this section](#non-global-configuration). There are three ways to access the setup functionality - through either the common, sp, or graph library's setup method. While the configuration is global the various methods have different typing on their input parameter. You can review the [libconfig article](../common/libconfig.md) for more details on storing your own configuration.


## Common Configuration

The common libary's setup method takes parameters defined by [ILibraryConfiguration](../common/libconfig.md#ilibraryconfiguration-interface). The properties and their defaults are listed below, followed by a code sample. You can call setup multiple times and any new values will be added to the existing configuration or replace the previous value if one existed.

All values are optional.

| Name                                | Description                                                                                                    | Default |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------- |
| defaultCachingStore                 | Where will PnPjs store cached data by default (session or local)                                               | session |
| defaultCachingTimeoutSeconds        | The global default value used for cached data timeouts in seconds                                              | 60      |
| globalCacheDisable                  | Provides a way to globally within PnPjs disable all caching                                                    | false   |
| enableCacheExpiration               | If true a timeout expired items will be removed from the cache in intervals determined by cacheTimeoutInterval | false   |
| cacheExpirationIntervalMilliseconds | Determines the interval in milliseconds at which the cache is checked to see if items have expired (min: 100)  | 750     |
| spfxContext                         | When running in SPFx the current context should always be supplied to PnPjs when available                     | null    |
| ie11                                | If true the library downgrades functionality to work in IE11                                                   | false   |

> For more information on setting up in SPFx please see the [authentication section](../authentication/index.md)


> For more details on ie11 mode please see the [topic article](./ie11-mode.md)

```ts
import { setup } from "@pnp/common";

// called before other code
setup({
  cacheExpirationIntervalMilliseconds: 15000,
  defaultCachingStore: "local",
  defaultCachingTimeoutSeconds: 600,
  enableCacheExpiration: true,
  globalCacheDisable: false,
  ie11: false,
  spfxContext: this.context, // if in SPFx, otherwise leave it out
});
```

## SP Configuration

The sp library's configuration is defined by the ISPConfiguration interface which extends ILibraryConfiguration. All of the sp values are contained in a top level property named "sp". The following table describes the properties with a code sample following.

All values are optional.

| Name               | Description                                                                                                               | Default |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------- |
| headers            | Allows you to apply any headers to all calls made by the sp library                                                       | none    |
| baseUrl            | Allows you to define a base site url for all requests, takes precedence over all other url logic. Must be absolute.       | none    |
| fetchClientFactory | Allows you to specify a factory function used to produce [IHttpClientImpl](../common/netutil.md#httpclientimpl) instances | none    |

> There are many examples of using fetchClientFactory available in the [authentication section](../authentication/index.md).

```ts
import { sp } from "@pnp/sp";
import { SPFxAdalClient } from "@pnp/common";

// note you can still set the global configuration such as ie11 using the same object as 
// the interface extends ILibraryConfiguration
sp.setup({
  ie11: false,
  sp: {
    baseUrl: "https://tenant.sharepoint.com/sites/dev",
    fetchClientFactory: () => {
      return new SPFxAdalClient(this.context);
    },
    headers: {
      "Accept": "application/json;odata=verbose",
      "X-Something": "header-value",
    },
  },
  spfxContext: this.context,
});
```

### SharePoint Framework

You can optionally supply only the SPFx context to the sp configure method.

```ts
import { sp } from "@pnp/sp";

// in SPFx only
sp.setup(this.context);
```

## Graph Configuration

The graph configuration works exactly the same as the sp configuration but is defined by the IGraphConfiguration interface which extends ILibraryConfiguration. All of the graph values are contained in a top level property named "graph". The following table describes the properties with a code sample following.

All values are optional.

| Name               | Description                                                                                                                            | Default |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| headers            | Allows you to apply any headers to all calls made by the sp library                                                                    | none    |
| baseUrl            | Allows you to define a base site url for all requests, takes precedence over all other url logic. Must be absolute. (_Added in 2.0.8_) | none    |
| fetchClientFactory | Allows you to specify a factory function used to produce [IHttpClientImpl](../common/netutil.md#httpclientimpl) instances              | none    |

> There are many examples of using fetchClientFactory available in the [authentication section](../authentication/index.md).

```ts
import { graph } from "@pnp/graph";
import { MsalClientSetup } from "@pnp/msaljsclient";

// note you can still set the global configuration such as ie11 using the same object as 
// the interface extends ILibraryConfiguration
graph.setup({
  ie11: false,
  graph: {
    // we set the GCC url
    baseUrl: "https://graph.microsoft.us",
    fetchClientFactory: MsalClientSetup({
        auth: {
            authority: "https://login.microsoftonline.com/tenant.onmicrosoft.com",
            clientId: "00000000-0000-0000-0000-000000000000",
            redirectUri: "https://tenant.sharepoint.com/sites/dev/SitePages/test.aspx",
        },
    }, ["Group.Read.All"]),
    headers: {
      "Accept": "application/json;odata=verbose",
      "X-Something": "header-value",
    },
  },
  spfxContext: this.context,
});
```

### SharePoint Framework

You can optionally supply only the SPFx context to the graph configure method. We will attempt to set the baseUrl property from the context - but if that is failing in your environment and you need to call a special cloud (i.e. graph.microsoft.us) please set the baseUrl property.

```ts
import { graph } from "@pnp/graph";

// in SPFx only
graph.setup(this.context);
```

## Configure Everything At Once

In some cases you might want to configure everything in one go. Because the configuration is stored in a single location you can use the common library's setup method and adjust the typings to ensure you are using the correct property names while only having to setup things with a single call.

> In versions before 2.0.8 ISPConfigurationPart, IGraphConfigurationPart, and ILibraryConfiguration incorrectly were missing the "I" prefix. That was fixed in 2.0.8 - but note if you are using an older version of the library you'll need to use the old names. Everything else in the below example works as expected.

```ts
import { ISPConfigurationPart } from "@pnp/sp";
import { IGraphConfigurationPart } from "@pnp/graph";
import { ILibraryConfiguration, setup } from "@pnp/common";

// you could also include your custom configuration parts
export interface AllConfig extends ILibraryConfiguration, ISPConfigurationPart, IGraphConfigurationPart { }

// create a single big configuration entry
const config: AllConfig = {
  graph: {
    baseUrl: "https://graph.microsoft.us",
  },
  ie11: false,
  sp: {
    baseUrl: "https://tenant.sharepoint.com/sites/dev",
  },
};

setup(config);
```    
