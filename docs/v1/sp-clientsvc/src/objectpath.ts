import { TypedHash, extend, objectDefinedNotNull } from "@pnp/common";
import { objectPath } from "./opactionbuilders";
import { property, staticProperty } from "./opbuilders";
import { writeObjectPathBody } from "./utils";

/**
 * Defines the properties and method of an ObjectPath
 */
export interface IObjectPath {
    /**
     * The ObjectPath xml node
     */
    path: string;
    /**
     * Collection of xml action nodes
     */
    actions: string[];
    /**
     * The id of this object path, used for processing, not set directly
     */
    id: number | undefined;
}

/**
 * Represents an ObjectPath used when querying ProcessQuery
 */
export class ObjectPath implements IObjectPath {
    constructor(public path: string, public actions: string[] = [], public id = -1, public replaceAfter: IObjectPath[] = []) { }
}

/**
 * Replaces all found instance of the $$ID$$ placeholder in the supplied xml string
 * 
 * @param id New value to be insterted
 * @param xml The existing xml fragment in which the replace should occur
 */
export function opSetId(id: string, xml: string): string {
    return xml.replace(/\$\$ID\$\$/g, id);
}

/**
 * Replaces all found instance of the $$PATH_ID$$ placeholder in the supplied xml string
 * 
 * @param id New value to be insterted
 * @param xml The existing xml fragment in which the replace should occur
 */
export function opSetPathId(id: string, xml: string): string {
    return xml.replace(/\$\$PATH_ID\$\$/g, id);
}

/**
 * Replaces all found instance of the $$PARENT_ID$$ placeholder in the supplied xml string
 * 
 * @param id New value to be insterted
 * @param xml The existing xml fragment in which the replace should occur
 */
export function opSetParentId(id: string, xml: string): string {
    return xml.replace(/\$\$PARENT_ID\$\$/g, id);
}

/**
 * Replaces all found instance of the $$OP_PARAM_ID$$ placeholder in the supplied xml string
 * 
 * @param map A mapping where [index] = replaced_object_path_id
 * @param xml The existing xml fragment in which the replace should occur
 * @param indexMapper Used when creating batches, not meant for direct use external to this library
 */
export function opSetPathParamId(map: number[], xml: string, indexMapper: (n: number) => number = (n) => n): string {

    // this approach works because input params must come before the things that need them
    // meaning the right id will always be in the map
    const matches = /\$\$OP_PARAM_ID_(\d+)\$\$/ig.exec(xml);
    if (matches !== null) {
        for (let i = 1; i < matches.length; i++) {
            const index = parseInt(matches[i], 10);
            const regex = new RegExp(`\\$\\$OP_PARAM_ID_${index}\\$\\$`, "ig");
            xml = xml.replace(regex, map[indexMapper(index)].toString());
        }
    }

    return xml;
}

/**
 * Represents a collection of IObjectPaths
 */
export class ObjectPathQueue {

    private _xml: string | null;
    private _contextIndex = -1;
    private _siteIndex = -1;
    private _webIndex = -1;

    constructor(protected _paths: IObjectPath[] = [], protected _relationships: TypedHash<number[]> = {}) { }

    /**
     * Adds an object path to the queue
     * 
     * @param op The action to add
     * @returns The index of the added object path
     */
    public add(op: IObjectPath): number {

        this.dirty();
        this._paths.push(op);
        return this.lastIndex;
    }

    public addChildRelationship(parentIndex: number, childIndex: number) {
        if (objectDefinedNotNull(this._relationships[`_${parentIndex}`])) {
            this._relationships[`_${parentIndex}`].push(childIndex);
        } else {
            this._relationships[`_${parentIndex}`] = [childIndex];
        }
    }

    public getChildRelationship(parentIndex: number): number[] {
        if (objectDefinedNotNull(this._relationships[`_${parentIndex}`])) {
            return this._relationships[`_${parentIndex}`];
        } else {
            return [];
        }
    }

    public getChildRelationships(): TypedHash<number[]> {
        return this._relationships;
    }

    /**
     * Appends an action to the supplied IObjectPath, replacing placeholders
     * 
     * @param op IObjectPath to which the action will be appended
     * @param action The action to append
     */
    public appendAction(op: IObjectPath, action: string): this {

        this.dirty();
        op.actions.push(action);
        return this;
    }

    /**
     * Appends an action to the last IObjectPath in the collection
     * 
     * @param action 
     */
    public appendActionToLast(action: string): this {

        return this.appendAction(this.last, action);
    }

    /**
     * Creates a linked copy of this ObjectPathQueue
     */
    public copy(): ObjectPathQueue {
        const copy = new ObjectPathQueue(this.toArray(), extend({}, this._relationships));
        copy._contextIndex = this._contextIndex;
        copy._siteIndex = this._siteIndex;
        copy._webIndex = this._webIndex;
        return copy;
    }

    /**
     * Creates an independent clone of this ObjectPathQueue
     */
    public clone(): ObjectPathQueue {
        const clone = new ObjectPathQueue(this.toArray().map(p => Object.assign({}, p)), extend({}, this._relationships));
        clone._contextIndex = this._contextIndex;
        clone._siteIndex = this._siteIndex;
        clone._webIndex = this._webIndex;
        return clone;
    }

    /**
     * Gets a copy of this instance's paths
     */
    public toArray(): IObjectPath[] {
        return this._paths.slice(0);
    }

    /**
     * The last IObjectPath instance added to this collection
     */
    public get last(): IObjectPath {

        if (this._paths.length < 1) {
            return null;
        }

        return this._paths[this.lastIndex];
    }

    /**
     * Index of the last IObjectPath added to the queue
     */
    public get lastIndex(): number {
        return this._paths.length - 1;
    }

    /**
     * Gets the index of the current site in the queue
     */
    public get siteIndex(): number {

        if (this._siteIndex < 0) {

            // this needs to be here in case we create it
            const contextIndex = this.contextIndex;

            this._siteIndex = this.add(property("Site",
                // actions
                objectPath()));

            this.addChildRelationship(contextIndex, this._siteIndex);
        }

        return this._siteIndex;
    }

    /**
     * Gets the index of the current web in the queue
     */
    public get webIndex(): number {

        if (this._webIndex < 0) {

            // this needs to be here in case we create it
            const contextIndex = this.contextIndex;

            this._webIndex = this.add(property("Web",
                // actions
                objectPath()));

            this.addChildRelationship(contextIndex, this._webIndex);
        }

        return this._webIndex;
    }

    /**
     * Gets the index of the Current context in the queue, can be used to establish parent -> child rels
     */
    public get contextIndex(): number {
        if (this._contextIndex < 0) {
            this._contextIndex = this.add(staticProperty("Current", "{3747adcd-a3c3-41b9-bfab-4a64dd2f1e0a}",
                // actions
                objectPath()));
        }

        return this._contextIndex;
    }

    public toBody(): string {

        if (objectDefinedNotNull(this._xml)) {
            return this._xml;
        }

        // create our xml payload
        this._xml = writeObjectPathBody(this.toIndexedTree());

        return this._xml;
    }

    /**
     * Conducts the string replacements for id, parent id, and path id
     * 
     * @returns The tree with all string replacements made
     */
    public toIndexedTree(): IObjectPath[] {

        let builderIndex = -1;
        let lastOpId = -1;
        const idIndexMap: number[] = [];

        return this.toArray().map((op, index, arr) => {

            const opId = ++builderIndex;

            // track the array index => opId relationship
            idIndexMap.push(opId);

            // do path replacements
            op.path = opSetPathParamId(idIndexMap, opSetId(opId.toString(), op.path));

            if (lastOpId >= 0) {
                // if we have a parent do the replace
                op.path = opSetParentId(lastOpId.toString(), op.path);
            }

            // rewrite actions with placeholders replaced
            op.actions = op.actions.map(a => {
                const actionId = ++builderIndex;
                return opSetId(actionId.toString(), opSetPathId(opId.toString(), a));
            });

            // handle any specific child relationships
            this.getChildRelationship(index).forEach(childIndex => {
                // set the parent id for our non-immediate children, thus removing the token so it isn't overwritten
                arr[childIndex].path = opSetParentId(opId.toString(), arr[childIndex].path);
            });

            // and remember our last object path id for the parent replace above
            lastOpId = opId;

            return op;
        });
    }

    /**
     * Dirties this queue clearing any cached data
     */
    protected dirty(): void {
        this._xml = null;
    }
}
