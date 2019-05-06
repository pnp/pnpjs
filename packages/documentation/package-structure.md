# Package Structure

Each of the packages is published with the same structure, so this article applies to all of the packages. We will use @pnp/common as an example for discussion.

## Folders

In addition to the files in the root each package has three folders dist, docs, and src.

### Root Files

These files are found at the root of each package.

|File|Description|
|-|-|
|index.d.ts|Referenced in package.json typings property and provides the TypeScript type information for consumers|
|LICENSE|Package license|
|package.json|npm package definition|
|readme.md|Basic readme referencing the docs site|

### Dist

The dist folder contains the transpiled files bundled in various ways. You can choose the best file for your usage as needed. Below the {package} will be
replaced with the name of the package - in our examples case this would be "common" making the file name "{package}.es5.js" = "common.es5.js". All of the *.map
files are the debug mapping files related to the .js file of the same name.

|File|Description|
|-|-|
|{package}.es5.js|Library packaged in es5 format not wrapped as a module|
|{package}.es5.umd.bundle.js|The library bundled with all dependencies into a single UMD module. Global variable will be "pnp.{package}". Referenced in the main property of package.json|
|{package}.es5.umd.bundle.min.js|Minified version of the bundled umd module|
|{package}.es5.umd.js|The library in es5 bundled as a UMD modules with no included dependencies. They are designed to work with the other *.es5.umd.js files. Referenced in the module property of package.json|
|{package}.es5.umd.min.js|Minified version of the es5 umd module|
|{package}.js|es6 format file of the library. Referenced by es2015 property of package.json|

### Docs

This folder contains markdown documentation for the library. All packages will include an index.md which serves as the root of the docs. These files are also used
to build the [public site](https://pnp.github.io/pnpjs/). To edit these files they can be found in the packages/{package}/docs folder.

### Src

Contains the TypeScript definition files refrenced by the index.d.ts in the package root. These files serve to provide typing information about the library to
consumers who can process typing information.