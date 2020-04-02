import { _Field } from "../fields/types";
import { getValueForUICultureBinder } from "./funcs";
import { IUserResources } from "./types";

declare module "../fields/types" {
    interface _Field extends IUserResources {}
    interface IField extends IUserResources {}
}

_Field.prototype.titleResource = getValueForUICultureBinder("titleResource");
_Field.prototype.descriptionResource = getValueForUICultureBinder("descriptionResource");
