import { graphGet } from "../graphqueryable.js";
import { _List, List } from "../lists/types.js";
import { Drive as  IDriveType } from "@microsoft/microsoft-graph-types";

declare module "../lists/types" {
    interface _List {
        drive(): Promise<IDriveType>;
    }
    interface IList {
        drive(): Promise<IDriveType>;
    }
}

_List.prototype.drive = function drive(): Promise<IDriveType> {
    return graphGet(List(this, "drive"));
};
