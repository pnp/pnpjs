import { _GraphQueryableCollection, _GraphQueryableInstance, graphInvokableFactory } from "../graphqueryable.js";
import { DirectoryObject as IDirectoryObjectType } from "@microsoft/microsoft-graph-types";
import { defaultPath, getById, IGetById, deleteable, IDeleteable } from "../decorators.js";
import { body } from "@pnp/queryable";
import { graphPost } from "../operations.js";
import { AsPaged, IPagedResult } from "../behaviors/paged.js";

/**
 * Represents a Directory Object entity
 */
@deleteable()
export class _DirectoryObject<GetType = IDirectoryObjectType> extends _GraphQueryableInstance<GetType> {

    /**
   * Returns all the groups and directory roles that the specified Directory Object is a member of. The check is transitive
   *
   * @param securityEnabledOnly
   */
    public getMemberObjects(securityEnabledOnly = false): Promise<string[]> {
        return graphPost(DirectoryObject(this, "getMemberObjects"), body({ securityEnabledOnly }));
    }

    /**
   * Returns all the groups that the specified Directory Object is a member of. The check is transitive
   *
   * @param securityEnabledOnly
   */
    public getMemberGroups(securityEnabledOnly = false): Promise<string[]> {
        return graphPost(DirectoryObject(this, "getMemberGroups"), body({ securityEnabledOnly }));
    }

    /**
   * Check for membership in a specified list of groups, and returns from that list those groups of which the specified user, group, or directory object is a member.
   * This function is transitive.
   * @param groupIds A collection that contains the object IDs of the groups in which to check membership. Up to 20 groups may be specified.
   */
    public checkMemberGroups(groupIds: string[]): Promise<string[]> {
        return graphPost(DirectoryObject(this, "checkMemberGroups"), body({ groupIds }));
    }
}

export interface IDirectoryObject extends _DirectoryObject, IDeleteable { }
export const DirectoryObject = graphInvokableFactory<IDirectoryObject>(_DirectoryObject);

/**
 * Describes a collection of Directory Objects
 *
 */
@defaultPath("directoryObjects")
@getById(DirectoryObject)
export class _DirectoryObjects<GetType = IDirectoryObjectType[]> extends _GraphQueryableCollection<GetType> {
    /**
  * Returns the directory objects specified in a list of ids. NOTE: The directory objects returned are the full objects containing all their properties.
  * The $select query option is not available for this operation.
  *
  * @param ids A collection of ids for which to return objects. You can specify up to 1000 ids.
  * @param type A collection of resource types that specifies the set of resource collections to search. Default is directoryObject.
  */
    public getByIds(ids: string[], type: DirectoryObjectTypes = DirectoryObjectTypes.directoryObject): Promise<IDirectoryObjectType[]> {
        return graphPost(DirectoryObjects(this, "getByIds"), body({ ids, type }));
    }

    /**
     * 	Retrieves the total count of matching resources
     *  If the resource doesn't support count, this value will always be zero
     */
    public async count(): Promise<number> {
        const q = AsPaged(this, true);
        const r: IPagedResult = await q.top(1)();
        return r.count;
    }

    /**
     * Allows reading through a collection as pages of information whose size is determined by top or the api method's default
     *
     * @returns an object containing results, the ability to determine if there are more results, and request the next page of results
     */
    public paged(): Promise<IPagedResult> {
        return AsPaged(this, true)();
    }
}
export interface IDirectoryObjects extends _DirectoryObjects, IGetById<IDirectoryObjectType> { }
export const DirectoryObjects = graphInvokableFactory<IDirectoryObjects>(_DirectoryObjects);

/**
 * DirectoryObjectTypes
 */
export enum DirectoryObjectTypes {
    /**
   * Directory Objects
   */
    directoryObject,
    /**
   * User
   */
    user,
    /**
   * Group
   */
    group,
    /**
   * Device
   */
    device,
}
