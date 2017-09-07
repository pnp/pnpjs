import { expect } from "chai";
import { default as CachingConfigurationProvider } from "../../../src/configuration/providers/cachingConfigurationProvider";
import  * as Collections  from "../../../src/collections/collections";
import * as Configuration from "../../../src/configuration/configuration";
import {default as MockConfigurationProvider} from "../../mocks/mockconfigurationprovider";
import MockStorage from "../../mocks/mockstorage";
import * as storage from "../../../src/utils/storage";

describe("Configuration", () => {

    describe("CachingConfigurationProvider", () => {
        let wrapped: MockConfigurationProvider;
        let store: storage.PnPClientStore;
        let settings: Configuration.Settings;

        beforeEach(() => {
            let mockValues: Collections.TypedHash<string> = {
                "key1": "value1",
                "key2": "value2",
            };
            wrapped = new MockConfigurationProvider();
            wrapped.mockValues = mockValues;
            store = new storage.PnPClientStorageWrapper(new MockStorage());
            settings = new Configuration.Settings();
        });

        it("Loads the config from the wrapped provider", () => {
            let provider = new CachingConfigurationProvider(wrapped, "cacheKey", store);
            return settings.load(provider).then(() => {
                expect(settings.get("key1")).to.eq("value1");
                expect(settings.get("key2")).to.eq("value2");
            });
        });

        it("Returns cached values", () => {
            let provider = new CachingConfigurationProvider(wrapped, "cacheKey", store);
            return settings.load(provider).then(() => {
                let updatedValues: Collections.TypedHash<string> = {
                    "key1": "update1",
                    "key2": "update2",
                };
                wrapped.mockValues = updatedValues;
                return settings.load(provider);
            }).then (() => {
                expect(settings.get("key1")).to.eq("value1");
                expect(settings.get("key2")).to.eq("value2");
            });
        });

        it("Bypasses a disabled cache", () => {
            store.enabled = false;
            let provider = new CachingConfigurationProvider(wrapped, "cacheKey", store);
            return settings.load(provider).then(() => {
                let updatedValues: Collections.TypedHash<string> = {
                    "key1": "update1",
                    "key2": "update2",
                };
                wrapped.mockValues = updatedValues;
                return settings.load(provider);
            }).then (() => {
                expect(settings.get("key1")).to.eq("update1");
                expect(settings.get("key2")).to.eq("update2");
            });
        });

        it("Uses provided cachekey with a '_configcache_' prefix", () => {
            let provider = new CachingConfigurationProvider(wrapped, "cacheKey", store);
            return settings.load(provider).then(() => {
                expect(store.get("_configcache_cacheKey")).not.to.be.null;
            });
        });
    });
});
