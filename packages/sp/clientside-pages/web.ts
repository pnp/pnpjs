import { _Web, IWeb } from "../webs/types.js";
import {
    IClientsidePageComponent,
    CreateClientsidePage,
    IClientsidePage,
    ClientsidePageLayoutType,
    ClientsidePageFromFile,
    PromotedState,
    IRepostPage,
    ClientsideWebpart,
} from "./types.js";
import { SPCollection, SPInstance } from "../spqueryable.js";
import { spPost } from "../operations.js";
import { body } from "@pnp/queryable";
import { extractWebUrl } from "@pnp/sp";


declare module "../webs/types" {
    interface _Web {
        getClientsideWebParts(): Promise<IClientsidePageComponent[]>;
        addClientsidePage(pageName: string, title?: string, libraryTitle?: string, promotedState?: PromotedState): Promise<IClientsidePage>;
        loadClientsidePage(path: string): Promise<IClientsidePage>;
        addRepostPage(details: IRepostPage): Promise<string>;
        addFullPageApp(pageName: string, title: string, componentId: string, promotedState?: PromotedState): Promise<IClientsidePage>;
    }
    interface IWeb {

        /**
         * Gets the collection of available client side web parts for this web instance
         */
        getClientsideWebParts(): Promise<IClientsidePageComponent[]>;

        /**
         * Creates a new client side page
         *
         * @param pageName Name of the new page
         * @param title Display title of the new page
         */
        addClientsidePage(pageName: string, title?: string, PageLayoutType?: ClientsidePageLayoutType, promotedState?: PromotedState): Promise<IClientsidePage>;

        /**
         * Loads a page from the provided server relative path to the file
         *
         * @param path Server relative path to the file (ex: "/sites/dev/sitepages/page.aspx")
         */
        loadClientsidePage(path: string): Promise<IClientsidePage>;

        /**
         * Adds a repost page
         *
         * @param details The request details to create the page
         */
        addRepostPage(details: IRepostPage): Promise<string>;

        /**
         * Creates a new single page app page and installs the indicated component
         *
         * @param componentId
         */
        addFullPageApp(pageName: string, title: string, componentId: string, promotedState?: PromotedState): Promise<IClientsidePage>;
    }
}

_Web.prototype.getClientsideWebParts = function (this: _Web): Promise<IClientsidePageComponent[]> {
    return SPCollection(this, "GetClientSideWebParts")();
};

_Web.prototype.addClientsidePage =
    function (this: IWeb, pageName: string, title = pageName.replace(/\.[^/.]+$/, ""), layout?: ClientsidePageLayoutType, promotedState?: PromotedState): Promise<IClientsidePage> {
        return CreateClientsidePage(this, pageName, title, layout, promotedState);
    };

_Web.prototype.loadClientsidePage = function (this: IWeb, path: string): Promise<IClientsidePage> {
    return ClientsidePageFromFile(this.getFileByServerRelativePath(path));
};

_Web.prototype.addRepostPage = async function (this: IWeb, details: IRepostPage): Promise<string> {
    const query = SPInstance([this, extractWebUrl(this.toUrl())], "_api/sitepages/pages/reposts");
    const r: { AbsoluteUrl: string } = await spPost(query, body(details));
    return r.AbsoluteUrl;
};

// eslint-disable-next-line max-len
_Web.prototype.addFullPageApp = async function (this: IWeb, pageName: string, title = pageName.replace(/\.[^/.]+$/, ""), componentId: string, promotedState?: PromotedState): Promise<IClientsidePage> {

    const parts = await this.getClientsideWebParts();
    const test = new RegExp(`{?${componentId}}?`, "i");
    const partDef = parts.find(p => test.test(p.Id));
    const part = ClientsideWebpart.fromComponentDef(partDef);
    const page = await this.addClientsidePage(pageName, title, "SingleWebPartAppPage", promotedState);
    page.addSection().addColumn(12).addControl(part);
    return page;
};
