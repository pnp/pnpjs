import { GraphQueryableInstance, GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { Drive as IDrive } from "@microsoft/microsoft-graph-types";
import { jsS, TypedHash, extend } from "@pnp/common";

export interface IDriveItemsMethods {
    getById(id: string): DriveItem;
}

/**
 * Describes a collection of Drive objects
 *
 */
@defaultPath("drives")
export class Drives extends GraphQueryableCollection<IDrive[]> {

    /**
     * Gets a Drive instance by id
     * 
     * @param id Drive id
     */
    public getById(id: string): Drive {
        return new Drive(this, id);
    }
}

/**
 * Describes a Drive instance
 *
 */
@defaultPath("drive")
export class Drive extends GraphQueryableInstance<IDrive> {

    public get root(): Root {
        return new Root(this);
    }

    public get items(): IDriveItemsMethods {
        return new DriveItems(this);
    }

    public get list(): DriveList {
        return new DriveList(this);
    }

    public get recent(): Recent {
        return new Recent(this);
    }

    public get sharedWithMe(): SharedWithMe {
        return new SharedWithMe(this);
    }

}

/**
 * Describes a Root instance
 *
 */
@defaultPath("root")
export class Root extends GraphQueryableInstance<IDrive> {

    public get children(): Children {
        return new Children(this);
    }

    public search(query: string): DriveSearch {
        return new DriveSearch(this, `search(q='${query}')`);
    }
}

/**
 * Describes a collection of Drive Item objects
 *
 */
@defaultPath("items")
export class DriveItems extends GraphQueryableCollection implements IDriveItemsMethods {
    /**
     * Gets a Drive Item instance by id
     * 
     * @param id Drive Item id
     */
    public getById(id: string): DriveItem {
        return new DriveItem(this, id);
    }
}

/**
 * Describes a Drive Item instance
 *
 */
export class DriveItem extends GraphQueryableInstance<any> {

    public get children(): Children {
        return new Children(this);
    }

    public get thumbnails(): Thumbnails {
        return new Thumbnails(this);
    }

    /**
     * Deletes this Drive Item
     */
    public delete(): Promise<void> {
        return this.deleteCore();
    }

    /**
     * Update the properties of a Drive item
     * 
     * @param properties Set of properties of this Drive Item to update
     */
    public update(properties: TypedHash<string | number | boolean | string[]>): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }

    /**
     * Move the Drive item and optionally update the properties
     * 
     * @param parentReference Should contain Id of new parent folder
     * @param properties Optional set of properties of this Drive Item to update
     */
    public move(parentReference: TypedHash<any>, properties?: TypedHash<string | number | boolean | string[]>): Promise<void> {
        let patchBody = extend({
        }, parentReference);

        if (properties) {
            patchBody = extend({
            }, properties);
        }

        return this.patchCore({
            body: jsS(patchBody),
        });
    }
}

/**
 * Return a collection of DriveItems in the children relationship of a DriveItem
 *
 */
@defaultPath("children")
export class Children extends GraphQueryableCollection {
    /**
    * Create a new folder or DriveItem in a Drive with a specified parent item or path
    * Currently only Folder or File works
    * @param name The name of the Drive Item.
    * @param properties Type of Drive Item to create.
    * */
    public add(name: string, driveItemType: any): Promise<IDriveItemAddResult> {

        const postBody = extend({
            name: name,
        }, driveItemType);

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
                driveItem: new DriveItem(this, r.id),
            };
        });
    }
}

@defaultPath("list")
export class DriveList extends GraphQueryableCollection { }

@defaultPath("recent")
export class Recent extends GraphQueryableInstance { }

@defaultPath("sharedWithMe")
export class SharedWithMe extends GraphQueryableInstance { }

@defaultPath("search")
export class DriveSearch extends GraphQueryableInstance { }

@defaultPath("thumbnails")
export class Thumbnails extends GraphQueryableInstance { }

export interface IDriveItemAddResult {
    data: any;
    driveItem: DriveItem;
}
