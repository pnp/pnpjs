import { _ContentType } from "../content-types/types";
import { getValueForUICultureBinder } from "./funcs";
import { IUserResources } from "./types";

declare module "../content-types/types" {
    interface _ContentType extends IUserResources {}
    interface IContentType extends IUserResources {}
}

_ContentType.prototype.titleResource = getValueForUICultureBinder("titleResource");
_ContentType.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
