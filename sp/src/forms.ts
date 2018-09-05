import { SharePointQueryableCollection, SharePointQueryableInstance, defaultPath } from "./sharepointqueryable";

/**
 * Describes a collection of Field objects
 *
 */
@defaultPath("forms")
export class Forms extends SharePointQueryableCollection {
    /**	
     * Gets a form by id	
     *	
     * @param id The guid id of the item to retrieve	
     */
    public getById(id: string): Form {
        const i = new Form(this);
        i.concat(`('${id}')`);
        return i;
    }
}

/**
 * Describes a single of Form instance
 *
 */
export class Form extends SharePointQueryableInstance { }
