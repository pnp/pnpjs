import { Dictionary } from "@pnp/common";

export default class MockStorage implements Storage {
    constructor(private _store = new Dictionary<string>(), private _length = 0) { }

    public get length(): number {
        return this._store.count();
    }

    public set length(i: number) {
        this._length = i;
    }

    public clear(): void {
        this._store.clear();
    }

    public getItem(key: string): any {
        return this._store.get(key);
    }

    public key(index: number): string {
        return this._store.getKeys()[index];
    }

    public removeItem(key: string): void {
        this._store.remove(key);
    }

    public setItem(key: string, data: string): void {
        this._store.add(key, data);
    }

    [key: string]: any;
    [index: number]: string;
}
