import { expect } from "chai";
import { mergeMaps } from "../";

describe("Collections", () => {

    describe("mergeMaps", () => {

        it("should merge to maps with unique keys", () => {

            const map1 = new Map<string, string>([["key1", "value1"], ["key2", "value2"], ["key3", "value3"]]);
            const map2 = new Map<string, string>([["2_key1", "2_value1"], ["2_key2", "2_value2"], ["2_key3", "2_value3"]]);
            const map = mergeMaps(map1, map2);

            expect(map.size).to.eq(6, "Size should be 6");
            expect(Array.from(map)[1][0]).to.eq("key2", "Should be able to spread map");
        });

        it("should merge to maps with common keys", () => {

            const map1 = new Map<string, string>([["key1", "value1"], ["key2", "value2"], ["key3", "value3"]]);
            const map2 = new Map<string, string>([["2_key1", "2_value1"], ["2_key2", "2_value2"], ["key3", "2_value3"]]);
            const map = mergeMaps(map1, map2);

            expect(map.size).to.eq(5, "Size should be 5");
            expect(Array.from(map)[2][1]).to.eq("2_value3", "Should overwrite the value");
            expect(Array.from(map)[4][1]).to.eq("2_value2", "Should overwrite the value");
        });

        it("should merge many maps - even", () => {

            const target = new Map<string, string>([["key1", "value1"], ["key2", "value2"], ["key3", "value3"]]);
            const maps = [];
            const sub: [string, string][] = [];
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < i + 1; j++) {
                    sub.push([`${i}_key_${j}`, `${i}_value1_${j}`]);
                }
                maps.push(new Map<string, string>(sub));
            }

            const map = mergeMaps(target, ...maps);
            expect(map.size).to.eq(58, "Size should be 58");
        });

        it("should merge many maps - odd", () => {

            const target = new Map<string, string>([["key1", "value1"], ["key2", "value2"], ["key3", "value3"]]);
            const maps = [];
            const sub: [string, string][] = [];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < i + 1; j++) {
                    sub.push([`${i}_key_${j}`, `${i}_value1_${j}`]);
                }
                maps.push(new Map<string, string>(sub));
            }

            const map = mergeMaps(target, ...maps);
            expect(map.size).to.eq(9, "Size should be 9");
        });
    });
});
