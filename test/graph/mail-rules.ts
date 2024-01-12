import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { MessageRule as IMessageRuleType } from "@microsoft/microsoft-graph-types";

describe("Mail: Rules", function () {
    let testUserName = "";

    const draftRule: IMessageRuleType = {
        displayName: "PnPjs Test Rule",
        sequence: 2,
        isEnabled: true,
        conditions: {
            senderContains: [
                "adele",
            ],
        },
        actions: {
            forwardTo: [
                {
                    emailAddress: {
                        name: "Alex Wilbur",
                        address: "AlexW@contoso.onmicrosoft.com",
                    },
                },
            ],
            stopProcessingRules: true,
        },
    };

    // Ensure we have the data to test against
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
    });

    it("Mail: Rules List", async function () {
        const rules = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules();
        return expect(rules).is.not.null;
    });

    it("Mail: Rule Get", async function () {
        const r = JSON.parse(JSON.stringify(draftRule));
        r.displayName = `PnPjs Test Rule ${getRandomString(8)}`;
        const rule = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.add(r);
        let success = false;
        if (rule !== null) {
            const getRule = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.getById(rule.id)();
            if(getRule !== null) {
                success = (getRule.displayName === r.displayName);
                await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.getById(rule.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Rule Add", async function () {
        const r = JSON.parse(JSON.stringify(draftRule));
        r.displayName = `PnPjs Test Rule ${getRandomString(8)}`;
        const rule = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.add(r);
        const success = (rule !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.getById(rule.id).delete();
        }
        return expect(success).to.be.true;
    });

    it("Mail: Rule Update", async function () {
        const r = JSON.parse(JSON.stringify(draftRule));
        r.displayName = `PnPjs Test Rule ${getRandomString(8)}`;
        const rule = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.add(r);
        const newRuleName = `PnPjs Test Rule ${getRandomString(8)}`;
        let success = false;
        if (rule !== null) {
            const update = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox")
                .messageRules.getById(rule.id).update({ displayName: newRuleName });
            if (update !== null) {
                success = (update.displayName === newRuleName);
                await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.getById(rule.id).delete();
            }
        }
        return expect(success).to.be.true;
    });

    it("Mail: Rule Delete", async function () {
        const r = JSON.parse(JSON.stringify(draftRule));
        r.displayName = `PnPjs Test Rule ${getRandomString(8)}`;
        const rule = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.add(r);
        let success = false;
        if (rule !== null) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.getById(rule.id).delete();
            try {
                const found = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.getById(rule.id)();
                if (found?.id === null) {
                    success = true;
                }
            } catch (e) {
                success = true;
            }
        }
        return expect(success).to.be.true;
    });

});

