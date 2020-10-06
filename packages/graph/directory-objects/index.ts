import { GraphRest } from "../rest";
import { IDirectoryObjects, DirectoryObjects } from "./types";

export {
    IDirectoryObject,
    DirectoryObjectTypes,
    DirectoryObject,
    DirectoryObjects,
    IDirectoryObjects,
} from "./types";

declare module "../rest" {
    interface GraphRest {
        readonly directoryObjects: IDirectoryObjects;
    }
}

Reflect.defineProperty(GraphRest.prototype, "directoryObjects", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphRest) {
        return this.childConfigHook(({ options, baseUrl, runtime }) => {
            return DirectoryObjects(baseUrl).configure(options).setRuntime(runtime);
        });
    },
});
