import { _GraphQueryableCollection, graphInvokableFactory, _GraphQueryableInstance } from "../graphqueryable";
import { User as IUserType, Person as IPersonType } from "@microsoft/microsoft-graph-types";
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

    /**
     * Retrieve a collection of person objects ordered by their relevance to the user
     */
    public get people(): IPeople {
        return People(this);
    }
}
export interface IUser extends _User, IUpdateable<IUserType>, IDeleteable { }
export const User = graphInvokableFactory<IUser>(_User);

@defaultPath("users")
@getById(User)
export class _Users extends _GraphQueryableCollection<IUserType[]> { }
export interface IUsers extends _Users, IGetById<IUser> { }
export const Users = graphInvokableFactory<IUsers>(_Users);

@defaultPath("people")
export class _People extends _GraphQueryableCollection<IPersonType[]> {}
export interface IPeople extends _People { }
export const People = graphInvokableFactory<IPeople>(_People);
