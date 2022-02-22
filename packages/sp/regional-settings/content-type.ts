import { _ContentType } from "../content-types/types.js";
import { getValueForUICultureBinder } from "./funcs.js";
import { IUserResources } from "./types.js";

declare module "../content-types/types" {
    interface _ContentType extends IUserResources { }
    interface IContentType extends IUserResources { }
}

_ContentType.prototype.titleResource = getValueForUICultureBinder("nameResource");
_ContentType.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
