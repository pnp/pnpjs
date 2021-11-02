import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import { getGraph, testSettings } from "../main.js";
import { GraphFI } from "@pnp/graph";
import "@pnp/graph/teams";
import "@pnp/graph/groups";

// TODO:: not working
describe("Teams", function () {

    if (testSettings.enableWebTests) {
        let _graphfi: GraphFI = null;
        let teamID = "";
        let operationID = "";

        before(function () {
            _graphfi = getGraph();
        });

        const sleep = (ms): Promise<void> => {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        };

        // tslint:disable:object-literal-sort-keys
        const teamBody = {
            "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
            "displayName": "",
            "description": "PnPJS Test Team’s Description",
            "members": [
                {
                    "@odata.type": "#microsoft.graph.aadUserConversationMember",
                    "roles": ["owner"],
                    "user@odata.bind": "https://graph.microsoft.com/v1.0/users('1d7f876a-49c2-4b05-8ca4-cb819ae840c4')",
                },
            ],
        };

        beforeEach(async function () {
            // Clear out groupID
            teamID = "";
            operationID = "";
        });

        it("createTeam()", async function () {
            const teamName = `TestTeam_${getRandomString(4)}`;
            teamBody.displayName = teamName;
            const teamCreateResult = await _graphfi.teams.create(teamBody);
            teamID = teamCreateResult.teamId;
            operationID = teamCreateResult.operationId;
            return expect(teamID.length > 0).is.true;
        });

        afterEach(async function () {
            if (teamID !== "") {
                let isPending = true;
                while (isPending) {
                    const status = await _graphfi.teams.getById(teamID).getOperationById(operationID);
                    isPending = (status.status === "inProgress");
                    if (isPending) {
                        await sleep(3000);
                    }
                }
                await _graphfi.groups.getById(teamID).delete();
            }
        });
    }
});
