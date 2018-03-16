import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";

export interface OneNoteMethods {
    notebooks: Notebooks;
    sections: Sections;
    pages: Pages;
}

/**
 * Represents a onenote entity
 */
export class OneNote extends GraphQueryableInstance implements OneNoteMethods {

    constructor(baseUrl: string | GraphQueryable, path = "onenote") {
        super(baseUrl, path);
    }

    public get notebooks(): Notebooks {
        return new Notebooks(this);
    }

    public get sections(): Sections {
        return new Sections(this);
    }

    public get pages(): Pages {
        return new Pages(this);
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
     * Gets a notebook instance by id
     * 
     * @param id Notebook id
     */
    public getById(id: string): Notebook {
        return new Notebook(this, id);
    }

    /**
     * Create a new notebook as specified in the request body.
     * 
     * @param displayName Notebook display name
     */
    public add(displayName: string): Promise<NotebookAddResult> {

        const postBody = {
            displayName: displayName,
        };

        return this.postCore({
            body: JSON.stringify(postBody),
        }).then(r => {
            return {
                data: r,
                notebook: this.getById(r.id),
            };
        });
    }
}

/**
 * Describes a notebook instance
 *
 */
export class Notebook extends GraphQueryableInstance {
    constructor(baseUrl: string | GraphQueryable, path?: string) {
        super(baseUrl, path);
    }

    public get sections(): Sections {
        return new Sections(this);
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

    /**
     * Gets a section instance by id
     * 
     * @param id Section id
     */
    public getById(id: string): Section {
        return new Section(this, id);
    }

    /**
     * Adds a new section
     * 
     * @param displayName New section display name
     */
    public add(displayName: string): Promise<SectionAddResult> {

        const postBody = {
            displayName: displayName,
        };

        return this.postCore({
            body: JSON.stringify(postBody),
        }).then(r => {
            return {
                data: r,
                section: this.getById(r.id),
            };
        });
    }
}

/**
 * Describes a sections instance
 *
 */
export class Section extends GraphQueryableInstance {
    constructor(baseUrl: string | GraphQueryable, path?: string) {
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
    notebook: Notebook;
}

export interface SectionAddResult {
    data: any;
    section: Section;
}
