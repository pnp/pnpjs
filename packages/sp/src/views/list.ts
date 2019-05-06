import { addProp } from "@pnp/odata";
import { _List } from "../lists/types";
import { Views, IViews, IView, View } from "./types";

/**
* Extend Item
*/
declare module "../lists/types" {
    interface _List {
        readonly views: IViews;
        readonly defaultView: IView;
        getView(id: string): IView;
    }
    interface IList {
        readonly views: IViews;
        readonly defaultView: IView;
        getView(id: string): IView;
    }
}

addProp(_List, "views", Views);
addProp(_List, "defaultView", View, "DefaultView");

/**
 * Gets a view by view guid id
 *
 */
_List.prototype.getView = function (this: _List, viewId: string): IView {
    return View(this, `getView('${viewId}')`);
};
