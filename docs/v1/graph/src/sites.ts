import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { jsS, TypedHash, extend } from "@pnp/common";
import {
    Site as ISite,
    List as IList,
    ListItem as IListItem,
    ListItemVersion as IListItemVersion,
    ContentType as IContentType,
    ColumnDefinition as IColumnDefinition,
    ListInfo as IListInfo,
    ColumnLink as IColumnLink,
} from "@microsoft/microsoft-graph-types";
import {
    Drive,
    Drives,
    DriveItem,
} from "./onedrive";

export interface ISitesMethods {
    root: GraphSite;
    getById(baseUrl: string, relativeUrl?: string): GraphSite;
}

/**
 * Represents a Sites entity
 */
@defaultPath("sites")
export class Sites extends GraphQueryableInstance<ISite> implements ISitesMethods {

    /**
     * Gets the root site collection of the tenant
     */
    public get root(): GraphSite {
        return new GraphSite(this, "root");
    }

    /**
     * Gets a Site instance by id
     * 
     * @param baseUrl Base url ex: contoso.sharepoint.com
     * @param relativeUrl Optional relative url ex: /sites/site
     */
    public getById(baseUrl: string, relativeUrl?: string): GraphSite {
        let siteUrl = baseUrl;

        // If a relative URL combine url with : at the right places
        if (relativeUrl) {
            siteUrl = this._urlCombine(baseUrl, relativeUrl);
        }

        return new GraphSite(this, siteUrl);
    }

    /**
     * Method to make sure the url is encoded as it should with :
     * 
     */
    private _urlCombine(baseUrl: string, relativeUrl: string): string {
        // remove last '/' of base if exists
        if (baseUrl.lastIndexOf("/") === baseUrl.length - 1) {
            baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }

        // remove '/' at 0
        if (relativeUrl.charAt(0) === "/") {
            relativeUrl = relativeUrl.substring(1, relativeUrl.length);
        }

        // remove last '/' of next if exists
        if (relativeUrl.lastIndexOf("/") === relativeUrl.length - 1) {
            relativeUrl = relativeUrl.substring(0, relativeUrl.length - 1);
        }

        return `${baseUrl}:/${relativeUrl}:`;
    }
}

/**
 * Describes a Site object
 *
 */
export class GraphSite extends GraphQueryableInstance<ISite> {

    public get columns(): GraphColumns {
        return new GraphColumns(this);
    }

    public get contentTypes(): GraphContentTypes {
        return new GraphContentTypes(this);
    }

    public get drive(): Drive {
        return new Drive(this);
    }

    public get drives(): Drives {
        return new Drives(this);
    }

    public get lists(): GraphLists {
        return new GraphLists(this);
    }

    public get sites(): Sites {
        return new Sites(this);
    }
}

/**
* Describes a collection of Content Type objects
*
*/
@defaultPath("contenttypes")
export class GraphContentTypes extends GraphQueryableCollection<IContentType[]> {

    /**
     * Gets a Content Type instance by id
     * 
     * @param id Content Type id
     */
    public getById(id: string): GraphContentType {
        return new GraphContentType(this, id);
    }

}

/**
 * Describes a Content Type object
 *
 */
export class GraphContentType extends GraphQueryableInstance<IContentType> {

}

/**
 * Describes a collection of Column Definition objects
 *
 */
@defaultPath("columns")
export class GraphColumns extends GraphQueryableCollection<IColumnDefinition[]> {
    /**
     * Gets a Column instance by id
     * 
     * @param id Column id
     */
    public getById(id: string): GraphColumn {
        return new GraphColumn(this, id);
    }
}

/**
 * Describes a Column Definition object
 *
 */
export class GraphColumn extends GraphQueryableInstance<IColumnDefinition> {

    public get columnLinks(): GraphColumnLinks {
        return new GraphColumnLinks(this);
    }
}

/**
 * Describes a collection of Column Link objects
 *
 */
@defaultPath("columnlinks")
export class GraphColumnLinks extends GraphQueryableCollection<IColumnLink[]> {
    /**
     * Gets a Column Link instance by id
     * 
     * @param id Column link id
     */
    public getById(id: string): GraphColumnLink {
        return new GraphColumnLink(this, id);
    }
}

/**
 * Describes a Column Link object
 *
 */
export class GraphColumnLink extends GraphQueryableInstance<IColumnLink> { }

/**
* Describes a collection of Column definitions objects
*/
@defaultPath("lists")
export class GraphLists extends GraphQueryableCollection<IList[]> {
    /**
     * Gets a List instance by id
     * 
     * @param id List id
     */
    public getById(id: string): GraphList {
        return new GraphList(this, id);
    }

    /**
    * Create a new List
    * @param displayName The display name of the List
    * @param list List information. Which template, if hidden, and contentTypesEnabled.
    * @param additionalProperties A plain object collection of additional properties you want to set in list
    * 
    * */
    public create(displayName: string, list: IListInfo, additionalProperties: TypedHash<any> = {}): Promise<IListCreationResult> {

        const postBody = extend({
            displayName: displayName,
            list: list,
        }, additionalProperties);

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                list: new GraphList(this, r.id),
            };
        });
    }
}

/**
 * Describes a List object
 *
 */
export class GraphList extends GraphQueryableInstance<IList> {

    public get columns(): GraphColumns {
        return new GraphColumns(this);
    }

    public get contentTypes(): GraphContentTypes {
        return new GraphContentTypes(this);
    }

    public get drive(): Drive {
        return new Drive(this);
    }

    public get items(): GraphItems {
        return new GraphItems(this);
    }

}

/**
* Describes a collection of Item objects
*/
@defaultPath("items")
export class GraphItems extends GraphQueryableCollection<IListItem[]> {
    /**
     * Gets a List Item instance by id
     * 
     * @param id List item id
     */
    public getById(id: string): GraphItem {
        return new GraphItem(this, id);
    }

    /**
    * Create a new Item
    * @param displayName The display name of the List
    * @param list List information. Which template, if hidden, and contentTypesEnabled.
    * @param additionalProperties A plain object collection of additional properties you want to set in list
    * 
    * */
    public create(fields: TypedHash<any>): Promise<IItemCreationResult> {

        const postBody = {
            fields: fields,
        };

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                item: new GraphItem(this, r.id),
            };
        });
    }
}

/**
 * Describes an Item object
 *
 */
export class GraphItem extends GraphQueryableInstance<IListItem> {

    public get driveItem(): DriveItem {
        return new DriveItem(this);
    }

    public get fields(): GraphFields {
        return new GraphFields(this);
    }

    public get versions(): GraphVersions {
        return new GraphVersions(this);
    }

    /**
     * Deletes this item
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a item object
     * 
     * @param properties Set of properties of this item to update
     */
    public update(properties: IListItem): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }

}

/**
 * Describes a collection of Field objects
 *
 */
@defaultPath("fields")
export class GraphFields extends GraphQueryableCollection<any[]> { }

/**
 * Describes a collection of Version objects
 *
 */
@defaultPath("versions")
export class GraphVersions extends GraphQueryableCollection<IListItemVersion[]> {

    /**
    * Gets a Version instance by id
    * 
    * @param id Version id
    */
    public getById(id: string): Version {
        return new Version(this, id);
    }
}

/**
 * Describes a Version object
 *
 */
export class Version extends GraphQueryableInstance<IListItemVersion> { }

export interface IListCreationResult {
    data: IList;
    list: GraphList;
}

export interface IItemCreationResult {
    data: IListItem;
    item: GraphItem;
}
