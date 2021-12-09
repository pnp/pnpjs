import { getRandomString, delay } from "@pnp/core";
import { expect } from "chai";
import { getGraph, testSettings } from "../main.js";
import { GraphFI } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/groups";
import getValidUser from "./utilities/getValidUser.js";

describe("Teams", function () {

    let _graphfi: GraphFI = null;
    let testUserId = "";
    let teamBody = {};
    let teamID = "";
    let operationID = "";

    before(async function () {

        if (!testSettings.enableWebTests) {
            this.skip();
        }

        _graphfi = getGraph();
        const userInfo = await getValidUser();
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
    });


    beforeEach(async function () {
        // Clear out groupID
        teamID = "";
        operationID = "";
    });

    it("create()", async function () {
        const teamName = `TestTeam_${getRandomString(4)}`;
        (<any>teamBody).displayName = teamName;
        const teamCreateResult = await _graphfi.teams.create(teamBody);
        teamID = teamCreateResult.teamId;
        operationID = teamCreateResult.operationId;
        return expect(teamID.length > 0).is.true && expect(operationID.length > 0).is.true;
    });

    after(async function () {

        // Added delays to try and deal with async nature of adding a team. At this time it seems to be enough.
        if (teamID !== "" && operationID !== "") {

            try {

                this.timeout(0);
                await delay(6000);

                let isPending = true;
                while (isPending) {
                    const status = await _graphfi.teams.getById(teamID).getOperationById(operationID);
                    isPending = (status.status === "inProgress");
                    if (isPending) {
                        await delay(3000);
                    }
                }
                await delay(60000);
                await _graphfi.groups.getById(teamID).delete();

            // eslint-disable-next-line no-empty
            } catch (e) { }
        }
    });
});
