import { body } from "@pnp/queryable";
import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    deleteable,
    IDeleteable,
} from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { spPost, spPostMerge } from "../operations.js";
import { encodePath } from "../utils/encode-path-str.js";

@defaultPath("views")
export class _Views extends _SPCollection<IViewInfo[]> {

    /**
     * Adds a new view to the collection
     *
     * @param title The new views's title
     * @param personalView True if this is a personal view, otherwise false, default = false
     * @param additionalSettings Will be passed as part of the view creation body
     */
    public async add(Title: string, PersonalView = false, additionalSettings: Record<string, any> = {}): Promise<IViewAddResult> {

        const data = await spPost(this, body({
            PersonalView,
            Title,
            ...additionalSettings,
        }));

        return {
            data,
            view: this.getById(data.Id),
        };
    }

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
        return View(this, `getByTitle('${encodePath(title)}')`);
    }
}
export interface IViews extends _Views { }
export const Views = spInvokableFactory<IViews>(_Views);

export class _View extends _SPInstance<IViewInfo> {

    public delete = deleteable();

    public get fields(): IViewFields {
        return ViewFields(this);
    }

    /**
     * Updates this view intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the view
     */
    public async update(props: Partial<IViewInfo>): Promise<IViewUpdateResult> {

        const data = await spPostMerge(this, body(props));

        return {
            data,
            view: this,
        };
    }

    // : any = this._update<IViewUpdateResult, ITypedHash<any>>("SP.View", data => ({ data, view: <any>this }));

    /**
     * Returns the list view as HTML.
     *
     */
    public renderAsHtml(): Promise<string> {
        return View(this, "renderashtml")();
    }

    /**
     * Sets the view schema
     *
     * @param viewXml The view XML to set
     */
    public setViewXml(viewXml: string): Promise<void> {
        return spPost(View(this, "SetViewXml"), body({ viewXml }));
    }
}
export interface IView extends _View, IDeleteable { }
export const View = spInvokableFactory<IView>(_View);

@defaultPath("viewfields")
export class _ViewFields extends _SPCollection<{ Items: string[]; SchemaXml: string }> {

    /**
     * Gets a value that specifies the XML schema that represents the collection.
     */
    public getSchemaXml(): Promise<string> {
        return ViewFields(this, "schemaxml")();
    }

    /**
     * Adds the field with the specified field internal name or display name to the collection.
     *
     * @param fieldTitleOrInternalName The case-sensitive internal name or display name of the field to add.
     */
    public add(fieldTitleOrInternalName: string): Promise<void> {
        return spPost(ViewFields(this, `addviewfield('${encodePath(fieldTitleOrInternalName)}')`));
    }

    /**
     * Moves the field with the specified field internal name to the specified position in the collection.
     *
     * @param field The case-sensitive internal name of the field to move.
     * @param index The zero-based index of the new position for the field.
     */
    public move(field: string, index: number): Promise<void> {
        return spPost(ViewFields(this, "moveviewfieldto"), body({ field, index }));
    }

    /**
     * Removes all the fields from the collection.
     */
    public removeAll(): Promise<void> {
        return spPost(ViewFields(this, "removeallviewfields"));
    }

    /**
     * Removes the field with the specified field internal name from the collection.
     *
     * @param fieldInternalName The case-sensitive internal name of the field to remove from the view.
     */
    public remove(fieldInternalName: string): Promise<void> {
        return spPost(ViewFields(this, `removeviewfield('${encodePath(fieldInternalName)}')`));
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
    AssociatedContentTypeId: string | null;
    CalendarViewStyles: string | null;
    CustomFormatter: string | null;
    DefaultView: boolean;
    DefaultViewForContentType: boolean;
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
    ServerRelativePath: { DecodedUrl: string };
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
    ViewType2: "KANBAN" | "TILES" | "COMPACTLIST" | "MODERNCALENDAR" | null;
    VisualizationInfo: any | null;
}
