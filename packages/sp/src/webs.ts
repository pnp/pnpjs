import { SharePointQueryable, SharePointQueryableCollection } from "./sharepointqueryable";
import { Lists } from "./lists";
import { Fields } from "./fields";
import { Navigation } from "./navigation";
import { SiteGroups, SiteGroup } from "./sitegroups";
import { ContentTypes } from "./contenttypes";
import { Folders, Folder } from "./folders";
import { RoleDefinitions } from "./roles";
import { File } from "./files";
import { TypedHash } from "../collections/collections";
import { Util, extractWebUrl } from "../utils/util";
import { ChangeQuery } from "./types";
import { List } from "./lists";
import { SiteUsers, SiteUser, CurrentUser, SiteUserProps } from "./siteusers";
import { UserCustomActions } from "./usercustomactions";
import { spExtractODataId } from "./odata";
import { ODataBatch } from "./batch";
import { Features } from "./features";
import { SharePointQueryableShareableWeb } from "./sharepointqueryableshareable";
import { RelatedItemManger, RelatedItemManagerImpl } from "./relateditems";

/**
 * Describes a collection of webs
 *
 */
export class Webs extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the Webs class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web collection
     */
    constructor(baseUrl: string | SharePointQueryable, webPath = "webs") {
        super(baseUrl, webPath);
    }

    /**
     * Adds a new web to the collection
     *
     * @param title The new web's title
     * @param url The new web's relative url
     * @param description The new web's description
     * @param template The new web's template internal name (default = STS)
     * @param language The locale id that specifies the new web's language (default = 1033 [English, US])
     * @param inheritPermissions When true, permissions will be inherited from the new web's parent (default = true)
     */
    public add(
        title: string,
        url: string,
        description = "",
        template = "STS",
        language = 1033,
        inheritPermissions = true): Promise<WebAddResult> {

        const props = {
            Description: description,
            Language: language,
            Title: title,
            Url: url,
            UseSamePermissionsAsParentSite: inheritPermissions,
            WebTemplate: template,
        };

        const postBody = JSON.stringify({
            "parameters":
            Util.extend({
                "__metadata": { "type": "SP.WebCreationInformation" },
            }, props),
        });

        return this.clone(Webs, "add").postCore({ body: postBody }).then((data) => {
            return {
                data: data,
                web: new Web(spExtractODataId(data).replace(/_api\/web\/?/i, "")),
            };
        });
    }
}

/**
 * Describes a collection of web infos
 *
 */
export class WebInfos extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the WebInfos class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web infos collection
     */
    constructor(baseUrl: string | SharePointQueryable, webPath = "webinfos") {
        super(baseUrl, webPath);
    }
}

/**
 * Describes a web
 *
 */
export class Web extends SharePointQueryableShareableWeb {

    /**
     * Creates a new web instance from the given url by indexing the location of the /_api/
     * segment. If this is not found the method creates a new web with the entire string as
     * supplied.
     *
     * @param url
     */
    public static fromUrl(url: string, path?: string) {
        return new Web(extractWebUrl(url), path);
    }

    /**
     * Creates a new instance of the Web class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this web
     */
    constructor(baseUrl: string | SharePointQueryable, path = "_api/web") {
        super(baseUrl, path);
    }

    /**
     * Gets this web's subwebs
     *
     */
    public get webs(): Webs {
        return new Webs(this);
    }

    /**
     * Gets a collection of WebInfos for this web's subwebs
     *
     */
    public get webinfos(): WebInfos {
        return new WebInfos(this);
    }

    /**
     * Gets the content types available in this web
     *
     */
    public get contentTypes(): ContentTypes {
        return new ContentTypes(this);
    }

    /**
     * Gets the lists in this web
     *
     */
    public get lists(): Lists {
        return new Lists(this);
    }

    /**
     * Gets the fields in this web
     *
     */
    public get fields(): Fields {
        return new Fields(this);
    }

    /**
     * Gets the active features for this web
     *
     */
    public get features(): Features {
        return new Features(this);
    }

    /**
     * Gets the available fields in this web
     *
     */
    public get availablefields(): Fields {
        return new Fields(this, "availablefields");
    }

    /**
     * Gets the navigation options in this web
     *
     */
    public get navigation(): Navigation {
        return new Navigation(this);
    }

    /**
     * Gets the site users
     *
     */
    public get siteUsers(): SiteUsers {
        return new SiteUsers(this);
    }

    /**
     * Gets the site groups
     *
     */
    public get siteGroups(): SiteGroups {
        return new SiteGroups(this);
    }

    /**
     * Gets the current user
     */
    public get currentUser(): CurrentUser {
        return new CurrentUser(this);
    }

    /**
     * Gets the top-level folders in this web
     *
     */
    public get folders(): Folders {
        return new Folders(this);
    }

    /**
     * Gets all user custom actions for this web
     *
     */
    public get userCustomActions(): UserCustomActions {
        return new UserCustomActions(this);
    }

    /**
     * Gets the collection of RoleDefinition resources
     *
     */
    public get roleDefinitions(): RoleDefinitions {
        return new RoleDefinitions(this);
    }

    /**
     * Provides an interface to manage related items
     *
     */
    public get relatedItems(): RelatedItemManger {
        return RelatedItemManagerImpl.FromUrl(this.toUrl());
    }

    /**
     * Creates a new batch for requests within the context of this web
     *
     */
    public createBatch(): ODataBatch {
        return new ODataBatch(this.parentUrl);
    }

    /**
     * Gets the root folder of this web
     *
     */
    public get rootFolder(): Folder {
        return new Folder(this, "rootFolder");
    }

    /**
     * Gets the associated owner group for this web
     *
     */
    public get associatedOwnerGroup(): SiteGroup {
        return new SiteGroup(this, "associatedownergroup");
    }

    /**
     * Gets the associated member group for this web
     *
     */
    public get associatedMemberGroup(): SiteGroup {
        return new SiteGroup(this, "associatedmembergroup");
    }

    /**
     * Gets the associated visitor group for this web
     *
     */
    public get associatedVisitorGroup(): SiteGroup {
        return new SiteGroup(this, "associatedvisitorgroup");
    }

    /**
     * Gets a folder by server relative url
     *
     * @param folderRelativeUrl The server relative path to the folder (including /sites/ if applicable)
     */
    public getFolderByServerRelativeUrl(folderRelativeUrl: string): Folder {
        return new Folder(this, `getFolderByServerRelativeUrl('${folderRelativeUrl}')`);
    }

    /**
     * Gets a file by server relative url
     *
     * @param fileRelativeUrl The server relative path to the file (including /sites/ if applicable)
     */
    public getFileByServerRelativeUrl(fileRelativeUrl: string): File {
        return new File(this, `getFileByServerRelativeUrl('${fileRelativeUrl}')`);
    }

    /**
     * Gets a list by server relative url (list's root folder)
     *
     * @param listRelativeUrl The server relative path to the list's root folder (including /sites/ if applicable)
     */
    public getList(listRelativeUrl: string): List {
        return new List(this, `getList('${listRelativeUrl}')`);
    }

    /**
     * Updates this web instance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the web
     */
    public update(properties: TypedHash<string | number | boolean>): Promise<WebUpdateResult> {

        const postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.Web" },
        }, properties));

        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                web: this,
            };
        });
    }

    /**
     * Deletes this web
     *
     */
    public delete(): Promise<void> {
        return super.deleteCore();
    }

    /**
     * Applies the theme specified by the contents of each of the files specified in the arguments to the site
     *
     * @param colorPaletteUrl The server-relative URL of the color palette file
     * @param fontSchemeUrl The server-relative URL of the font scheme
     * @param backgroundImageUrl The server-relative URL of the background image
     * @param shareGenerated When true, the generated theme files are stored in the root site. When false, they are stored in this web
     */
    public applyTheme(colorPaletteUrl: string, fontSchemeUrl: string, backgroundImageUrl: string, shareGenerated: boolean): Promise<void> {

        const postBody = JSON.stringify({
            backgroundImageUrl: backgroundImageUrl,
            colorPaletteUrl: colorPaletteUrl,
            fontSchemeUrl: fontSchemeUrl,
            shareGenerated: shareGenerated,
        });

        return this.clone(Web, "applytheme").postCore({ body: postBody });
    }

    /**
     * Applies the specified site definition or site template to the Web site that has no template applied to it
     *
     * @param template Name of the site definition or the name of the site template
     */
    public applyWebTemplate(template: string): Promise<void> {

        const q = this.clone(Web, "applywebtemplate");
        q.concat(`(@t)`);
        q.query.add("@t", template);
        return q.postCore();
    }

    /**
     * Checks whether the specified login name belongs to a valid user in the web. If the user doesn't exist, adds the user to the web.
     *
     * @param loginName The login name of the user (ex: i:0#.f|membership|user@domain.onmicrosoft.com)
     */
    public ensureUser(loginName: string): Promise<WebEnsureUserResult> {
        const postBody = JSON.stringify({
            logonName: loginName,
        });

        return this.clone(Web, "ensureuser").postCore({ body: postBody }).then((data: any) => {
            return {
                data: data,
                user: new SiteUser(spExtractODataId(data)),
            };
        });
    }

    /**
     * Returns a collection of site templates available for the site
     *
     * @param language The locale id of the site templates to retrieve (default = 1033 [English, US])
     * @param includeCrossLanguage When true, includes language-neutral site templates; otherwise false (default = true)
     */
    public availableWebTemplates(language = 1033, includeCrossLanugage = true): SharePointQueryableCollection {
        return new SharePointQueryableCollection(this, `getavailablewebtemplates(lcid=${language}, doincludecrosslanguage=${includeCrossLanugage})`);
    }

    /**
     * Returns the list gallery on the site
     *
     * @param type The gallery type - WebTemplateCatalog = 111, WebPartCatalog = 113 ListTemplateCatalog = 114,
     * MasterPageCatalog = 116, SolutionCatalog = 121, ThemeCatalog = 123, DesignCatalog = 124, AppDataCatalog = 125
     */
    public getCatalog(type: number): Promise<List> {
        return this.clone(Web, `getcatalog(${type})`).select("Id").get().then((data) => {
            return new List(spExtractODataId(data));
        });
    }

    /**
     * Returns the collection of changes from the change log that have occurred within the list, based on the specified query
     *
     * @param query The change query
     */
    public getChanges(query: ChangeQuery): Promise<any> {

        const postBody = JSON.stringify({ "query": Util.extend({ "__metadata": { "type": "SP.ChangeQuery" } }, query) });
        return this.clone(Web, "getchanges").postCore({ body: postBody });
    }

    /**
     * Gets the custom list templates for the site
     *
     */
    public get customListTemplate(): SharePointQueryableCollection {
        return new SharePointQueryableCollection(this, "getcustomlisttemplates");
    }

    /**
     * Returns the user corresponding to the specified member identifier for the current site
     *
     * @param id The id of the user
     */
    public getUserById(id: number): SiteUser {
        return new SiteUser(this, `getUserById(${id})`);
    }

    /**
     * Returns the name of the image file for the icon that is used to represent the specified file
     *
     * @param filename The file name. If this parameter is empty, the server returns an empty string
     * @param size The size of the icon: 16x16 pixels = 0, 32x32 pixels = 1 (default = 0)
     * @param progId The ProgID of the application that was used to create the file, in the form OLEServerName.ObjectName
     */
    public mapToIcon(filename: string, size = 0, progId = ""): Promise<string> {
        return this.clone(Web, `maptoicon(filename='${filename}', progid='${progId}', size=${size})`).get();
    }
}

/**
 * Result from adding a web
 *
 */
export interface WebAddResult {
    data: any;
    web: Web;
}

/**
 * Result from updating a web
 *
 */
export interface WebUpdateResult {
    data: any;
    web: Web;
}

/**
 * Result from retrieving a catalog
 *
 */
export interface GetCatalogResult {
    data: any;
    list: List;
}

/**
 * Result from ensuring a user
 *
 */
export interface WebEnsureUserResult {
    data: SiteUserProps;
    user: SiteUser;
}
