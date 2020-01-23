# Nodejs App Sample

This sample provides a simple demonstration of creating a nodejs application using the "-commonjs" version of the libraries.

## Run the sample

1. Clone this folder
2. Run `npm install` in the sample folder
3. Update the index.ts with your site url, client id, and client secret
4. Run `npm start`

## How the sample was built

### index.ts

We will create an index.ts file and add the following code. You will need to update the site url, client id, and client secret to your values. This should be done using a settings file or something like Azure KeyVault for production, but for this example it is good enough.

```TypeScript
// our imports come from the commonjs libs
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

> Don't forget you will need to [register an app](https://pnp.github.io/pnpjs/debugging/#register-an-add-in) to get the client id and secret.

### Add a tsconfig.json

Not strictly necessary but very useful to include is a tsconfig.json to control how tsc transpiles your code to JavaScript

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

We add the "start" script to the package.json

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

### Run It!

You can now run your program using:

```
npm start
```