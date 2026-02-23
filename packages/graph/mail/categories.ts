import { _GraphCollection, _GraphInstance, graphInvokableFactory } from "../graphqueryable.js";
import { OutlookUser as IOutlookType, OutlookCategory as IOutlookCategoryType } from "@microsoft/microsoft-graph-types";
import { addable, defaultPath, deleteable, getById, IAddable, IDeleteable, IGetById, IUpdateable, updateable } from "../decorators.js";
// import { graphPost } from "@pnp/graph";
// import { body } from "@pnp/queryable";

/**
 * Outlook
 */
export class _Outlook extends _GraphInstance<IOutlookType> {

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
export class _OutlookCategory extends _GraphInstance<IOutlookCategoryType> { }
export interface IOutlookCategory extends _OutlookCategory, IUpdateable<IOutlookCategoryType>, IDeleteable { }
export const OutlookCategory = graphInvokableFactory<IOutlookCategory>(_OutlookCategory);

/**
 * Categories
 */
@defaultPath("masterCategories")
@getById(OutlookCategory)
@addable()
export class _MasterCategories extends _GraphCollection<IOutlookCategoryType[]> { }
export interface IMasterCategories extends _MasterCategories, IGetById<IOutlookCategory>, IAddable<IOutlookCategoryType> { }
export const MasterCategories = graphInvokableFactory<IMasterCategories>(_MasterCategories);

/**
 * MasterCategoryAddResult
 */
export interface IMasterCategoryAddResult {
    data: IOutlookCategoryType;
}
