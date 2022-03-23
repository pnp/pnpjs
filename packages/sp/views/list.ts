import { addProp } from "@pnp/queryable";
import { _List } from "../lists/types.js";
import { Views, IViews, IView, View } from "./types.js";

declare module "../lists/types" {
    interface _List {
        readonly views: IViews;
        readonly defaultView: IView;
        getView(id: string): IView;
    }
    interface IList {
        /**
         * Gets the views on this list
         */
        readonly views: IViews;
        /**
         * Gets the default view for this list
         */
        readonly defaultView: IView;
        /**
         * Gets a view by view guid id
         *
         */
        getView(id: string): IView;
    }
}

addProp(_List, "views", Views);
addProp(_List, "defaultView", View);

_List.prototype.getView = function (this: _List, viewId: string): IView {
    return View(this, `getView('${viewId}')`);
};
