import { _Web, IWeb } from "../webs/types";
import { IClientsidePageComponent, CreateClientsidePage, IClientsidePage, ClientsidePageLayoutType, ClientsidePageFromFile, PromotedState } from "./types";
import { SharePointQueryableCollection } from "../sharepointqueryable";

declare module "../webs/types" {
    interface _Web {
        getClientsideWebParts(): Promise<IClientsidePageComponent[]>;
        addClientsidePage(pageName: string, title?: string, libraryTitle?: string, promotedState?: PromotedState): Promise<IClientsidePage>;
        loadClientsidePage(path: string): Promise<IClientsidePage>;
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
    }
}

_Web.prototype.getClientsideWebParts = function (): Promise<IClientsidePageComponent[]> {
    return this.clone(SharePointQueryableCollection, "GetClientSideWebParts")();
};

_Web.prototype.addClientsidePage =
    function (this: IWeb, pageName: string, title = pageName.replace(/\.[^/.]+$/, ""), layout?: ClientsidePageLayoutType, promotedState?: PromotedState): Promise<IClientsidePage> {
        return CreateClientsidePage(this, pageName, title, layout, promotedState);
    };

_Web.prototype.loadClientsidePage = function (this: IWeb, path: string): Promise<IClientsidePage> {
    return ClientsidePageFromFile(this.getFileByServerRelativePath(path));
};
