// import { DefaultRuntime, IConfigOptions, ISPFXContext, Runtime, ITypedHash } from "@pnp/common";
import { Queryable2 } from "@pnp/queryable";

/**
 * Root of the SharePoint REST module
 */
export class SPRest2 {

    protected _root: Queryable2;

    /**
     * Creates a new instance of the SPRest class
     *
     * @param root Establishes a root url/configuration for
     */
    constructor(root: string | Queryable2 = "") {

        if (typeof root === "string") {
            this._root = new Queryable2(root);
        } else {
            this._root = root;
        }
    }

    public using(behavior: (intance: Queryable2) => Queryable2): this {

        this._root.using(behavior);
        return this;
    }
}

// export const sp2 = new SPRest2();

export function sp(root: string | Queryable2 = ""): SPRest2 {
    return new SPRest2(root);
}
