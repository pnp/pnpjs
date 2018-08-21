# @pnp/odata

[![npm version](https://badge.fury.io/js/%40pnp%2Fodata.svg)](https://badge.fury.io/js/%40pnp%2Fodata)

This modules contains the abstract core classes used to process odata requests. They can also be used to build your own odata
library should you wish to. By sharing the core functionality across libraries we can provide a consistent API as well as ensure
the core code is solid and well tested, with any updates benefitting all inheriting libraries.

## Getting Started

Install the library and required dependencies

`npm install @pnp/logging @pnp/common @pnp/odata --save`

## Library Topics

* [caching](caching.md)
* [core](core.md)
* [OData Batching](odata-batch.md)
* [Parsers](parsers.md)
* [Pipeline](pipeline.md)
* [Queryable](queryable.md)

## UML
![Graphical UML diagram](../../documentation/img/pnpjs-odata-uml.svg)

Graphical UML diagram of @pnp/odata. Right-click the diagram and open in new tab if it is too small.