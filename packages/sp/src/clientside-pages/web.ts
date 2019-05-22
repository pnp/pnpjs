import "../lists/web";
import { _Web, IWeb } from "../webs/types";
import { IClientSidePageComponent, CreateClientSidePage, IClientSidePage } from "./types";
import { _SharePointQueryableCollection, SharePointQueryableCollection } from "../sharepointqueryable";

declare module "../webs/types" {
    interface _Web {
        getClientSideWebParts(): Promise<IClientSidePageComponent[]>;
        addClientSidePage(pageName: string, title?: string, libraryTitle?: string): Promise<IClientSidePage>;
    }
    interface IWeb {

        /**
         * Gets the collection of available client side web parts for this web instance
         */
        getClientSideWebParts(): Promise<IClientSidePageComponent[]>;

        /**
         * Creates a new client side page
         *
         * @param pageName Name of the new page
         * @param title Display title of the new page
         * @param libraryTitle Title of the library in which to create the new page. Default: "Site Pages"
         */
        addClientSidePage(pageName: string, title?: string, libraryTitle?: string): Promise<IClientSidePage>;
    }
}

_Web.prototype.getClientSideWebParts = function (): Promise<IClientSidePageComponent[]> {
    return this.clone(SharePointQueryableCollection, "GetClientSideWebParts").get();
};

_Web.prototype.addClientSidePage = function (this: IWeb, pageName: string, title = pageName.replace(/\.[^/.]+$/, "")): Promise<IClientSidePage> {
    return CreateClientSidePage(this, pageName, title);
};
