import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { jsS } from "@pnp/common";
import { DirectoryObject as IDirectoryObject } from "@microsoft/microsoft-graph-types";

export enum DirectoryObjectType {
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

/**
 * Describes a collection of Directory Objects
 *
 */
@defaultPath("directoryObjects")
export class DirectoryObjects extends GraphQueryableCollection<IDirectoryObject[]> {

    /**
     * Gets a directoryObject from the collection using the specified id
     * 
     * @param id Id of the Directory Object to get from this collection
     */
    public getById(id: string): DirectoryObject {
        return new DirectoryObject(this, id);
    }

    /**
    * Returns the directory objects specified in a list of ids. NOTE: The directory objects returned are the full objects containing all their properties. 
    * The $select query option is not available for this operation.
    * 
    * @param ids A collection of ids for which to return objects. You can specify up to 1000 ids.
    * @param type A collection of resource types that specifies the set of resource collections to search. Default is directoryObject.
    */
    public getByIds(ids: string[], type: DirectoryObjectType = DirectoryObjectType.directoryObject): Promise<DirectoryObject[]> {
        return this.clone(DirectoryObjects, "getByIds").postCore({
            body: jsS({
                ids,
                type,
            }),
        });
    }
}

/**
 * Represents a Directory Object entity
 */
export class DirectoryObject extends GraphQueryableInstance<IDirectoryObject> {

    /**
     * Deletes this group
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Returns all the groups and directory roles that the specified Directory Object is a member of. The check is transitive
     * 
     * @param securityEnabledOnly 
     */
    public getMemberObjects(securityEnabledOnly = false): Promise<{ value: string[] }> {
        return this.clone(DirectoryObject, "getMemberObjects").postCore({
            body: jsS({
                securityEnabledOnly,
            }),
        });
    }

    /**
     * Returns all the groups that the specified Directory Object is a member of. The check is transitive
     * 
     * @param securityEnabledOnly 
     */
    public getMemberGroups(securityEnabledOnly = false): Promise<{ value: string[] }> {

        return this.clone(DirectoryObject, "getMemberGroups").postCore({
            body: jsS({
                securityEnabledOnly,
            }),
        });
    }

    /**
     * Check for membership in a specified list of groups, and returns from that list those groups of which the specified user, group, or directory object is a member. 
     * This function is transitive.
     * @param groupIds A collection that contains the object IDs of the groups in which to check membership. Up to 20 groups may be specified.
     */
    public checkMemberGroups(groupIds: String[]): Promise<{ value: string[] }> {
        return this.clone(DirectoryObject, "checkMemberGroups").postCore({
            body: jsS({
                groupIds,
            }),
        });
    }
}
