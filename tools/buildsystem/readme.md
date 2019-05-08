# Build system

This project contains the system used to build, package, and publish the npm packages created for each package in the ./packages folder.

## Configuration

Configuration is driven entirely by the `buildsystem-config.ts` file, which uses TypeScript to allow type checking for the elements. The file should provide a default export of an array of build configurations as described below. There can be any number of configurations as needed, but to support the full lifecycle you typically need to cover one config for each role: build, package, and publish.

For each of the three roles, build, package, and publish there exists an interface defining what it should contain. You can have multiple configurations per role, differentiated by name.

## Run

You can install the tool globally but that isn't requried as it is installed locally when you `npm install` within the root of the main library project. It has a simple command line:

`pnpbuild -n <name of the configuration to run>`

OR default to using the "build" configuration:

`pnpbuild`
