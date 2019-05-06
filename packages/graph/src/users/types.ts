import { _GraphQueryableCollection, IGraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import {
    User as IUserType,
} from "@microsoft/microsoft-graph-types";
import { _DirectoryObject, IDirectoryObject, DirectoryObjects, IDirectoryObjects } from "../directory-objects/types";
import { defaultPath, updateable, deleteable, IUpdateable, IDeleteable, getById, IGetById } from "../decorators";
import { IGetable } from "@pnp/odata";

/**
 * Represents a user entity
 */
@updateable()
@deleteable()
export class _User extends _DirectoryObject<IUserType> implements IUser {
    /**
    * The groups and directory roles associated with the user
    */
    public get memberOf(): IDirectoryObjects {
        return DirectoryObjects(this, "memberOf");
    }
}
export interface IUser extends IGetable, IUpdateable<IUserType>, IDeleteable, IDirectoryObject<IUserType> {
    readonly memberOf: IDirectoryObjects;
 }
export interface _User extends IGetable, IUpdateable<IUserType>, IDeleteable { }
export const User = graphInvokableFactory<IUser>(_User);

/**
 * Describes a collection of Users objects
 *
 */
@defaultPath("users")
@getById(User)
export class _Users extends _GraphQueryableCollection<IUserType[]> {}
export interface IUsers extends IGetable, IGetById<IUser>, IGraphQueryableCollection<IUserType[]> { }
export interface _Users extends IGetable, IGetById<IUser> { }
export const Users = graphInvokableFactory<IUsers>(_Users);
