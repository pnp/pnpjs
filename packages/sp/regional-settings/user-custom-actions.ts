import { _UserCustomAction } from "../user-custom-actions/types";
import { getValueForUICultureBinder } from "./funcs";
import { IUserResources } from "./types";

declare module "../user-custom-actions/types" {
    interface _UserCustomAction extends IUserResources {}
    interface IUserCustomAction extends IUserResources {}
}

_UserCustomAction.prototype.titleResource = getValueForUICultureBinder("titleResource");
_UserCustomAction.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
