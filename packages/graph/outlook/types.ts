import { _GraphQueryableCollection, _GraphQueryableInstance, graphInvokableFactory } from "@pnp/graph/graphqueryable";
import { OutlookUser as IOutlookType, OutlookCategory as IOutlookCategoryType } from "@microsoft/microsoft-graph-types";
import { defaultPath } from "@pnp/graph/decorators";
import { graphPost } from "@pnp/graph";
import { body } from "@pnp/odata";

/**
 * Calendar
 */
export class _Outlook extends _GraphQueryableInstance<IOutlookType> {

    public get masterCategories(): IMasterCategories {
        return MasterCategories(this);
    }
}
export interface IOutlook extends _Outlook {}
export const Outlook = graphInvokableFactory<IOutlook>(_Outlook);

/**
 * Categories
 */
@defaultPath("masterCategories")
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
export interface IMasterCategories extends _MasterCategories { }
export const MasterCategories = graphInvokableFactory<IMasterCategories>(_MasterCategories);

/**
 * MasterCategoryAddResult
 */
export interface IMasterCategoryAddResult {
    data: IOutlookCategoryType;
}
