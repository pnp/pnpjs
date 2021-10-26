# @pnp/core

[![npm version](https://badge.fury.io/js/%40pnp%2Fcommon.svg)](https://badge.fury.io/js/%40pnp%2Fcommon)

The common modules provides a set of utilities classes and reusable building blocks used throughout the @pnp modules. They can be used within your applications as well.

## Getting Started

>To use the library as a stand alone modules, you will need to install it. It's a peer dependency of the @pnp/sp and @pnp/graph libraries so you do not need to install it seperately if you already have one of those installed.
Install the library and required dependencies

`npm install @pnp/core --save`

Import and use functionality, see details on modules below.

```TypeScript
import { getGUID } from "@pnp/core";

console.log(getGUID());
```

## Exports

* [timeline](timeline.md)
* [moments](moments.md)
* [observers](observers.md)
* [behaviors](behaviors.md)
* [storage](storage.md)
* [util](util.md)
