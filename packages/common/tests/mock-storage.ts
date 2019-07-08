export default class MockStorage implements Storage {
    constructor(private _store = new Map<string, any>()) { }

    public get length(): number {
        return this._store.size;
    }

    public clear(): void {
        this._store.clear();
    }

    public getItem(key: string): any {
        return this._store.get(key);
    }

    public key(index: number): string {
        return Array.from(this._store)[index][0];
    }

    public removeItem(key: string): void {
        this._store.delete(key);
    }

    public setItem(key: string, data: string): void {
        this._store.set(key, data);
    }

    [key: string]: any;
    [index: number]: string;
}
