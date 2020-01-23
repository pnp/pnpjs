import { SPFetchClient } from "@pnp/nodejs-commonjs";
import { sp } from "@pnp/sp-commonjs";

sp.setup({
    sp: {
        fetchClientFactory: () => {
            return new SPFetchClient("{ site url }", "{ client id }", "{ client secret }");
        },
    },
});

async function makeRequest() {

    const w = await sp.web();
    console.log(JSON.stringify(w, null, 2));
}

// get past no await at root of app
makeRequest();
