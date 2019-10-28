// ** import the ambient augmentation
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists/web";
import "@pnp/sp/src/items/list";

export {
    IWeb,
    Web,
    IWebs,
    Webs,
} from "@pnp/sp/src/webs";

export {
    ILists,
    List,
    IList,
    Lists,
} from "@pnp/sp/src/lists";

export {
    IItems,
    IItem,
    Item,
    Items,
} from "@pnp/sp/src/items";

// export only a subset of the sp lib root
export {
    sp,
    spGet,
    spPost,
    extractWebUrl,
} from "@pnp/sp";
