# Supported NPM Scripts

As you likely are aware you can embed scripts within package.json. Using this capability coupled with the knowledge that pretty much all of the tools we use now support code files (.js/.ts) as configuration we have removed gulp from our tooling and now execute our various actions via scripts. This is not a knock on gulp, it remains a great tool, rather an opportunity for us to remove some dependencies.

This article outlines the current scripts we've implemented and how to use them, with available options and examples.

## start

Executes the `serve` command

```cmd
npm start
```

## serve

Starts a debugging server serving a bundled script with ./debug/serve/main.ts as the entry point. This allows you to run tests and debug code running within the context of a webpage rather than node.

```cmd
npm run serve
```

## test

Runs the tests and coverage for the library.

```cmd
npm test
```

### options

There are several options you can provide to the test command. All of these need to be separated using a "--" double hyphen so they are passed to the spawned sub-commands.

**Test a Single Package**

>`--package` or `-p`

This option will only run the tests associated with the package you specify. They values are the folder names within the ./packages directory.

```cmd
# run only sp tests
npm test -- -p sp

# run only logging tests
npm test -- -package logging
```

**Run a Single Test File**

>`--single` or `--s`

You can also run a specific file with a package. This option _must_ be used with the single package option as you are essentially specifying the folder and file. This option uses either the  flags.

```cmd
# run only sp web tests
npm test -- -p sp -s web

# run only graph groups tests
npm test -- -package graph -single groups
```

**Specify a Site**

>`--site`

By default every time you run the tests a new subsite is created below the site specified in your [settings file](settings.md). You can choose to reuse a site for testing, which saves time when re-running a set of tests frequently. Testing content is not deleted after tests, so if you need to inspect the created content from testing you may wish to forgo this option.

This option can be used with any or none of the other testing options.

```cmd
# run only sp web tests with a certain site
npm test -- -p sp -s web --site https://some.site.com/sites/dev
```

## build

Invokes the pnpbuild cli to transpile the TypeScript into JavaScript. All behavior is controlled via the tsconfig.json in the root of the project and sub folders as needed.

```cmd
npm run build
```

## package

Invokes the pnpbuild cli to create the package directories under the dist folder. This will allow you to see excactly what will end up in the npm packages once they are published.

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
