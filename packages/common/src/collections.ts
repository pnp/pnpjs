/**
 * Interface defining an object with a known property type
 */
export interface TypedHash<T> {
    [key: string]: T;
}

/**
 * Generic dictionary
 */
export class Dictionary<T> {

    /**
     * Creates a new instance of the Dictionary<T> class
     *
     * @constructor
     */
    constructor(private keys: string[] = [], private values: T[] = []) {
    }

    /**
     * Gets a value from the collection using the specified key
     *
     * @param key The key whose value we want to return, returns null if the key does not exist
     */
    public get(key: string): T | null {
        const index = this.keys.indexOf(key);
        if (index < 0) {
            return null;
        }
        return this.values[index];
    }

    /**
     * Adds the supplied key and value to the dictionary
     *
     * @param key The key to add
     * @param o The value to add
     */
    public add(key: string, o: T | null): void {
        const index = this.keys.indexOf(key);
        if (index > -1) {
            if (o === null) {
                this.remove(key);
            } else {
                this.values[index] = o;
            }
        } else {
            if (o !== null) {
                this.keys.push(key);
                this.values.push(o);
            }
        }
    }

    /**
     * Merges the supplied typed hash into this dictionary instance. Existing values are updated and new ones are created as appropriate.
     */
    public merge(source: TypedHash<T> | Dictionary<T>): void {
        if ("getKeys" in source) {
            const sourceAsDictionary = source as Dictionary<T>;
            sourceAsDictionary.getKeys().map(key => {
                this.add(key, sourceAsDictionary.get(key));
            });
        } else {
            const sourceAsHash = source as TypedHash<T>;
            for (const key in sourceAsHash) {
                if (sourceAsHash.hasOwnProperty(key)) {
                    this.add(key, sourceAsHash[key]);
                }
            }
        }
    }

    /**
     * Removes a value from the dictionary
     *
     * @param key The key of the key/value pair to remove. Returns null if the key was not found.
     */
    public remove(key: string): T | null {
        const index = this.keys.indexOf(key);
        if (index < 0) {
            return null;
        }
        const val = this.values[index];
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        return val;
    }

    /**
     * Returns all the keys currently in the dictionary as an array
     */
    public getKeys(): string[] {
        return this.keys;
    }

    /**
     * Returns all the values currently in the dictionary as an array
     */
    public getValues(): T[] {
        return this.values;
    }

    /**
     * Clears the current dictionary
     */
    public clear(): void {
        this.keys = [];
        this.values = [];
    }

    /**
     * Gets a count of the items currently in the dictionary
     */
    public get count(): number {
        return this.keys.length;
    }
}
