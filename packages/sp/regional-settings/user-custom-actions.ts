import { _UserCustomAction } from "../user-custom-actions/types.js";
import { getValueForUICultureBinder } from "./funcs.js";
import { IUserResources } from "./types.js";

declare module "../user-custom-actions/types" {
    interface _UserCustomAction extends IUserResources {}
    interface IUserCustomAction extends IUserResources {}
}

_UserCustomAction.prototype.titleResource = getValueForUICultureBinder("titleResource");
_UserCustomAction.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
