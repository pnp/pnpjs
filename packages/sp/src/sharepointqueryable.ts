import {
    combine,
    isUrlAbsolute,
    FetchOptions,
    mergeOptions,
    extend,
    getGUID,
    jsS,
} from "@pnp/common";
import {
    ODataParser,
    ODataQueryable,
    RequestContext,
} from "@pnp/odata";
import { Logger, LogLevel } from "@pnp/logging";
import { SPBatch } from "./batch";
import { SPHttpClient } from "./net/sphttpclient";
import { toAbsoluteUrl } from "./utils/toabsoluteurl";
import { metadata } from "./utils/metadata";

export interface SharePointQueryableConstructor<T> {
    new(baseUrl: string | SharePointQueryable, path?: string): T;
}

/**
 * SharePointQueryable Base Class
 *
 */
export class SharePointQueryable<GetType = any> extends ODataQueryable<SPBatch, GetType> {

    protected _forceCaching: boolean;

    /**
     * Creates a new instance of the SharePointQueryable class
     *
     * @constructor
     * @param baseUrl A string or SharePointQueryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | SharePointQueryable, path?: string) {
        super();

        this._forceCaching = false;

        if (typeof baseUrl === "string") {
            // we need to do some extra parsing to get the parent url correct if we are
            // being created from just a string.

            if (isUrlAbsolute(baseUrl) || baseUrl.lastIndexOf("/") < 0) {
                this._parentUrl = baseUrl;
                this._url = combine(baseUrl, path);
            } else if (baseUrl.lastIndexOf("/") > baseUrl.lastIndexOf("(")) {
                // .../items(19)/fields
                const index = baseUrl.lastIndexOf("/");
                this._parentUrl = baseUrl.slice(0, index);
                path = combine(baseUrl.slice(index), path);
                this._url = combine(this._parentUrl, path);
            } else {
                // .../items(19)
                const index = baseUrl.lastIndexOf("(");
                this._parentUrl = baseUrl.slice(0, index);
                this._url = combine(baseUrl, path);
            }
        } else {
            this.extend(baseUrl, path);
            const target = baseUrl.query.get("@target");
            if (target !== undefined) {
                this.query.set("@target", target);
            }
        }
    }

    /**
     * Creates a new instance of the supplied factory and extends this into that new instance
     *
     * @param factory constructor for the new SharePointQueryable
     */
    public as<T>(factory: SharePointQueryableConstructor<T>): T {
        const o = <T>new factory(this._url, null);
        return extend(o, this, true);
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {

        const aliasedParams = new Map<string, string>(this.query);

        let url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, (match, labelName, value) => {
            Logger.write(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, LogLevel.Verbose);
            aliasedParams.set(labelName, `'${value}'`);
            return labelName;
        });

        if (aliasedParams.size > 0) {
            const char = url.indexOf("?") > -1 ? "&" : "?";
            url += `${char}${Array.from(aliasedParams).map((v: [string, string]) => v[0] + "=" + v[1]).join("&")}`;
        }

        return url;
    }

    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): this {
        if (selects.length > 0) {
            this.query.set("$select", selects.join(","));
        }
        return this;
    }

    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    public expand(...expands: string[]): this {
        if (expands.length > 0) {
            this.query.set("$expand", expands.join(","));
        }
        return this;
    }

    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends SharePointQueryable>(
        factory: SharePointQueryableConstructor<T>,
        baseUrl: string | SharePointQueryable = this.parentUrl,
        path?: string,
        batch?: SPBatch): T {

        let parent = new factory(baseUrl, path).configureFrom(this);

        const t = "@target";
        if (this.query.has(t)) {
            parent.query.set(t, this.query.get(t));
        }
        if (batch !== undefined) {
            parent = parent.inBatch(batch);
        }
        return parent;
    }

    /**
     * Clones this SharePointQueryable into a new SharePointQueryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     */
    protected clone<T extends SharePointQueryable>(factory: SharePointQueryableConstructor<T>, additionalPath?: string, includeBatch = true): T {

        const clone: T = super._clone(new factory(this, additionalPath), { includeBatch });

        // handle sp specific clone actions
        const t = "@target";
        if (this.query.has(t)) {
            clone.query.set(t, this.query.get(t));
        }

        return clone;
    }

    /**
     * Converts the current instance to a request context
     *
     * @param verb The request verb
     * @param options The set of supplied request options
     * @param parser The supplied ODataParser instance
     * @param pipeline Optional request processing pipeline
     */
    protected toRequestContext<T>(
        verb: string,
        options: FetchOptions = {},
        parser: ODataParser<T>,
        pipeline: Array<(c: RequestContext<T>) => Promise<RequestContext<T>>>): Promise<RequestContext<T>> {

        const dependencyDispose = this.hasBatch ? this._batchDependency : () => { return; };

        return toAbsoluteUrl(this.toUrlAndQuery()).then(url => {

            mergeOptions(options, this._options);

            // build our request context
            const context: RequestContext<T> = {
                batch: this.batch,
                batchDependency: dependencyDispose,
                cachingOptions: this._cachingOptions,
                clientFactory: () => new SPHttpClient(),
                isBatched: this.hasBatch,
                isCached: this._forceCaching || (this._useCaching && /^get$/i.test(verb)),
                options: options,
                parser: parser,
                pipeline: pipeline,
                requestAbsoluteUrl: url,
                requestId: getGUID(),
                verb: verb,
            };

            return context;
        });
    }
}

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class SharePointQueryableCollection<GetType = any[]> extends SharePointQueryable<GetType> {

    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The string representing the filter query
     */
    public filter(filter: string): this {
        this.query.set("$filter", filter);
        return this;
    }

    /**
     * Orders based on the supplied fields
     *
     * @param orderby The name of the field on which to sort
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    public orderBy(orderBy: string, ascending = true): this {
        const o = "$orderby";
        const query = this.query.has(o) ? this.query.get(o).split(",") : [];
        query.push(`${orderBy} ${ascending ? "asc" : "desc"}`);
        this.query.set(o, query.join(","));
        return this;
    }

    /**
     * Skips the specified number of items
     *
     * @param skip The number of items to skip
     */
    public skip(skip: number): this {
        this.query.set("$skip", skip.toString());
        return this;
    }

    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    public top(top: number): this {
        this.query.set("$top", top.toString());
        return this;
    }
}

/**
 * Represents an instance that can be selected
 *
 */
export class SharePointQueryableInstance<GetType = any> extends SharePointQueryable<GetType> {

    /**
     * Curries the update function into the common pieces
     * 
     * @param type 
     * @param mapper 
     */
    protected _update<Return, Props = any, Data = any>(type: string, mapper: (data: Data, props: Props) => Return): (props: Props) => Promise<Return> {
        return (props: any) => this.postCore({
            body: jsS(extend(metadata(type), props)),
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((d: Data) => mapper(d, props));
    }

    /**
    * Deletes this instance
    *
    */
    protected _delete(): Promise<void> {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Deletes this instance with an etag value in the headers
     * 
     * @param eTag eTag to delete
     */
    protected _deleteWithETag(eTag = "*"): Promise<void> {
        return this.postCore({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }
}

/**
 * Decorator used to specify the default path for SharePointQueryable objects
 * 
 * @param path 
 */
export function defaultPath(path: string) {

    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            constructor(...args: any[]) {
                super(args[0], args.length > 1 && args[1] !== undefined ? args[1] : path);
            }
        };
    };
}
