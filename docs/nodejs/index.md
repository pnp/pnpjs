# @pnp/nodejs

[![npm version](https://badge.fury.io/js/%40pnp%2Fnodejs.svg)](https://badge.fury.io/js/%40pnp%2Fnodejs)

This package supplies helper code when using the @pnp libraries within the context of nodejs. This removes the node specific functionality from any of the packages.
Primarily these consist of clients to enable use of the libraries in nodejs.

## Getting Started

Install the library and required dependencies. You will also need to install other libraries such as [@pnp/sp](../sp/index.md) or [@pnp/graph](../graph/index.md) to use the
exported functionality.

`npm install @pnp/logging @pnp/common @pnp/nodejs --save`

* [AdalFetchClient](./adal-fetch-client.md)
* [SPFetchClient](./sp-fetch-client.md)
* [BearerTokenFetchClient](./bearer-token-fetch-client.md)

## SP Extensions

_Added in 2.0.9_

A set of nodejs specific extensions for the [@pnp/sp](../sp/) library.

* [SP Extensions](./sp-extensions.md)
