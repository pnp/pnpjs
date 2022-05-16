import {
    GraphQueryableInstance,
    GraphQueryableCollection,
    _GraphQueryableInstance,
    IGraphQueryableInstance,
    IGraphQueryableCollection,
    _GraphQueryableCollection,
    graphInvokableFactory,
    GraphQueryable,
} from "../graphqueryable.js";
import { Drive as IDriveType } from "@microsoft/microsoft-graph-types";
import { combine } from "@pnp/core";
import { defaultPath, getById, IGetById, deleteable, IDeleteable, updateable, IUpdateable } from "../decorators.js";
import { body, BlobParse } from "@pnp/queryable";
import { graphPatch, graphPost, graphPut } from "../operations.js";

/**
 * Describes a Drive instance
 *
 */
@defaultPath("drive")
export class _Drive extends _GraphQueryableInstance<IDriveType> {

    public get root(): IRoot {
        return Root(this);
    }

    public get list(): IGraphQueryableInstance {
        return GraphQueryableInstance(this, "list");
    }

    public get recent(): IDriveItems {
        return DriveItems(this, "recent");
    }

    public get sharedWithMe(): IDriveItems {
        return DriveItems(this, "sharedWithMe");
    }

    public getItemById(id: string): IDriveItem {
        return DriveItem(this, combine("items", id));
    }
}
export interface IDrive extends _Drive { }
export const Drive = graphInvokableFactory<IDrive>(_Drive);

/**
 * Describes a collection of Drive objects
 *
 */
@defaultPath("drives")
@getById(Drive)
export class _Drives extends _GraphQueryableCollection<IDriveType[]> { }
export interface IDrives extends _Drives, IGetById<IDrive> { }
export const Drives = graphInvokableFactory<IDrives>(_Drives);

/**
 * Describes a Root instance
 *
 */
@defaultPath("root")
export class _Root extends _GraphQueryableInstance<IDrive> {

    public get children(): IDriveItems {
        return DriveItems(this, "children");
    }

    public search(query: string): Promise<any> {
        const searcher = Root(this);
        searcher.query.set("search", `'${query}'`);
        return searcher();
    }

    public get thumbnails(): IGraphQueryableCollection {
        return GraphQueryableCollection(this, "thumbnails");
    }
}
export interface IRoot extends _Root { }
export const Root = graphInvokableFactory<IRoot>(_Root);

/**
 * Describes a Drive Item instance
 *
 */
@deleteable()
@updateable()
export class _DriveItem extends _GraphQueryableInstance<any> {

    public get children(): IDriveItems {
        return DriveItems(this, "children");
    }

    public get thumbnails(): IGraphQueryableCollection {
        return GraphQueryableCollection(this, "thumbnails");
    }

    public get versions(): IGraphQueryableCollection<IDriveItemVersionInfo> {
        return <any>GraphQueryableCollection(this, "versions");
    }

    public move(parentReference: { id: "string" }, name: string): Promise<void> {
        return graphPatch(this, body({ name, ...parentReference }));
    }

    public async getContent(): Promise<Blob> {
        const info = await this();
        const query = GraphQueryable([this, info["@microsoft.graph.downloadUrl"]], null).using(BlobParse());

        query.on.pre(async (url, init, result) => {

            (<any>init).responseType = "arraybuffer";

            return [url, init, result];
        });

        return query();
    }

    public setContent(content: any): Promise<{ id: string; name: string; size: number }> {
        return graphPut(DriveItem(this, "content"), {
            body: content,
        });
    }
}
export interface IDriveItem extends _DriveItem, IDeleteable, IUpdateable { }
export const DriveItem = graphInvokableFactory<IDriveItem>(_DriveItem);

/**
 * Describes a collection of Drive Item objects
 *
 */
@getById(DriveItem)
export class _DriveItems extends _GraphQueryableCollection {
    public async add(filename: string, content: string): Promise<IDriveItemAddResult> {

        // because the graph is not consistent in how it addresses
        // resources through the path, we have to do some url manipulation
        const parent = this.getParent(_DriveItems);
        parent.concat(`:/${filename}:/content`);

        const data = await graphPut(parent, { body: content });

        return {
            data,
            driveItem: (<any>this).getById(data.id),
        };
    }

    /**
     * Adds a folder to this collection of drive items
     * @param name Name of the new folder
     * @returns result with folder data and chainable drive item object
     */
    public async addFolder(name: string): Promise<IDriveItemAddResult> {

        const postBody = {
            name,
            folder: {},
            "@microsoft.graph.conflictBehavior": "rename",
        };

        const data = await graphPost(this, body(postBody));

        return {
            data,
            driveItem: (<any>this).getById(data.id),
        };
    }
}
export interface IDriveItems extends _DriveItems, IGetById<IDriveItem> { }
export const DriveItems = graphInvokableFactory<IDriveItems>(_DriveItems);

/**
 * IDriveItemAddResult
 */
export interface IDriveItemAddResult {
    data: any;
    driveItem: IDriveItem;
}

export interface IDriveItemVersionInfo {
    id: string;
    lastModifiedBy: {
        user: {
            id: string;
            displayName: string;
        };
    };
    lastModifiedDateTime: string;
    size: number;
}
