import { getRandomString, delay, stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/teams";
import "@pnp/graph/groups";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

// skipping because this is a very time intensive test for an API that is unlikely to change frequently
describe.skip("Teams", function () {

    let testUserId = "";
    let teamBody = {};
    let teamID = "";
    let operationID = "";

    before(pnpTest("af8f6e86-0905-4bbf-8b74-dd4b1ce1bdda", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserId = userInfo.id;
        teamBody = {
            "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
            "displayName": "PnPJS Test Team",
            "description": "PnPJS Test Team’s Description",
            "members": [
                {
                    "@odata.type": "#microsoft.graph.aadUserConversationMember",
                    "roles": ["owner"],
                    "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${testUserId}')`,
                },
            ],
        };
    }));


    beforeEach(async function () {
        // Clear out groupID
        teamID = "";
        operationID = "";
    });

    it("create()", pnpTest("10a95c84-3001-4093-aef0-d59fc1245234", async function () {
        const { teamName } = await this.props({
            teamName: `TestTeam_${getRandomString(4)}`,
        });
        (<any>teamBody).displayName = teamName;
        const teamCreateResult = await this.pnp.graph.teams.create(teamBody);
        teamID = teamCreateResult.teamId;
        operationID = teamCreateResult.operationId;
        return expect(teamID.length > 0).is.true && expect(operationID.length > 0).is.true;
    }));

    after(pnpTest("4bd4e8f9-afb9-4338-b4e3-84f52188f158", async function () {

        // Added delays to try and deal with async nature of adding a team. At this time it seems to be enough.
        if (teamID !== "" && operationID !== "") {

            try {

                await delay(6000);

                let isPending = true;
                while (isPending) {
                    const status = await this.pnp.graph.teams.getById(teamID).getOperationById(operationID);
                    isPending = (status.status === "inProgress");
                    if (isPending) {
                        await delay(3000);
                    }
                }
                await this.pnp.graph.groups.getById(teamID).delete();

                // eslint-disable-next-line no-empty
            } catch (e) { }
        }
    }));
});
