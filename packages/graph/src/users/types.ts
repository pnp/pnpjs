import { _GraphQueryableCollection, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import {
    User as IUserType,
} from "@microsoft/microsoft-graph-types";
import { _DirectoryObject, IDirectoryObject, DirectoryObjects, IDirectoryObjects } from "../directory-objects/types";
import { defaultPath, updateable, deleteable, IUpdateable, IDeleteable, getById, IGetById } from "../decorators";
import { IInvokable } from "@pnp/odata";

/**
 * Represents a user entity
 */
@updateable()
@deleteable()
export class _User extends _DirectoryObject<IUserType> implements _IUser {
    /**
    * The groups and directory roles associated with the user
    */
    public get memberOf(): IDirectoryObjects {
        return DirectoryObjects(this, "memberOf");
    }
}
export interface _IUser {
    readonly memberOf: IDirectoryObjects;
}
export interface IUser extends _IUser, IInvokable, IUpdateable<IUserType>, IDeleteable, IDirectoryObject<IUserType> { }
export const User = graphInvokableFactory<IUser>(_User);

/**
 * Describes a collection of Users objects
 *
 */
@defaultPath("users")
@getById(User)
export class _Users extends _GraphQueryableCollection<IUserType[]> implements _IUsers { }
export interface _IUsers { }
export interface IUsers extends _IUsers, IInvokable, IGetById<IUser>, IGraphQueryableCollection<IUserType[]> { }
export const Users = graphInvokableFactory<IUsers>(_Users);
