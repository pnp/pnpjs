import { expect } from "chai";
import { testSettings } from "../main";

import { sp } from "@pnp/sp";
import  "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/subscriptions";
import { dateAdd } from '@pnp/common';

describe("Subscriptions", function() {
    if (testSettings.enableWebTests) {
        
        let subID = null;
        const listTitle = "Documents";
        const notificationUrl = testSettings.sp.subscriptions.notificationUrl;
        const after120Days = (dateAdd(new Date(), "day", 120).toISOString());
        const after180Days = (dateAdd(new Date(), "day", 180).toISOString());

        it("subscriptions.add() - Add new webhook", function() {
            const r = sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state")
            .then(res => subID = res.data.id);
            return expect(r, `A new webhook with id :${subID} should be created`).to.be.eventually.fulfilled;
        });
        it(".subscriptions() - Get list of all subscriptions", function() {
            return expect(sp.web.lists.getByTitle(listTitle).subscriptions()
            , "Fetched the list of all webhooks").to.be.eventually.fulfilled;
        });
        it("subscriptions.getById() - Get a specific subscription by Id", async function() {
            const res = await sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days);
            return expect(sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id)()
            , "Get the details of a webhook with the given id").to.be.eventually.fulfilled;
        });
        it("subscription.update() - Update a webhook", async function() {
            const res = await sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");
            return expect(sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id).update(after180Days, notificationUrl, "pnp client state")
            , "The webhook should have been updated with the new expiry date").to.be.eventually.fulfilled;
        });
        it("subscription.delete() - Delete a webhook", async function() {
            const res = await sp.web.lists.getByTitle(listTitle).subscriptions.add(notificationUrl, after120Days, "pnp client state");
            return expect(sp.web.lists.getByTitle(listTitle).subscriptions.getById(res.data.id).delete()
            , "The webhook should have been deleted").to.be.eventually.fulfilled;
        });

    }
});
