import { assign, TypedHash, hOP } from "@pnp/common";
import { IInvokable, body, headers } from "@pnp/odata";
import {
    SharePointQueryable,
    SharePointQueryableCollection,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    ISharePointQueryable,
    spInvokableFactory,
} from "../sharepointqueryable";
import { IChangeQuery } from "../types";
import { odataUrlFrom } from "../odata";
import { metadata } from "../utils/metadata";
import { defaultPath, deleteableWithETag, IDeleteableWithETag, clientTagMethod } from "../decorators";
import { spPost } from "../operations";
import { escapeQueryStrValue } from "../utils/escapeSingleQuote";

@defaultPath("lists")
export class _Lists extends _SharePointQueryableCollection implements _ILists {

    public getById(id: string): IList {

        return clientTagMethod.configure(List(this).concat(`('${id}')`), "l.getById");
    }

    public getByTitle(title: string): IList {
        return clientTagMethod.configure(List(this, `getByTitle('${escapeQueryStrValue(title)}')`), "l.getByTitle");
    }

    @clientTagMethod("ls.add")
    public async add(title: string, desc = "", template = 100, enableContentTypes = false, additionalSettings: TypedHash<string | number | boolean> = {}): Promise<IListAddResult> {

        const addSettings = Object.assign({
            "AllowContentTypes": enableContentTypes,
            "BaseTemplate": template,
            "ContentTypesEnabled": enableContentTypes,
            "Description": desc,
            "Title": title,
        }, metadata("SP.List"), additionalSettings);

        const data = await spPost(this, body(addSettings));

        return { data, list: this.getByTitle(addSettings.Title) };
    }

    @clientTagMethod("ls.ensure")
    public async ensure(
        title: string,
        desc = "",
        template = 100,
        enableContentTypes = false,
        additionalSettings: TypedHash<string | number | boolean> = {}): Promise<IListEnsureResult> {

        if (this.hasBatch) {
            throw Error("The ensure list method is not supported for use in a batch.");
        }

        return new Promise((resolve, reject) => {

            const addOrUpdateSettings = assign(additionalSettings, { Title: title, Description: desc, ContentTypesEnabled: enableContentTypes }, true);

            const list: IList = this.getByTitle(addOrUpdateSettings.Title);

            list.get().then(_ => {

                list.update(addOrUpdateSettings).then(d => {
                    resolve({ created: false, data: d, list: this.getByTitle(addOrUpdateSettings.Title) });
                }).catch(e => reject(e));

            }).catch(_ => {

                this.add(title, desc, template, enableContentTypes, addOrUpdateSettings).then((r) => {
                    resolve({ created: true, data: r.data, list: this.getByTitle(addOrUpdateSettings.Title) });
                }).catch((e) => reject(e));
            });
        });
    }

    @clientTagMethod("ls.ensureSiteAssetsLibrary")
    public async ensureSiteAssetsLibrary(): Promise<IList> {
        const json = await spPost(this.clone(Lists, "ensuresiteassetslibrary"));
        return List(odataUrlFrom(json));
    }

    @clientTagMethod("ls.ensureSitePagesLibrary")
    public async ensureSitePagesLibrary(): Promise<IList> {
        const json = await spPost(this.clone(Lists, "ensuresitepageslibrary"));
        return List(odataUrlFrom(json));
    }
}

export interface _ILists {
    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the list (GUID)
     */
    getById(id: string): IList;

    /**
     * Gets a list from the collection by title
     *
     * @param title The title of the list
     */
    getByTitle(title: string): IList;

    /**
     * Adds a new list to the collection
     *
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body
     */
    add(title: string, description?: string, template?: number, enableContentTypes?: boolean, additionalSettings?: TypedHash<string | number | boolean>): Promise<IListAddResult>;

    /**
     * Ensures that the specified list exists in the collection (note: this method not supported for batching)
     *
     * @param title The new list's title
     * @param desc The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body or used to update an existing list
     */
    ensure(title: string, desc?: string, template?: number, enableContentTypes?: boolean, additionalSettings?: TypedHash<string | number | boolean>): Promise<IListEnsureResult>;

    /**
     * Gets a list that is the default asset location for images or other files, which the users upload to their wiki pages.
     */
    ensureSiteAssetsLibrary(): Promise<IList>;

    /**
     * Gets a list that is the default location for wiki pages.
     */
    ensureSitePagesLibrary(): Promise<IList>;
}

export interface ILists extends _ILists, IInvokable, ISharePointQueryableCollection { }

export const Lists = spInvokableFactory<ILists>(_Lists);

@deleteableWithETag("l")
export class _List extends _SharePointQueryableInstance implements _IList {

    public get effectiveBasePermissions(): ISharePointQueryable {
        return SharePointQueryable(this, "EffectiveBasePermissions");
    }

    public get eventReceivers(): ISharePointQueryableCollection {
        return SharePointQueryableCollection(this, "EventReceivers");
    }

    public get relatedFields(): ISharePointQueryable {
        return SharePointQueryable(this, "getRelatedFields");
    }

    public get informationRightsManagementSettings(): ISharePointQueryable {
        return SharePointQueryable(this, "InformationRightsManagementSettings");
    }

    @clientTagMethod("l.update")
    public async update(properties: TypedHash<string | number | boolean>, eTag = "*"): Promise<IListUpdateResult> {

        const postBody = body(assign({
            "__metadata": { "type": "SP.List" },
        }, properties), headers({
            "IF-Match": eTag,
            "X-HTTP-Method": "MERGE",
        }));

        const data = await spPost(this, postBody);

        let list: any = this;

        if (hOP(properties, "Title")) {
            list = this.getParent(_List, this.parentUrl, `getByTitle('${properties.Title}')`);
        }

        return {
            data,
            list,
        };
    }

    @clientTagMethod("l.getChanges")
    public getChanges(query: IChangeQuery): Promise<any> {

        return spPost(this.clone(List, "getchanges"), body({ query: assign({ "__metadata": { "type": "SP.ChangeQuery" } }, query) }));
    }

    @clientTagMethod("l.CAMLQuery")
    public getItemsByCAMLQuery(query: ICamlQuery, ...expands: string[]): Promise<any> {

        const q = this.clone(List, "getitems");
        return spPost(q.expand.apply(q, expands), body({ "query": assign({ "__metadata": { "type": "SP.CamlQuery" } }, query) }));
    }

    @clientTagMethod("l.ChangesSinceToken")
    public getListItemChangesSinceToken(query: IChangeLogItemQuery): Promise<string> {

        const o = this.clone(List, "getlistitemchangessincetoken").usingParser({ parse(r: Response) { return r.text(); } });
        return spPost(o, body({ "query": assign({ "__metadata": { "type": "SP.ChangeLogItemQuery" } }, query) }));
    }

    @clientTagMethod("l.recycle")
    public async recycle(): Promise<string> {
        const data = await spPost(this.clone(List, "recycle"));
        return hOP(data, "Recycle") ? data.Recycle : data;
    }

    @clientTagMethod("l.renderListData")
    public async renderListData(viewXml: string): Promise<IRenderListData> {

        const q = this.clone(List, "renderlistdata(@viewXml)");
        q.query.set("@viewXml", `'${viewXml}'`);
        const data = await spPost(q);

        // data will be a string, so we parse it again
        return JSON.parse(hOP(data, "RenderListData") ? data.RenderListData : data);
    }

    @clientTagMethod("l.AsStream")
    public renderListDataAsStream(parameters: IRenderListDataParameters, overrideParameters: any = null): Promise<any> {

        const postBody = body({
            overrideParameters: assign(metadata("SP.RenderListDataOverrideParameters"), overrideParameters),
            parameters: assign(metadata("SP.RenderListDataParameters"), parameters),
        });

        return spPost(this.clone(List, "RenderListDataAsStream", true), postBody);
    }

    @clientTagMethod("l.renderListFormData")
    public async renderListFormData(itemId: number, formId: string, mode: ControlMode): Promise<IListFormData> {
        const data = await spPost(this.clone(List, `renderlistformdata(itemid=${itemId}, formid='${formId}', mode='${mode}')`));
        // data will be a string, so we parse it again
        return JSON.parse(hOP(data, "RenderListFormData") ? data.RenderListFormData : data);
    }

    @clientTagMethod("l.reserveListItemId")
    public async reserveListItemId(): Promise<number> {
        const data = await spPost(this.clone(List, "reservelistitemid"));
        return hOP(data, "ReserveListItemId") ? data.ReserveListItemId : data;
    }

    @clientTagMethod("l.getListItemEntityTypeFullName")
    public getListItemEntityTypeFullName(): Promise<string> {
        return this.clone(List, null, false).select("ListItemEntityTypeFullName").get<{ ListItemEntityTypeFullName: string }>().then(o => o.ListItemEntityTypeFullName);
    }

    @clientTagMethod("l.addValidateUpdateItemUsingPath")
    public async addValidateUpdateItemUsingPath(
        formValues: IListItemFormUpdateValue[],
        decodedUrl: string,
        bNewDocumentUpdate = false,
        checkInComment?: string,
    ): Promise<IListItemFormUpdateValue[]> {

        const res = await spPost(this.clone(List, "AddValidateUpdateItemUsingPath()"), body({
            bNewDocumentUpdate,
            checkInComment,
            formValues,
            listItemCreateInfo: {
                FolderPath: {
                    DecodedUrl: decodedUrl,
                    __metadata: { type: "SP.ResourcePath" },
                },
                __metadata: { type: "SP.ListItemCreationInformationUsingPath" },
            },
        }));

        return hOP(res, "AddValidateUpdateItemUsingPath") ? res.AddValidateUpdateItemUsingPath : res;
    }
}

export interface _IList {

    /**
     * Gets the effective base permissions of this list
     *
     */
    readonly effectiveBasePermissions: ISharePointQueryable;

    /**
     * Gets the event receivers attached to this list
     *
     */
    readonly eventReceivers: ISharePointQueryableCollection;

    /**
     * Gets the related fields of this list
     *
     */
    readonly relatedFields: ISharePointQueryable;

    /**
     * Gets the IRM settings for this list
     *
     */
    readonly informationRightsManagementSettings: ISharePointQueryable;

    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    update(properties: TypedHash<string | number | boolean>, eTag?: string): Promise<IListUpdateResult>;

    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     * @param query A query that is performed against the change log.
     */
    getChanges(query: IChangeQuery): Promise<any>;

    /**
     * Returns the collection of items in the list based on the provided CamlQuery
     * @param query A query that is performed against the list
     * @param expands An expanded array of n items that contains fields to expand in the CamlQuery
     */
    getItemsByCAMLQuery(query: ICamlQuery, ...expands: string[]): Promise<any>;

    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     * @param query An object that defines the change log item query
     */
    getListItemChangesSinceToken(query: IChangeLogItemQuery): Promise<string>;

    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    recycle(): Promise<string>;

    /**
     * Renders list data based on the view xml provided
     * @param viewXml A string object representing a view xml
     */
    renderListData(viewXml: string): Promise<IRenderListData>;

    /**
     * Returns the data for the specified query view
     *
     * @param parameters The parameters to be used to render list data as JSON string.
     * @param overrideParameters The parameters that are used to override and extend the regular SPRenderListDataParameters.
     */
    renderListDataAsStream(parameters: IRenderListDataParameters, overrideParameters?: any): Promise<any>;

    /**
     * Gets the field values and field schema attributes for a list item.
     * @param itemId Item id of the item to render form data for
     * @param formId The id of the form
     * @param mode Enum representing the control mode of the form (Display, Edit, New)
     */
    renderListFormData(itemId: number, formId: string, mode: ControlMode): Promise<IListFormData>;

    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    reserveListItemId(): Promise<number>;

    /**
     * Returns the ListItemEntityTypeFullName for this list, used when adding/updating list items. Does not support batching.
     *
     */
    getListItemEntityTypeFullName(): Promise<string>;

    /**
     * Creates an item using path (in a folder), validates and sets its field values.
     *
     * @param formValues The fields to change and their new values.
     * @param decodedUrl Path decoded url; folder's server relative path.
     * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     * @param comment Optional check in comment.
     */
    addValidateUpdateItemUsingPath(formValues: IListItemFormUpdateValue[], decodedUrl: string, bNewDocumentUpdate?: boolean, comment?: string): Promise<IListItemFormUpdateValue[]>;
}

export interface IList extends _IList, IInvokable, ISharePointQueryableInstance, IDeleteableWithETag { }

export const List = spInvokableFactory<IList>(_List);

/**
 * Represents the output of the add method
 */
export interface IListAddResult {
    list: IList;
    data: any;
}

/**
 * Represents the output of the update method
 */
export interface IListUpdateResult {
    list: IList;
    data: any;
}

/**
 * Represents the output of the ensure method
 */
export interface IListEnsureResult {
    list: IList;
    created: boolean;
    data: any;
}

/**
 * Specifies a Collaborative Application Markup Language (CAML) query on a list or joined lists.
 */
export interface ICamlQuery {

    /**
     * Gets or sets a value that indicates whether the query returns dates in Coordinated Universal Time (UTC) format.
     */
    DatesInUtc?: boolean;

    /**
     * Gets or sets a value that specifies the server relative URL of a list folder from which results will be returned.
     */
    FolderServerRelativeUrl?: string;

    /**
     * Gets or sets a value that specifies the information required to get the next page of data for the list view.
     */
    ListItemCollectionPosition?: IListItemCollectionPosition;

    /**
     * Gets or sets value that specifies the XML schema that defines the list view.
     */
    ViewXml?: string;
}

/**
 * Specifies the information required to get the next page of data for a list view.
 */
export interface IListItemCollectionPosition {
    /**
     * Gets or sets a value that specifies information, as name-value pairs, required to get the next page of data for a list view.
     */
    PagingInfo: string;
}

/**
 * Represents the input parameter of the GetListItemChangesSinceToken method.
 */
export interface IChangeLogItemQuery {
    /**
     * The change token for the request.
     */
    ChangeToken?: string;

    /**
     * The XML element that defines custom filtering for the query.
     */
    Contains?: string;

    /**
     * The records from the list to return and their return order.
     */
    Query?: string;

    /**
     * The options for modifying the query.
     */
    QueryOptions?: string;

    /**
     * RowLimit
     */
    RowLimit?: string;

    /**
     * The names of the fields to include in the query result.
     */
    ViewFields?: string;

    /**
     * The GUID of the view.
     */
    ViewName?: string;
}

/**
 * Represents the output parameter of the renderListFormData method.
 */
export interface IListFormData {
    ContentType?: string;
    Title?: string;
    Author?: string;
    Editor?: string;
    Created?: Date;
    Modified: Date;
    Attachments?: any;
    ListSchema?: any;
    FormControlMode?: number;
    FieldControlModes?: {
        Title?: number,
        Author?: number,
        Editor?: number,
        Created?: number,
        Modified?: number,
        Attachments?: number,
    };
    WebAttributes?: {
        WebUrl?: string,
        EffectivePresenceEnabled?: boolean,
        AllowScriptableWebParts?: boolean,
        PermissionCustomizePages?: boolean,
        LCID?: number,
        CurrentUserId?: number,
    };
    ItemAttributes?: {
        Id?: number,
        FsObjType?: number,
        ExternalListItem?: boolean,
        Url?: string,
        EffectiveBasePermissionsLow?: number,
        EffectiveBasePermissionsHigh?: number,
    };
    ListAttributes?: {
        Id?: string,
        BaseType?: number,
        Direction?: string,
        ListTemplateType?: number,
        DefaultItemOpen?: number,
        EnableVersioning?: boolean,
    };
    CSRCustomLayout?: boolean;
    PostBackRequired?: boolean;
    PreviousPostBackHandled?: boolean;
    UploadMode?: boolean;
    SubmitButtonID?: string;
    ItemContentTypeName?: string;
    ItemContentTypeId?: string;
    JSLinks?: string;
}

/**
 * Enum representing the options of the RenderOptions property on IRenderListDataParameters interface
 */
export enum IRenderListDataOptions {
    None = 0,
    ContextInfo = 1,
    ListData = 2,
    ListSchema = 4,
    MenuView = 8,
    ListContentType = 16,
    FileSystemItemId = 32,
    ClientFormSchema = 64,
    QuickLaunch = 128,
    Spotlight = 256,
    Visualization = 512,
    ViewMetadata = 1024,
    DisableAutoHyperlink = 2048,
    EnableMediaTAUrls = 4096,
    ParentInfo = 8192,
    PageContextInfo = 16384,
    ClientSideComponentManifest = 32768,
}
/**
 * Represents the parameters to be used to render list data as JSON string in the RenderListDataAsStream method of IList.
 */
export interface IRenderListDataParameters {
    AllowMultipleValueFilterForTaxonomyFields?: boolean;
    DatesInUtc?: boolean;
    ExpandGroups?: boolean;
    FirstGroupOnly?: boolean;
    FolderServerRelativeUrl?: string;
    ImageFieldsToTryRewriteToCdnUrls?: string;
    OverrideViewXml?: string;
    Paging?: string;
    RenderOptions?: IRenderListDataOptions;
    ReplaceGroup?: boolean;
    ViewXml?: string;
}

/**
 * Represents properties of a list item field and its value.
 */
export interface IListItemFormUpdateValue {

    /**
     * The error message result after validating the value for the field.
     */
    ErrorMessage?: string;

    /**
     * The internal name of the field.
     */
    FieldName?: string;

    /**
     * The value of the field, in string format.
     */
    FieldValue?: string;

    /**
     * Indicates whether there was an error result after validating the value for the field.
     */
    HasException?: boolean;
}

/**
 * Represents the output parameter of the renderListData method.
 */
export interface IRenderListData {
    Row: any[];
    FirstRow: number;
    FolderPermissions: string;
    LastRow: number;
    FilterLink: string;
    ForceNoHierarchy: string;
    HierarchyHasIndention: string;
}

/**
 * Determines the display mode of the given control or view
 */
export enum ControlMode {
    Display = 1,
    Edit = 2,
    New = 3,
}
