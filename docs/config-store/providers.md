# @pnp/config-store/providers

Currently there is a single provider included in the library, but contributions of additional providers are welcome.

## SPListConfigurationProvider

This provider is based on a SharePoint list and read all of the rows and makes them available as a TypedHash<string>. By default the column names used are Title for key and "Value" for value, but you can update these as needed. Additionally the settings class supports the idea of last value in wins - so you can easily load multiple configurations. This helps to support a common scenario in the enterprise where you might have one main list for global configuration but some settings can be set at the web level. In this case you would first load the global, then the local settings and any local values will take precedence.

```TypeScript
import { Web } from "@pnp/sp";
import { Settings, SPListConfigurationProvider } from "@pnp/config-store";

// create a new provider instance
const w = new Web("https://mytenant.sharepoint.com/sites/dev");
const provider = new SPListConfigurationProvider(w, "myconfiglistname");

const settings = new Settings();

// load our values from the list
await settings.load(provider);
```

## CachingConfigurationProvider

Because making requests on each page load is very inefficient you can optionally use the caching configuration provider, which wraps a
provider and caches the configuration in local or session storage.

```TypeScript
import { Web } from "@pnp/sp";
import { Settings, SPListConfigurationProvider } from "@pnp/config-store";

// create a new provider instance
const w = new Web("https://mytenant.sharepoint.com/sites/dev");
const provider = new SPListConfigurationProvider(w, "myconfiglistname");

// get an instance of the provider wrapped
// you can optionally provide a key that will be used in the cache to the asCaching method
const wrappedProvider = provider.asCaching();

// use that wrapped provider to populate the settings
await settings.load(wrappedProvider);
```

