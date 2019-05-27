# @pnp/nodejs

[![npm version](https://badge.fury.io/js/%40pnp%2Fnodejs.svg)](https://badge.fury.io/js/%40pnp%2Fnodejs)

This package supplies helper code when using the @pnp libraries within the context of nodejs. This removes the node specific functionality from any of the packages.
Primarily these consist of clients to enable use of the libraries in nodejs.

## Getting Started

Install the library and required dependencies. You will also need to install other libraries such as [@pnp/sp](../../sp/docs/index.md) or [@pnp/graph](../../graph/docs/index.md) to use the
exported functionality.

`npm install @pnp/logging @pnp/common @pnp/nodejs --save`

* [AdalFetchClient](adal-fetch-client.md)
* [SPFetchClient](sp-fetch-client.md)
* [BearerTokenFetchClient](bearer-token-fetch-client.md)
* [Using A Proxy](proxy.md)

## UML
![Graphical UML diagram](../../documentation/img/pnpjs-nodejs-uml.svg)

Graphical UML diagram of @pnp/nodejs. Right-click the diagram and open in new tab if it is too small.
