import { graphInvokableFactory } from "../graphqueryable.js";
import { User as IUserType, Person as IPersonType } from "@microsoft/microsoft-graph-types";
import { _DirectoryObject, DirectoryObjects, IDirectoryObjects, _DirectoryObjects } from "../directory-objects/types.js";
import { defaultPath, updateable, deleteable, IUpdateable, IDeleteable, getById, IGetById } from "../decorators.js";

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
    * The groups and directory roles associated with the user
    */
    public get transitiveMemberOf(): IDirectoryObjects {
        return DirectoryObjects(this, "transitiveMemberOf");
    }

    /**
     * Retrieve a collection of person objects ordered by their relevance to the user
     */
    public get people(): IPeople {
        return People(this);
    }

    /**
    * People that have direct reports to the user
    */
    public get directReports(): IPeople {
        return People(this, "directReports");
    }

    /**
    * The manager associated with this user
    */
    public get manager(): IUser {
        return User(this, "manager");
    }
}
export interface IUser extends _User, IUpdateable<IUserType>, IDeleteable { }
export const User = graphInvokableFactory<IUser>(_User);

@defaultPath("users")
@getById(User)
export class _Users extends _DirectoryObjects<IUserType[]> { }
export interface IUsers extends _Users, IGetById<IUser> { }
export const Users = graphInvokableFactory<IUsers>(_Users);

@defaultPath("people")
export class _People extends _DirectoryObjects<IPersonType[]> { }
export interface IPeople extends _People { }
export const People = graphInvokableFactory<IPeople>(_People);
