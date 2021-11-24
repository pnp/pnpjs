import { expect } from "chai";
import {
    Queryable,
    BearerToken,
    InjectHeaders,
    DefaultParse,
    ResolveOnData,
    RejectOnError,
} from "@pnp/queryable";

describe("Queryable", function () {

    it("Lifecycle works as expected", async function () {

        const tracker = [];

        const q = new Queryable("https://bing.com");
        q.using(ResolveOnData(), RejectOnError());

        q.on.init(() => {
            tracker.push(1);
        });

        q.on.pre(async (url, init, result) => {
            tracker.push(2);
            return [url, init, result];
        });

        q.on.auth(async (url, init) => {
            tracker.push(3);
            return [url, init];
        });

        q.on.send(async () => {
            tracker.push(4);
            return null;
        });

        q.on.parse(async (url, response, result) => {
            tracker.push(5);
            return [url, response, result];
        });

        q.on.post(async (url, result) => {
            tracker.push(6);
            return [url, result];
        });

        q.on.dispose(() => {
            tracker.push(7);
        });

        await q();

        expect(tracker.length).to.eq(7);
        expect(tracker[0]).to.eq(1);
        expect(tracker[1]).to.eq(2);
        expect(tracker[2]).to.eq(3);
        expect(tracker[3]).to.eq(4);
        expect(tracker[4]).to.eq(5);
        expect(tracker[5]).to.eq(6);
        expect(tracker[6]).to.eq(7);
    });

    it("Observer inhertance", function () {

        const q = new Queryable("https://bing.com");

        q.using(
            BearerToken("token"),
            DefaultParse(),
            InjectHeaders({
                "X-name": "value",
            }));

        const q2 = new Queryable(q);

        // directly inherited with no changes should equal parent
        expect((<any>q2).observers).to.be.equal((<any>q).observers);

        q.on.post(async (url, result) => [url, result]);

        // addition to parent should appear to child as they share a ref
        expect((<any>q2).observers).to.be.equal((<any>q).observers);

        q2.on.post(async (url, result) => [url, result]);

        // ref to parent is broken due to edit of child
        expect((<any>q2).observers).to.not.be.equal((<any>q).observers);
    });

    it("Url manipulation", function () {

        const q = new Queryable("https://bing.com");

        const q2 = new Queryable(q);

        expect(q.toUrl()).to.be.eq(q2.toUrl());

        const q3 = new Queryable(q, "path1");
        const q4 = new Queryable(q3, "path2");

        expect(q3.toUrl()).to.be.eq("https://bing.com/path1");
        expect(q4.toUrl()).to.be.eq("https://bing.com/path1/path2");

        q4.concat("(path3)");

        expect(q4.toUrl()).to.be.eq("https://bing.com/path1/path2(path3)");

        q.query.set("key", "value");

        expect(q.toRequestUrl()).to.be.eq("https://bing.com?key=value");

        q.query.set("key2", "value2?");

        expect(q.toRequestUrl()).to.be.eq("https://bing.com?key=value&key2=value2%3F");
    });
});
