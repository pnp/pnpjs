# @pnp/common

The common modules provides a set of utilities classes and reusable building blocks used throughout the @pnp modules. They can be used wihtin your applications as well
without depending on the remainder of the @pnp libraries.

## Getting Started

Install the library and required dependencies

`npm install @pnp\logging @pnp\common --save`

Import and use functionality, see details on modules below.

```TypeScript
import { Util } from "@pnp/common";

console.log(Util.getGUID());
```

## Exports

* [blobutil](blobutil.md)
* [collections](collections.md)
* [decorators](decorators.md)
* [exceptions](exceptions.md)
* [libconfig](libconfig.md)
* [netutil](netutil.md)
* [storage](storage.md)
* [util](util.md)