import { _Field } from "../fields/types.js";
import { getValueForUICultureBinder } from "./funcs.js";
import { IUserResources } from "./types.js";

declare module "../fields/types" {
    interface _Field extends IUserResources {}
    interface IField extends IUserResources {}
}

_Field.prototype.titleResource = getValueForUICultureBinder("titleResource");
_Field.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
