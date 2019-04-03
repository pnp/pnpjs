import { GraphQueryableCollection, defaultPath } from "./graphqueryable";
import { Person as IPerson } from "@microsoft/microsoft-graph-types";

@defaultPath("people")
export class People extends GraphQueryableCollection<IPerson[]> { }
