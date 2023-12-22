import { defaultPath, updateable, IUpdateable, getById, IGetById } from "../decorators.js";
import { _GraphCollection, _GraphInstance, graphInvokableFactory } from "../graphqueryable.js";
import { Room as IRoomType, RoomList as IRoomListType, Place as IPlaceType } from "@microsoft/microsoft-graph-types";

/**
 * Place
 */
@updateable()
export class _Place extends _GraphInstance<IPlaceType> { }
export interface IPlace extends _Place, IUpdateable<IUpdatePlaceProps> { }
export const Place = graphInvokableFactory<IPlace>(_Place);

/**
 * Places
 */
@defaultPath("places")
@getById(Place)
export class _Places extends _GraphInstance<IPlace> {

    /**
     * Gets all rooms in a tenant
     */
    public get rooms(): IRooms {
        return Rooms(this);
    }

    /**
    * Gets all roomLists in a tenant
    */
    public get roomLists(): IRoomlists {
        return RoomLists(this);
    }
}
export interface IPlaces extends _Places, IGetById<IPlace> { }
export const Places = graphInvokableFactory<IPlaces>(_Places);

/**
 * RoomList
 */
export class _RoomList extends _GraphInstance<IRoomListType> {
    /**
    * Gets all rooms in a roomList
    */
    public get rooms(): IRooms {
        return Rooms(this, "rooms");
    }
}
export interface IRoomlist extends _RoomList {}
export const RoomList = graphInvokableFactory<IRoomlist>(_RoomList);

/**
 * RoomLists
 */
@defaultPath("microsoft.graph.roomList")
@getById(RoomList)
export class _RoomLists extends _GraphCollection<IRoomListType[]> {}
export interface IRoomlists extends _RoomLists, IGetById<IRoomlist> { }
export const RoomLists = graphInvokableFactory<IRoomlists>(_RoomLists);

/**
 * Room
 */
export class _Room extends _GraphInstance<IRoomType> {}
export interface IRoom extends _Rooms { }
export const Room = graphInvokableFactory<IRoom>(_Room);

/**
 * Rooms
 */
@defaultPath("microsoft.graph.room")
@getById(Room)
export class _Rooms extends _GraphCollection<IRoom> {}
export interface IRooms extends _Rooms, IGetById<IRoom> { }
export const Rooms = graphInvokableFactory<IRooms>(_Rooms);

export interface IPlacesType {
    readonly rooms: IRoomType[];
    readonly roomLists: IRoomListType[];
}

export interface IUpdatePlaceProps extends IRoomType, IRoomListType {
    "@odata.type": string;
}
