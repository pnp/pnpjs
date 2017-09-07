import { SharePointQueryable, SharePointQueryableInstance, SharePointQueryableCollection } from "./sharepointqueryable";
import { SiteGroups } from "./sitegroups";
import { BasePermissions } from "./types";
import { Util } from "../utils/util";
import { TypedHash } from "../collections/collections";

/**
 * Describes a set of role assignments for the current scope
 *
 */
export class RoleAssignments extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the RoleAssignments class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this role assignments collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "roleassignments") {
        super(baseUrl, path);
    }

    /**
     * Adds a new role assignment with the specified principal and role definitions to the collection
     *
     * @param principalId The id of the user or group to assign permissions to
     * @param roleDefId The id of the role definition that defines the permissions to assign
     *
     */
    public add(principalId: number, roleDefId: number): Promise<void> {
        return this.clone(RoleAssignments, `addroleassignment(principalid=${principalId}, roledefid=${roleDefId})`).postCore();
    }

    /**
     * Removes the role assignment with the specified principal and role definition from the collection
     *
     * @param principalId The id of the user or group in the role assignment
     * @param roleDefId The id of the role definition in the role assignment
     *
     */
    public remove(principalId: number, roleDefId: number): Promise<void> {
        return this.clone(RoleAssignments, `removeroleassignment(principalid=${principalId}, roledefid=${roleDefId})`).postCore();
    }

    /**
     * Gets the role assignment associated with the specified principal id from the collection.
     *
     * @param id The id of the role assignment
     */
    public getById(id: number) {
        const ra = new RoleAssignment(this);
        ra.concat(`(${id})`);
        return ra;
    }
}

/**
 * Describes a role assignment
 *
 */
export class RoleAssignment extends SharePointQueryableInstance {

    /**
     * Gets the groups that directly belong to the access control list (ACL) for this securable object
     *
     */
    public get groups(): SiteGroups {
        return new SiteGroups(this, "groups");
    }

    /**
     * Gets the role definition bindings for this role assignment
     *
     */
    public get bindings(): RoleDefinitionBindings {
        return new RoleDefinitionBindings(this);
    }

    /**
     * Deletes this role assignment
     *
     */
    public delete(): Promise<void> {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }
}

/**
 * Describes a collection of role definitions
 *
 */
export class RoleDefinitions extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the RoleDefinitions class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this role definitions collection
     *
     */
    constructor(baseUrl: string | SharePointQueryable, path = "roledefinitions") {
        super(baseUrl, path);
    }

    /**
     * Gets the role definition with the specified id from the collection
     *
     * @param id The id of the role definition
     *
     */
    public getById(id: number): RoleDefinition {
        return new RoleDefinition(this, `getById(${id})`);
    }

    /**
     * Gets the role definition with the specified name
     *
     * @param name The name of the role definition
     *
     */
    public getByName(name: string): RoleDefinition {
        return new RoleDefinition(this, `getbyname('${name}')`);
    }

    /**
     * Gets the role definition with the specified role type
     *
     * @param roleTypeKind The roletypekind of the role definition (None=0, Guest=1, Reader=2, Contributor=3, WebDesigner=4, Administrator=5, Editor=6, System=7)
     *
     */
    public getByType(roleTypeKind: number): RoleDefinition {
        return new RoleDefinition(this, `getbytype(${roleTypeKind})`);
    }

    /**
     * Creates a role definition
     *
     * @param name The new role definition's name
     * @param description The new role definition's description
     * @param order The order in which the role definition appears
     * @param basePermissions The permissions mask for this role definition
     *
     */
    public add(name: string, description: string, order: number, basePermissions: BasePermissions): Promise<RoleDefinitionAddResult> {

        const postBody = JSON.stringify({
            BasePermissions: Util.extend({ __metadata: { type: "SP.BasePermissions" } }, basePermissions),
            Description: description,
            Name: name,
            Order: order,
            __metadata: { "type": "SP.RoleDefinition" },
        });

        return this.postCore({ body: postBody }).then((data) => {
            return {
                data: data,
                definition: this.getById(data.Id),
            };
        });
    }
}

/**
 * Describes a role definition
 *
 */
export class RoleDefinition extends SharePointQueryableInstance {

    /**
     * Updates this role definition with the supplied properties
     *
     * @param properties A plain object hash of values to update for the role definition
     */
    /* tslint:disable no-string-literal */
    public update(properties: TypedHash<any>): Promise<RoleDefinitionUpdateResult> {

        if (typeof properties.hasOwnProperty("BasePermissions") !== "undefined") {
            properties["BasePermissions"] = Util.extend({ __metadata: { type: "SP.BasePermissions" } }, properties["BasePermissions"]);
        }

        const postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.RoleDefinition" },
        }, properties));

        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {

            let retDef: RoleDefinition = this;

            if (properties.hasOwnProperty("Name")) {
                const parent = this.getParent(RoleDefinitions, this.parentUrl, "");
                retDef = parent.getByName(<string>properties["Name"]);
            }

            return {
                data: data,
                definition: retDef,
            };
        });
    }
    /* tslint:enable */

    /**
     * Deletes this role definition
     *
     */
    public delete(): Promise<void> {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }
}

/**
 * Result from updating a role definition
 *
 */
export interface RoleDefinitionUpdateResult {
    definition: RoleDefinition;
    data: any;
}

/**
 * Result from adding a role definition
 *
 */
export interface RoleDefinitionAddResult {
    definition: RoleDefinition;
    data: any;
}

/**
 * Describes the role definitons bound to a role assignment object
 *
 */
export class RoleDefinitionBindings extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the RoleDefinitionBindings class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this role definition bindings collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "roledefinitionbindings") {
        super(baseUrl, path);
    }
}
