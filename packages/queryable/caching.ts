import { IODataParser } from "./parsers.js";
import { IPnPClientStore, PnPClientStorage } from "@pnp/common";

export interface ICachingOptions {
    expiration?: Date;
    storeName?: "session" | "local";
    key: string;
}

const storage = new PnPClientStorage();

export class CachingOptions implements ICachingOptions {

    constructor(
        public key: string,
        public storeName?: "session" | "local",
        public expiration?: Date) { }

    public get store(): IPnPClientStore {
        if (this.storeName === "local") {
            return storage.local;
        } else {
            return storage.session;
        }
    }
}

export class CachingParserWrapper<T> implements IODataParser<T> {

    constructor(public parser: IODataParser<T>, public cacheOptions: CachingOptions) { }

    public parse(response: Response): Promise<T> {
        return this.parser.parse(response).then(r => this.cacheData(r));
    }

    protected cacheData(data: any): any {
        if (this.cacheOptions.store !== null) {
            this.cacheOptions.store.put(this.cacheOptions.key, data, this.cacheOptions.expiration);
        }
        return data;
    }
}
