import { TimelinePipe } from "@pnp/core";
import { GraphQueryable, IGraphQueryable } from "./graphqueryable.js";

export class GraphRest {

    protected _root: IGraphQueryable;

    /**
     * Creates a new instance of the GraphRest class
     *
     * @param root Establishes a root url/configuration for
     */
    constructor(root: string | IGraphQueryable = "") {

        this._root = GraphQueryable(root);
    }

    public using(behavior: TimelinePipe): this {

        this._root.using(behavior);
        return this;
    }

    /**
     * Used by extending classes to create new objects directly from the root
     *
     * @param factory The factory for the type of object to create
     * @returns A configured instance of that object
     */
    protected create<T>(factory: (q: IGraphQueryable, path?: string) => T, path?: string): T {
        return factory(this._root, path);
    }
}

export function graph(root: string | IGraphQueryable = ""): GraphRest {
    return new GraphRest(root);
}
