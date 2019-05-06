import { _SharePointQueryable } from "../sharepointqueryable";
import { extractWebUrl } from "../utils/extractweburl";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { body } from "@pnp/odata";

@defaultPath("_api/SP.RelatedItemManager")
export class _RelatedItemManager extends _SharePointQueryable implements IRelatedItemManager {

    public getRelatedItems(sourceListName: string, sourceItemId: number): Promise<IRelatedItem[]> {

        const query = this.clone(<any>RelatedItemManager, null);
        query.concat(".GetRelatedItems");

        return spPost(query, body({
            SourceItemID: sourceItemId,
            SourceListName: sourceListName,
        }));
    }

    public getPageOneRelatedItems(sourceListName: string, sourceItemId: number): Promise<IRelatedItem[]> {

        const query = this.clone(<any>RelatedItemManager, null);
        query.concat(".GetPageOneRelatedItems");

        return spPost(query, body({
            SourceItemID: sourceItemId,
            SourceListName: sourceListName,
        }));
    }

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

    /**
     * Adds a related item link from an item specified by url, to an item specified by list name and item id
     *
     * @param sourceItemUrl The source item url
     * @param targetListName The target list name or list id
     * @param targetItemId The target item id
     * @param tryAddReverseLink If set to true try to add the reverse link (will not return error if it fails)
     */
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

    getRelatedItems(sourceListName: string, sourceItemId: number): Promise<IRelatedItem[]>;

    getPageOneRelatedItems(sourceListName: string, sourceItemId: number): Promise<IRelatedItem[]>;

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

    deleteSingleLink(sourceListName: string,
        sourceItemId: number,
        sourceWebUrl: string,
        targetListName: string,
        targetItemId: number,
        targetWebUrl: string,
        tryDeleteReverseLink?: boolean): Promise<void>;
}

export const RelatedItemManager = (url: string): IRelatedItemManager => new _RelatedItemManager(extractWebUrl(url));

export interface IRelatedItem {
    ListId: string;
    ItemId: number;
    Url: string;
    Title: string;
    WebId: string;
    IconUrl: string;
}
