import { addProp } from "@pnp/queryable";
import { DocumentSetVersions, _ListItem } from "./types.js";

declare module "./types" {
    interface _ListItem {
        readonly documentSetVersions: IDocumentSetVersions;
    }
    interface IListItem {
        readonly documentSetVersions: IDocumentSetVersions;
    }
}

addProp(_ListItem, "documentSetVersions", DocumentSetVersions);
