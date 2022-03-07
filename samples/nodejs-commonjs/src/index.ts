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
            scopes: settings.testing.sp.msal.scopes,
        },
    }));

    // make a call to SharePoint and log it in the console
    const w = await sp.web.select("Title", "Description")();
    console.log(JSON.stringify(w, null, 4));

}, 0);
