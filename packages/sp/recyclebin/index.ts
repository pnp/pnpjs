import { addProp } from "@pnp/queryable";
import { _Site } from "../sites/types.js";
import { _Web } from "../webs/types.js";
import { RecycleBin } from "./types.js";

export {
    IRecycleBin,
    IRecycleBinItem,
    RecycleBin
} from "./types.js";

addProp(_Web, "recycleBin", RecycleBin);
addProp(_Site, "recycleBin", RecycleBin);