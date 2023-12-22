import { defaultPath, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { GraphCollection, _GraphInstance, _GraphQueryable, graphInvokableFactory } from "../graphqueryable.js";
import { Room as IRoomType, RoomList as IRoomListType } from "@microsoft/microsoft-graph-types";

/**
 * Place
 */
@updateable()
export class _Place extends _GraphInstance<IRoomType | IRoomListType> { }
export interface IPlace extends _Place, IUpdateable<IUpdatePlaceProps> { }
export const Place = graphInvokableFactory<IPlace>(_Place);

/**
 * Places
 */
@defaultPath("places")
@getById(Place)
export class _Places extends _GraphInstance<IPhotosType> {

    /**
     * Gets all rooms in a tenant
     */
    public get rooms(): _GraphQueryable<IRoomType[]> {
        return GraphCollection(this, "microsoft.graph.room");
    }

    /**
    * Gets all roomLists in a tenant
    */
    public get roomLists():  _GraphQueryable<IRoomListType[]> {
        return GraphCollection(this, "microsoft.graph.roomList");
    }
}
export interface IPlaces extends _Places, IGetById<IPlace> { }
export const Places = graphInvokableFactory<IPlaces>(_Places);

export interface IPhotosType {
    readonly rooms: IRoomType[];
    readonly roomLists: IRoomListType[];
}

export interface IUpdatePlaceProps extends IRoomType, IRoomListType {
    "@odata.type": string;
}
