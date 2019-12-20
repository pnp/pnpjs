import { ITypedHash } from "@pnp/common";
import { body } from "@pnp/odata";
import {
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
    IDeleteable,
    deleteable,
} from "../sharepointqueryable";
import { metadata } from "../utils/metadata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { tag } from "../telemetry";

@defaultPath("views")
export class _Views extends _SharePointQueryableCollection<IViewInfo[]> {

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
    @tag("vs.add")
    public async add(title: string, personalView = false, additionalSettings: ITypedHash<any> = {}): Promise<IViewAddResult> {

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
export interface IViews extends _Views { }
export const Views = spInvokableFactory<IViews>(_Views);

export class _View extends _SharePointQueryableInstance<IViewInfo> {

    public delete = deleteable("vw");

    public get fields(): IViewFields {
        return ViewFields(this);
    }

    /**
     * Updates this view intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the view
     */
    public update: any = this._update<IViewUpdateResult, ITypedHash<any>>("SP.View", data => ({ data, view: <any>this }));

    /**
     * Returns the list view as HTML.
     *
     */
    @tag("v.renderAsHtml")
    public renderAsHtml(): Promise<string> {
        return this.clone(View, "renderashtml")();
    }

    /**
     * Sets the view schema
     * 
     * @param viewXml The view XML to set
     */
    @tag("v.setViewXml")
    public setViewXml(viewXml: string): Promise<void> {
        return spPost(this.clone(View, "SetViewXml"), body({ viewXml }));
    }
}
export interface IView extends _View, IDeleteable { }
export const View = spInvokableFactory<IView>(_View);

@defaultPath("viewfields")
export class _ViewFields extends _SharePointQueryableCollection<{ SchemaXml: string; }> {

    /**
     * Gets a value that specifies the XML schema that represents the collection.
     */
    @tag("vfs.getSchemaXml")
    public getSchemaXml(): Promise<string> {
        return this.clone(ViewFields, "schemaxml")();
    }

    /**
     * Adds the field with the specified field internal name or display name to the collection.
     *
     * @param fieldTitleOrInternalName The case-sensitive internal name or display name of the field to add.
     */
    @tag("vfs.add")
    public add(fieldTitleOrInternalName: string): Promise<void> {
        return spPost(this.clone(ViewFields, `addviewfield('${fieldTitleOrInternalName}')`));
    }

    /**
     * Moves the field with the specified field internal name to the specified position in the collection.
     *
     * @param field The case-sensitive internal name of the field to move.
     * @param index The zero-based index of the new position for the field.
     */
    @tag("vfs.move")
    public move(field: string, index: number): Promise<void> {
        return spPost(this.clone(ViewFields, "moveviewfieldto"), body({ field, index }));
    }

    /**
     * Removes all the fields from the collection.
     */
    @tag("vfs.removeAll")
    public removeAll(): Promise<void> {
        return spPost(this.clone(ViewFields, "removeallviewfields"));
    }

    /**
     * Removes the field with the specified field internal name from the collection.
     *
     * @param fieldInternalName The case-sensitive internal name of the field to remove from the view.
     */
    @tag("vfs.remove")
    public remove(fieldInternalName: string): Promise<void> {
        return spPost(this.clone(ViewFields, `removeviewfield('${fieldInternalName}')`));
    }
}
export interface IViewFields extends _ViewFields { }
export const ViewFields = spInvokableFactory<IViewFields>(_ViewFields);

export interface IViewAddResult {
    view: IView;
    data: IViewInfo;
}

export interface IViewUpdateResult {
    view: IView;
    data: IViewInfo;
}

export enum ViewScope {
    DefaultValue,
    Recursive,
    RecursiveAll,
    FilesOnly,
}

export interface IViewInfo {
    EditorModified: boolean;
    Formats: string | null;
    Hidden: boolean;
    HtmlSchemaXml: string;
    Id: string;
    ImageUrl: string;
    IncludeRootFolder: boolean;
    JSLink: string;
    ListViewXml: string;
    Method: string | null;
    MobileDefaultView: boolean;
    MobileView: boolean;
    ModerationType: string | null;
    NewDocumentTemplates: string;
    OrderedView: boolean;
    Paged: boolean;
    PersonalView: boolean;
    ReadOnlyView: boolean;
    RequiresClientIntegration: boolean;
    RowLimit: number;
    Scope: ViewScope;
    ServerRelativePath: { DecodedUrl: string; };
    ServerRelativeUrl: string;
    StyleId: string | null;
    TabularView: boolean;
    Threaded: boolean;
    Title: string;
    Toolbar: string;
    ToolbarTemplateName: string | null;
    ViewData: string | null;
    ViewJoins: string | null;
    ViewProjectedFields: { SchemaXml: string } | null;
    ViewQuery: string;
    ViewType: string;
    VisualizationInfo: any | null;
}
