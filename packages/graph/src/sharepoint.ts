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
    FieldValueSet as IFieldValueSet,
    ColumnLink as IColumnLink,
} from "@microsoft/microsoft-graph-types";
import {
    Drive,
    Drives,
    DriveItem,
} from "./onedrive";

export interface ISitesMethods {
    root: SPSite;
    getByServerRelativeUrl(hostName: string, relativeUrl?: string): SPSite;
}

export interface IItemMethods {
    root: SPSite;
    getById(id: string): SPSite;
}

/**
 * Represents a Sites entity
 */
@defaultPath("sites")
export class Sites extends GraphQueryableInstance<ISite> implements ISitesMethods {

    public get root(): SPSite {
        return new SPSite(this, "root");
    }

    /**
     * Gets a Site instance by id
     * 
     * @param id Site id
     */
    public getByServerRelativeUrl(hostName: string, relativeUrl?: string): SPSite {
        let siteUrl = hostName;
        if (relativeUrl) {
            siteUrl += `:${relativeUrl}:`; 
        }

        return new SPSite(this, siteUrl);
    }
}

export class SPSite extends GraphQueryableInstance<ISite> {

    public get columns(): Columns {
        return new Columns(this);
    }

    public get contentTypes(): SPContentTypes {
        return new SPContentTypes(this);
    }

    public get drive(): Drive {
        return new Drive(this);
    }

    public get drives(): Drives {
        return new Drives(this);
    }

    public get lists(): SPLists {
        return new SPLists(this);
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
export class SPContentTypes extends GraphQueryableCollection<IContentType[]> {

    /**
     * Gets a Content Type instance by id
     * 
     * @param id Content Type id
     */
    public getById(id: string): SPContentType {
        return new SPContentType(this, id);
    }

}

export class SPContentType extends GraphQueryableInstance<IContentType> {

}

/**
 * Describes a collection of Column definitions objects
 *
 */
@defaultPath("columns")
export class Columns extends GraphQueryableCollection<IColumnDefinition[]> {
    /**
     * Gets a Column instance by id
     * 
     * @param id Column id
     */
    public getById(id: string): Column {
        return new Column(this, id);
    }
}

export class Column extends GraphQueryableInstance<IColumnDefinition> {

    public get columnLinks(): ColumnLinks {
        return new ColumnLinks(this);
    }
}

@defaultPath("columnlinks")
export class ColumnLinks extends GraphQueryableCollection<IColumnLink[]> {
    /**
     * Gets a Column link instance by id
     * 
     * @param id Column link id
     */
    public getById(id: string): ColumnLink {
        return new ColumnLink(this, id);
    }
}

export class ColumnLink extends GraphQueryableInstance<IColumnLink> { }

/**
* Describes a collection of Column definitions objects
*/
@defaultPath("lists")
export class SPLists extends GraphQueryableCollection<IList[]> {
    /**
     * Gets a List instance by id
     * 
     * @param id List id
     */
    public getById(id: string): SPList {
        return new SPList(this, id);
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
                list: new SPList(this, r.id),
            };
        });
    }
}

export class SPList extends GraphQueryableInstance<IList> {

    public get columns(): Columns {
        return new Columns(this);
    }

    public get contentTypes(): SPContentTypes {
        return new SPContentTypes(this);
    }

    public get drive(): Drive {
        return new Drive(this);
    }

    public get items(): SPItems {
        return new SPItems(this);
    }

}

@defaultPath("items")
export class SPItems extends GraphQueryableCollection<IListItem[]> {
    /**
     * Gets a List Item instance by id
     * 
     * @param id List item id
     */
    public getById(id: string): SPItem {
        return new SPItem(this, id);
    }

    /**
    * Create a new Item
    * @param displayName The display name of the List
    * @param list List information. Which template, if hidden, and contentTypesEnabled.
    * @param additionalProperties A plain object collection of additional properties you want to set in list
    * 
    * */
    public create(fields: IFieldValueSet): Promise<IItemCreationResult> {

        const postBody = {
            fields: fields,
        };

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                item: new SPItem(this, r.id),
            };
        });
    }
}

export class SPItem extends GraphQueryableInstance<IListItem> {

    public get driveItem(): DriveItem {
        return new DriveItem(this);
    }

    public get fields(): SPFields {
        return new SPFields(this);
    }

    public get versions(): Versions {
        return new Versions(this);
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

@defaultPath("fields")
export class SPFields extends GraphQueryableCollection<IFieldValueSet[]> { }

@defaultPath("versions")
export class Versions extends GraphQueryableCollection<IListItemVersion[]> {

    /**
    * Gets a Version instance by id
    * 
    * @param id Version id
    */
    public getById(id: string): Version {
        return new Version(this, id);
    }
}

export class Version extends GraphQueryableInstance<IListItemVersion> { }

export interface IListCreationResult {
    data: IList;
    list: SPList;
}

export interface IItemCreationResult {
    data: IListItem;
    item: SPItem;
}
