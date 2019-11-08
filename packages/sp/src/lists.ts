import { Items } from "./items";
import { Views, View } from "./views";
import { ContentTypes } from "./contenttypes";
import { Fields } from "./fields";
import { Forms } from "./forms";
import { Subscriptions } from "./subscriptions";
import { SharePointQueryable, SharePointQueryableCollection, defaultPath } from "./sharepointqueryable";
import { SharePointQueryableSecurable } from "./sharepointqueryablesecurable";
import { extend, TypedHash, hOP, jsS } from "@pnp/common";
import { ControlMode, RenderListData, ChangeQuery, CamlQuery, ChangeLogitemQuery, ListFormData, RenderListDataParameters, ListItemFormUpdateValue } from "./types";
import { UserCustomActions } from "./usercustomactions";
import { odataUrlFrom } from "./odata";
import { Folder } from "./folders";
import { metadata } from "./utils/metadata";
import { SiteScripts } from "..";
import { toAbsoluteUrl } from "./utils/toabsoluteurl";

/**
 * Describes a collection of List objects
 *
 */
@defaultPath("lists")
export class Lists extends SharePointQueryableCollection {

    /**
     * Gets a list from the collection by guid id
     *
     * @param id The Id of the list (GUID)
     */
    public getById(id: string): List {
        const list = new List(this);
        list.concat(`('${id}')`);
        return list;
    }

    /**
     * Gets a list from the collection by title
     *
     * @param title The title of the list
     */
    public getByTitle(title: string): List {
        return new List(this, `getByTitle('${title}')`);
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
    public add(title: string, description = "", template = 100, enableContentTypes = false, additionalSettings: TypedHash<string | number | boolean> = {}): Promise<ListAddResult> {

        const addSettings = extend({
            "AllowContentTypes": enableContentTypes,
            "BaseTemplate": template,
            "ContentTypesEnabled": enableContentTypes,
            "Description": description,
            "Title": title,
            "__metadata": { "type": "SP.List" },
        }, additionalSettings);

        return this.postCore({ body: jsS(addSettings) }).then((data) => {
            return { data: data, list: this.getByTitle(addSettings.Title) };
        });
    }

    /**
     * Ensures that the specified list exists in the collection (note: this method not supported for batching)
     *
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body or used to update an existing list
     */
    public ensure(
        title: string,
        description = "",
        template = 100,
        enableContentTypes = false,
        additionalSettings: TypedHash<string | number | boolean> = {}): Promise<ListEnsureResult> {

        if (this.hasBatch) {
            throw Error("The ensure list method is not supported for use in a batch.");
        }

        return new Promise((resolve, reject) => {

            const addOrUpdateSettings = extend(additionalSettings, { Title: title, Description: description, ContentTypesEnabled: enableContentTypes }, true);

            const list: List = this.getByTitle(addOrUpdateSettings.Title);

            list.get().then(_ => {

                list.update(addOrUpdateSettings).then(d => {
                    resolve({ created: false, data: d, list: this.getByTitle(addOrUpdateSettings.Title) });
                }).catch(e => reject(e));

            }).catch(_ => {

                this.add(title, description, template, enableContentTypes, addOrUpdateSettings).then((r) => {
                    resolve({ created: true, data: r.data, list: this.getByTitle(addOrUpdateSettings.Title) });
                }).catch((e) => reject(e));
            });
        });
    }

    /**
     * Gets a list that is the default asset location for images or other files, which the users upload to their wiki pages.
     */
    public ensureSiteAssetsLibrary(): Promise<List> {
        return this.clone(Lists, "ensuresiteassetslibrary").postCore().then((json) => {
            return new List(odataUrlFrom(json));
        });
    }

    /**
     * Gets a list that is the default location for wiki pages.
     */
    public ensureSitePagesLibrary(): Promise<List> {
        return this.clone(Lists, "ensuresitepageslibrary").postCore().then((json) => {
            return new List(odataUrlFrom(json));
        });
    }
}

/**
 * Describes a single List instance
 *
 */
export class List extends SharePointQueryableSecurable {

    /**
     * Gets the content types in this list
     *
     */
    public get contentTypes(): ContentTypes {
        return new ContentTypes(this);
    }

    /**
     * Gets the items in this list
     *
     */
    public get items(): Items {
        return new Items(this);
    }

    /**
     * Gets the views in this list
     *
     */
    public get views(): Views {
        return new Views(this);
    }

    /**
     * Gets the fields in this list
     *
     */
    public get fields(): Fields {
        return new Fields(this);
    }

    /**
     * Gets the forms in this list
     *
     */
    public get forms(): Forms {
        return new Forms(this);
    }

    /**
     * Gets the default view of this list
     *
     */
    public get defaultView(): View {
        return new View(this, "DefaultView");
    }

    /**
     * Get all custom actions on a site collection
     *
     */
    public get userCustomActions(): UserCustomActions {
        return new UserCustomActions(this);
    }

    /**
     * Gets the effective base permissions of this list
     *
     */
    public get effectiveBasePermissions(): SharePointQueryable {
        return new SharePointQueryable(this, "EffectiveBasePermissions");
    }

    /**
     * Gets the event receivers attached to this list
     *
     */
    public get eventReceivers(): SharePointQueryableCollection {
        return new SharePointQueryableCollection(this, "EventReceivers");
    }

    /**
     * Gets the related fields of this list
     *
     */
    public get relatedFields(): SharePointQueryable {
        return new SharePointQueryable(this, "getRelatedFields");
    }

    /**
     * Gets the IRM settings for this list
     *
     */
    public get informationRightsManagementSettings(): SharePointQueryable {
        return new SharePointQueryable(this, "InformationRightsManagementSettings");
    }

    /**
     * Gets the webhook subscriptions of this list
     *
     */
    public get subscriptions(): Subscriptions {
        return new Subscriptions(this);
    }

    /**
     * The root folder of the list
     */
    public get rootFolder(): Folder {
        return new Folder(this, "rootFolder");
    }

    /**
     * Gets a view by view guid id
     *
     */
    public getView(viewId: string): View {
        return new View(this, `getView('${viewId}')`);
    }

    /**
     * Updates this list intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    /* tslint:disable no-string-literal */
    public update(properties: TypedHash<string | number | boolean>, eTag = "*"): Promise<ListUpdateResult> {

        const postBody = jsS(extend({
            "__metadata": { "type": "SP.List" },
        }, properties));

        return this.postCore({
            body: postBody,
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {

            let retList: List = this;

            if (hOP(properties, "Title")) {
                retList = this.getParent(List, this.parentUrl, `getByTitle('${properties["Title"]}')`);
            }

            return {
                data: data,
                list: retList,
            };
        });
    }
    /* tslint:enable */

    /**
     * Delete this list
     *
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public delete(eTag = "*"): Promise<void> {
        return this.postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query.
     */
    public getChanges(query: ChangeQuery): Promise<any> {

        return this.clone(List, "getchanges").postCore({
            body: jsS({ "query": extend(metadata("SP.ChangeQuery"), query) }),
        });
    }

    /**
     * Returns a collection of items from the list based on the specified query.
     *
     * @param CamlQuery The Query schema of Collaborative Application Markup
     * Language (CAML) is used in various ways within the context of Microsoft SharePoint Foundation
     * to define queries against list data.
     * see:
     *
     * https://msdn.microsoft.com/en-us/library/office/ms467521.aspx
     *
     * @param expands A URI with a $expand System Query Option indicates that Entries associated with
     * the Entry or Collection of Entries identified by the Resource Path
     * section of the URI must be represented inline (i.e. eagerly loaded).
     * see:
     *
     * https://msdn.microsoft.com/en-us/library/office/fp142385.aspx
     *
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/#ExpandSystemQueryOption
     */
    public getItemsByCAMLQuery(query: CamlQuery, ...expands: string[]): Promise<any> {

        const q = this.clone(List, "getitems");
        return q.expand.apply(q, expands).postCore({
            body: jsS({ "query": extend({ "__metadata": { "type": "SP.CamlQuery" } }, query) }),
        });
    }

    /**
     * See: https://msdn.microsoft.com/en-us/library/office/dn292554.aspx
     */
    public getListItemChangesSinceToken(query: ChangeLogitemQuery): Promise<string> {

        return this.clone(List, "getlistitemchangessincetoken").postCore({
            body: jsS({ "query": extend({ "__metadata": { "type": "SP.ChangeLogItemQuery" } }, query) }),
        }, { parse(r) { return r.text(); } });
    }

    /**
     * Moves the list to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     */
    public recycle(): Promise<string> {
        return this.clone(List, "recycle").postCore().then(data => {
            if (hOP(data, "Recycle")) {
                return data.Recycle;
            } else {
                return data;
            }
        });
    }

    /**
     * Renders list data based on the view xml provided
     */
    public renderListData(viewXml: string): Promise<RenderListData> {

        const q = this.clone(List, "renderlistdata(@viewXml)");
        q.query.set("@viewXml", `'${viewXml}'`);
        return q.postCore().then(data => {
            // data will be a string, so we parse it again
            return JSON.parse(hOP(data, "RenderListData") ? data.RenderListData : data);
        });
    }

    /**
     * Returns the data for the specified query view
     *
     * @param parameters The parameters to be used to render list data as JSON string.
     * @param overrideParameters The parameters that are used to override and extend the regular SPRenderListDataParameters.
     * @param queryParams Allows setting of query parameters
     */
    public renderListDataAsStream(parameters: RenderListDataParameters, overrideParameters: any = null, queryParams = new Map<string, string>()): Promise<any> {

        const postBody = {
            overrideParameters: extend(metadata("SP.RenderListDataOverrideParameters"), overrideParameters),
            parameters: extend(metadata("SP.RenderListDataParameters"), parameters),
        };

        const clone = this.clone(List, "RenderListDataAsStream", true);

        if (queryParams && queryParams.size > 0) {
            queryParams.forEach((v, k) => clone.query.set(k, v));
        }

        return clone.postCore({
            body: jsS(postBody),
        });
    }

    /**
     * Gets the field values and field schema attributes for a list item.
     */
    public renderListFormData(itemId: number, formId: string, mode: ControlMode): Promise<ListFormData> {
        return this.clone(List, `renderlistformdata(itemid=${itemId}, formid='${formId}', mode='${mode}')`).postCore().then(data => {
            // data will be a string, so we parse it again
            return JSON.parse(hOP(data, "RenderListFormData") ? data.RenderListFormData : data);
        });
    }

    /**
     * Reserves a list item ID for idempotent list item creation.
     */
    public reserveListItemId(): Promise<number> {
        return this.clone(List, "reservelistitemid").postCore().then(data => {
            if (hOP(data, "ReserveListItemId")) {
                return data.ReserveListItemId;
            } else {
                return data;
            }
        });
    }

    /**
     * Returns the ListItemEntityTypeFullName for this list, used when adding/updating list items. Does not support batching.
     *
     */
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
     */
    public addValidateUpdateItemUsingPath(
        formValues: ListItemFormUpdateValue[],
        decodedUrl: string,
        bNewDocumentUpdate = false,
        checkInComment?: string,
    ): Promise<ListItemFormUpdateValue[]> {
        return this.clone(List, "AddValidateUpdateItemUsingPath()").postCore({
            body: jsS({
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
            }),
        }).then(res => {
            if (typeof res.AddValidateUpdateItemUsingPath !== "undefined") {
                return res.AddValidateUpdateItemUsingPath.results;
            }
            return res;
        });
    }

    /**
    * Gets the site script syntax (JSON) for the current list
    */
    public async getSiteScript(): Promise<string> {
        const rootFolder = await this.clone(List).rootFolder.select("ServerRelativeUrl").get();
        const absoluteListUrl = await toAbsoluteUrl(rootFolder.ServerRelativeUrl);
        return new SiteScripts(this, "").getSiteScriptFromList(absoluteListUrl);
    }
}

export interface ListAddResult {
    list: List;
    data: any;
}

export interface ListUpdateResult {
    list: List;
    data: any;
}

export interface ListEnsureResult {
    list: List;
    created: boolean;
    data: any;
}
