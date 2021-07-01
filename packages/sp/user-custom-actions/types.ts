import {
    _OLD_SharePointQueryableInstance,
    _OLD_SharePointQueryableCollection,
    OLD_spInvokableFactory,
    OLD_deleteable,
    OLD_IDeleteable,
} from "../sharepointqueryable.js";
import { assign, ITypedHash } from "@pnp/core";
import { body } from "@pnp/queryable";
import { defaultPath } from "../decorators.js";
import { OLD_spPost } from "../operations.js";
import { tag } from "../telemetry.js";
import { IBasePermissions } from "../security/index.js";
import { metadata } from "../utils/metadata.js";

@defaultPath("usercustomactions")
export class _UserCustomActions extends _OLD_SharePointQueryableCollection<IUserCustomActionInfo[]> {

    /**
     * Returns the user custom action with the specified id
     *
     * @param id The GUID id of the user custom action to retrieve
     */
    public getById(id: string): IUserCustomAction {
        return tag.configure(UserCustomAction(this).concat(`('${id}')`), "ucas.getById");
    }

    /**
     * Creates a user custom action
     *
     * @param properties The information object of property names and values which define the new user custom action
     */
    @tag("ucas.add")
    public async add(properties: ITypedHash<any>): Promise<IUserCustomActionAddResult> {
        const data = await OLD_spPost(this, body(assign(metadata("SP.UserCustomAction"), properties)));
        return {
            action: this.getById(data.Id),
            data,
        };
    }

    /**
     * Deletes all user custom actions in the collection
     */
    @tag("ucas.clear")
    public clear(): Promise<void> {
        return OLD_spPost(this.clone(UserCustomActions, "clear"));
    }
}
export interface IUserCustomActions extends _UserCustomActions {}
export const UserCustomActions = OLD_spInvokableFactory<IUserCustomActions>(_UserCustomActions);

export class _UserCustomAction extends _OLD_SharePointQueryableInstance<IUserCustomActionInfo> {

    public delete = OLD_deleteable("uca");

    /**
    * Updates this user custom action with the supplied properties
    *
    * @param properties An information object of property names and values to update for this user custom action
    */
    public update: any = this._update<IUserCustomActionUpdateResult, ITypedHash<any>>("SP.UserCustomAction", (data) => ({ data, action: <any>this }));
}
export interface IUserCustomAction extends _UserCustomAction, OLD_IDeleteable { }
export const UserCustomAction = OLD_spInvokableFactory<IUserCustomAction>(_UserCustomAction);

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
