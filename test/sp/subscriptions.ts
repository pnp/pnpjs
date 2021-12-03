import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/subscriptions";
import { dateAdd, stringIsNullOrEmpty } from "@pnp/core";
import { SPFI } from "@pnp/sp";

describe("Subscriptions", function () {

    const listTitle = "Documents";
    let notificationUrl = "";
    let after120Days = (dateAdd(new Date(), "day", 120).toISOString());
    let after180Days = (dateAdd(new Date(), "day", 180).toISOString());
    let _spfi: SPFI = null;

    before(function () {

        if (!testSettings.enableWebTests || stringIsNullOrEmpty(testSettings?.sp?.notificationUrl)) {
            this.skip();
            return;
        }

        _spfi = getSP();
        notificationUrl = testSettings.sp.notificationUrl;
        after120Days = (dateAdd(new Date(), "day", 120).toISOString());
        after180Days = (dateAdd(new Date(), "day", 180).toISOString());
    });

    it("invoke", function () {

        return expect(_spfi.web.lists.getByTitle(listTitle).subscriptions(), "Fetched the list of all webhooks").to.be.eventually.fulfilled;
    });

    it("add", async function () {

        const r = await _spfi.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");
        const subID = r.data.id;

        return expect(subID, `A new webhook with id :${subID} should be created`).to.not.be.null.and.not.be.empty.and.be.an.instanceOf(Number);
    });

    it("getById", async function () {

        const res = await _spfi.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days);

        const p = _spfi.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id)();

        return expect(p, "Get the details of a webhook with the given id").to.be.eventually.fulfilled;
    });

    it("update() - Update a webhook", async function () {

        const res = await _spfi.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");

        const p = _spfi.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id).update(after180Days, notificationUrl, "pnp client state");

        return expect(p, "The webhook should have been updated with the new expiry date").to.be.eventually.fulfilled;
    });

    it("delete() - Delete a webhook", async function () {

        const res = await _spfi.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");

        const p = _spfi.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id).delete();

        return expect(p, "The webhook should have been deleted").to.be.eventually.fulfilled;
    });
});
