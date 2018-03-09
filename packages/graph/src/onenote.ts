import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";

/**
 * Represents a onenote entity
 */
export class OneNote extends GraphQueryableInstance {

    public get notebooks(): Notebooks {
        return new Notebooks(this);
    }

    public get sections(): Sections {
        return new Sections(this);
    }
}

/**
 * Describes a collection of Notebook objects
 *
 */
export class Notebooks extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "notebooks") {
        super(baseUrl, path);
    }

    /**
     * Create a new notebook as specified in the request body.
     * 
     * @param displayName Notebook display name
     */
    public add(displayName: string): Promise<NotebookAddResult> {

        let postBody = {
            displayName: displayName,
        };

        return this.postCore({
            body: JSON.stringify(postBody),
        }).then(r => {
            return {
                data: r
            };
        });
    }
}

/**
 * Describes a collection of Sections objects
 *
 */
export class Sections extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "sections") {
        super(baseUrl, path);
    }
}

/**
 * Describes a collection of Pages objects
 *
 */
export class Pages extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "pages") {
        super(baseUrl, path);
    }
}

export interface NotebookAddResult {
    data: any;
}
