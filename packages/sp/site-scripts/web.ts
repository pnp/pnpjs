import { AssignFrom } from "@pnp/core";
import { _Web } from "../webs/types.js";
import { SiteScripts } from "./types.js";
import { ISiteScriptSerializationInfo, ISiteScriptSerializationResult } from "./types.js";

declare module "../webs/types" {
    interface _Web {
        getSiteScript(extractInfo?: ISiteScriptSerializationInfo): Promise<ISiteScriptSerializationResult>;
    }

    interface IWeb {
        /**
         * Gets the site script syntax (JSON) for the current web
         * @param extractInfo configuration object to specify what to extract
         */
        getSiteScript(extractInfo?: ISiteScriptSerializationInfo): Promise<ISiteScriptSerializationResult>;
    }
}

_Web.prototype.getSiteScript = async function (this: _Web, extractInfo?: ISiteScriptSerializationInfo): Promise<ISiteScriptSerializationResult> {

    const info = await this.select("Url")<{ Url: string }>();
    return SiteScripts(this.toUrl(), "").using(AssignFrom(this)).getSiteScriptFromWeb(info.Url, extractInfo);
};
