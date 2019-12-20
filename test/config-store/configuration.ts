import { expect } from "chai";
import * as Collections from "@pnp/common";
import { Settings } from "../../packages/config-store";
import { default as MockConfigurationProvider } from "./mock-configurationprovider";

describe("Configuration", () => {

    describe("Settings", () => {

        let settings: Settings;

        beforeEach(() => {
            settings = new Settings();
        });

        it("Add and get a setting", () => {
            settings.add("key1", "value1");
            const setting = settings.get("key1");
            expect(setting).to.eq("value1");
        });

        it("Add and get a JSON value", () => {
            const obj = { "prop1": "prop1value", "prop2": "prop2value" };
            settings.addJSON("obj1", obj);
            const setting = settings.getJSON("obj1");
            expect(setting).to.deep.equal(obj);
        });

        it("Apply a hash and retrieve one of the values", () => {

            const hash: Collections.ITypedHash<string> = {
                "key1": "value1",
                "key2": "value2",
            };

            settings.apply(hash);
            const setting = settings.get("key1");
            expect(setting).to.eq("value1");
        });

        it("Apply a hash, apply a second hash overwritting a value and get back the new value", () => {

            const hash1: Collections.ITypedHash<string> = {
                "key1": "value1",
                "key2": "value2",
            };

            const hash2: Collections.ITypedHash<string> = {
                "key1": "value3",
                "key2": "value4",
            };

            settings.apply(hash1);
            settings.apply(hash2);
            const setting = settings.get("key1");
            expect(setting).to.eq("value3");
        });

        it("Apply a hash containing a serialized JSON object and then retrieve that object using getJSON", () => {

            const obj = { "prop1": "prop1value", "prop2": "prop2value" };

            const hash: Collections.ITypedHash<string> = {
                "key1": "value1",
                "key2": "value2",
                "key3": JSON.stringify(obj),
            };

            settings.apply(hash);
            const setting = settings.getJSON("key3");
            expect(setting).to.deep.equal(obj);
        });

        it("loads settings from a configuration provider", () => {
            const mockValues: Collections.ITypedHash<string> = {
                "key2": "value_from_provider_2",
                "key3": "value_from_provider_3",
            };
            const mockProvider = new MockConfigurationProvider();
            mockProvider.mockValues = mockValues;

            settings.add("key1", "value1");
            const p = settings.load(mockProvider);

            return p.then(() => {
                expect(settings.get("key1")).to.eq("value1");
                expect(settings.get("key2")).to.eq("value_from_provider_2");
                expect(settings.get("key3")).to.eq("value_from_provider_3");
            });
        });

        it("rejects a promise if configuration provider throws", () => {
            const mockProvider = new MockConfigurationProvider();
            mockProvider.shouldThrow = true;
            const p = settings.load(mockProvider);
            return p.then(
                () => { expect.fail(null, null, "Should not resolve when provider throws!"); },
                // tslint:disable-next-line:no-unused-expression
                (reason) => { expect(reason).not.to.be.null; },
            );
        });

        it("rejects a promise if configuration provider rejects the promise", () => {
            const mockProvider = new MockConfigurationProvider();
            mockProvider.shouldReject = true;
            const p = settings.load(mockProvider);
            return p.then(
                () => { expect.fail(null, null, "Should not resolve when provider rejects!"); },
                // tslint:disable-next-line:no-unused-expression
                (reason) => { expect(reason).not.to.be.null; },
            );
        });
    });
});
