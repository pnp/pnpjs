# @pnp/common/libconfig

Contains the shared classes and interfaces used to configure the libraries. These bases classes are expanded on in dependent libraries with the core
configuration defined here. This module exposes an instance of the RuntimeConfigImpl class: RuntimeConfig. This configuration object can be referenced and
contains the global configuration shared across the libraries. You can also extend the configuration for use within your own applications.

## LibraryConfiguration Interface

Defines the shared configurable values used across the library as shown below. Each of these has a default value as shown below

```TypeScript
export interface LibraryConfiguration {

    /**
     * Allows caching to be global disabled, default: false
     */
    globalCacheDisable?: boolean;

    /**
     * Defines the default store used by the usingCaching method, default: session
     */
    defaultCachingStore?: "session" | "local";

    /**
     * Defines the default timeout in seconds used by the usingCaching method, default 30
     */
    defaultCachingTimeoutSeconds?: number;

    /**
     * If true a timeout expired items will be removed from the cache in intervals determined by cacheTimeoutInterval
     */
    enableCacheExpiration?: boolean;

    /**
     * Determines the interval in milliseconds at which the cache is checked to see if items have expired (min: 100)
     */
    cacheExpirationIntervalMilliseconds?: number;

    /**
     * Used to supply the current context from an SPFx webpart to the library
     */
    spfxContext?: any;
}
```

## RuntimeConfigImpl

The class which implements the runtime configuration management as well as sets the default values used within the library. At its heart lies a [Dictionary](collections.md)
used to track the configuration values. The keys will match the values in the interface or plain object passed to the extend method.

### extend

The extend method is used to add configuration to the global configuration instance. You can pass it any plain object with string keys and those values will be added. Any 
existing values will be overwritten based on the keys. Last value in wins. For a more detailed scenario of using the RuntimeConfig instance in your own application please 
see the section below "Using RuntimeConfig within your application". Note there are no methods to remove/clear the global config as it should be considered fairly static
as frequent updates may have unpredictable side effects as it is a global shared object. Generally it should be set at the start of your application.

```TypeScript
import { RuntimeConfig } from "@pnp/common";

// add your custom keys to the global configuration
// note you can use object hashes as values
RuntimeConfig.extend({
   "myKey1": "value 1",
   "myKey2": {
       "subKey": "sub value 1",
       "subKey2": "sub value 2",
   },
});

// read your custom values
const v = RuntimeConfig.get("myKey1"); // "value 1"
```

## Using RuntimeConfig within your Application

If you have a set of properties you will access very frequently it may be desirable to implement your own configuration object and expose those values as properties. To
do so you will need to create an interface for your configuration (optional) and a wrapper class for RuntimeConfig to expose your properties

```TypeScript
import { LibraryConfiguration, RuntimeConfig } from "@pnp/common";

// first we create our own interface by extending LibraryConfiguration. This allows your class to accept all the values with correct type checking. Note, because
// TypeScript allows you to extend from multiple interfaces you can build a complex configuration definition from many sub definitions.

// create the interface of your properties
// by creating this separately you allows others to compose your parts into their own config
interface MyConfigurationPart {

    // you can create a grouped definition and access your settings as an object
    // keys can be optional or required as defined by your interface
    my?: {
        prop1?: string;
        prop2?: string;
    }

    // and/or define multiple top level properties (beware key collision)
    // it is good practice to use a unique prefix
    myProp1: string;
    myProp2: number;
}

// now create a combined interface
interface MyConfiguration extends LibraryConfiguration, MyConfigurationPart { }


// now create a wrapper object and expose your properties
class MyRuntimeConfigImpl {

    // exposing a nested property
    public get prop1(): TypedHash<string> {

        const myPart = RuntimeConfig.get("my");
        if (myPart !== null && typeof myPart !== "undefined" && typeof myPart.prop1 !== "undefined") {
            return myPart.prop1;
        }

        return {};
    }

    // exposing a root level property
    public get myProp1(): string | null {

        let myProp1 = RuntimeConfig.get("myProp1");
        
        if (myProp1 === null) {
            myProp1 = "some default value";
        }

        return myProp1;
    }

    setup(config: MyConfiguration): void {
        RuntimeConfig.extend(config);
    }
}

// create a single static instance of your impl class
export let MyRuntimeConfig = new MyRuntimeConfigImpl();
```

Now in other files you can use and set your configuration with a typed interface and properties

```TypeScript
import { MyRuntimeConfig } from "{location of module}";


MyRuntimeConfig.setup({
    my: {
        prop1: "hello",
    },
});

const value = MyRuntimeConfig.prop1; // "hello"
```

