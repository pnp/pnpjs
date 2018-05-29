import { SPConfiguration, sp } from "@pnp/sp";
import { ClientSvcQueryable, IObjectPathBatch, ObjectPathBatch, objectPath, staticMethod } from "@pnp/sp-clientsvc";
import { ITermStore, ITermStores, TermStore, TermStores } from "./termstores";

/**
 * Defines the publicly visible members of Taxonomy
 */
export interface ITaxonomySession {

    /**
     * The collection of term stores
     */
    termStores: ITermStores;

    /**
     * Provides access to sp.setup from @pnp/sp
     * 
     * @param config Configuration
     */
    setup(config: SPConfiguration): void;

    /**
     * Creates a new batch
     */
    createBatch(): IObjectPathBatch;

    /**
     * Gets the default keyword termstore for this session
     */
    getDefaultKeywordTermStore(): ITermStore;

    /**
     * Gets the default site collection termstore for this session
     */
    getDefaultSiteCollectionTermStore(): ITermStore;
}

/**
 * The root taxonomy object
 */
export class Session extends ClientSvcQueryable implements ITaxonomySession {

    constructor(webUrl = "") {
        super(webUrl);

        // everything starts with the session
        this._objectPaths.add(staticMethod("GetTaxonomySession", "{981cbc68-9edc-4f8d-872f-71146fcbb84f}",
            // actions
            objectPath()));
    }

    /**
     * The collection of term stores
     */
    public get termStores(): ITermStores {
        return new TermStores(this);
    }

    /**
     * Provides access to sp.setup from @pnp/sp
     * 
     * @param config Configuration
     */
    public setup(config: SPConfiguration): void {
        sp.setup(config);
    }

    /**
     * Creates a new batch
     */
    public createBatch(): IObjectPathBatch {
        return new ObjectPathBatch(this.toUrl());
    }

    /**
     * Gets the default keyword termstore for this session
     */
    public getDefaultKeywordTermStore(): ITermStore {
        return this.getChild(TermStore, "GetDefaultKeywordsTermStore", null);
    }

    /**
     * Gets the default site collection termstore for this session
     */
    public getDefaultSiteCollectionTermStore(): ITermStore {
        return this.getChild(TermStore, "GetDefaultSiteCollectionTermStore", null);
    }
}
