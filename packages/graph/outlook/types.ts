import { _GraphQueryableCollection, _GraphQueryableInstance, graphInvokableFactory } from "../graphqueryable.js";
import { OutlookUser as IOutlookType, OutlookCategory as IOutlookCategoryType } from "@microsoft/microsoft-graph-types";
import { defaultPath, deleteable, getById, IDeleteable, IGetById, IUpdateable, updateable } from "../decorators.js";
import { graphPost } from "@pnp/graph";
import { body } from "@pnp/queryable";

/**
 * Outlook
 */
export class _Outlook extends _GraphQueryableInstance<IOutlookType> {

    public get masterCategories(): IMasterCategories {
        return MasterCategories(this);
    }
}
export interface IOutlook extends _Outlook { }
export const Outlook = graphInvokableFactory<IOutlook>(_Outlook);


/**
 * Describes an Outlook Category instance
 */
@deleteable()
@updateable()
export class _OutlookCategory extends _GraphQueryableInstance<IOutlookCategoryType> { }
export interface IOutlookCategory extends _OutlookCategory, IUpdateable<IOutlookCategoryType>, IDeleteable { }
export const OutlookCategory = graphInvokableFactory<IOutlookCategory>(_OutlookCategory);

/**
 * Categories
 */
@defaultPath("masterCategories")
@getById(OutlookCategory)
export class _MasterCategories extends _GraphQueryableCollection<IOutlookCategoryType[]> {

    /**
     * Adds a new event to the collection
     *
     * @param properties The set of properties used to create the event
     */
    public async add(properties: IOutlookCategoryType): Promise<IMasterCategoryAddResult> {

        const data = await graphPost(this, body(properties));

        return {
            data,
        };
    }
}
export interface IMasterCategories extends _MasterCategories, IGetById<IOutlookCategory> { }
export const MasterCategories = graphInvokableFactory<IMasterCategories>(_MasterCategories);

/**
 * MasterCategoryAddResult
 */
export interface IMasterCategoryAddResult {
    data: IOutlookCategoryType;
}
