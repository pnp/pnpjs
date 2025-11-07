import { MSAL } from "@pnp/msaljsclient/index.js";
import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
import { settings } from "../../settings.js";
import { graphfi } from "@pnp/graph/fi.js";
import { GraphBrowser } from "@pnp/graph/index.js";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/planner";
import "@pnp/graph/files";
import "@pnp/graph/calendars";
import "@pnp/graph/contacts";
import "@pnp/graph/mail";
import "@pnp/graph/to-do";
import "@pnp/graph/directory-objects";
import { IFileUploadOptions } from "@pnp/graph/files/types.js";

/**
 * The testing function whose code is executed
 * 
 * @param resultDiv The div into which you can write your result
 */
async function main(resultDiv: HTMLDivElement) {

    const html = [];

    try {

        // Make sure to add `https://localhost:8080/spa.html` as a Redirect URI in your testing's AAD App Registration
        const graph = graphfi().using(GraphBrowser({baseUrl:"https://graph.microsoft.com/v1.0"}),
                    MSAL({ configuration: settings.testing.graph.msal.init, authParams: { scopes: settings.testing.graph.msal.scopes } }));
       
        // Test 1: Users Delta
        console.log("=== Testing Users Delta ===");
        try {
            const usersDelta = await graph.users.delta()();
            console.log("Users Delta Result:", usersDelta);
            console.log("Users Delta Values Count:", usersDelta.values?.length || 0);
            if (usersDelta.values && usersDelta.values.length > 0) {
                console.log("First User:", usersDelta.values[0]);
            }
        } catch (e) {
            console.error("Users Delta Error:", e);
        }

        // Test 2: Groups Delta
        console.log("\n=== Testing Groups Delta ===");
        try {
            const groupsDelta = await graph.groups.delta()();
            console.log("Groups Delta Result:", groupsDelta);
            console.log("Groups Delta Values Count:", groupsDelta.values?.length || 0);
            if (groupsDelta.values && groupsDelta.values.length > 0) {
                console.log("First Group:", groupsDelta.values[0]);
            }
        } catch (e) {
            console.error("Groups Delta Error:", e);
        }

        // Test 3: Directory Objects Delta
        console.log("\n=== Testing Directory Objects Delta ===");
        try {
            const directoryObjectsDelta = await graph.directoryObjects.delta()();
            console.log("Directory Objects Delta Result:", directoryObjectsDelta);
            console.log("Directory Objects Delta Values Count:", directoryObjectsDelta.values?.length || 0);
            if (directoryObjectsDelta.values && directoryObjectsDelta.values.length > 0) {
                console.log("First Directory Object:", directoryObjectsDelta.values[0]);
            }
        } catch (e) {
            console.error("Directory Objects Delta Error:", e);
        }

        // Test 4: Contacts Delta (requires a user context)
        console.log("\n=== Testing Contacts Delta ===");
        try {
            const contactsDelta = await graph.me.contacts.delta()();
            console.log("Contacts Delta Result:", contactsDelta);
            console.log("Contacts Delta Values Count:", contactsDelta.values?.length || 0);
        } catch (e) {
            console.error("Contacts Delta Error:", e);
        }

        // Test 5: Contact Folders Delta
        console.log("\n=== Testing Contact Folders Delta ===");
        try {
            const contactFoldersDelta = await graph.me.contactFolders.delta()();
            console.log("Contact Folders Delta Result:", contactFoldersDelta);
            console.log("Contact Folders Delta Values Count:", contactFoldersDelta.values?.length || 0);
        } catch (e) {
            console.error("Contact Folders Delta Error:", e);
        }        // Test 6: Calendar View Delta (requires date range)
        console.log("\n=== Testing Calendar View Delta ===");
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30); // 30 days ago
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30); // 30 days from now
            
            const calendarViewDelta = await graph.me.calendarView(startDate.toISOString(), endDate.toISOString()).delta()();
            console.log("Calendar View Delta Result:", calendarViewDelta);
            console.log("Calendar View Delta Values Count:", calendarViewDelta.values?.length || 0);
        } catch (e) {
            console.error("Calendar View Delta Error:", e);
        }

        // Test 7: Mail Messages Delta
        console.log("\n=== Testing Mail Messages Delta ===");
        try {
            const messagesDelta = await graph.me.messages.delta()();
            console.log("Messages Delta Result:", messagesDelta);
            console.log("Messages Delta Values Count:", messagesDelta.values?.length || 0);
        } catch (e) {
            console.error("Messages Delta Error:", e);
        }

        // Test 8: Mail Folders Delta
        console.log("\n=== Testing Mail Folders Delta ===");
        try {
            const mailFoldersDelta = await graph.me.mailFolders.delta()();
            console.log("Mail Folders Delta Result:", mailFoldersDelta);
            console.log("Mail Folders Delta Values Count:", mailFoldersDelta.values?.length || 0);
        } catch (e) {
            console.error("Mail Folders Delta Error:", e);
        }

        // Test 9: OneDrive Files Delta
        console.log("\n=== Testing OneDrive Files Delta ===");
        try {
            const driveItemsDelta = await graph.me.drive.root.delta()();
            console.log("Drive Items Delta Result:", driveItemsDelta);
            console.log("Drive Items Delta Values Count:", driveItemsDelta.values?.length || 0);
        } catch (e) {
            console.error("Drive Items Delta Error:", e);
        }

        // Test 10: ToDo Lists Delta
        console.log("\n=== Testing ToDo Lists Delta ===");
        try {
            const todoListsDelta = await graph.me.todo.lists.delta()();
            console.log("ToDo Lists Delta Result:", todoListsDelta);
            console.log("ToDo Lists Delta Values Count:", todoListsDelta.values?.length || 0);
        } catch (e) {
            console.error("ToDo Lists Delta Error:", e);
        }

        // Test 11: ToDo List Tasks Delta (requires a list ID - this may fail without a valid list)
        console.log("\n=== Testing ToDo List Tasks Delta ===");
        try {
            // First get a list to test tasks delta
            const todoLists = await graph.me.todo.lists();
            if (todoLists.length > 0) {
                const tasksDelta = await graph.me.todo.lists.getById(todoLists[0].id).tasks.delta()();
                console.log("ToDo Tasks Delta Result:", tasksDelta);
                console.log("ToDo Tasks Delta Values Count:", tasksDelta.values?.length || 0);
            } else {
                console.log("No ToDo lists available to test tasks delta");
            }
        } catch (e) {
            console.error("ToDo Tasks Delta Error:", e);
        }        // Test 12: Planner Delta (may require additional permissions)
        console.log("\n=== Testing Planner Delta ===");
        try {
            const plannerDelta = await graph.planner.delta()();
            console.log("Planner Delta Result:", plannerDelta);
            console.log("Planner Delta Values Count:", plannerDelta.values?.length || 0);
        } catch (e) {
            console.error("Planner Delta Error:", e);
        }

        // Test 13: Planner Tasks Delta
        console.log("\n=== Testing Planner Tasks Delta ===");
        try {
            const plannerTasksDelta = await graph.planner.tasks.delta()();
            console.log("Planner Tasks Delta Result:", plannerTasksDelta);
            console.log("Planner Tasks Delta Values Count:", plannerTasksDelta.values?.length || 0);
        } catch (e) {
            console.error("Planner Tasks Delta Error:", e);
        }

        // Test 14: Planner Buckets Delta
        console.log("\n=== Testing Planner Buckets Delta ===");
        try {
            const plannerBucketsDelta = await graph.planner.buckets.delta()();
            console.log("Planner Buckets Delta Result:", plannerBucketsDelta);
            console.log("Planner Buckets Delta Values Count:", plannerBucketsDelta.values?.length || 0);
        } catch (e) {
            console.error("Planner Buckets Delta Error:", e);
        }

        console.log("\n=== All Delta Tests Complete ===");

        // Test with delta tokens (if available from previous calls)
        console.log("\n=== Testing Delta with Tokens ===");
        try {
            // Example of using delta with maxPageSize
            console.log("Testing Users Delta with maxPageSize...");
            const usersWithPageSize = await graph.users.delta({ maxPageSize: 10 })();
            console.log("Users Delta with maxPageSize Result:", usersWithPageSize);
            
            // If we have a delta link, we can use it for subsequent calls
            if (usersWithPageSize.delta) {
                console.log("Found delta link for future incremental sync");
            }
        } catch (e) {
            console.error("Delta with Tokens Error:", e);
        }

} catch(e) {
    console.error("General Error:", e);
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
