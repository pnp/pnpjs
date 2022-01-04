# Project Presets

Due to the introduction of [selective imports](./selective-imports.md) it can be somewhat frustrating to import all of the needed dependencies every time you need them across many files. Instead the preferred approach, especially for SPFx, is to create a project preset file. This centralizes the imports, configuration, and optionally extensions to PnPjs in a single place.

> If you have multiple projects that share dependencies on PnPjs you can benefit from creating a [custom bundle](./custom-bundle.md) and using them across your projects.

These steps reference an [SPFx]() solution, but apply to any solution.

## Install the library

`npm install @pnp/sp --save`

## Create a Preset File

Within the src directory create a new file named `pnpjs-presets.ts` and copy in the below content.

```TypeScript

```









