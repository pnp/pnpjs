import { _List } from "../lists/types.js";
import { getValueForUICultureBinder } from "./funcs.js";
import { IUserResources } from "./types.js";

declare module "../lists/types" {
    interface _List extends IUserResources {}
    interface IList extends IUserResources {}
}

_List.prototype.titleResource = getValueForUICultureBinder("titleResource");
_List.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
