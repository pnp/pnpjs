# @pnp/common

[![npm version](https://badge.fury.io/js/%40pnp%2Fcommon.svg)](https://badge.fury.io/js/%40pnp%2Fcommon)

The common modules provides a set of utilities classes and reusable building blocks used throughout the @pnp modules. They can be used within your applications as well.

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