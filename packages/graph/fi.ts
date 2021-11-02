import { TimelinePipe } from "@pnp/core";
import { GraphQueryable, IGraphInvokableFactory, IGraphQueryable, GraphInit } from "./graphqueryable.js";

export class GraphFI {

    protected _root: IGraphQueryable;

    /**
     * Creates a new instance of the GraphFI class
     *
     * @param root Establishes a root url/configuration
     */
    constructor(root: GraphInit = "") {

        this._root = GraphQueryable(root);
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
    protected create<T extends IGraphQueryable>(factory: IGraphInvokableFactory<T>, path?: string): T {
        return factory(this._root, path);
    }
}

export function graphfi(root: GraphInit | GraphFI = ""): GraphFI {

    if (typeof root === "object" && !Reflect.has(root, "length")) {
        root = (<any>root)._root;
    }

    return new GraphFI(<any>root);
}
