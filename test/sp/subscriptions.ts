import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/subscriptions";
import { dateAdd, stringIsNullOrEmpty } from "@pnp/core";
import { pnpTest } from  "../pnp-test.js";

describe("Subscriptions", function () {

    const listTitle = "Documents";
    let notificationUrl = "";
    let after120Days = (dateAdd(new Date(), "day", 120).toISOString());
    let after180Days = (dateAdd(new Date(), "day", 180).toISOString());

    before(pnpTest("8894d6c7-e3e6-4764-9aba-4cabc4af6144", function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings?.sp?.notificationUrl)) {
            this.skip();
        }

        notificationUrl = this.pnp.settings.sp.notificationUrl;
        after120Days = (dateAdd(new Date(), "day", 120).toISOString());
        after180Days = (dateAdd(new Date(), "day", 180).toISOString());
    }));

    it("invoke", pnpTest("35ae6398-5fd9-473d-9a35-21db5d628fd3", function () {

        return expect(this.pnp.sp.web.lists.getByTitle(listTitle).subscriptions(), "Fetched the list of all webhooks").to.be.eventually.fulfilled;
    }));

    it("add", pnpTest("cfca7285-a99a-4af6-8f76-5aff4ca34102", async function () {

        const r = await this.pnp.sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");
        const subID = r.id;

        return expect(subID, `A new webhook with id :${subID} should be created`).to.not.be.null.and.not.be.empty.and.be.an.instanceOf(Number);
    }));

    it("getById", pnpTest("403e9d1e-0979-4cee-8920-3a353ec95462", async function () {

        const res = await this.pnp.sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days);

        const p = this.pnp.sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.id)();

        return expect(p, "Get the details of a webhook with the given id").to.be.eventually.fulfilled;
    }));

    it("update() - Update a webhook", pnpTest("73562073-8c6e-4c7d-96e8-3104936b6ac8", async function () {

        const res = await this.pnp.sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");

        const p = this.pnp.sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.id).update(after180Days, notificationUrl, "pnp client state");

        return expect(p, "The webhook should have been updated with the new expiry date").to.be.eventually.fulfilled;
    }));

    it("delete() - Delete a webhook", pnpTest("271b07e7-3da5-4ff6-aa9a-12c232018d28", async function () {

        const res = await this.pnp.sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");

        const p = this.pnp.sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.id).delete();

        return expect(p, "The webhook should have been deleted").to.be.eventually.fulfilled;
    }));
});
