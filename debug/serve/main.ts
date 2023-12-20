import { MSAL } from "@pnp/msaljsclient/index.js";
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
import { graphfi, GraphBrowser } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/lists";
import "@pnp/graph/files";
import "@pnp/graph/users";
import { settings } from "../../settings.js";
import { Diagnostics_JWTDecoder } from "@pnp/queryable";
import { ConsoleListener, PnPLogging, Logger, LogLevel } from "@pnp/logging";
// import { graph } from "@pnp/graph/presets/all";

// ******
// Please edit this file and do any testing required. Please do not submit changes as part of a PR.
// ******

const localInit = {
    auth: {
        authority: "https://login.microsoftonline.com/ef379d32-30d7-46fd-9bc8-971e0cfff9bd/",
        clientId: "726ef411-3b09-4799-9b70-f0e5dde64466",
        redirectUri: "https://localhost:8080/spa.html",
    }
}

//heartbeat
// const localInit = {
//     auth: {
//         authority: "https://login.microsoftonline.com/6b0c2761-33e5-48b4-868c-169359f2f8be/",
//         clientId: "9b2a3203-adb3-4d28-8ee9-8a54a411b1b2",
//         redirectUri: "https://localhost:8080/spa.html",
//     }
// }

const localScopes = ["Files.ReadWrite.AppFolder"];

Logger.subscribe(ConsoleListener());

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

            // // Make sure to add `https://localhost:8080/spa.html` as a Redirect URI in your testing's AAD App Registration
            // const sp = spfi().using(
            //     SPBrowser({ baseUrl: "https://318studios.sharepoint.com/sites/SiteSelectedDelegated"}), 
            //     MSAL(localInit, {scopes: localScopes})
            // );

            // Make sure to add `https://localhost:8080/spa.html` as a Redirect URI in your testing's AAD App Registration
            const graph = graphfi().using(
                GraphBrowser(),
                MSAL(localInit, { scopes: localScopes }),
                PnPLogging(LogLevel.Info),
            );

            graph.using(Diagnostics_JWTDecoder());


            // https://a830edad9050849einspufstc3x.sharepoint.com

            // const r = await graph.me.drive.special("approot")();

            const r = await graph.users.getById("patrick@three18studios.com").drive.special("approot")();

            // 

            // const site = await graph.sites.getByUrl("318studios.sharepoint.com", "/sites/dev/");

            // const r = await site.drive.special("approot")();

            
            // const r = await graph.sites.getById("a830edad9050849einspufstc3x.sharepoint.com:/sites/test1")();
            //const r = await graph.sites.getById("318studios.sharepoint.com:/sites/SiteSelectedDelegated:")();
            // const r = await graph.sites.getById("318studios.sharepoint.com:/sites/SiteSelectedDelegated:").lists.getById("e76d1709-44a3-41a7-8146-6f3191d6e72b")();

            html.push(`<textarea cols="200" rows="40">${JSON.stringify(r, null, 4)}</textarea>`);

        } catch (e) {
            html.push(`Error: <pre>${JSON.stringify(e.message, null, 4)}</pre>`);
        }

        e.innerHTML = html.join("<br />");
    }
};
