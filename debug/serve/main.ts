import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
// import { graph } from "@pnp/graph/presets/all";

// ******
// Please edit this file and do any testing required. Please do not submit changes as part of a PR.
// ******

// ensure our DOM is ready for us to do stuff
document.onreadystatechange = async () => {

    if (document.readyState === "interactive") {

        // uncomment this to test with verbose mode
        // sp.setup({
        //     sp: {
        //         headers: {
        //             "Accept": "application/json;odata=verbose",
        //         },
        //     },
        // });

        const e = document.getElementById("pnp-test");

        const html = [];

        try {

            const sp = spfi().using(SPBrowser({
                baseUrl: "https://{tenant}.sharepoint.com/sites/dev/",
            }));

            const r = await sp.web();

            html.push(`<textarea cols="200" rows="40">${JSON.stringify(r, null, 4)}</textarea>`);

        } catch (e) {
            html.push(`Error: <pre>${JSON.stringify(e, null, 4)}</pre>`);
        }

        e.innerHTML = html.join("<br />");
    }
};
