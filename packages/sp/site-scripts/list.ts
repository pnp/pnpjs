import { combine } from "@pnp/common";
import { _List, List } from "../lists/types";
import { SiteScripts } from "./types";
import "../folders/list";
import { _Web, Web } from "../webs/types";
import { extractWebUrl } from "../utils/extractweburl";

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

    const rootFolder = await this.clone(List).rootFolder.get<{ Name: string }>();
    const web = await Web(extractWebUrl(this.toUrl())).select("Url").get();
    const absoluteListUrl = combine(web.Url, "Lists", rootFolder.Name);
    return SiteScripts(this, "").getSiteScriptFromList(absoluteListUrl);
};
