import { hOP, isArray, objectDefinedNotNull } from "@pnp/core";
import { body, headers, TextParse, ThrowErrors } from "@pnp/queryable";
import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    deleteableWithETag,
    SPQueryable,
    ISPQueryable,
    ISPCollection,
    SPCollection,
    IDeleteableWithETag,
} from "../spqueryable.js";
import { IChangeQuery } from "../types.js";
import { odataUrlFrom } from "../utils/odata-url-from.js";
import { defaultPath } from "../decorators.js";
import { spPost, spPostMerge } from "../operations.js";
import { escapeQueryStrValue } from "../utils/escape-query-str.js";
import { IBasePermissions } from "../security/types.js";
import { IFieldInfo } from "../fields/types.js";
import { IFormInfo } from "../forms/types.js";
import { IFolderInfo } from "../folders/types.js";
import { IViewInfo } from "../views/types.js";
import { IUserCustomActionInfo } from "../user-custom-actions/types.js";
import { IResourcePath, toResourcePath } from "../utils/to-resource-path.js";

@defaultPath("lists")
export class _Lists extends _SPCollection<IListInfo[]> {

    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the list (GUID)
     */
    public getById(id: string): IList {
        return List(this).concat(`('${id}')`);
    }

    /**
     * Gets a list from the collection by title
     *
     * @param title The title of the list
     */
    public getByTitle(title: string): IList {
        return List(this, `getByTitle('${escapeQueryStrValue(title)}')`);
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
    public async add(title: string, desc = "", template = 100, enableContentTypes = false, additionalSettings: Partial<IListInfo> = {}): Promise<IListAddResult> {

        const addSettings = {
            "AllowContentTypes": enableContentTypes,
            "BaseTemplate": template,
            "ContentTypesEnabled": enableContentTypes,
            "Description": desc,
            "Title": title,
            ...additionalSettings,
        };

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
    public async ensure(
        title: string,
        desc = "",
        template = 100,
        enableContentTypes = false,
        additionalSettings: Partial<IListInfo> = {}): Promise<IListEnsureResult> {

        const addOrUpdateSettings = { Title: title, Description: desc, ContentTypesEnabled: enableContentTypes, ...additionalSettings };

        const list: IList = this.getByTitle(addOrUpdateSettings.Title);

        try {

            await list.using(ThrowErrors()).select("Title")();

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
    public async ensureSiteAssetsLibrary(): Promise<IList> {
        const json = await spPost(Lists(this, "ensuresiteassetslibrary"));
        return List(odataUrlFrom(json));
    }

    /**
     * Gets a list that is the default location for wiki pages.
     */
    public async ensureSitePagesLibrary(): Promise<IList> {
        const json = await spPost(Lists(this, "ensuresitepageslibrary"));
        return List(odataUrlFrom(json));
    }
}
export interface ILists extends _Lists { }
export const Lists = spInvokableFactory<ILists>(_Lists);

export class _List extends _SPInstance<IListInfo> {

    public delete = deleteableWithETag();

    /**
     * Gets the effective base permissions of this list
     *
     */
    public get effectiveBasePermissions(): ISPQueryable {
        return SPQueryable(this, "EffectiveBasePermissions");
    }

    /**
     * Gets the event receivers attached to this list
     *
     */
    public get eventReceivers(): ISPCollection {
        return SPCollection(this, "EventReceivers");
    }

    /**
     * Gets the related fields of this list
     *
     */
    public get relatedFields(): ISPQueryable {
        return SPQueryable(this, "getRelatedFields");
    }

    /**
     * Gets the IRM settings for this list
     *
     */
    public get informationRightsManagementSettings(): ISPQueryable {
        return SPQueryable(this, "InformationRightsManagementSettings");
    }

    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public async update(properties: Partial<IListInfo>, eTag = "*"): Promise<IListUpdateResult> {

        const data = await spPostMerge(this, body(properties, headers({ "IF-Match": eTag })));

        const list: IList = hOP(properties, "Title") ? this.getParent(List, `getByTitle('${properties.Title}')`) : List(this);

        return {
            data,
            list,
        };
    }

    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     * @param query A query that is performed against the change log.
     */
    public getChanges(query: IChangeQuery): Promise<any> {
        return spPost(List(this, "getchanges"), body({ query }));
    }

    /**
     * Returns the collection of items in the list based on the provided CamlQuery
     * @param query A query that is performed against the list
     * @param expands An expanded array of n items that contains fields to expand in the CamlQuery
     */
    public getItemsByCAMLQuery(query: ICamlQuery, ...expands: string[]): Promise<any> {

        return spPost(List(this, "getitems").expand(...expands), body({ query }));
    }

    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     * @param query An object that defines the change log item query
     */
    public getListItemChangesSinceToken(query: IChangeLogItemQuery): Promise<string> {

        return spPost(List(this, "getlistitemchangessincetoken").using(TextParse()), body({ query }));
    }

    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public async recycle(): Promise<string> {
        return spPost(List(this, "recycle"));
    }

    /**
     * Renders list data based on the view xml provided
     * @param viewXml A string object representing a view xml
     */
    public async renderListData(viewXml: string): Promise<IRenderListData> {

        const q = List(this, "renderlistdata(@viewXml)");
        q.query.set("@viewXml", `'${viewXml}'`);
        const data = await spPost(q);
        return JSON.parse(data);
    }

    /**
     * Returns the data for the specified query view
     *
     * @param parameters The parameters to be used to render list data as JSON string.
     * @param overrideParams The parameters that are used to override and extend the regular SPRenderListDataParameters.
     * @param query Allows setting of query parameters
     */
    // eslint-disable-next-line max-len
    public renderListDataAsStream(parameters: IRenderListDataParameters, overrideParameters: any = null, query = new Map<string, string>()): Promise<IRenderListDataAsStreamResult> {

        if (hOP(parameters, "RenderOptions") && isArray(parameters.RenderOptions)) {
            parameters.RenderOptions = (<RenderListDataOptions[]>parameters.RenderOptions).reduce((v, c) => v + c);
        }

        const clone = List(this, "RenderListDataAsStream");

        if (query && query.size > 0) {
            query.forEach((v, k) => clone.query.set(k, v));
        }

        return spPost(clone, body({ parameters, ...overrideParameters }));
    }

    /**
     * Gets the field values and field schema attributes for a list item.
     * @param itemId Item id of the item to render form data for
     * @param formId The id of the form
     * @param mode Enum representing the control mode of the form (Display, Edit, New)
     */
    public async renderListFormData(itemId: number, formId: string, mode: ControlMode): Promise<IListFormData> {
        const data = await spPost(List(this, `renderlistformdata(itemid=${itemId}, formid='${formId}', mode='${mode}')`));
        // data will be a string, so we parse it again
        return JSON.parse(data);
    }

    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    public async reserveListItemId(): Promise<number> {
        return spPost(List(this, "reservelistitemid"));
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
    public async addValidateUpdateItemUsingPath(
        formValues: IListItemFormUpdateValue[],
        decodedUrl: string,
        bNewDocumentUpdate = false,
        checkInComment?: string,
        additionalProps?: {
            /**
             * If creating a document or folder, the name
             */
            leafName?: string;
            /**
             * 0: File, 1: Folder, 2: Web
             */
            objectType?: 0 | 1 | 2;
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

        return spPost(List(this, "AddValidateUpdateItemUsingPath()"), body({
            bNewDocumentUpdate,
            checkInComment,
            formValues,
            listItemCreateInfo: addProps,
        }));
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
        Title?: number;
        Author?: number;
        Editor?: number;
        Created?: number;
        Modified?: number;
        Attachments?: number;
    };
    WebAttributes?: {
        WebUrl?: string;
        EffectivePresenceEnabled?: boolean;
        AllowScriptableWebParts?: boolean;
        PermissionCustomizePages?: boolean;
        LCID?: number;
        CurrentUserId?: number;
    };
    ItemAttributes?: {
        Id?: number;
        FsObjType?: number;
        ExternalListItem?: boolean;
        Url?: string;
        EffectiveBasePermissionsLow?: number;
        EffectiveBasePermissionsHigh?: number;
    };
    ListAttributes?: {
        Id?: string;
        BaseType?: number;
        Direction?: string;
        ListTemplateType?: number;
        DefaultItemOpen?: number;
        EnableVersioning?: boolean;
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
    ImagePath: { DecodedUrl: string };
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
    ParentWebPath: { DecodedUrl: string };
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
    NextHref?: string;
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
