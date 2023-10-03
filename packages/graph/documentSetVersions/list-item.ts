import { addProp } from "@pnp/queryable";
import { DocumentSetVersions, IDocumentSetVersions } from "./types.js";
import { _ListItem } from "../list-item/types.js";

declare module "../list-item/types" {
    interface _ListItem {
        readonly documentSetVersions: IDocumentSetVersions;
    }
    interface IListItem {
        readonly documentSetVersions: IDocumentSetVersions;
    }
}

addProp(_ListItem, "documentSetVersions", DocumentSetVersions);