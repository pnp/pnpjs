import { GraphFI } from "../fi.js";
import { IDirectoryObjects, DirectoryObjects } from "./types.js";

export {
    IDirectoryObject,
    DirectoryObjectTypes,
    DirectoryObject,
    DirectoryObjects,
    IDirectoryObjects,
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly directoryObjects: IDirectoryObjects;
    }
}

Reflect.defineProperty(GraphFI.prototype, "directoryObjects", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(DirectoryObjects);
    },
});
