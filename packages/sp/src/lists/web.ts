import { addProp } from "@pnp/odata";
import { _Web, Web } from "../webs/types";
import { Lists, ILists, IList, List } from "./types";
import { odataUrlFrom } from "../odata";
import { ISharePointQueryableCollection, SharePointQueryableCollection } from "../sharepointqueryable";
import { escapeQueryStrValue } from "../utils/escapeQueryStrValue";

declare module "../webs/types" {
    interface _Web {
        readonly lists: ILists;
        readonly siteUserInfoList: IList;
        readonly defaultDocumentLibrary: IList;
        readonly customListTemplates: ISharePointQueryableCollection;
        getList(listRelativeUrl: string): IList;
        getCatalog(type: number): Promise<IList>;
    }
    interface IWeb {

        /**
         * Gets the collection of all lists that are contained in the Web site
         */
        readonly lists: ILists;

        /**
         * Gets the UserInfo list of the site collection that contains the Web site
         */
        readonly siteUserInfoList: IList;

        /**
         * Get a reference the default documents library of a web
         */
        readonly defaultDocumentLibrary: IList;

        /**
         * Gets the collection of all list definitions and list templates that are available
         */
        readonly customListTemplates: ISharePointQueryableCollection;

        /**
         * Gets a list by server relative url (list's root folder)
         *
         * @param listRelativeUrl The server relative path to the list's root folder (including /sites/ if applicable)
         */
        getList(listRelativeUrl: string): IList;

        /**
         * Returns the list gallery on the site
         *
         * @param type The gallery type - WebTemplateCatalog = 111, WebPartCatalog = 113 ListTemplateCatalog = 114,
         * MasterPageCatalog = 116, SolutionCatalog = 121, ThemeCatalog = 123, DesignCatalog = 124, AppDataCatalog = 125
         */
        getCatalog(type: number): Promise<IList>;
    }
}

addProp(_Web, "lists", Lists);
addProp(_Web, "siteUserInfoList", List, "siteuserinfolist");
addProp(_Web, "defaultDocumentLibrary", List, "DefaultDocumentLibrary");
addProp(_Web, "customListTemplates", SharePointQueryableCollection, "getcustomlisttemplates");

_Web.prototype.getList = function (this: _Web, listRelativeUrl: string): IList {
    return List(this, `getList('${escapeQueryStrValue(listRelativeUrl)}')`);
};

_Web.prototype.getCatalog = async function (this: _Web, type: number): Promise<IList> {
    const data = await this.clone(Web, `getcatalog(${type})`).select("Id").get();
    return List(odataUrlFrom(data));
};
