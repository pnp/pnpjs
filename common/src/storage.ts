import { dateAdd, getCtxCallback, jsS, objectDefinedNotNull } from "./util";
import { RuntimeConfig } from "./libconfig";

/**
 * A wrapper class to provide a consistent interface to browser based storage
 *
 */
export class PnPClientStorageWrapper implements PnPClientStore {

    /**
     * True if the wrapped storage is available; otherwise, false
     */
    public enabled: boolean;

    /**
     * Creates a new instance of the PnPClientStorageWrapper class
     *
     * @constructor
     */
    constructor(private store: Storage, public defaultTimeoutMinutes = -1) {
        this.enabled = this.test();
        // if the cache timeout is enabled call the handler
        // this will clear any expired items and set the timeout function
        if (RuntimeConfig.enableCacheExpiration) {
            this.cacheExpirationHandler();
        }
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

        const persistable = JSON.parse(o!);

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
    public getOrPut<T>(key: string, getter: () => Promise<T>, expire?: Date): Promise<T> {
        if (!this.enabled) {
            return getter();
        }

        const o = this.get<T>(key);

        if (o === null) {
            return getter().then((d) => {
                this.put(key, d, expire);
                return d;
            });
        }

        return Promise.resolve(o);
    }

    /**
     * Deletes any expired items placed in the store by the pnp library, leaves other items untouched
     */
    public deleteExpired(): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            if (!this.enabled) {
                resolve();
            }

            try {

                for (let i = 0; i < this.store.length; i++) {
                    const key = this.store.key(i);
                    if (key !== null) {
                        // test the stored item to see if we stored it
                        if (/["|']?pnp["|']? ?: ?1/i.test(<string>this.store.getItem(key))) {
                            // get those items as get will delete from cache if they are expired
                            this.get(key);
                        }
                    }
                }

                resolve();

            } catch (e) { reject(e); }
        });
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

            // ensure we are by default inline with the global library setting
            let defaultTimeout = RuntimeConfig.defaultCachingTimeoutSeconds;
            if (this.defaultTimeoutMinutes > 0) {
                defaultTimeout = this.defaultTimeoutMinutes * 60;
            }
            expire = dateAdd(new Date(), "second", defaultTimeout);
        }

        return jsS({ pnp: 1, expiration: expire, value: o });
    }

    /**
     * Deletes expired items added by this library in this.store and sets a timeout to call itself
     */
    private cacheExpirationHandler(): void {
        this.deleteExpired().then(_ => {

            // call ourself in the future
            setTimeout(getCtxCallback(this, this.cacheExpirationHandler), RuntimeConfig.cacheExpirationIntervalMilliseconds);
        }).catch(e => {
            console.error(e);
        });
    }
}

/**
 * Interface which defines the operations provided by a client storage object
 */
export interface PnPClientStore {
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

/**
 * A class that will establish wrappers for both local and session storage
 */
export class PnPClientStorage {

    /**
     * Creates a new instance of the PnPClientStorage class
     *
     * @constructor
     */
    constructor(private _local: PnPClientStore | null = null, private _session: PnPClientStore | null = null) { }

    /**
     * Provides access to the local storage of the browser
     */
    public get local(): PnPClientStore {

        if (this._local === null) {
            this._local = this.getStore("local");
        }

        return this._local;
    }

    /**
     * Provides access to the session storage of the browser
     */
    public get session(): PnPClientStore {

        if (this._session === null) {
            this._session = this.getStore("session");
        }

        return this._session;
    }

    private getStore(name: string): PnPClientStorageWrapper {

        if (name === "local") {
            return new PnPClientStorageWrapper(typeof (localStorage) === "undefined" ? new MemoryStorage() : localStorage);
        }

        return new PnPClientStorageWrapper(typeof (sessionStorage) === "undefined" ? new MemoryStorage() : sessionStorage);
    }
}
