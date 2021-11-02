import { TimelinePipe } from "@pnp/core";
import { ISPQueryable, SPQueryable, SPInit } from "./spqueryable.js";

export class SPFI {

    protected _root: ISPQueryable;

    /**
     * Creates a new instance of the SPFI class
     *
     * @param root Establishes a root url/configuration
     */
    constructor(root: SPInit = "") {

        this._root = SPQueryable(root);
    }

    /**
     * Applies one or more behaviors which will be inherited by all instances chained from this root
     *
     */
    public using(...behaviors: TimelinePipe[]): this {

        this._root.using(...behaviors);
        return this;
    }

    /**
     * Used by extending classes to create new objects directly from the root
     *
     * @param factory The factory for the type of object to create
     * @returns A configured instance of that object
     */
    protected create<T extends ISPQueryable>(factory: (q: ISPQueryable, path?: string) => T, path?: string): T {
        return factory(this._root, path);
    }
}

export function spfi(root: SPInit | SPFI = ""): SPFI {

    if (typeof root === "object" && !Reflect.has(root, "length")) {
        root = (<any>root)._root;
    }

    return new SPFI(<any>root);
}
