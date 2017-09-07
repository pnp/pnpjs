import { SharePointQueryable, SharePointQueryableCollection, SharePointQueryableInstance } from "./sharepointqueryable";
import { TypedHash } from "../collections/collections";
import { Util } from "../utils/util";

/**
 * Describes the views available in the current context
 *
 */
export class Views extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the Views class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "views") {
        super(baseUrl, path);
    }

    /**
     * Gets a view by guid id
     *
     * @param id The GUID id of the view
     */
    public getById(id: string): View {
        const v = new View(this);
        v.concat(`('${id}')`);
        return v;
    }

    /**
     * Gets a view by title (case-sensitive)
     *
     * @param title The case-sensitive title of the view
     */
    public getByTitle(title: string): View {
        return new View(this, `getByTitle('${title}')`);
    }

    /**
     * Adds a new view to the collection
     *
     * @param title The new views's title
     * @param personalView True if this is a personal view, otherwise false, default = false
     * @param additionalSettings Will be passed as part of the view creation body
     */
    public add(title: string, personalView = false, additionalSettings: TypedHash<any> = {}): Promise<ViewAddResult> {

        const postBody = JSON.stringify(Util.extend({
            "PersonalView": personalView,
            "Title": title,
            "__metadata": { "type": "SP.View" },
        }, additionalSettings));

        return this.clone(Views, null).postAsCore<{ Id: string }>({ body: postBody }).then((data) => {
            return {
                data: data,
                view: this.getById(data.Id),
            };
        });
    }
}


/**
 * Describes a single View instance
 *
 */
export class View extends SharePointQueryableInstance {

    public get fields(): ViewFields {
        return new ViewFields(this);
    }

    /**
     * Updates this view intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the view
     */
    public update(properties: TypedHash<any>): Promise<ViewUpdateResult> {

        const postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.View" },
        }, properties));

        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                view: this,
            };
        });
    }

    /**
     * Delete this view
     *
     */
    public delete(): Promise<void> {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Returns the list view as HTML.
     *
     */
    public renderAsHtml(): Promise<string> {
        return this.clone(SharePointQueryable, "renderashtml").get();
    }
}

export class ViewFields extends SharePointQueryableCollection {
    constructor(baseUrl: string | SharePointQueryable, path = "viewfields") {
        super(baseUrl, path);
    }

    /**
     * Gets a value that specifies the XML schema that represents the collection.
     */
    public getSchemaXml(): Promise<string> {
        return this.clone(SharePointQueryable, "schemaxml").get();
    }

    /**
     * Adds the field with the specified field internal name or display name to the collection.
     *
     * @param fieldTitleOrInternalName The case-sensitive internal name or display name of the field to add.
     */
    public add(fieldTitleOrInternalName: string): Promise<void> {
        return this.clone(ViewFields, `addviewfield('${fieldTitleOrInternalName}')`).postCore();
    }

    /**
     * Moves the field with the specified field internal name to the specified position in the collection.
     *
     * @param fieldInternalName The case-sensitive internal name of the field to move.
     * @param index The zero-based index of the new position for the field.
     */
    public move(fieldInternalName: string, index: number): Promise<void> {
        return this.clone(ViewFields, "moveviewfieldto").postCore({
            body: JSON.stringify({ "field": fieldInternalName, "index": index }),
        });
    }

    /**
     * Removes all the fields from the collection.
     */
    public removeAll(): Promise<void> {
        return this.clone(ViewFields, "removeallviewfields").postCore();
    }

    /**
     * Removes the field with the specified field internal name from the collection.
     *
     * @param fieldInternalName The case-sensitive internal name of the field to remove from the view.
     */
    public remove(fieldInternalName: string): Promise<void> {
        return this.clone(ViewFields, `removeviewfield('${fieldInternalName}')`).postCore();
    }
}

export interface ViewAddResult {
    view: View;
    data: any;
}

export interface ViewUpdateResult {
    view: View;
    data: any;
}

