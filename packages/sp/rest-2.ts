// import { DefaultRuntime, IConfigOptions, ISPFXContext, Runtime, ITypedHash } from "@pnp/core";
import { Queryable2 } from "@pnp/queryable";
import { ISPQueryable, SPQueryable } from "./sharepointqueryable";

/**
 * Root of the SharePoint REST module
 */
export class SPRest2 {

    private _root: ISPQueryable;

    /**
     * Creates a new instance of the SPRest class
     *
     * @param root Establishes a root url/configuration for
     */
    constructor(root: string | ISPQueryable = "") {

        this._root = typeof root === "string" ? SPQueryable(root) : root;
    }

    public using(behavior: (intance: Queryable2) => Queryable2): this {

        // TODO:: some typing issues here
        this._root.using(<any>behavior);
        return this;
    }

    /**
     * Used by extending classes to create new objects directly from the root
     *
     * @param factory The factory for the type of object to create
     * @returns A configured instance of that object
     */
    protected create<T>(factory: (q: ISPQueryable, path?: string) => T, path?: string): T {
        return factory(this._root, path);
    }
}

// export const sp2 = new SPRest2();

export function sp(root: string | ISPQueryable = ""): SPRest2 {
    return new SPRest2(root);
}
