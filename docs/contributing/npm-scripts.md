# Supported NPM Scripts

As you likely are aware you can embed scripts within package.json. Using this capability coupled with the knowledge that pretty much all of the tools we use now support code files (.js/.ts) as configuration we have removed gulp from our tooling and now execute our various actions via scripts. This is not a knock on gulp, it remains a great tool, rather an opportunity for us to remove some dependencies.

This article outlines the current scripts we've implemented and how to use them, with available options and examples.

## Start

Executes the `serve` command

```cmd
npm start
```

## Serve

Starts a debugging server serving a bundled script with ./debug/serve/main.ts as the entry point. This allows you to run tests and debug code running within the context of a webpage rather than node.

```cmd
npm run serve
```

## Test

Runs the tests and coverage for the library.

[More details on setting up MSAL for node.](https://pnp.github.io/pnpjs/getting-started/#getting-started-with-nodejs)

### Options

There are several options you can provide to the test command. All of these need to be separated using a "--" double hyphen so they are passed to the spawned sub-commands.

#### Test a Single Package

>`--package` or `-p`

This option will only run the tests associated with the package you specify. The values are the folder names within the ./packages directory.

```cmd
# run only sp tests
npm test -- -p sp

# run only logging tests
npm test -- -package logging
```

#### Run a Single Test File

>`--single` or `--s`

You can also run a specific file with a package. This option _must_ be used with the single package option as you are essentially specifying the folder and file. This option uses either the  flags.

```cmd
# run only sp web tests
npm test -- -p sp -s web

# run only graph groups tests
npm test -- -package graph -single groups
```

#### Specify a Site

>`--site`

By default every time you run the tests a new sub-site is created below the site specified in your [settings file](./settings.md). You can choose to reuse a site for testing, which saves time when re-running a set of tests frequently. Testing content is not deleted after tests, so if you need to inspect the created content from testing you may wish to forgo this option.

This option can be used with any or none of the other testing options.

```cmd
# run only sp web tests with a certain site
npm test -- -p sp -s web --site https://some.site.com/sites/dev
```

#### Cleanup

>`--cleanup`

If you include this flag the testing web will be deleted once tests are complete. Useful for local testing where you do not need to inspect the web once the tests are complete. Works with any of the other options, be careful when specifying a web using `--site` as it will be deleted.

```cmd
# clean up our testing site
npm test -- --cleanup
```

#### Logging

>`--logging`

If you include this flag a console logger will be subscribed and the log level will be set to Info. This will provide console output for all the requests being made during testing. This flag is compatible with all other flags - however unless you are trying to debug a specific test this will produce a lot of chatty output.

```cmd
# enable logging during testing
npm test -- --logging
```

You can also optionally set a log level of error, warning, info, or verbose:

```cmd
# enable logging during testing in verbose (lots of info)
npm test -- --logging verbose
```

```cmd
# enable logging during testing in error
npm test -- --logging error
```

#### spVerbose

>`--spverbose`

This flag will enable "verbose" OData mode for SharePoint tests. This flag is compatible with other flags.

```cmd
npm test -- --spverbose
```

## build

Invokes the pnpbuild cli to transpile the TypeScript into JavaScript. All behavior is controlled via the tsconfig.json in the root of the project and sub folders as needed.

```cmd
npm run build
```

## package

Invokes the pnpbuild cli to create the package directories under the dist folder. This will allow you to see exactly what will end up in the npm packages once they are published.

```cmd
npm run package
```

## lint

Runs the linter.

```cmd
npm run lint
```

## clean

Removes any generated folders from the working directory.

```cmd
npm run clean
```
