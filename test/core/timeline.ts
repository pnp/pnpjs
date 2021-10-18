import { Timeline, asyncReduce } from "@pnp/core";
import { expect } from "chai";

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

    it("Should process moments 2", async function () {

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
    });

    it("Prepend works as expected", function () {

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
    });

    it("Clear works as expected", function () {

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
    });

    it("Replace works as expected", function () {

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
    });

    it("Logging works as expected", function () {

        const tl = new TestTimeline();

        const messages = [];

        tl.on.log((message) => {
            messages.push(message);
        });

        tl.log("Test 1", 0);

        tl.log("Test 2", 0);

        expect(messages.length).to.eq(2);
    });

    it("Lifecycle works as expected", async function () {

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
    });
});
