# Nodejs App Sample

This sample provides a simple demonstration of creating a nodejs application using the "esm" version of the libraries.

## Run the sample

1. Clone this folder
2. Run `npm install` in the sample folder
3. Update the index.ts file with your site url, client id, thumbprint and tenant
4. Run `npm start`

## How the sample was built

### index.ts

We create an index.ts file with the following code. The code has two methods, showcasing functions using SharePoint and Graph APIs.
You will need to update the site url, client id, thumbprint, and tenant to your values.
For production, this should be done using a settings file or something like Azure KeyVault, but for this example it is good enough.

```TypeScript
// our imports come from the esm libs
import { spfi } from "@pnp/sp/index.js";
import { graphfi } from "@pnp/graph/index.js";
import { LogLevel  } from "@pnp/logging/index.js";
import { SPDefault, GraphDefault } from "@pnp/nodejs/index.js";

import {readFileSync} from 'fs';
import "@pnp/sp/webs/index.js";
import "@pnp/graph/users/index.js";

const buffer = readFileSync("c:/temp/key.pem");

// we create the config to use with the node clients
const config:any = {
  auth: {
    authority: "https://login.microsoftonline.com/{my tenant}/",
    clientId: "{application (client) id}",
    clientCertificate: {
      thumbprint: "{certificate thumbprint, displayed in AAD}",
      privateKey: buffer.toString(),
    },
  },
};

async function makeGraphRequest() {
  const graph = graphfi()
  .using(GraphDefault({
    baseUrl: 'https://graph.microsoft.com',
    msal: {
      config: config,
      scopes: [ 'https://graph.microsoft.com/.default' ]
    }
  })));

  const first = await graph.users.top(1)();
  console.log(JSON.stringify(first, null, 2));
}

async function makeSPRequest() {
  const sp = spfi('{site url}')
  .using(SPDefault({
    baseUrl: '{site url}',
    msal: {
      config: config,
      scopes: [ 'https://{my tenant}.sharepoint.com/.default' ]
    }
  }));

  const w = await sp.web();
  console.log(JSON.stringify(w, null, 2));
}

// get past no await at root of app
makeSPRequest();
// makeGraphRequest();
```

### Add a tsconfig.json

Not strictly necessary but very useful to include is a tsconfig.json to control how tsc transpiles your code to JavaScript

```JSON
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "es6",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "dist",
    "skipLibCheck": true,
    "sourceMap": true,
  },
  "files": [
    "./index.ts"
  ]
}
```

### Add a package.json file

We add the "start" script to the package.json

```JSON
{
  "name": "nodejs-app",
  "version": "1.0.0",
  "description": "Sample nodejs app using PnPjs",
  "main": "index.js",
  "scripts": {
    "start": "tsc -p . && node --experimental-specifier-resolution=node dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@pnp/sp": "3.0.0",
    "@pnp/graph": "3.0.0",
    "@pnp/nodejs": "3.0.0"
  },
  "devDependencies": {
    "typescript": "^4.2.3"
  }
}
```

### Install Dependencies

Run the command below to install all the required modules.

```
npm install
```

### Run It!

You can now run your program using:

```
npm start
```