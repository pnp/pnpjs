// this file contains tests that validate assumptions we have made about how JavaScript will behave.
// We don't anticipate these changing, as it would be a change in JS itself, but good to ensure
// our assumptions remain correct

import { expect } from "chai";

describe("Assumptions", function () {

    it("JS should merge objects how we expect", function () {

        const o = {};

        const u = undefined;

        const three = {
            dog: "cat",
            thing: "another",
            bob: 22,
        };

        const one = {
            dog: "not cat",
        };

        const test1 = { ...o, ...u, ...three };

        const test2 = { ...u, ...three };

        const test3 = { ...three, ...one };

        const test4 = { ...one, ...three };

        const test5 = { ...u };

        expect(test1, "test 1").to.eql({
            dog: "cat",
            thing: "another",
            bob: 22,
        });

        expect(test2, "test 2").to.eql({
            dog: "cat",
            thing: "another",
            bob: 22,
        });

        expect(test3, "test 3").to.eql({
            dog: "not cat",
            thing: "another",
            bob: 22,
        });

        expect(test4, "test 4").to.eql({
            dog: "cat",
            thing: "another",
            bob: 22,
        });

        expect(test5, "test 5").to.eql({});

    });
});
