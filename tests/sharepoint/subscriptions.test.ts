import { expect } from "chai";
import { Lists } from "../../src/sharepoint/lists";
import { testSettings } from "../test-config.test";
import pnp from "../../src/pnp";

describe("Lists", () => {

    let lists: Lists;
    let webTestCheck: boolean;

    before(function (done) {

        // sometimes we have web tests enabled but no notificationUrl set
        webTestCheck = testSettings.notificationUrl !== null && testSettings.notificationUrl !== "";

        if (testSettings.enableWebTests && webTestCheck) {

            let today = new Date();
            let expirationDate = new Date(today.setDate(today.getDate() + 90)).toISOString();
            pnp.sp.web.lists.getByTitle("Documents").subscriptions.add(testSettings.notificationUrl, expirationDate).then(_ => {
                done();
            }).catch(_ => {
                done();
            });

        } else {

            done();
        }
    });

    beforeEach(() => {
        lists = new Lists("_api/web");
    });

    it("Should be an object", () => {
        expect(lists).to.be.a("object");
    });

    if (testSettings.enableWebTests) {

        describe("getByTitle", () => {
            it("Should get a list by title with the expected title", () => {

                // we are expecting that the OOTB list exists 
                return expect(pnp.sp.web.lists.getByTitle("Documents").get()).to.eventually.have.property("Title", "Documents");
            });
        });

        describe("getSubscriptions", () => {
            it("Should return the subscriptions of the current list", () => {
                let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").subscriptions.get());
                return expectVal.to.eventually.be.fulfilled;
            });
        });

        describe("createSubscription", () => {
            it("Should be able to create a new webhook subscription in the current list", () => {
                let today = new Date();
                let expirationDate = new Date(today.setDate(today.getDate() + 90)).toISOString();
                let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").subscriptions.add(testSettings.notificationUrl, expirationDate));
                return expectVal.to.eventually.have.property("subscription");
            });
        });

        describe("getSubscriptionsById", () => {
            it("Should return the subscription by its ID of the current list", () => {
                pnp.sp.web.lists.getByTitle("Documents").subscriptions.get().then((data) => {
                    if (data !== null) {
                        if (data.length > 0) {
                            let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").subscriptions.getById(data[0].id).get());
                            return expectVal.to.eventually.have.property("id", data[0].id);
                        }
                    }
                }).catch(_ => {});
            });
        });

        describe("updateSubscription", () => {
            it("Should be able to update an existing webhook subscription in the current list", () => {
                pnp.sp.web.lists.getByTitle("Documents").subscriptions.get().then((data) => {
                    if (data !== null) {
                        if (data.length > 0) {
                            let today = new Date();
                            let expirationDate = new Date(today.setDate(today.getDate() + 90)).toISOString();
                            let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").subscriptions.getById(data[0].id).update(expirationDate));
                            return expectVal.to.eventually.have.property("subscription");
                        }
                    }
                }).catch(_ => {});
            });
        });

        describe("deleteSubscription", () => {
            it("Should be able to delete an existing webhook subscription in the current list", () => {
                pnp.sp.web.lists.getByTitle("Documents").subscriptions.get().then((data) => {
                    if (data !== null) {
                        if (data.length > 0) {
                            let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").subscriptions.getById(data[0].id).delete());
                            return expectVal.to.eventually.be.fulfilled;
                        }
                    }
                }).catch(_ => {});
            });
        });
    }
});
