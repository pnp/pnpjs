import { SharePointQueryableCollection, SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";

/**
 * Describes a collection of Field objects
 *
 */
@defaultPath("forms")
export class Forms extends SharePointQueryableCollection {
    public getById = this._getById(Form);
}

/**
 * Describes a single of Form instance
 *
 */
export class Form extends SharePointQueryableInstance { }
