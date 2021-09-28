import { GraphRest } from "../rest.js";
import { IDirectoryObjects, DirectoryObjects } from "./types.js";

export {
    IDirectoryObject,
    DirectoryObjectTypes,
    DirectoryObject,
    DirectoryObjects,
    IDirectoryObjects,
} from "./types.js";

declare module "../rest" {
    interface GraphRest {
        readonly directoryObjects: IDirectoryObjects;
    }
}

Reflect.defineProperty(GraphRest.prototype, "directoryObjects", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.create(DirectoryObjects);
    },
});
