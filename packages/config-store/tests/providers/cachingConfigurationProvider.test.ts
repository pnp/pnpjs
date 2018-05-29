import { PnPClientStorageWrapper, PnPClientStore, TypedHash } from "@pnp/common";
import { expect } from "chai";
import { CachingConfigurationProvider, Settings } from "../../";
import { default as MockConfigurationProvider } from "../mock-configurationprovider";
import MockStorage from "../mock-storage";

describe("Configuration", () => {

    describe("CachingConfigurationProvider", () => {
        let wrapped: MockConfigurationProvider;
        let store: PnPClientStore;
        let settings: Settings;

        beforeEach(() => {
            const mockValues: TypedHash<string> = {
                "key1": "value1",
                "key2": "value2",
            };
            wrapped = new MockConfigurationProvider();
            wrapped.mockValues = mockValues;
            store = new PnPClientStorageWrapper(new MockStorage());
            settings = new Settings();
        });

        it("Loads the config from the wrapped provider", () => {
            const provider = new CachingConfigurationProvider(wrapped, "cacheKey", store);
            return settings.load(provider).then(() => {
                expect(settings.get("key1")).to.eq("value1");
                expect(settings.get("key2")).to.eq("value2");
            });
        });

        it("Returns cached values", () => {
            const provider = new CachingConfigurationProvider(wrapped, "cacheKey", store);
            return settings.load(provider).then(() => {
                const updatedValues: TypedHash<string> = {
                    "key1": "update1",
                    "key2": "update2",
                };
                wrapped.mockValues = updatedValues;
                return settings.load(provider);
            }).then(() => {
                expect(settings.get("key1")).to.eq("value1");
                expect(settings.get("key2")).to.eq("value2");
            });
        });

        it("Bypasses a disabled cache", () => {
            store.enabled = false;
            const provider = new CachingConfigurationProvider(wrapped, "cacheKey", store);
            return settings.load(provider).then(() => {
                const updatedValues: TypedHash<string> = {
                    "key1": "update1",
                    "key2": "update2",
                };
                wrapped.mockValues = updatedValues;
                return settings.load(provider);
            }).then(() => {
                expect(settings.get("key1")).to.eq("update1");
                expect(settings.get("key2")).to.eq("update2");
            });
        });

        it("Uses provided cachekey with a '_configcache_' prefix", () => {
            const provider = new CachingConfigurationProvider(wrapped, "_configcache_cacheKey", store);
            return settings.load(provider).then(() => {
                return expect(store.get("_configcache_cacheKey")).not.to.be.null;
            });
        });
    });
});
