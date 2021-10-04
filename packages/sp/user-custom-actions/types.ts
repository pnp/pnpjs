import {
    _SPCollection,
    spInvokableFactory,
    deleteable,
    _SPInstance,
    IDeleteable,
} from "../spqueryable.js";
import { body } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";
import { spPost, spPostMerge } from "../operations.js";
import { IBasePermissions } from "../security/index.js";

@defaultPath("usercustomactions")
export class _UserCustomActions extends _SPCollection<IUserCustomActionInfo[]> {

    /**
     * Returns the user custom action with the specified id
     *
     * @param id The GUID id of the user custom action to retrieve
     */
    public getById(id: string): IUserCustomAction {
        return UserCustomAction(this).concat(`('${id}')`);
    }

    /**
     * Creates a user custom action
     *
     * @param properties The information object of property names and values which define the new user custom action
     */
    public async add(properties: Partial<IUserCustomActionInfo>): Promise<IUserCustomActionAddResult> {
        const data = await spPost(this, body(properties));
        return {
            action: this.getById(data.Id),
            data,
        };
    }

    /**
     * Deletes all user custom actions in the collection
     */
    public clear(): Promise<void> {
        return spPost(UserCustomActions(this, "clear"));
    }
}
export interface IUserCustomActions extends _UserCustomActions { }
export const UserCustomActions = spInvokableFactory<IUserCustomActions>(_UserCustomActions);

export class _UserCustomAction extends _SPInstance<IUserCustomActionInfo> {

    public delete = deleteable();

    /**
    * Updates this user custom action with the supplied properties
    *
    * @param properties An information object of property names and values to update for this user custom action
    */
    public async update(props: Partial<IUserCustomActionInfo>): Promise<IUserCustomActionUpdateResult> {

        const data = await spPostMerge(this, body(props));

        return {
            data,
            action: this,
        };
    }
}
export interface IUserCustomAction extends _UserCustomAction, IDeleteable { }
export const UserCustomAction = spInvokableFactory<IUserCustomAction>(_UserCustomAction);

/**
 * Result from adding a user custom action
 */
export interface IUserCustomActionAddResult {
    /*
     * The raw data returned from the add operation
     */
    data: any;

    /*
     * The added UserCustomAction
     */
    action: IUserCustomAction;
}

/**
 * Result from udating a user custom action
 */
export interface IUserCustomActionUpdateResult {
    /*
     * The raw data returned from the update operation
     */
    data: any;

    /*
     * The updated UserCustomAction
     */
    action: IUserCustomAction;
}

export enum UserCustomActionRegistrationType {
    None,
    List,
    ContentType,
    ProgId,
    FileType,
}

export enum UserCustomActionScope {
    Unknown,
    Site = 2,
    Web,
    List,
}

export interface IUserCustomActionInfo {
    CommandUIExtension: string;
    Description: string;
    Group: string;
    Id: string;
    ImageUrl: string;
    Location: string;
    Name: string;
    RegistrationId: string;
    RegistrationType: UserCustomActionRegistrationType;
    Rights: IBasePermissions;
    Scope: UserCustomActionScope;
    ScriptBlock: string;
    ScriptSrc: string;
    Sequence: number;
    Title: string;
    Url: string;
    VersionOfUserCustomAction: string;
}
