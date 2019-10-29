import { expect } from "chai";
import { testSettings } from "../main";

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/subscriptions";
import { dateAdd } from "@pnp/common";

describe("Subscriptions", function () {
    if (testSettings.enableWebTests) {

        const listTitle = "Documents";
        const notificationUrl = testSettings.sp.notificationUrl;
        const after120Days = (dateAdd(new Date(), "day", 120).toISOString());
        const after180Days = (dateAdd(new Date(), "day", 180).toISOString());

        it("subscriptions.add() - Add new webhook", async function () {

            const r = await sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");
            const subID = r.data.id;

            return expect(subID, `A new webhook with id :${subID} should be created`).to.not.be.null.and.not.be.empty.and.be.an.instanceOf(Number);
        });

        it(".subscriptions() - Get list of all subscriptions", function () {

            return expect(sp.web.lists.getByTitle(listTitle).subscriptions(), "Fetched the list of all webhooks").to.be.eventually.fulfilled;
        });

        it("subscriptions.getById() - Get a specific subscription by Id", async function () {

            const res = await sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days);

            const p = sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id)();

            return expect(p, "Get the details of a webhook with the given id").to.be.eventually.fulfilled;
        });

        it("subscription.update() - Update a webhook", async function () {

            const res = await sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");

            const p = sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id).update(after180Days, notificationUrl, "pnp client state");

            return expect(p, "The webhook should have been updated with the new expiry date").to.be.eventually.fulfilled;
        });

        it("subscription.delete() - Delete a webhook", async function () {

            const res = await sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");

            const p = sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id).delete();

            return expect(p, "The webhook should have been deleted").to.be.eventually.fulfilled;
        });
    }
});
