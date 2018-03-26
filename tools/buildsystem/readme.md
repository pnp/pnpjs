# Build system

This project contains the system used to build, package, and publish the npm packages created for each package in the ./packages folder.

## Builder

Responsible for building the code (transpiling the TS into JS), controlled by pnp-build.js configuration file

`gulp build`

## Packager

Handles creating the actual package directories as they will be published to NPM. Controlled by the pnp-package.js configuration file.

`gulp package`

## Publisher

Publishes the packages to NPM

`gulp publish`

`gulp publish-beta`
