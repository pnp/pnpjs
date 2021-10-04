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
import { body, FromQueryable, BlobParse } from "@pnp/queryable";
import { graphPatch, graphPut } from "../operations.js";

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
export class _Drives extends _GraphQueryableCollection<IDriveType[]> {
    public getById(id: string): IDrive {
        return Drive(this.getUrlBase(), `drives/${id}`);
    }
}
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

    // TODO:: make sure this works
    public async getContent(): Promise<Blob> {
        const info = await this();
        const query = GraphQueryable(info["@microsoft.graph.downloadUrl"], null).using(BlobParse).using(FromQueryable(this));

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
export class _DriveItems extends _GraphQueryableCollection { }
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
