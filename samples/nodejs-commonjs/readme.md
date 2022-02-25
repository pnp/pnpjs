## TS => Commonjs & import esm modules

This sample as the awkward title says is setup to demonstrate outputting commonjs from a TypeScript project while importing esm modules.

### Node project using TypeScript producing commonjs modules

For TypeScript projects which output commonjs but need to import esm modules you will need to take a few additional steps to use the pnp esm modules. This is true of any esm module with a project structured in this way, not specific to PnP's implementation. It is very possible there are other configurations that make this work, but these steps worked in our testing. We have also provided a basic sample showing this setup.

You must install TypeScript @next or you will get errors using node12 module resolution. This may change but is the current behavior when we did our testing.

`npm install -D typescript@next`

The tsconfig file for your project should have the `"module": "CommonJS"` and `"moduleResolution": "node12",` settings in addition to whatever else you need.

_tsconfig.json_
```JSON
{
    "compilerOptions": {
        "module": "CommonJS",
        "moduleResolution": "node12"
    }
}
```

You must then import the esm dependencies using the async import pattern. This works as expected with our selective imports, and vscode will pick up the intellisense as expected.

_index.ts_
```TypeScript
import { settings } from "./settings.js";

// this is a simple example as async await is not supported with commonjs output
// at the root.
setTimeout(async () => {

    const { spfi } = await import("@pnp/sp");
    const { SPDefault } = await import("@pnp/nodejs");
    await import("@pnp/sp/webs");

    const sp = spfi().using(SPDefault({
        baseUrl: settings.testing.sp.url,
        msal: {
            config: settings.testing.sp.msal.init,
            scopes: settings.testing.sp.msal.scopes
        }
    }));
    
    // make a call to SharePoint and log it in the console
    const w = await sp.web.select("Title", "Description")();
    console.log(JSON.stringify(w, null, 4));

}, 0);
```

Finally, when launching node you need to include the `` flag with a setting of 'node'. See the [package.json's scripts](./package.json) for an example.

`node --experimental-specifier-resolution=node dist/index.js`

> Read more in the releated [TypeScript Issue](https://github.com/microsoft/TypeScript/issues/43329), [TS pull request Adding the functionality](https://github.com/microsoft/TypeScript/pull/45884), and the [TS Docs](https://www.typescriptlang.org/tsconfig#moduleResolution).