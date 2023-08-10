import { defaultPath } from "../decorators.js";
import { graphInvokableFactory, _GraphCollection } from "../graphqueryable.js";
import { Operation as IOperationType } from "@microsoft/microsoft-graph-types";

/**
 * Operations
 */
@defaultPath("operations")
export class _Operations extends _GraphCollection<IOperationType[]> {}
export interface IOperations extends _Operations { }
export const Operations = graphInvokableFactory<IOperations>(_Operations);
