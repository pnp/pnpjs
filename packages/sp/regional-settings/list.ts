import { _List } from "../lists/types";
import { getValueForUICultureBinder } from "./funcs";
import { IUserResources } from "./types";

declare module "../lists/types" {
    interface _List extends IUserResources {}
    interface IList extends IUserResources {}
}

_List.prototype.titleResource = getValueForUICultureBinder("titleResource");
_List.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
