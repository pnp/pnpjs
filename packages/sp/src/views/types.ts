import {
    _SharePointQueryableInstance,
    ISharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { TypedHash } from "@pnp/common";
import { metadata } from "../utils/metadata";
import { IInvokable, body } from "@pnp/odata";
import { defaultPath, IDeleteable, deleteable } from "../decorators";
import { spPost } from "../operations";

/**
 * Describes the views available in the current context
 *
 */
@defaultPath("views")
export class _Views extends _SharePointQueryableCollection implements IViews {

    /**	  
     * Gets a view by guid id	    
     *	   
     * @param id The GUID id of the view	    
     */
    public getById(id: string): IView {
        return View(this).concat(`('${id}')`);
    }

    /**
     * Gets a view by title (case-sensitive)
     *
     * @param title The case-sensitive title of the view
     */
    public getByTitle(title: string): IView {
        return View(this, `getByTitle('${title}')`);
    }

    /**
     * Adds a new view to the collection
     *
     * @param title The new views's title
     * @param personalView True if this is a personal view, otherwise false, default = false
     * @param additionalSettings Will be passed as part of the view creation body
     */
    public async add(title: string, personalView = false, additionalSettings: TypedHash<any> = {}): Promise<IViewAddResult> {

        const postBody = body(Object.assign(metadata("SP.View"), {
            "PersonalView": personalView,
            "Title": title,
        }, additionalSettings));

        const data = await spPost(this.clone(Views, null), postBody);

        return {
            data,
            view: this.getById(data.Id),
        };
    }
}

export interface IViews extends IInvokable, ISharePointQueryableCollection {
    getById(id: string): IView;
    getByTitle(title: string): IView;
    add(title: string, personalView?: boolean, additionalSettings?: TypedHash<any>): Promise<IViewAddResult>;
}
export interface _Views extends IInvokable { }
export const Views = spInvokableFactory<IViews>(_Views);

/**
 * Describes a single View instance
 *
 */
@deleteable()
export class _View extends _SharePointQueryableInstance implements IView {

    public get fields(): IViewFields {
        return ViewFields(this);
    }

    /**
     * Updates this view intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the view
     */
    public update: any = this._update<IViewUpdateResult, TypedHash<any>>("SP.View", data => ({ data, view: this }));

    /**
     * Returns the list view as HTML.
     *
     */
    public renderAsHtml(): Promise<string> {
        return this.clone(View, "renderashtml")();
    }

    /**
     * Sets the view schema
     * 
     * @param viewXml The view XML to set
     */
    public setViewXml(viewXml: string): Promise<void> {
        return spPost(this.clone(View, "SetViewXml"), body({ viewXml }));
    }
}

export interface IView extends IInvokable, ISharePointQueryableInstance, IDeleteable {
    readonly fields: IViewFields;
    update(props: TypedHash<any>): IViewUpdateResult;
    renderAsHtml(): Promise<string>;
    setViewXml(viewXml: string): Promise<void>;
}
export interface _View extends IInvokable, IDeleteable { }
export const View = spInvokableFactory<IView>(_View);

@defaultPath("viewfields")
export class _ViewFields extends _SharePointQueryableCollection implements IViewFields {
    /**
     * Gets a value that specifies the XML schema that represents the collection.
     */
    public getSchemaXml(): Promise<string> {
        return this.clone(ViewFields, "schemaxml")();
    }

    /**
     * Adds the field with the specified field internal name or display name to the collection.
     *
     * @param fieldTitleOrInternalName The case-sensitive internal name or display name of the field to add.
     */
    public add(fieldTitleOrInternalName: string): Promise<void> {
        return spPost(this.clone(ViewFields, `addviewfield('${fieldTitleOrInternalName}')`));
    }

    /**
     * Moves the field with the specified field internal name to the specified position in the collection.
     *
     * @param field The case-sensitive internal name of the field to move.
     * @param index The zero-based index of the new position for the field.
     */
    public move(field: string, index: number): Promise<void> {
        return spPost(this.clone(ViewFields, "moveviewfieldto"), body({ field, index }));
    }

    /**
     * Removes all the fields from the collection.
     */
    public removeAll(): Promise<void> {
        return spPost(this.clone(ViewFields, "removeallviewfields"));
    }

    /**
     * Removes the field with the specified field internal name from the collection.
     *
     * @param fieldInternalName The case-sensitive internal name of the field to remove from the view.
     */
    public remove(fieldInternalName: string): Promise<void> {
        return spPost(this.clone(ViewFields, `removeviewfield('${fieldInternalName}')`));
    }
}

export interface IViewFields extends IInvokable, ISharePointQueryableCollection {
    getSchemaXml(): Promise<string>;
    add(fieldTitleOrInternalName: string): Promise<void>;
    move(fieldInternalName: string, index: number): Promise<void>;
    removeAll(): Promise<void>;
    remove(fieldInternalName: string): Promise<void>;
}
export interface _ViewFields extends IInvokable { }
export const ViewFields = spInvokableFactory<IViewFields>(_ViewFields);

export interface IViewAddResult {
    view: IView;
    data: any;
}

export interface IViewUpdateResult {
    view: IView;
    data: any;
}
