# Working in Nodejs

As outlined on the [getting started page](./getting-started.md#connect-to-sharepoint-from-node) you can easily use the library with Nodejs, but there are some key differences you need to consider.

But first a little history, you can skip this part if you just want to see how things work but we felt some folks might be interested. To make selective imports work we need to support es module syntax for client-side environments such as SPFx development. All versions of Nodejs that are currently LTS do not support es modules without flags (as of when this was written). We thought we had a scheme to handle this [following the available guidance](https://nodejs.org/docs/latest-v12.x/api/esm.html#esm_enabling) but ultimately it didn't work across all node versions and we unpublished 2.0.1.

## CommonJS Libraries

Because of the difficulties of working with es modules in node we recommend using our mirror packages providing commonjs modules. These can be installed by using the package name and appending -commonjs, such as:

```CMD
npm install @pnp/sp-commonjs @pnp/nodejs-commonjs
```

These packages are built from the same source and released at the same time so all updates are included with each release. The only difference is that for the sp-commonjs and graph-commonjs packages we target the "all" preset as the entry point. This makes things a little easier in node where bundle sizes aren't an issue. You can see this in the [nodejs-app sample](https://github.com/pnp/pnpjs/tree/version-2/samples/nodejs-app). Here is that sample explained fully:

### Install Libraries

We want to make a simple request to SharePoint so we need to first install the modules we need:

```cmd
npm install @pnp/sp-commonjs @pnp/nodejs-commonjs --save
```

We will also install TypeScript:

```cmd
npm install typescript --save-dev
```

### index.ts

We will create an index.ts file and add the following code. You will need to update the site url, client id, and client secret to your values. This should be done using a settings file or something like Azure KeyVault for production, but for this example it is good enough.

```TypeScript
// our imports come from the -commonjs libs
import { SPFetchClient } from "@pnp/nodejs-commonjs";
import { sp } from "@pnp/sp-commonjs";

// we call setup to use the node client
sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{ site url }", "{ client id }", "{ client secret }");
        },
    },
});

async function makeRequest() {

    // make a request to get the web's details
    const w = await sp.web();
    console.log(JSON.stringify(w, null, 2));
}

// get past no await at root of app
makeRequest();
```

> Don't forget you will need to [register an app](https://pnp.github.io/pnpjs/authentication/sp-app-registration/) to get the client id and secret.

### Add a tsconfig.json

Not strictly necessary but very useful to include a tsconfig.json to control how tsc transpiles your code to JavaScript

```JSON
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "esnext",
        "moduleResolution": "node",
        "declaration": true,
        "outDir": "dist",
        "skipLibCheck": true,
        "sourceMap": true,
        "lib": [
            "dom",
            "esnext"
        ]
    },
    "files": [
        "./index.ts"
    ]
}
```

### Add an script to package.json

We add the "start" script to the default package.json

```JSON
{
  "name": "nodejs-app",
  "version": "1.0.0",
  "description": "Sample nodejs app using PnPjs",
  "main": "index.js",
  "scripts": {
    "start": "tsc -p . && node dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@pnp/nodejs-commonjs": "^2.0.2-5",
    "@pnp/sp-commonjs": "^2.0.2-5"
  },
  "devDependencies": {
    "typescript": "^3.7.5"
  }
}
```

### Run It

You can now run your program using:

```cmd
npm start
```
