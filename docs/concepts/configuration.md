# PnPjs Configuration

This article describes the configuration architecture used by the library as well as the settings available.

## Architecture

PnPjs uses an additive configuration design with multiple libraries sharing a single global configuration instance. If you need non-global configuration [please see this section](#non-global-configuration). There are three ways to access the setup functionality - through either the common, sp, or graph library's setup method. While the configuration is global the various methods have different typing on their input parameter. You can review the [libconfig article](../common/libconfig.md) for more details on storing your own configuration.


## Common Configuration

The common libary's setup method takes parameters defined by [ILibraryConfiguration](../common/libconfig.md#ilibraryconfiguration-interface). The properties and their defaults are listed below, followed by a code sample. You can call setup multiple times and any new values will be added to the existing configuration or replace the previous value if one existed.

All values are optional.

|Name|Description|Default
|--|--|--|
|defaultCachingStore|Where will PnPjs store cached data by default (session or local)|session
|defaultCachingTimeoutSeconds|The global default value used for cached data timeouts in seconds|60
|globalCacheDisable|Provides a way to globally within PnPjs disable all caching|false
|enableCacheExpiration|If true a timeout expired items will be removed from the cache in intervals determined by cacheTimeoutInterval|false
|cacheExpirationIntervalMilliseconds|Determines the interval in milliseconds at which the cache is checked to see if items have expired (min: 100)|750
|spfxContext|When running in SPFx the current context should always be supplied to PnPjs when available|null
|ie11|If true the library downgrades functionality to work in IE11|false

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

|Name|Description|Default
|--|--|--|
|headers| Allows you to apply any headers to all calls made by the sp library|none
|baseUrl|Allows you to define a base site url for all requests, takes precedence over all other url logic. Must be absolute.|none
|fetchClientFactory|Allows you to specify a factory function used to produce [IHttpClientImpl](../common/netutil.md#httpclientimpl) instances|none

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

|Name|Description|Default
|--|--|--|
|headers| Allows you to apply any headers to all calls made by the sp library|none
|baseUrl|Allows you to define a base site url for all requests, takes precedence over all other url logic. Must be absolute. (_Added in 2.0.8_)|none
|fetchClientFactory|Allows you to specify a factory function used to produce [IHttpClientImpl](../common/netutil.md#httpclientimpl) instances|none

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

## Non-Global Configuration

Currently PnPjs uses a globally shared configuration model. This means you can't have one "sp" pointing to one site and another "sp" pointing to another, or using different headers, etc. There is an [open issue](https://github.com/pnp/pnpjs/issues/589) to create a way to enable such an isolated configuration experience and we're working on it. You can track progress in the issue and we'll update these docs with usage when available.
    
