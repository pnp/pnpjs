import { TypedHash } from "@pnp/common";
import { IInvokable, body } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    ISharePointQueryableInstance,
    ISharePointQueryableCollection,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { metadata } from "../utils/metadata";
import { defaultPath, IDeleteable, deleteable, clientTagMethod } from "../decorators";
import { spPost } from "../operations";

@defaultPath("views")
export class _Views extends _SharePointQueryableCollection implements _IViews {

    public getById(id: string): IView {
        return View(this).concat(`('${id}')`);
    }

    public getByTitle(title: string): IView {
        return View(this, `getByTitle('${title}')`);
    }

    @clientTagMethod("vs.add")
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

/**
 * Describes the views available in the current context
 *
 */
export interface _IViews {
    /**	  
     * Gets a view by guid id	    
     *	   
     * @param id The GUID id of the view	    
     */
    getById(id: string): IView;

    /**
     * Gets a view by title (case-sensitive)
     *
     * @param title The case-sensitive title of the view
     */
    getByTitle(title: string): IView;

    /**
     * Adds a new view to the collection
     *
     * @param title The new views's title
     * @param personalView True if this is a personal view, otherwise false, default = false
     * @param additionalSettings Will be passed as part of the view creation body
     */
    add(title: string, personalView?: boolean, additionalSettings?: TypedHash<any>): Promise<IViewAddResult>;
}

export interface IViews extends _IViews, IInvokable, ISharePointQueryableCollection { }
export const Views = spInvokableFactory<IViews>(_Views);

@deleteable("vw")
export class _View extends _SharePointQueryableInstance implements _IView {

    public get fields(): IViewFields {
        return ViewFields(this);
    }

    public update: any = this._update<IViewUpdateResult, TypedHash<any>>("SP.View", data => ({ data, view: <any>this }));

    @clientTagMethod("v.renderAsHtml")
    public renderAsHtml(): Promise<string> {
        return this.clone(View, "renderashtml")();
    }

    @clientTagMethod("v.setViewXml")
    public setViewXml(viewXml: string): Promise<void> {
        return spPost(this.clone(View, "SetViewXml"), body({ viewXml }));
    }
}

/**
 * Describes a single View instance
 *
 */
export interface _IView {

    readonly fields: IViewFields;

    /**
     * Updates this view intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the view
     */
    update(props: TypedHash<any>): Promise<IViewUpdateResult>;

    /**
     * Returns the list view as HTML.
     *
     */
    renderAsHtml(): Promise<string>;

    /**
     * Sets the view schema
     * 
     * @param viewXml The view XML to set
     */
    setViewXml(viewXml: string): Promise<void>;
}

export interface IView extends _IView, IInvokable, ISharePointQueryableInstance, IDeleteable { }
export const View = spInvokableFactory<IView>(_View);

@defaultPath("viewfields")
export class _ViewFields extends _SharePointQueryableCollection implements _IViewFields {

    @clientTagMethod("vfs.getSchemaXml")
    public getSchemaXml(): Promise<string> {
        return this.clone(ViewFields, "schemaxml")();
    }

    @clientTagMethod("vfs.add")
    public add(fieldTitleOrInternalName: string): Promise<void> {
        return spPost(this.clone(ViewFields, `addviewfield('${fieldTitleOrInternalName}')`));
    }

    @clientTagMethod("vfs.move")
    public move(field: string, index: number): Promise<void> {
        return spPost(this.clone(ViewFields, "moveviewfieldto"), body({ field, index }));
    }

    @clientTagMethod("vfs.removeAll")
    public removeAll(): Promise<void> {
        return spPost(this.clone(ViewFields, "removeallviewfields"));
    }

    @clientTagMethod("vfs.remove")
    public remove(fieldInternalName: string): Promise<void> {
        return spPost(this.clone(ViewFields, `removeviewfield('${fieldInternalName}')`));
    }
}

export interface _IViewFields {

    /**
     * Gets a value that specifies the XML schema that represents the collection.
     */
    getSchemaXml(): Promise<string>;

    /**
     * Adds the field with the specified field internal name or display name to the collection.
     *
     * @param fieldTitleOrInternalName The case-sensitive internal name or display name of the field to add.
     */
    add(fieldTitleOrInternalName: string): Promise<void>;

    /**
     * Moves the field with the specified field internal name to the specified position in the collection.
     *
     * @param field The case-sensitive internal name of the field to move.
     * @param index The zero-based index of the new position for the field.
     */
    move(fieldInternalName: string, index: number): Promise<void>;

    /**
     * Removes all the fields from the collection.
     */
    removeAll(): Promise<void>;

    /**
     * Removes the field with the specified field internal name from the collection.
     *
     * @param fieldInternalName The case-sensitive internal name of the field to remove from the view.
     */
    remove(fieldInternalName: string): Promise<void>;
}

export interface IViewFields extends _IViewFields, IInvokable, ISharePointQueryableCollection { }
export const ViewFields = spInvokableFactory<IViewFields>(_ViewFields);

export interface IViewAddResult {
    view: IView;
    data: any;
}

export interface IViewUpdateResult {
    view: IView;
    data: any;
}
