# @pnp/config-store/providers

Currently there is a single provider included in the library, but contributions of additional providers are welcome.

## SPListConfigurationProvider

This provider is based on a SharePoint list and read all of the rows and makes them available as a TypedHash<string>.

```TypeScript
import { Web } from "@pnp/sp";
import { Settings, SPListConfigurationProvider } from "@pnp/config-store";

// create a new provider instance
const w = new Web("https://mytenant.sharepoint.com/sites/dev");
const provider = new SPListConfigurationProvider(w, "myconfiglistname");

const settings = new Settings();

// load our values from the list
settings.load(provider);
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
const wrappedProvider = provider.asCaching();

// use that wrapped provider to populate the settings
settings.load(wrappedProvider);
```

