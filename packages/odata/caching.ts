import { IODataParser } from "./parsers";
import { RuntimeConfig, dateAdd, IPnPClientStore, PnPClientStorage } from "@pnp/common";

export interface ICachingOptions {
    expiration?: Date;
    storeName?: "session" | "local";
    key: string;
}

export class CachingOptions implements ICachingOptions {

    protected static storage = new PnPClientStorage();

    constructor(
        public key: string,
        public storeName: "session" | "local" = RuntimeConfig.defaultCachingStore,
        public expiration = dateAdd(new Date(), "second", RuntimeConfig.defaultCachingTimeoutSeconds)) { }

    public get store(): IPnPClientStore {
        if (this.storeName === "local") {
            return CachingOptions.storage.local;
        } else {
            return CachingOptions.storage.session;
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
