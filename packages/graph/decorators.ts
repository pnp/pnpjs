import { GraphCollection, IGraphCollection, IGraphQueryable, graphDelete, graphPatch, graphPost } from "./graphqueryable.js";
import { body, errorCheck, headers } from "@pnp/queryable";

/**
 * Decorator used to specify the default path for Queryable objects
 *
 * @param path
 */
export function defaultPath(path: string) {

    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            constructor(...args: any[]) {
                super(args[0], args.length > 1 && args[1] !== undefined ? args[1] : path);
            }
        };
    };
}

/**
 * Adds the delete method to the tagged class
 */
export function deleteable() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public delete(this: IGraphQueryable): Promise<void> {
                return graphDelete(this);
            }
        };
    };
}

export interface IDeleteable {
    /**
     * Delete this instance
     */
    delete(): Promise<void>;
}

/**
 * Adds the delete method to the tagged class
 */
export function deleteableWithETag() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public delete(this: IGraphQueryable, eTag = "*"): Promise<void> {
                return graphDelete(this, headers({
                    "If-Match": eTag,
                }));
            }
        };
    };
}

export interface IDeleteableWithETag {
    /**
     * Delete this instance
     */
    delete(eTag?: string): Promise<void>;
}

/**
 * Adds the update method to the tagged class
 */
export function updateable() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public update(this: IGraphQueryable, props: any): Promise<T> {
                return graphPatch(this, body(props));
            }
        };
    };
}

export interface IUpdateable<T = any> {
    /**
     * Update the properties of an event object
     *
     * @param props Set of properties to update
     */
    update(props: T): Promise<T>;
}

/**
 * Adds the update method to the tagged class
 */
export function updateableWithETag() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public update(this: IGraphQueryable, props: any, eTag = "*"): Promise<T> {
                return graphPatch(this, body(props, headers({
                    "If-Match": eTag,
                })));
            }
        };
    };
}

export interface IUpdateableWithETag<T = any> {
    /**
     * Update the properties of an event object
     *
     * @param props Set of properties to update
     */
    update(props: T, eTag?: string): Promise<T>;
}

/**
 * Adds the add method to the tagged class
 */
export function addable() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public add(this: IGraphQueryable, props: any): Promise<void> {
                return graphPost(this, body(props));
            }
        };
    };
}

export interface IAddable<T = any, R = { id: string }> {
    /**
     * Adds a new item to this collection
     *
     * @param props properties used to create the new thread
     */
    add(props: T): Promise<R>;
}

/**
 * Adds the getById method to a collection
 */
export function getById<R>(factory: (...args: any[]) => R) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public getById(this: IGraphQueryable, id: string): R {
                return factory(this, id);
            }
        };
    };
}
export interface IGetById<R = any, T = string> {
    /**
     * Adds a new item to this collection
     *
     * @param props properties used to create the new thread
     */
    getById(id: T): R;
}

/**
 * Adds the getByName method to a collection
 */
export function getByName<R>(factory: (...args: any[]) => R) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public getByName(this: IGraphQueryable, name: string): R {
                return factory(this, name);
            }
        };
    };
}
export interface IGetByName<R = any, T = string> {
    /**
     * Adds a new item to this collection
     *
     * @param props properties used to create the new thread
     */
    getByName(name: T): R;
}


export function deltaEnabled() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends { new(...args: any[]): {} }>(target: T) {

        return class extends target {
            public delta(this: IGraphQueryable, token?: string): Promise<IGraphCollection<any>> {
                const path = `delta${(token) ? `(token=${token})` : ""}`;

                const query: IGraphCollection<any> = <any>GraphCollection(this, path);
                query.on.parse.replace(errorCheck);
                query.on.parse(async (url: URL, response: Response, result: any): Promise<[URL, Response, any]> => {

                    const json = await response.json();
                    const nextLink = json["@odata.nextLink"];
                    const deltaLink = json["@odata.deltaLink"];

                    result = {
                        // TODO:: update docs to show how to load next with async iterator
                        next: () => (nextLink ? GraphCollection([this, nextLink]) : null),
                        delta: () => (deltaLink ? GraphCollection([query, deltaLink])() : null),
                        values: json.value,
                    };

                    return [url, response, result];
                });

                return query();
            }
        };
    };
}

export interface IDeltaEnabled<T = any> {
    /**
     * Gets the delta of the queryable
     *
     */
    delta(): Promise<T>;
}

export interface IDeltaItems {
    next: IGraphCollection<IDeltaItems>;
    delta: IGraphCollection<IDeltaItems>;
    values: any[];
}