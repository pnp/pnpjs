import { expect } from "chai";
import { sp, Lists } from "../";
import { testSettings } from "../../../test/main";

describe("Lists", () => {

    let lists: Lists;
    let webTestCheck: boolean;

    before(function (done) {

        // sometimes we have web tests enabled but no notificationUrl set
        webTestCheck = testSettings.notificationUrl !== null && testSettings.notificationUrl !== "";

        if (testSettings.enableWebTests && webTestCheck) {

            const now = new Date();
            const expirationDate = new Date(now.setDate(now.getDate() + 90)).toISOString();
            sp.web.lists.getByTitle("Documents").subscriptions.add(testSettings.notificationUrl, expirationDate).then(_ => {
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
                return expect(sp.web.lists.getByTitle("Documents").get()).to.eventually.have.property("Title", "Documents");
            });
        });

        describe("getSubscriptions", () => {
            it("Should return the subscriptions of the current list", () => {
                const expectVal = expect(sp.web.lists.getByTitle("Documents").subscriptions.get());
                return expectVal.to.eventually.be.fulfilled;
            });
        });

        describe("createSubscription", () => {
            it("Should be able to create a new webhook subscription in the current list", () => {
                const now = new Date();
                const expirationDate = new Date(now.setDate(now.getDate() + 90)).toISOString();
                const expectVal = expect(sp.web.lists.getByTitle("Documents").subscriptions.add(testSettings.notificationUrl, expirationDate));
                return expectVal.to.eventually.have.property("subscription");
            });
        });

        describe("getSubscriptionsById", () => {
            it("Should return the subscription by its ID of the current list", () => {
                sp.web.lists.getByTitle("Documents").subscriptions.get().then((data) => {
                    if (data !== null) {
                        if (data.length > 0) {
                            const expectVal = expect(sp.web.lists.getByTitle("Documents").subscriptions.getById(data[0].id).get());
                            return expectVal.to.eventually.have.property("id", data[0].id);
                        }
                    }
                });
            });
        });

        describe("updateSubscription", () => {
            it("Should be able to update an existing webhook subscription in the current list", () => {
                sp.web.lists.getByTitle("Documents").subscriptions.get().then((data) => {
                    if (data !== null) {
                        if (data.length > 0) {
                            const now = new Date();
                            const expirationDate = new Date(now.setDate(now.getDate() + 90)).toISOString();
                            const expectVal = expect(sp.web.lists.getByTitle("Documents").subscriptions.getById(data[0].id).update(expirationDate));
                            return expectVal.to.eventually.have.property("subscription");
                        }
                    }
                });
            });
        });

        describe("deleteSubscription", () => {
            it("Should be able to delete an existing webhook subscription in the current list", () => {
                sp.web.lists.getByTitle("Documents").subscriptions.get().then((data) => {
                    if (data !== null) {
                        if (data.length > 0) {
                            const expectVal = expect(sp.web.lists.getByTitle("Documents").subscriptions.getById(data[0].id).delete());
                            return expectVal.to.eventually.be.fulfilled;
                        }
                    }
                });
            });
        });
    }
});
