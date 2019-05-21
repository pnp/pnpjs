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
import { extend, combine } from "@pnp/common";
import { defaultPath, getById, IGetById, deleteable, IDeleteable, updateable, IUpdateable } from "../decorators";
import { IInvokable, body } from "@pnp/odata";
import { graphPatch, graphGet, graphPut } from "../operations";

/**
 * Describes a Drive instance
 *
 */
@defaultPath("drive")
export class _Drive extends _GraphQueryableInstance<IDriveType> implements IDrive {

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
export interface IDrive extends IInvokable, IGraphQueryableInstance<IDriveType> {
    readonly root: IRoot;
    readonly list: IGraphQueryableInstance;
    readonly recent: IDriveItems;
    readonly sharedWithMe: IDriveItems;
}
export interface _Drive extends IInvokable { }
export const Drive = graphInvokableFactory<IDrive>(_Drive);

/**
 * Describes a collection of Drive objects
 *
 */
@defaultPath("drives")
@getById(Drive)
export class _Drives extends _GraphQueryableCollection<IDriveType[]> implements IDrives { }
export interface IDrives extends IInvokable, IGetById<IDrive>, IGraphQueryableCollection<IDriveType[]> { }
export interface _Drives extends IInvokable, IGetById<IDrive> { }
export const Drives = graphInvokableFactory<IDrives>(_Drives);

/**
 * Describes a Root instance
 *
 */
@defaultPath("root")
export class _Root extends _GraphQueryableInstance<IDrive> implements IRoot {

    public get children(): IDriveItems {
        return DriveItems(this, "children");
    }

    public search(query: string): Promise<any> {
        const searcher = this.clone(Root);
        searcher.query.set("search", `'${query}'`);
        return searcher();
    }

    public get thumbnails(): IGraphQueryableCollection {
        return GraphQueryableCollection(this, "thumbnails");
    }
}
export interface IRoot extends IInvokable, IGraphQueryableInstance<IDrive> {
    readonly children: IDriveItems;
    readonly thumbnails: IGraphQueryableCollection;
    search(query: string): Promise<any>;
}
export interface _Root extends IInvokable { }
export const Root = graphInvokableFactory<IRoot>(_Root);

/**
 * Describes a Drive Item instance
 *
 */
@deleteable()
@updateable()
export class _DriveItem extends _GraphQueryableInstance<any> implements IDriveItem {

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
        return graphPatch(this, body(extend(parentReference, { name })));
    }

    public getContent(): Promise<any> {
        return graphGet(this.clone(DriveItem, "content"));
    }

    public setContent(content: any): Promise<{ id: string, name: string, size: number }> {
        return graphPut(this.clone(DriveItem, "content"), {
            body: content,
        });
    }
}
export interface IDriveItem extends IInvokable, IDeleteable, IUpdateable, IGraphQueryableInstance<any> {
    readonly children: IDriveItems;
    readonly thumbnails: IGraphQueryableCollection;
    readonly versions: IGraphQueryableCollection<IDriveItemVersionInfo>;
    move(parentReference: { id: "string" }, name: string): Promise<void>;
    getContent(): Promise<any>;
}
export interface _DriveItem extends IInvokable, IDeleteable, IUpdateable { }
export const DriveItem = graphInvokableFactory<IDriveItem>(_DriveItem);

/**
 * Describes a collection of Drive Item objects
 *
 */
@getById(DriveItem)
export class _DriveItems extends _GraphQueryableCollection implements IDriveItems { }
export interface IDriveItems extends IInvokable, IGetById<IDriveItem>, IGraphQueryableCollection { }
export interface _DriveItems extends IInvokable, IGetById<IDriveItem> { }
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
