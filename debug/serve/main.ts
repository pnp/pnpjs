import { MSAL } from "@pnp/msaljsclient/index.js";
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
import { settings } from "../../settings.js";
// import { graph } from "@pnp/graph/presets/all";

// ******
// Please edit the main function and do any testing required. Please do not submit changes as part of a PR.
// ******

/**
 * The testing function whose code is executed
 * 
 * @param resultDiv The div into which you can write your result
 */
async function main(resultDiv: HTMLDivElement) {

    const html = [];

    try {

        // Make sure to add `https://localhost:8080/spa.html` as a Redirect URI in your testing's AAD App Registration
        const sp = spfi().using(
            SPBrowser({ baseUrl: settings.testing.sp.url }),
            MSAL({ configuration: settings.testing.sp.msal.init, authParams: { scopes: settings.testing.sp.msal.scopes } })
        );

        const r = await sp.web();

        html.push(`<textarea cols="200" rows="40">${JSON.stringify(r, null, 4)}</textarea>`);

    } catch (err) {

        html.push(`Error: <pre>${JSON.stringify(err.message, null, 4)}</pre>`);
    }

    resultDiv.innerHTML = html.join("<br />");
}

// ensure our DOM is ready for us to do stuff and either wire up the button even or fire the main function
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

        const resultDiv = <HTMLDivElement>document.getElementById("pnp-test");
        const body = document.getElementsByTagName("body");

        if (body[0].hasAttribute("isPnPSPA")) {

            // id in spa use button event to fire
            const b = document.getElementById("pnp-button");
            b.addEventListener("click", async function (e: MouseEvent) {

                e.preventDefault();
                await main(resultDiv);
            });

        } else {

            // id not in the spa, just run it (old script editor webpart test)
            await main(resultDiv);
        }
    };
}
