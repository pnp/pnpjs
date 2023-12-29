import { GraphFI } from "../fi.js";
import { IPlaces, Places } from "./types.js";

export {
    Places,
    IPlaces,
    Place,
    IPlace,
    Room,
    IRoom,
    RoomList,
    IRoomlist,
    RoomLists,
    IRoomlists
} from "./types.js";

declare module "../fi" {
    interface GraphFI {
        readonly places: IPlaces;
    }
}

Reflect.defineProperty(GraphFI.prototype, "places", {
    configurable: true,
    enumerable: true,
    get: function (this: GraphFI) {
        return this.create(Places);
    },
});
