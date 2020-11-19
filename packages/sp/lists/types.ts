import { assign, hOP, isArray, objectDefinedNotNull } from "@pnp/common";
import { body, headers } from "@pnp/odata";
import {
    SharePointQueryable,
    SharePointQueryableCollection,
    ISharePointQueryableCollection,
    _SharePointQueryableInstance,
    _SharePointQueryableCollection,
    ISharePointQueryable,
    spInvokableFactory,
    deleteableWithETag,
    IDeleteableWithETag,
} from "../sharepointqueryable";
import { IChangeQuery } from "../types";
import { odataUrlFrom } from "../odata";
import { metadata } from "../utils/metadata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue";
import { tag } from "../telemetry";
import { IBasePermissions } from "../security/types";
import { IFieldInfo } from "../fields/types";
import { IFormInfo } from "../forms/types";
import { IFolderInfo } from "../folders/types";
import { IViewInfo } from "../views/types";
import { IUserCustomActionInfo } from "../user-custom-actions/types";
import { IResourcePath, toResourcePath } from "../utils/toResourcePath";

@defaultPath("lists")
export class _Lists extends _SharePointQueryableCollection<IListInfo[]> {

    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the list (GUID)
     */
    public getById(id: string): IList {
        return tag.configure(List(this).concat(`('${id}')`), "ls.getById");
    }

    /**
     * Gets a list from the collection by title
     *
     * @param title The title of the list
     */
    public getByTitle(title: string): IList {
        return tag.configure(List(this, `getByTitle('${escapeQueryStrValue(title)}')`), "ls.getByTitle");
    }

    /**
     * Adds a new list to the collection
     *
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body
     */
    @tag("ls.add")
    public async add(title: string, desc = "", template = 100, enableContentTypes = false, additionalSettings: Partial<IListInfo> = {}): Promise<IListAddResult> {

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

    /**
     * Ensures that the specified list exists in the collection (note: this method not supported for batching)
     *
     * @param title The new list's title
     * @param desc The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body or used to update an existing list
     */
    @tag("ls.ensure")
    public async ensure(
        title: string,
        desc = "",
        template = 100,
        enableContentTypes = false,
        additionalSettings: Partial<IListInfo> = {}): Promise<IListEnsureResult> {

        if (this.hasBatch) {
            throw Error("The ensure list method is not supported for use in a batch.");
        }

        const addOrUpdateSettings = assign(additionalSettings, { Title: title, Description: desc, ContentTypesEnabled: enableContentTypes }, true);

        const list: IList = this.getByTitle(addOrUpdateSettings.Title);

        try {

            // this will throw if the list doesn't exist
            await list.select("Title")();
            const data = await list.update(addOrUpdateSettings).then(r => r.data);
            return { created: false, data, list: this.getByTitle(addOrUpdateSettings.Title) };

        } catch (e) {

            const data = await this.add(title, desc, template, enableContentTypes, addOrUpdateSettings).then(r => r.data);
            return { created: true, data, list: this.getByTitle(addOrUpdateSettings.Title) };
        }
    }

    /**
     * Gets a list that is the default asset location for images or other files, which the users upload to their wiki pages.
     */
    @tag("ls.ensureSiteAssetsLibrary")
    public async ensureSiteAssetsLibrary(): Promise<IList> {
        const json = await spPost(this.clone(Lists, "ensuresiteassetslibrary"));
        return List(odataUrlFrom(json));
    }

    /**
     * Gets a list that is the default location for wiki pages.
     */
    @tag("ls.ensureSitePagesLibrary")
    public async ensureSitePagesLibrary(): Promise<IList> {
        const json = await spPost(this.clone(Lists, "ensuresitepageslibrary"));
        return List(odataUrlFrom(json));
    }
}
export interface ILists extends _Lists { }
export const Lists = spInvokableFactory<ILists>(_Lists);

export class _List extends _SharePointQueryableInstance<IListInfo> {

    public delete = deleteableWithETag("l");

    /**
     * Gets the effective base permissions of this list
     *
     */
    public get effectiveBasePermissions(): ISharePointQueryable {
        return tag.configure(SharePointQueryable(this, "EffectiveBasePermissions"), "l.effectiveBasePermissions");
    }

    /**
     * Gets the event receivers attached to this list
     *
     */
    public get eventReceivers(): ISharePointQueryableCollection {
        return tag.configure(SharePointQueryableCollection(this, "EventReceivers"), "l.eventReceivers");
    }

    /**
     * Gets the related fields of this list
     *
     */
    public get relatedFields(): ISharePointQueryable {
        return tag.configure(SharePointQueryable(this, "getRelatedFields"), "l.relatedFields");
    }

    /**
     * Gets the IRM settings for this list
     *
     */
    public get informationRightsManagementSettings(): ISharePointQueryable {
        return tag.configure(SharePointQueryable(this, "InformationRightsManagementSettings"), "l.informationRightsManagementSettings");
    }

    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    @tag("l.update")
    public async update(properties: Partial<IListInfo>, eTag = "*"): Promise<IListUpdateResult> {

        const postBody = body(assign(metadata("SP.List"), properties), headers({
            "IF-Match": eTag,
            "X-HTTP-Method": "MERGE",
        }));

        const data = await spPost(this, postBody);

        let list: any = this;

        if (hOP(properties, "Title")) {
            list = this.getParent(List, this.parentUrl, `getByTitle('${properties.Title}')`);
        }

        return {
            data,
            list,
        };
    }

    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     * @param query A query that is performed against the change log.
     */
    @tag("l.getChanges")
    public getChanges(query: IChangeQuery): Promise<any> {

        return spPost(this.clone(List, "getchanges"), body({ query: assign(metadata("SP.ChangeQuery"), query) }));
    }

    /**
     * Returns the collection of items in the list based on the provided CamlQuery
     * @param query A query that is performed against the list
     * @param expands An expanded array of n items that contains fields to expand in the CamlQuery
     */
    @tag("l.CAMLQuery")
    public getItemsByCAMLQuery(query: ICamlQuery, ...expands: string[]): Promise<any> {

        const q = this.clone(List, "getitems");
        return spPost(q.expand.apply(q, expands), body({ query: assign(metadata("SP.CamlQuery"), query) }));
    }

    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     * @param query An object that defines the change log item query
     */
    @tag("l.ChangesSinceToken")
    public getListItemChangesSinceToken(query: IChangeLogItemQuery): Promise<string> {

        const o = this.clone(List, "getlistitemchangessincetoken").usingParser({ parse(r: Response) { return r.text(); } });
        return spPost(o, body({ "query": assign(metadata("SP.ChangeLogItemQuery"), query) }));
    }

    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    @tag("l.recycle")
    public async recycle(): Promise<string> {
        const data = await spPost(this.clone(List, "recycle"));
        return hOP(data, "Recycle") ? data.Recycle : data;
    }

    /**
     * Renders list data based on the view xml provided
     * @param viewXml A string object representing a view xml
     */
    @tag("l.renderListData")
    public async renderListData(viewXml: string): Promise<IRenderListData> {

        const q = this.clone(List, "renderlistdata(@viewXml)");
        q.query.set("@viewXml", `'${viewXml}'`);
        const data = await spPost(q);

        // data will be a string, so we parse it again
        return JSON.parse(hOP(data, "RenderListData") ? data.RenderListData : data);
    }

    /**
     * Returns the data for the specified query view
     *
     * @param parameters The parameters to be used to render list data as JSON string.
     * @param overrideParams The parameters that are used to override and extend the regular SPRenderListDataParameters.
     * @param query Allows setting of query parameters
     */
    @tag("l.AsStream")
    public renderListDataAsStream(parameters: IRenderListDataParameters, overrideParams: any = null, query = new Map<string, string>()): Promise<IRenderListDataAsStreamResult> {

        if (hOP(parameters, "RenderOptions") && isArray(parameters.RenderOptions)) {
            parameters.RenderOptions = (<RenderListDataOptions[]>parameters.RenderOptions).reduce((v, c) => v + c);
        }

        let bodyOptions = { parameters: assign(metadata("SP.RenderListDataParameters"), parameters) };

        if (objectDefinedNotNull(overrideParams)) {
            bodyOptions = assign(bodyOptions, { overrideParameters: assign(metadata("SP.RenderListDataOverrideParameters"), overrideParams) });
        }

        const clone = this.clone(List, "RenderListDataAsStream", true, true);

        if (query && query.size > 0) {
            query.forEach((v, k) => clone.query.set(k, v));
        }

        return spPost(clone, body(bodyOptions));
    }

    /**
     * Gets the field values and field schema attributes for a list item.
     * @param itemId Item id of the item to render form data for
     * @param formId The id of the form
     * @param mode Enum representing the control mode of the form (Display, Edit, New)
     */
    @tag("l.renderListFormData")
    public async renderListFormData(itemId: number, formId: string, mode: ControlMode): Promise<IListFormData> {
        const data = await spPost(this.clone(List, `renderlistformdata(itemid=${itemId}, formid='${formId}', mode='${mode}')`));
        // data will be a string, so we parse it again
        return JSON.parse(hOP(data, "RenderListFormData") ? data.RenderListFormData : data);
    }

    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    @tag("l.reserveListItemId")
    public async reserveListItemId(): Promise<number> {
        const data = await spPost(this.clone(List, "reservelistitemid"));
        return hOP(data, "ReserveListItemId") ? data.ReserveListItemId : data;
    }

    /**
     * Returns the ListItemEntityTypeFullName for this list, used when adding/updating list items. Does not support batching.
     */
    @tag("l.getListItemEntityTypeFullName")
    public getListItemEntityTypeFullName(): Promise<string> {
        return this.clone(List, null, false).select("ListItemEntityTypeFullName").get<{ ListItemEntityTypeFullName: string }>().then(o => o.ListItemEntityTypeFullName);
    }

    /**
     * Creates an item using path (in a folder), validates and sets its field values.
     *
     * @param formValues The fields to change and their new values.
     * @param decodedUrl Path decoded url; folder's server relative path.
     * @param bNewDocumentUpdate true if the list item is a document being updated after upload; otherwise false.
     * @param checkInComment Optional check in comment.
     * @param additionalProps Optional set of additional properties LeafName new document file name, 
     */
    @tag("l.addValidateUpdateItemUsingPath")
    public async addValidateUpdateItemUsingPath(
        formValues: IListItemFormUpdateValue[],
        decodedUrl: string,
        bNewDocumentUpdate = false,
        checkInComment?: string,
        additionalProps?: {
            /**
             * If creating a document or folder, the name
             */
            leafName?: string,
            /**
             * 0: File, 1: Folder, 2: Web
             */
            objectType?: 0 | 1 | 2,
        },
    ): Promise<IListItemFormUpdateValue[]> {

        const addProps: any = {
            FolderPath: toResourcePath(decodedUrl),
        };

        if (objectDefinedNotNull(additionalProps)) {

            if (additionalProps.leafName) {
                addProps.LeafName = toResourcePath(additionalProps.leafName);
            }

            if (additionalProps.objectType) {
                addProps.UnderlyingObjectType = additionalProps.objectType;
            }
        }

        const res = await spPost(this.clone(List, "AddValidateUpdateItemUsingPath()"), body({
            bNewDocumentUpdate,
            checkInComment,
            formValues,
            listItemCreateInfo: assign(metadata("SP.ListItemCreationInformationUsingPath"), addProps),
        }));

        return hOP(res, "AddValidateUpdateItemUsingPath") ? res.AddValidateUpdateItemUsingPath : res;
    }

    /**
     * Gets the parent information for this item's list and web
     */
    public async getParentInfos(): Promise<IListParentInfos> {

        const urlInfo: any =
            await this.select(
                "Id",
                "RootFolder/UniqueId",
                "RootFolder/ServerRelativeUrl",
                "RootFolder/ServerRelativePath",
                "ParentWeb/Id",
                "ParentWeb/Url",
                "ParentWeb/ServerRelativeUrl",
                "ParentWeb/ServerRelativePath",
            ).expand(
                "RootFolder",
                "ParentWeb")();

        return {
            List: {
                Id: urlInfo.Id,
                RootFolderServerRelativePath: urlInfo.RootFolder.ServerRelativePath,
                RootFolderServerRelativeUrl: urlInfo.RootFolder.ServerRelativeUrl,
                RootFolderUniqueId: urlInfo.RootFolder.UniqueId,
            },
            ParentWeb: {
                Id: urlInfo.ParentWeb.Id,
                ServerRelativePath: urlInfo.ParentWeb.ServerRelativePath,
                ServerRelativeUrl: urlInfo.ParentWeb.ServerRelativeUrl,
                Url: urlInfo.ParentWeb.Url,
            },
        };
    }
}
export interface IList extends _List, IDeleteableWithETag { }
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
export enum RenderListDataOptions {
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
    AddRequiredFields?: boolean;
    AllowMultipleValueFilterForTaxonomyFields?: boolean;
    AudienceTarget?: boolean;
    DatesInUtc?: boolean;
    DeferredRender?: boolean;
    ExpandGroups?: boolean;
    FirstGroupOnly?: boolean;
    FolderServerRelativeUrl?: string;
    ImageFieldsToTryRewriteToCdnUrls?: string;
    MergeDefaultView?: boolean;
    OriginalDate?: boolean;
    OverrideViewXml?: string;
    Paging?: string;
    ReplaceGroup?: boolean;
    RenderOptions?: RenderListDataOptions[] | number;
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

export interface IListInfo {
    AllowContentTypes: boolean;
    AllowDeletion: boolean;
    BaseTemplate: number;
    BaseType: any;
    BrowserFileHandling: any;
    ContentTypes: any[];
    ContentTypesEnabled: boolean;
    CrawlNonDefaultViews: boolean;
    CreatablesInfo: any;
    Created: string;
    CurrentChangeToken: any;
    CustomActionElements: any[];
    DataSource: any;
    DefaultContentApprovalWorkflowId: string;
    DefaultDisplayFormUrl: string;
    DefaultEditFormUrl: string;
    DefaultNewFormUrl: string;
    DefaultView: any;
    DefaultViewPath: any;
    DefaultViewUrl: string;
    Description: string;
    DescriptionResource: any;
    Direction: string;
    DocumentTemplateUrl: string;
    DraftVersionVisibility: any;
    EffectiveBasePermissions: IBasePermissions;
    EffectiveBasePermissionsForUI: IBasePermissions;
    EnableAssignToEmail: boolean;
    EnableAttachments: boolean;
    EnableFolderCreation: boolean;
    EnableMinorVersions: boolean;
    EnableModeration: boolean;
    EnableRequestSignOff: boolean;
    EnableVersioning: boolean;
    EntityTypeName: string;
    EventReceivers: any[];
    ExcludeFromOfflineClient: boolean;
    ExemptFromBlockDownloadOfNonViewableFiles: boolean;
    Fields: Partial<IFieldInfo>[];
    FileSavePostProcessingEnabled: boolean;
    ForceCheckout: boolean;
    Forms: IFormInfo[];
    HasExternalDataSource: boolean;
    Hidden: boolean;
    Id: string;
    ImagePath: { DecodedUrl: string; };
    ImageUrl: string;
    InformationRightsManagementSettings: any[];
    IrmEnabled: boolean;
    IrmExpire: boolean;
    IrmReject: boolean;
    IsApplicationList: boolean;
    IsCatalog: boolean;
    IsPrivate: boolean;
    IsSiteAssetsLibrary: boolean;
    IsSystemList: boolean;
    ItemCount: number;
    LastItemDeletedDate: string;
    LastItemModifiedDate: string;
    LastItemUserModifiedDate: string;
    ListExperienceOptions: number;
    ListItemEntityTypeFullName: string;
    MajorVersionLimit: number;
    MajorWithMinorVersionsLimit: number;
    MultipleDataList: boolean;
    NoCrawl: boolean;
    OnQuickLaunch: boolean;
    ParentWebPath: { DecodedUrl: string; };
    ParentWebUrl: string;
    ParserDisabled: boolean;
    ReadSecurity: number;
    RootFolder: IFolderInfo;
    SchemaXml: string;
    ServerTemplateCanCreateFolders: boolean;
    TemplateFeatureId: string;
    Title: string;
    UserCustomActions: IUserCustomActionInfo[];
    ValidationFormula: string;
    ValidationMessage: string;
    Views: IViewInfo[];
    WorkflowAssociations: any[];
    WriteSecurity: number;
}

export interface IRenderListDataAsStreamResult {
    CurrentFolderSpItemUrl: string;
    FilterLink: string;
    FirstRow: number;
    FolderPermissions: string;
    ForceNoHierarchy: string;
    HierarchyHasIndention: string;
    LastRow: number;
    Row: any[];
    RowLimit: number;
}

export interface IListParentInfos {
    List: {
        Id: string;
        RootFolderServerRelativePath: IResourcePath;
        RootFolderServerRelativeUrl: string;
        RootFolderUniqueId: string;
    };
    ParentWeb: {
        Id: string;
        ServerRelativePath: IResourcePath;
        ServerRelativeUrl: string;
        Url: string;
    };
}
