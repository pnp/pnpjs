import { _SharePointQueryable, ISharePointQueryable } from "../sharepointqueryable";
import { extractWebUrl } from "../utils/extractweburl";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { body } from "@pnp/odata";
import { tag } from "../telemetry";

@defaultPath("_api/SP.RelatedItemManager")
export class _RelatedItemManager extends _SharePointQueryable implements IRelatedItemManager {

    @tag("rim.getRelatedItems")
    public getRelatedItems(sourceListName: string, sourceItemId: number): Promise<IRelatedItem[]> {

        const query = this.clone(<any>RelatedItemManager, null);
        query.concat(".GetRelatedItems");

        return spPost(query, body({
            SourceItemID: sourceItemId,
            SourceListName: sourceListName,
        }));
    }

    @tag("rim.getPageOneRelatedItems")
    public getPageOneRelatedItems(sourceListName: string, sourceItemId: number): Promise<IRelatedItem[]> {

        const query = this.clone(<any>RelatedItemManager, null);
        query.concat(".GetPageOneRelatedItems");

        return spPost(query, body({
            SourceItemID: sourceItemId,
            SourceListName: sourceListName,
        }));
    }

    @tag("rim.addSingleLink")
    public addSingleLink(sourceListName: string,
        sourceItemId: number,
        sourceWebUrl: string,
        targetListName: string,
        targetItemID: number,
        targetWebUrl: string,
        tryAddReverseLink = false): Promise<void> {

        const query = this.clone(<any>RelatedItemManager, null);
        query.concat(".AddSingleLink");

        return spPost(query, body({
            SourceItemID: sourceItemId,
            SourceListName: sourceListName,
            SourceWebUrl: sourceWebUrl,
            TargetItemID: targetItemID,
            TargetListName: targetListName,
            TargetWebUrl: targetWebUrl,
            TryAddReverseLink: tryAddReverseLink,
        }));
    }

    @tag("rim.ToUrl")
    public addSingleLinkToUrl(sourceListName: string, sourceItemId: number, targetItemUrl: string, tryAddReverseLink = false): Promise<void> {

        const query = this.clone(<any>RelatedItemManager, null);
        query.concat(".AddSingleLinkToUrl");

        return spPost(query, body({
            SourceItemID: sourceItemId,
            SourceListName: sourceListName,
            TargetItemUrl: targetItemUrl,
            TryAddReverseLink: tryAddReverseLink,
        }));
    }

    @tag("rim.FromUrl")
    public addSingleLinkFromUrl(sourceItemUrl: string, targetListName: string, targetItemId: number, tryAddReverseLink = false): Promise<void> {

        const query = this.clone(<any>RelatedItemManager, null);
        query.concat(".AddSingleLinkFromUrl");

        return spPost(query, body({
            SourceItemUrl: sourceItemUrl,
            TargetItemID: targetItemId,
            TargetListName: targetListName,
            TryAddReverseLink: tryAddReverseLink,
        }));
    }

    @tag("rim.deleteSingleLink")
    public deleteSingleLink(sourceListName: string,
        sourceItemId: number,
        sourceWebUrl: string,
        targetListName: string,
        targetItemId: number,
        targetWebUrl: string,
        tryDeleteReverseLink = false): Promise<void> {

        const query = this.clone(<any>RelatedItemManager, null);
        query.concat(".DeleteSingleLink");

        return spPost(query, body({
            SourceItemID: sourceItemId,
            SourceListName: sourceListName,
            SourceWebUrl: sourceWebUrl,
            TargetItemID: targetItemId,
            TargetListName: targetListName,
            TargetWebUrl: targetWebUrl,
            TryDeleteReverseLink: tryDeleteReverseLink,
        }));
    }
}

export interface IRelatedItemManager {

    /**
     * Gets all the related items for the given item specification
     * 
     * @param sourceListName The list name or list id
     * @param sourceItemId The item id
     */
    getRelatedItems(sourceListName: string, sourceItemId: number): Promise<IRelatedItem[]>;

    /**
     * Gets the first page of related items for the given item specification
     * 
     * @param sourceListName The list name or list id
     * @param sourceItemId The item id
     */
    getPageOneRelatedItems(sourceListName: string, sourceItemId: number): Promise<IRelatedItem[]>;

    /**
     * Adds a single link using full specifications for source and target
     * 
     * @param sourceListName The source list name or list id
     * @param sourceItemId The source item id
     * @param sourceWebUrl The source web absolute url
     * @param targetListName The target list name or list id
     * @param targetItemID The target item id
     * @param targetWebUrl The target web absolute url
     * @param tryAddReverseLink If set to true try to add the reverse link (will not return error if it fails)
     */
    addSingleLink(sourceListName: string,
        sourceItemId: number,
        sourceWebUrl: string,
        targetListName: string,
        targetItemID: number,
        targetWebUrl: string,
        tryAddReverseLink?: boolean): Promise<void>;

    /**
     * Adds a related item link from an item specified by list name and item id, to an item specified by url
     *
     * @param sourceListName The source list name or list id
     * @param sourceItemId The source item id
     * @param targetItemUrl The target item url
     * @param tryAddReverseLink If set to true try to add the reverse link (will not return error if it fails)
     */
    addSingleLinkToUrl(sourceListName: string, sourceItemId: number, targetItemUrl: string, tryAddReverseLink?: boolean): Promise<void>;

    /**
     * Adds a related item link from an item specified by url, to an item specified by list name and item id
     *
     * @param sourceItemUrl The source item url
     * @param targetListName The target list name or list id
     * @param targetItemId The target item id
     * @param tryAddReverseLink If set to true try to add the reverse link (will not return error if it fails)
     */
    addSingleLinkFromUrl(sourceItemUrl: string, targetListName: string, targetItemId: number, tryAddReverseLink?: boolean): Promise<void>;

    /**
     * Deletes a single link
     * 
     * @param sourceListName 
     * @param sourceItemId 
     * @param sourceWebUrl 
     * @param targetListName 
     * @param targetItemId 
     * @param targetWebUrl 
     * @param tryDeleteReverseLink 
     */
    deleteSingleLink(sourceListName: string,
        sourceItemId: number,
        sourceWebUrl: string,
        targetListName: string,
        targetItemId: number,
        targetWebUrl: string,
        tryDeleteReverseLink?: boolean): Promise<void>;
}

export const RelatedItemManager = (url: string | ISharePointQueryable): IRelatedItemManager => new _RelatedItemManager(extractWebUrl(typeof url === "string" ? url : url.toUrl()));

export interface IRelatedItem {
    ListId: string;
    ItemId: number;
    Url: string;
    Title: string;
    WebId: string;
    IconUrl: string;
}
