# @pnp/config-store/configuration

The main class exported from the config-store package is Settings. This is the class through which you will load and access your
settings via [providers](providers.md).

```TypeScript
import { Web } from "@pnp/sp";
import { Settings, SPListConfigurationProvider } from "@pnp/config-store";

// create an instance of the settings class, could be static and shared across your application
// or built as needed.
const settings = new Settings();

// you can add/update a single value using add
settings.add("mykey", "myvalue");

// you can also add/update a JSON value which will be stringified for you as a shorthand
settings.addJSON("mykey2", {
    field: 1,
    field2: 2,
    field3: 3,
});

// and you can apply a plain object of keys/values that will be written as single values
// this results in each enumerable property of the supplied object being added to the settings collection
settings.apply({
    field: 1,
    field2: 2,
    field3: 3,
});

// and finally you can load values from a configuration provider
const w = new Web("https://mytenant.sharepoint.com/sites/dev");
const provider = new SPListConfigurationProvider(w, "myconfiglistname");

// this will load values from the supplied list
// by default the key will be from the Title field and the value from a column named Value
await settings.load(provider);

// once we have loaded values we can then read them
const value = settings.get("mykey");

// or read JSON that will be parsed for you from the store
const value2 = settings.getJSON("mykey2");
```
