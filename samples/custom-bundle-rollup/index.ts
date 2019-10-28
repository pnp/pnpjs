// ** import the ambient augmentation
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists/web";
import "@pnp/sp/src/items/list";

// you could add custom extension methods here to ensure they are always included in your version of the library

export {
    Web,
    Webs,
} from "@pnp/sp/src/webs";

export {
    List,
    Lists,
} from "@pnp/sp/src/lists";

export {
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
