# Gulp Commands

This library uses [Gulp](https://gulpjs.com/) to orchestrate various tasks. The tasks described below are available for your use. Please review the 
[getting started for development](getting-started-dev.md) to ensure you've setup your environment correctly. The source for the gulp commands can be found in
the tools\gulptasks folder at the root of the project.


## Basics

All gulp commands are run on the command line in the fashion shown below.

```
gulp <command> [optional pararms]
```

## build

The build command transpiles the solution from TypeScript into JavaScript using our custom [build system](https://github.com/pnp/pnpjs/tree/master/tools/buildsystem). It is controlled by the pnp-build.js file at
the project root.

### Build all of the packages

```
gulp build
```

### Building individual packages

Note when building a single package none of the dependencies are currently built, so you need to specify in order those packages to build which are dependencies.

```
# fails
gulp build --p sp

# works as all the dependencies are built in order
gulp build --p logging,common,odata,sp
```

You can also build the packages and then not clean using the nc flag. So for example if you are working on the sp package you can build all the packages once, then
use the "nc" flag to leave those that aren't changing.

```
# run once
gulp build --p logging,common,odata,sp

# run on subsequent builds
gulp build --p sp --nc
```

## clean

The clean command removes all of the generated folders from the project and is generally used automatically before other commands to ensure there is a clean workspace.

```
gulp clean
```

To clean the build folder. This build folder is no longer included in automatic cleaning after the move to use the TypeScript project references feature that compares previous output and doesn't rebuild unchanged files. This command will erase the entire build folder ensuring you can conduct a clean build/test/etc.

```
gulp clean-build
```

## lint

Runs the project linting based on the tslint.json rules defined at the project root. This should be done before any PR submissions as linting failures will block merging.

```
gulp lint
```

## package

Used to create the packages in the ./dist folder as they would exist for a release.

```
gulp package
```

### Packaging individual packages

You can also package individual packages, but as with build you must also package any dependencies at the same time.

```
gulp package --p logging,common,odata,sp
```

## publish

This command is only for use by package authors to publish a version to npm and is not for developer use.

## serve

The serve command allows you to serve either code from the ./debug/serve folder OR an individual package for testing in the browser. The file will always be served as 
https://localhost:8080/assets/pnp.js so can create a static page in your tenant for easy testing of a variety of scenarios. NOTE that in most browsers this file will
be flagged as unsafe so you will need to trust it for it to execute on the page.

### debug serve

When running the command with no parameters you will generate a package with the entry being based on the tsconfig.json file in ./debug/serve. By default this will
use serve.ts. This allows you to write any code you want to test to easily run it in the browser with all changes being watched and triggering a rebuild. 

```
gulp serve
```

### package serve

If instead you want to test how a particular package will work in the browser you can serve just that package. In this case you do not need to specify the dependencies
and specifying multiple packages will throw an error. Packages will be injected into the global namespace on a variable named pnp.

```
gulp serve --p sp
```

## test

Runs the tests specified in each package's tests folder

```
gulp test
```

### Verbose

The test command will switch to the "spec" mocha reporter if you supply the verbose flag. Doing so will list out each test's description and sucess instead of the "dot" used by default. This flag works with all other test options.

```
gulp test --verbose
```

### Test individual packages

You can test individual packages as needed, and there is no need to include dependencies in this case

```
# test the logging and sp packages
gulp test --p logging,sp
```

If you are working on a specific set of tests for a single module you can also use the single or s parameter to select just
a single module of tests. You specify the filename without the ".test.ts" suffix. It must be within the specified package and
this option can only be used with a single package for --p

```
# will test only the client-side pages module within the sp package
gulp test --p sp --s clientsidepages
```

If you want you can test within the same site and avoid creating a new one, though for some tests this might cause conflicts.
This flag can be helpful if you are rapidly testing things with no conflict as you can avoid creating a site each time. Works
with both of the above options --p and --s as well as individually. The url must be absolute.

```
#testing using the specified site.
gulp test --site https://{tenant}.sharepoint.com/sites/testing

# with other options
gulp test --p logging,sp --site https://{tenant}.sharepoint.com/sites/testing

gulp test --p sp --s clientsidepages --site https://{tenant}.sharepoint.com/sites/testing
```
