import { IInvokable } from "@pnp/queryable";
import { extractWebUrl, spfi } from "@pnp/sp";
import { IWeb } from "@pnp/sp/webs";

// Function deletes all test subsites
export async function cleanUpAllSubsites(web: IWeb & IInvokable<any>): Promise<void> {

    const webs = await web.webs.select("Title")();

    if (webs !== null && webs.length > 0) {

        console.log(`${webs.length} subwebs were found.`);

        for (let i = 0; i < webs.length; i++) {

            const webUrl = extractWebUrl(webs[i]["odata.id"]);

            const spObjSub = spfi([web, webUrl]);

            console.log(`Deleting: ${webUrl}`);

            await cleanUpAllSubsites(spObjSub.web);

            // Delay so that web can be deleted
            await delay(500);

            await spObjSub.web.delete();

            console.log(`Deleted: ${webUrl}`);
        }

    } else {

        console.log(`No subwebs found for site ${extractWebUrl(web.toUrl())}`);
    }
}
