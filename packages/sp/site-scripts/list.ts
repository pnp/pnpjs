import { combine } from "@pnp/core";
import { _List, List } from "../lists/types.js";
import { SiteScripts } from "./types.js";
import "../folders/list.js";
import { Web } from "../webs/types.js";
import { extractWebUrl } from "../utils/extract-web-url.js";

declare module "../lists/types" {
    interface _List {
        getSiteScript(): Promise<string>;
    }

    interface IList {
        /**
         * Gets the site script syntax (JSON) from the current list
         */
        getSiteScript(): Promise<string>;
    }
}

_List.prototype.getSiteScript = async function (this: _List): Promise<string> {

    const rootFolder = await List(this).rootFolder<{ Name: string }>();
    const web = await Web([this, extractWebUrl(this.toUrl())]).select("Url")();
    const absoluteListUrl = combine(web.Url, "Lists", rootFolder.Name);
    return SiteScripts(this, "").getSiteScriptFromList(absoluteListUrl);
};
