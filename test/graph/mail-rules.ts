import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/mail";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { MessageRule as IMessageRuleType } from "@microsoft/microsoft-graph-types";
import { pnpTest } from "../pnp-test.js";

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
    before(pnpTest("b44d7ba3-9b39-4b6c-bc6e-32dbacbd7eb8", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
    }));

    it("Mail: Rules List", pnpTest("0662894b-81de-42df-a24e-af305d44176e", async function () {
        const rules = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules();
        return expect(rules).is.not.null;
    }));

    it("Mail: Rule Get", pnpTest("7f5f0da9-2a2b-4950-af83-5eb1e17176a9", async function () {
        const { ruleName } = await this.props({
            ruleName: `PnPjs Test Rule ${getRandomString(8)}`,
        });
        const r = JSON.parse(JSON.stringify(draftRule));
        r.displayName = ruleName;
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
    }));

    it("Mail: Rule Add", pnpTest("826e1c2b-0467-47f5-96ff-54c7a2fe5583", async function () {
        const { ruleName } = await this.props({
            ruleName: `PnPjs Test Rule ${getRandomString(8)}`,
        });
        const r = JSON.parse(JSON.stringify(draftRule));
        r.displayName = ruleName;
        const rule = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.add(r);
        const success = (rule !== null);
        if (success) {
            await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.getById(rule.id).delete();
        }
        return expect(success).to.be.true;
    }));

    it("Mail: Rule Update", pnpTest("be280562-7135-49c2-9bd0-677978442f24", async function () {
        const { ruleName, newRuleName2 } = await this.props({
            ruleName: `PnPjs Test Rule ${getRandomString(8)}`,
            newRuleName2: `PnPjs Test Rule ${getRandomString(8)}`,
        });
        const r = JSON.parse(JSON.stringify(draftRule));
        r.displayName = ruleName;
        const rule = await this.pnp.graph.users.getById(testUserName).mailFolders.getById("inbox").messageRules.add(r);
        const newRuleName = newRuleName2;
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
    }));

    // This logs to the console when it passes, ignore those messages
    it("Mail: Rule Delete", pnpTest("b3477390-5570-4254-8e0b-cec5f0fccdd7", async function () {
        const { ruleName } = await this.props({
            ruleName: `PnPjs Test Rule ${getRandomString(8)}`,
        });
        const r = JSON.parse(JSON.stringify(draftRule));
        r.displayName = ruleName;
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
    }));

});

