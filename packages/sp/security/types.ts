import { assign, hOP } from "@pnp/common";
import { body, headers } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    SharePointQueryableCollection,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
    IDeleteable,
    deleteable,
} from "../sharepointqueryable";
import { SiteGroups, ISiteGroups } from "../site-groups/types";
import { metadata } from "../utils/metadata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { tag } from "../telemetry";

export type SecurableQueryable = _SharePointQueryableInstance & ISecurableMethods;

/**
 * Describes a set of role assignments for the current scope
 *
 */
@defaultPath("roleassignments")
export class _RoleAssignments extends _SharePointQueryableCollection<IRoleAssignmentInfo[]> {

    /**	
     * Gets the role assignment associated with the specified principal id from the collection.	
     *	
     * @param id The id of the role assignment	
     */
    public getById(id: number): IRoleAssignment {
        return RoleAssignment(this).concat(`(${id})`);
    }

    /**
     * Adds a new role assignment with the specified principal and role definitions to the collection
     *
     * @param principalId The id of the user or group to assign permissions to
     * @param roleDefId The id of the role definition that defines the permissions to assign
     *
     */
    public async add(principalId: number, roleDefId: number): Promise<void> {
        await spPost(this.clone(RoleAssignments, `addroleassignment(principalid=${principalId}, roledefid=${roleDefId})`));
    }

    /**
     * Removes the role assignment with the specified principal and role definition from the collection
     *
     * @param principalId The id of the user or group in the role assignment
     * @param roleDefId The id of the role definition in the role assignment
     *
     */
    public async remove(principalId: number, roleDefId: number): Promise<void> {
        await spPost(this.clone(RoleAssignments, `removeroleassignment(principalid=${principalId}, roledefid=${roleDefId})`));
    }
}
export interface IRoleAssignments extends _RoleAssignments { }
export const RoleAssignments = spInvokableFactory<IRoleAssignments>(_RoleAssignments);

/**
 * Describes a role assignment
 *
 */
export class _RoleAssignment extends _SharePointQueryableInstance<IRoleAssignmentInfo> {

    public delete = deleteable("ra");

    /**
     * Gets the groups that directly belong to the access control list (ACL) for this securable object
     *
     */
    public get groups(): ISiteGroups {
        return tag.configure(SiteGroups(this, "groups"), "ra.groups");
    }

    /**
     * Gets the role definition bindings for this role assignment
     *
     */
    public get bindings(): ISharePointQueryableCollection {
        return SharePointQueryableCollection(this, "roledefinitionbindings");
    }
}
export interface IRoleAssignment extends _RoleAssignment, IDeleteable { }
export const RoleAssignment = spInvokableFactory<IRoleAssignment>(_RoleAssignment);

/**
 * Describes a collection of role definitions
 *
 */
@defaultPath("roledefinitions")
export class _RoleDefinitions extends _SharePointQueryableCollection<IRoleDefinitionInfo[]> {

    /**	   
     * Gets the role definition with the specified id from the collection	    
     *	     
     * @param id The id of the role definition	     
     *	     
     */
    public getById(id: number): IRoleDefinition {
        return RoleDefinition(this, `getById(${id})`);
    }

    /**
     * Gets the role definition with the specified name
     *
     * @param name The name of the role definition
     *
     */
    public getByName(name: string): IRoleDefinition {
        return RoleDefinition(this, `getbyname('${name}')`);
    }

    /**
     * Gets the role definition with the specified role type
     *
     * @param roleTypeKind The roletypekind of the role definition (None=0, Guest=1, Reader=2, Contributor=3, WebDesigner=4, Administrator=5, Editor=6, System=7)
     *
     */
    public getByType(roleTypeKind: RoleTypeKind): IRoleDefinition {
        return RoleDefinition(this, `getbytype(${roleTypeKind})`);
    }

    /**
     * Creates a role definition
     *
     * @param name The new role definition's name
     * @param description The new role definition's description
     * @param order The order in which the role definition appears
     * @param basePermissions The permissions mask for this role definition, high and low values need to be converted to string
     *
     */
    public async add(name: string, description: string, order: number, basePermissions: IBasePermissions): Promise<IRoleDefinitionAddResult> {
        const postBody = body({
            BasePermissions: { "High": basePermissions.High.toString(), "Low": basePermissions.Low.toString() },
            Description: description,
            Name: name,
            Order: order,
            __metadata: { "type": "SP.RoleDefinition" },
        });

        const data = await spPost(this, postBody);

        return {
            data: data,
            definition: this.getById(data.Id),
        };
    }
}
export interface IRoleDefinitions extends _RoleDefinitions { }
export const RoleDefinitions = spInvokableFactory<IRoleDefinitions>(_RoleDefinitions);

/**
 * Describes a role definition
 *
 */
export class _RoleDefinition extends _SharePointQueryableInstance<IRoleDefinitionInfo> {

    public delete = deleteable("rd");

    /**
     * Updates this role definition with the supplied properties
     *
     * @param properties A plain object hash of values to update for the role definition
     */
    /* tslint:disable no-string-literal */
    public async update(properties: Partial<IRoleDefinitionInfo>): Promise<IRoleDefinitionUpdateResult> {

        const s = ["BasePermissions"];
        if (hOP(properties, s[0]) !== undefined) {
            properties[s[0]] = assign(metadata(`SP.${s[0]}`), properties[s[0]]);

            const bpObj = properties[s[0]];
            bpObj.High = bpObj.High.toString();
            bpObj.Low = bpObj.Low.toString();
        }

        const postBody = body(assign(metadata("SP.RoleDefinition"), properties), headers({ "X-HTTP-Method": "MERGE" }));

        const data = await spPost(this, postBody);

        let definition: IRoleDefinition = <any>this;
        if (hOP(properties, "Name")) {
            const parent = this.getParent<IRoleDefinitions>(RoleDefinitions, this.parentUrl, "");
            definition = parent.getByName((<string>properties["Name"]));
        }
        return {
            data,
            definition,
        };
    }
    /* tslint:enable */
}
export interface IRoleDefinition extends _RoleDefinition, IDeleteable { }
export const RoleDefinition = spInvokableFactory<IRoleDefinition>(_RoleDefinition);

export interface ISecurableMethods {
    readonly roleAssignments: IRoleAssignments;
    readonly firstUniqueAncestorSecurableObject: _SharePointQueryableInstance;
    getUserEffectivePermissions(loginName: string): Promise<IBasePermissions>;
    getCurrentUserEffectivePermissions(): Promise<IBasePermissions>;
    breakRoleInheritance(copyRoleAssignments?: boolean, clearSubscopes?: boolean): Promise<any>;
    resetRoleInheritance(): Promise<any>;
    userHasPermissions(loginName: string, permission: PermissionKind): Promise<boolean>;
    currentUserHasPermissions(permission: PermissionKind): Promise<boolean>;
    hasPermissions(value: IBasePermissions, perm: PermissionKind): boolean;
}

/**
 * Result from updating a role definition
 *
 */
export interface IRoleDefinitionUpdateResult {
    definition: IRoleDefinition;
    data: any;
}

/**
 * Result from adding a role definition
 *
 */
export interface IRoleDefinitionAddResult {
    definition: IRoleDefinition;
    data: any;
}

export interface IBasePermissions {
    Low: number;
    High: number;
}

export interface IRoleAssignmentInfo {
    PrincipalId: number;
}

export interface IRoleDefinitionInfo {
    BasePermissions: IBasePermissions;
    Description: string;
    Hidden: boolean;
    Id: number;
    Name: string;
    Order: number;
    RoleTypeKind: RoleTypeKind;
}

export type RoleTypeKind = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export enum PermissionKind {

    /**
     * Has no permissions on the Site. Not available through the user interface.
     */
    EmptyMask = 0,

    /**
     * View items in lists, documents in document libraries, and Web discussion comments.
     */
    ViewListItems = 1,

    /**
     * Add items to lists, documents to document libraries, and Web discussion comments.
     */
    AddListItems = 2,

    /**
     * Edit items in lists, edit documents in document libraries, edit Web discussion comments
     * in documents, and customize Web Part Pages in document libraries.
     */
    EditListItems = 3,

    /**
     * Delete items from a list, documents from a document library, and Web discussion
     * comments in documents.
     */
    DeleteListItems = 4,

    /**
     * Approve a minor version of a list item or document.
     */
    ApproveItems = 5,

    /**
     * View the source of documents with server-side file handlers.
     */
    OpenItems = 6,

    /**
     * View past versions of a list item or document.
     */
    ViewVersions = 7,

    /**
     * Delete past versions of a list item or document.
     */
    DeleteVersions = 8,

    /**
     * Discard or check in a document which is checked out to another user.
     */
    CancelCheckout = 9,

    /**
     * Create, change, and delete personal views of lists.
     */
    ManagePersonalViews = 10,

    /**
     * Create and delete lists, add or remove columns in a list, and add or remove public views of a list.
     */
    ManageLists = 12,

    /**
     * View forms, views, and application pages, and enumerate lists.
     */
    ViewFormPages = 13,

    /**
     * Make content of a list or document library retrieveable for anonymous users through SharePoint search.
     * The list permissions in the site do not change.
     */
    AnonymousSearchAccessList = 14,

    /**
     * Allow users to open a Site, list, or folder to access items inside that container.
     */
    Open = 17,

    /**
     * View pages in a Site.
     */
    ViewPages = 18,

    /**
     * Add, change, or delete HTML pages or Web Part Pages, and edit the Site using
     * a Windows SharePoint Services compatible editor.
     */
    AddAndCustomizePages = 19,

    /**
     * Apply a theme or borders to the entire Site.
     */
    ApplyThemeAndBorder = 20,

    /**
     * Apply a style sheet (.css file) to the Site.
     */
    ApplyStyleSheets = 21,

    /**
     * View reports on Site usage.
     */
    ViewUsageData = 22,

    /**
     * Create a Site using Self-Service Site Creation.
     */
    CreateSSCSite = 23,

    /**
     * Create subsites such as team sites, Meeting Workspace sites, and Document Workspace sites.
     */
    ManageSubwebs = 24,

    /**
     * Create a group of users that can be used anywhere within the site collection.
     */
    CreateGroups = 25,

    /**
     * Create and change permission levels on the Site and assign permissions to users
     * and groups.
     */
    ManagePermissions = 26,

    /**
     * Enumerate files and folders in a Site using Microsoft Office SharePoint Designer
     * and WebDAV interfaces.
     */
    BrowseDirectories = 27,

    /**
     * View information about users of the Site.
     */
    BrowseUserInfo = 28,

    /**
     * Add or remove personal Web Parts on a Web Part Page.
     */
    AddDelPrivateWebParts = 29,

    /**
     * Update Web Parts to display personalized information.
     */
    UpdatePersonalWebParts = 30,

    /**
     * Grant the ability to perform all administration tasks for the Site as well as
     * manage content, activate, deactivate, or edit properties of Site scoped Features
     * through the object model or through the user interface (UI). When granted on the
     * root Site of a Site Collection, activate, deactivate, or edit properties of
     * site collection scoped Features through the object model. To browse to the Site
     * Collection Features page and activate or deactivate Site Collection scoped Features
     * through the UI, you must be a Site Collection administrator.
     */
    ManageWeb = 31,

    /**
     * Content of lists and document libraries in the Web site will be retrieveable for anonymous users through
     * SharePoint search if the list or document library has AnonymousSearchAccessList set.
     */
    AnonymousSearchAccessWebLists = 32,

    /**
     * Use features that launch client applications. Otherwise, users must work on documents
     * locally and upload changes.
     */
    UseClientIntegration = 37,

    /**
     * Use SOAP, WebDAV, or Microsoft Office SharePoint Designer interfaces to access the Site.
     */
    UseRemoteAPIs = 38,

    /**
     * Manage alerts for all users of the Site.
     */
    ManageAlerts = 39,

    /**
     * Create e-mail alerts.
     */
    CreateAlerts = 40,

    /**
     * Allows a user to change his or her user information, such as adding a picture.
     */
    EditMyUserInfo = 41,

    /**
     * Enumerate permissions on Site, list, folder, document, or list item.
     */
    EnumeratePermissions = 63,

    /**
     * Has all permissions on the Site. Not available through the user interface.
     */
    FullMask = 65,
}
