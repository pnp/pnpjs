import { _GraphQueryableCollection, graphInvokableFactory } from "../graphqueryable";
import { User as IUserType } from "@microsoft/microsoft-graph-types";
import { _DirectoryObject, DirectoryObjects, IDirectoryObjects } from "../directory-objects/types";
import { defaultPath, updateable, deleteable, IUpdateable, IDeleteable, getById, IGetById } from "../decorators";

@updateable()
@deleteable()
export class _User extends _DirectoryObject<IUserType> {
    /**
    * The groups and directory roles associated with the user
    */
    public get memberOf(): IDirectoryObjects {
        return DirectoryObjects(this, "memberOf");
    }
}
export interface IUser extends _User, IUpdateable<IUserType>, IDeleteable { }
export const User = graphInvokableFactory<IUser>(_User);

/**
 * Describes a collection of Users objects
 *
 */
@defaultPath("users")
@getById(User)
export class _Users extends _GraphQueryableCollection<IUserType[]> { }
export interface IUsers extends _Users, IGetById<IUser> { }
export const Users = graphInvokableFactory<IUsers>(_Users);
