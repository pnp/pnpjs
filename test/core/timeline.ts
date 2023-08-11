import { Timeline, asyncReduce } from "@pnp/core";
import { expect } from "chai";
import { pnpTest } from "../pnp-test.js";

const TestingMoments = {
    first: asyncReduce<(a: number) => Promise<[number]>>(),
    second: asyncReduce<(a: number) => Promise<[number]>>(),
} as const;

class TestTimeline extends Timeline<typeof TestingMoments> {

    private InternalResolveEvent = Symbol.for("Resolve");
    private InternalRejectEvent = Symbol.for("Reject");

    constructor() {
        super(TestingMoments);
    }

    protected async execute(init?: any): Promise<any> {

        this.log("Starting", 0);

        setTimeout(async () => {

            try {

                // eslint-disable-next-line prefer-const
                let [value] = await this.emit.first(init);

                [value] = await this.emit.second(value);

                this.emit[this.InternalResolveEvent](value);

            } catch (e) {

                this.emit[this.InternalRejectEvent](e);
            }
        }, 0);

        return new Promise((resolve, reject) => {
            this.on[this.InternalResolveEvent].replace(resolve);
            this.on[this.InternalRejectEvent].replace(reject);
        });
    }

    public go(startValue = 0): Promise<number> {
        return this.start(startValue);
    }
}

describe("Timeline", function () {

    it("Should process moments", async function () {

        const tl = new TestTimeline();

        tl.on.first(async (n) => [++n]);

        tl.on.second(async (n) => [++n]);

        const h = await tl.go(0);

        return expect(h).to.eq(2);
    });

    it("Should process moments 2", pnpTest("8267d3af-554d-44d8-8b00-e33ce7d93f1d", async function () {

        const tl = new TestTimeline();

        tl.on.first(async (n) => [++n]);

        tl.on.second(async (n) => [++n]);
        tl.on.second(async (n) => [++n]);
        tl.on.second(async (n) => [++n]);
        tl.on.second(async (n) => [++n]);
        tl.on.second(async (n) => [++n]);
        tl.on.second(async (n) => [++n]);

        const h = await tl.go(0);

        return expect(h).to.eq(7);
    }));

    it("Prepend works as expected", pnpTest("890664f0-0e7f-4aa5-bc73-55fa4b05b27b", function () {

        const tl = new TestTimeline();

        const f1 = async (n) => n + 2;
        const f2 = async (n) => n + 3;
        const f3 = async (n) => n + 5;

        tl.on.first(f1);
        tl.on.first(f2);
        tl.on.first.prepend(f3);

        const observers = tl.on.first.toArray();

        expect(observers[0]).to.eq(f3);
        expect(observers[1]).to.eq(f1);
        expect(observers[2]).to.eq(f2);
    }));

    it("Clear works as expected", pnpTest("66b43d34-7e34-4506-abc9-4d12b8286937", function () {

        const tl = new TestTimeline();

        const f1 = async (n) => n + 2;
        const f2 = async (n) => n + 3;
        const f3 = async (n) => n + 5;

        tl.on.first(f1);
        tl.on.first(f2);
        tl.on.first(f3);

        const observers = tl.on.first.toArray();

        expect(observers).length(3);

        tl.on.first.clear();

        const observers2 = tl.on.first.toArray();

        expect(observers2).length(0);
    }));

    it("Replace works as expected", pnpTest("b162d48e-2ddd-4b36-8fee-fc3c9ef18838", function () {

        const tl = new TestTimeline();

        const f1 = async (n) => n + 2;
        const f2 = async (n) => n + 3;
        const f3 = async (n) => n + 5;

        tl.on.first(f1);
        tl.on.first(f2);
        tl.on.first(f3);

        const observers = tl.on.first.toArray();

        expect(observers).length(3);

        tl.on.first.replace(f1);

        const observers2 = tl.on.first.toArray();

        expect(observers2).length(1);
        expect(observers2[0]).to.eq(f1);
    }));

    it("Logging works as expected", pnpTest("0506ad5a-7d00-4f0e-b436-46c90faadd9d", function () {

        const tl = new TestTimeline();

        const messages = [];

        tl.on.log((message) => {
            messages.push(message);
        });

        tl.log("Test 1", 0);

        tl.log("Test 2", 0);

        expect(messages.length).to.eq(2);
    }));

    it("Lifecycle works as expected", pnpTest("a7dda9ad-cb00-4ad8-b717-4de294e02ad2", async function () {

        const tl = new TestTimeline();

        const tracker = [];

        tl.on.init(() => {

            tracker.push(1);
        });

        tl.on.first(async (v) => {

            tracker.push(2);

            return [v];
        });

        tl.on.second(async (v) => {

            tracker.push(3);

            return [v];
        });

        tl.on.dispose(() => {

            tracker.push(4);
        });

        const h = await tl.go(0);

        expect(h).to.eq(0);
        expect(tracker.length).to.eq(4);
        expect(tracker[0]).to.eq(1);
        expect(tracker[1]).to.eq(2);
        expect(tracker[2]).to.eq(3);
        expect(tracker[3]).to.eq(4);
    }));
});
