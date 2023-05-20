import { _Drive } from "../onedrive/types.js";
import { List, IList } from "./types.js";

declare module "../onedrive/types" {
    interface _Drive {
        getList: () => Promise<IList>;
    }
    interface IDrive {
        /**
         * Read the attachment files data for an item
         */
        getList: () => Promise<IList>;
    }
}

_Drive.prototype.getList = async function (): Promise<IList> {
    const q = await this.list();

    const url = `/sites/${q.parentReference.siteId}/lists/${q.id}`;
    return List([this, url]);
};
