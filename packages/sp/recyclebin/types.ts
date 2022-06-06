import {
    _SPCollection,
    spInvokableFactory,
    _SPInstance,
    SPQueryable
} from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { spGet, spPost } from "../operations.js";

@defaultPath("RecycleBin")
export class _RecycleBin extends _SPCollection<IRecycleBinItem[]> {

    /**
     * Returns a Recycle Bin item
     *
     * @param id The guid of an item in the Recycle Bin collection
     */
    public getById(id: string): Promise<IRecycleBinItem> {
        return spGet(SPQueryable(this, id));
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

export interface IRecycleBinItem {
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
    }
    Size: number;
    Title: string;
}