import { dateAdd, jsS, objectDefinedNotNull } from "./util.js";

let storageShim: MemoryStorage | undefined;

function getStorageShim(): MemoryStorage {
    if (typeof storageShim === "undefined") {
        storageShim = new MemoryStorage();
    }
    return storageShim;
}

/**
 * A wrapper class to provide a consistent interface to browser based storage
 *
 */
export class PnPClientStorageWrapper implements IPnPClientStore {

    /**
     * True if the wrapped storage is available; otherwise, false
     */
    public enabled: boolean;

    /**
     * Creates a new instance of the PnPClientStorageWrapper class
     *
     * @constructor
     */
    constructor(private store: Storage) {

        this.enabled = this.test();
    }

    /**
     * Get a value from storage, or null if that value does not exist
     *
     * @param key The key whose value we want to retrieve
     */
    public get<T>(key: string): T | null {

        if (!this.enabled) {
            return null;
        }

        const o = this.store.getItem(key);

        if (!objectDefinedNotNull(o)) {
            return null;
        }

        const persistable = JSON.parse(o);

        if (new Date(persistable.expiration) <= new Date()) {
            this.delete(key);
            return null;

        } else {

            return persistable.value as T;
        }
    }

    /**
     * Adds a value to the underlying storage
     *
     * @param key The key to use when storing the provided value
     * @param o The value to store
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    public put(key: string, o: any, expire?: Date): void {
        if (this.enabled) {
            this.store.setItem(key, this.createPersistable(o, expire));
        }
    }

    /**
     * Deletes a value from the underlying storage
     *
     * @param key The key of the pair we want to remove from storage
     */
    public delete(key: string): void {
        if (this.enabled) {
            this.store.removeItem(key);
        }
    }

    /**
     * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
     *
     * @param key The key to use when storing the provided value
     * @param getter A function which will upon execution provide the desired value
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    public async getOrPut<T>(key: string, getter: () => Promise<T>, expire?: Date): Promise<T> {

        if (!this.enabled) {
            return getter();
        }

        let o = this.get<T>(key);

        if (o === null) {
            o = await getter();
            this.put(key, o, expire);
        }

        return o;
    }

    /**
     * Deletes any expired items placed in the store by the pnp library, leaves other items untouched
     */
    public async deleteExpired(): Promise<void> {

        if (!this.enabled) {
            return;
        }

        for (let i = 0; i < this.store.length; i++) {
            const key = this.store.key(i);
            if (key !== null) {
                // test the stored item to see if we stored it
                if (/["|']?pnp["|']? ?: ?1/i.test(<string>this.store.getItem(key))) {
                    // get those items as get will delete from cache if they are expired
                    await this.get(key);
                }
            }
        }
    }

    /**
     * Used to determine if the wrapped storage is available currently
     */
    private test(): boolean {
        const str = "t";
        try {
            this.store.setItem(str, str);
            this.store.removeItem(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Creates the persistable to store
     */
    private createPersistable(o: any, expire?: Date): string {
        if (expire === undefined) {

            expire = dateAdd(new Date(), "minute", 5);
        }

        return jsS({ pnp: 1, expiration: expire, value: o });
    }
}

/**
 * Interface which defines the operations provided by a client storage object
 */
export interface IPnPClientStore {
    /**
     * True if the wrapped storage is available; otherwise, false
     */
    enabled: boolean;

    /**
     * Get a value from storage, or null if that value does not exist
     *
     * @param key The key whose value we want to retrieve
     */
    get(key: string): any;

    /**
     * Adds a value to the underlying storage
     *
     * @param key The key to use when storing the provided value
     * @param o The value to store
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    put(key: string, o: any, expire?: Date): void;

    /**
     * Deletes a value from the underlying storage
     *
     * @param key The key of the pair we want to remove from storage
     */
    delete(key: string): void;

    /**
     * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
     *
     * @param key The key to use when storing the provided value
     * @param getter A function which will upon execution provide the desired value
     * @param expire Optional, if provided the expiration of the item, otherwise the default is used
     */
    getOrPut<T>(key: string, getter: () => Promise<T>, expire?: Date): Promise<T>;

    /**
     * Removes any expired items placed in the store by the pnp library, leaves other items untouched
     */
    deleteExpired(): Promise<void>;
}

/**
 * A thin implementation of in-memory storage for use in nodejs
 */
class MemoryStorage {

    constructor(private _store = new Map<string, any>()) { }

    [key: string]: any;
    [index: number]: string;

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
}

/**
 * A class that will establish wrappers for both local and session storage, substituting basic memory storage for nodejs
 */
export class PnPClientStorage {

    /**
     * Creates a new instance of the PnPClientStorage class
     *
     * @constructor
     */
    constructor(private _local: IPnPClientStore | null = null, private _session: IPnPClientStore | null = null) { }

    /**
     * Provides access to the local storage of the browser
     */
    public get local(): IPnPClientStore {

        if (this._local === null) {
            this._local = new PnPClientStorageWrapper(typeof localStorage === "undefined" ? getStorageShim() : localStorage);
        }

        return this._local;
    }

    /**
     * Provides access to the session storage of the browser
     */
    public get session(): IPnPClientStore {

        if (this._session === null) {
            this._session = new PnPClientStorageWrapper(typeof sessionStorage === "undefined" ? getStorageShim() : sessionStorage);
        }

        return this._session;
    }
}
