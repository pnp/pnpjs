import { SharePointQueryable, SharePointQueryableCollection, SharePointQueryableInstance } from "./sharepointqueryable";

/**
 * Describes a collection of Field objects
 *
 */
export class Forms extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the Fields class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "forms") {
        super(baseUrl, path);
    }

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
