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
import { assign, combine } from "@pnp/common";
import { defaultPath, getById, IGetById, deleteable, IDeleteable, updateable, IUpdateable } from "../decorators";
import { IInvokable, body } from "@pnp/odata";
import { graphPatch, graphGet, graphPut } from "../operations";

/**
 * Describes a Drive instance
 *
 */
@defaultPath("drive")
export class _Drive extends _GraphQueryableInstance<IDriveType> implements _IDrive {

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
export interface _IDrive {
    readonly root: IRoot;
    readonly list: IGraphQueryableInstance;
    readonly recent: IDriveItems;
    readonly sharedWithMe: IDriveItems;
}
export interface IDrive extends _IDrive, IInvokable, IGraphQueryableInstance<IDriveType> {}
export const Drive = graphInvokableFactory<IDrive>(_Drive);

/**
 * Describes a collection of Drive objects
 *
 */
@defaultPath("drives")
@getById(Drive)
export class _Drives extends _GraphQueryableCollection<IDriveType[]> implements _IDrives { }
export interface _IDrives { }
export interface IDrives extends _IDrives, IInvokable, IGetById<IDrive>, IGraphQueryableCollection<IDriveType[]> { }
export const Drives = graphInvokableFactory<IDrives>(_Drives);

/**
 * Describes a Root instance
 *
 */
@defaultPath("root")
export class _Root extends _GraphQueryableInstance<IDrive> implements _IRoot {

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
export interface _IRoot {
    readonly children: IDriveItems;
    readonly thumbnails: IGraphQueryableCollection;
    search(query: string): Promise<any>;
}
export interface IRoot extends _IRoot, IInvokable, IGraphQueryableInstance<IDrive> {}
export const Root = graphInvokableFactory<IRoot>(_Root);

/**
 * Describes a Drive Item instance
 *
 */
@deleteable()
@updateable()
export class _DriveItem extends _GraphQueryableInstance<any> implements _IDriveItem {

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
        return graphPatch(this, body(assign(parentReference, { name })));
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
export interface _IDriveItem {
    readonly children: IDriveItems;
    readonly thumbnails: IGraphQueryableCollection;
    readonly versions: IGraphQueryableCollection<IDriveItemVersionInfo>;
    move(parentReference: { id: "string" }, name: string): Promise<void>;
    getContent(): Promise<any>;
}
export interface IDriveItem extends _IDriveItem, IInvokable, IDeleteable, IUpdateable, IGraphQueryableInstance<any> {}
export const DriveItem = graphInvokableFactory<IDriveItem>(_DriveItem);

/**
 * Describes a collection of Drive Item objects
 *
 */
@getById(DriveItem)
export class _DriveItems extends _GraphQueryableCollection implements _IDriveItems { }
export interface _IDriveItems { }
export interface IDriveItems extends _IDriveItems, IInvokable, IGetById<IDriveItem>, IGraphQueryableCollection { }
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
