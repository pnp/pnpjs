import {
    _SPCollection,
    spInvokableFactory,
    SPQueryable,
    _SPInstance,
} from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";

/**
 * Describes a recycle bin item
 *
 */
export class _RecycleBinItem extends _SPInstance<IRecycleBinItemObject> {
    /**
     * Delete's the Recycle Bin item
     *
     */
    public delete(): Promise<void> {
        return spPost(SPQueryable(this, "DeleteObject"));
    }

    /**
     * Moves Recycle Bin item to the Second-stage Recycle Bin
     *
     */
    public moveToSecondStage(): Promise<void> {
        return spPost(SPQueryable(this, "MoveToSecondStage"));
    }

    /**
     * Restore the the Recycle Bin item
     *
     */
    public restore(): Promise<void> {
        return spPost(SPQueryable(this, "Restore"));
    }
}
export interface IRecycleBinItem extends _RecycleBinItem { }
export const RecycleBinItem = spInvokableFactory<IRecycleBinItem>(_RecycleBinItem);

/**
 * Describes a collection of recycle bin items
 *
 */
@defaultPath("RecycleBin")
export class _RecycleBin extends _SPCollection<IRecycleBinItemObject[]> {

    /**
    * Gets a Recycle Bin Item by id
    *
    * @param id The string id of the recycle bin item
    */
    public getById(id: string): IRecycleBinItem {
        return RecycleBinItem(this).concat(`('${id}')`);
    }

    /**
     * Delete's all items in the Recycle Bin
     *
     */
    public deleteAll(): Promise<void> {
        return spPost(SPQueryable(this, "DeleteAll"));
    }

    /**
     * Delete's all items in the Second-stage Recycle Bin
     *
     */
    public deleteAllSecondStageItems(): Promise<void> {
        return spPost(SPQueryable(this, "DeleteAllSecondStageItems"));
    }

    /**
     * Moves all items in the Recycle Bin to the Second-stage Recycle Bin
     *
     */
    public moveAllToSecondStage(): Promise<void> {
        return spPost(SPQueryable(this, "MoveAllToSecondStage"));
    }

    /**
     * Restore all items in the Recycle Bin
     *
     */
    public restoreAll(): Promise<void> {
        return spPost(SPQueryable(this, "RestoreAll"));
    }
}
export interface IRecycleBin extends _RecycleBin { }
export const RecycleBin = spInvokableFactory<IRecycleBin>(_RecycleBin);

export interface IRecycleBinItemObject {
    AuthorEmail: string;
    AuthorName: string;
    DeletedByEmail: string;
    DeletedByName: string;
    DeletedDate: string;
    DeletedDateLocalFormatted: string;
    DirName: string;
    DirNamePath: {
        DecodedUrl: string;
    };
    Id: string;
    ItemState: number;
    ItemType: number;
    LeafName: string;
    LeafNamePath: {
        DecodedUrl: string;
    };
    Size: number;
    Title: string;
}
