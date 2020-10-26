import {
    GraphQueryableInstance,
    GraphQueryableCollection,
    _GraphQueryableInstance,
    IGraphQueryableInstance,
    IGraphQueryableCollection,
    _GraphQueryableCollection,
    graphInvokableFactory,
} from "../graphqueryable";
import { Drive as IDriveType } from "@microsoft/microsoft-graph-types";
import { assign, combine, safeGlobal } from "@pnp/common";
import { defaultPath, getById, IGetById, deleteable, IDeleteable, updateable, IUpdateable } from "../decorators";
import { body, BlobParser } from "@pnp/odata";
import { graphPatch, graphPut } from "../operations";

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
        return this.clone(GraphQueryableInstance, "list");
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
export interface IDrive extends _Drive {}
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
        const searcher = this.clone(Root);
        searcher.query.set("search", `'${query}'`);
        return searcher();
    }

    public get thumbnails(): IGraphQueryableCollection {
        return this.clone(GraphQueryableCollection, "thumbnails");
    }
}
export interface IRoot extends _Root {}
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
        return this.clone(GraphQueryableCollection, "thumbnails");
    }

    public get versions(): IGraphQueryableCollection<IDriveItemVersionInfo> {
        return <any>this.clone(GraphQueryableCollection, "versions");
    }

    public move(parentReference: { id: "string" }, name: string): Promise<void> {
        return graphPatch(this, body(assign(parentReference, { name })));
    }

    public async getContent(): Promise<Blob> {
        const info = await this();
        const r = await safeGlobal.fetch(info["@microsoft.graph.downloadUrl"], {
            headers: {
                "accept": "application/json",
            },
            method: "GET",
            responseType: "arraybuffer",
        });

        const p = new BlobParser();
        return p.parse(r);
    }

    public setContent(content: any): Promise<{ id: string, name: string, size: number }> {
        return graphPut(this.clone(DriveItem, "content"), {
            body: content,
        });
    }
}
export interface IDriveItem extends _DriveItem, IDeleteable, IUpdateable {}
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
        },
    };
    lastModifiedDateTime: string;
    size: number;
}
