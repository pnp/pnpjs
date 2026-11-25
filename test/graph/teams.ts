import { getRandomString, delay, stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/teams";
import "@pnp/graph/groups";
import getValidUser from "./utilities/getValidUser.js";
import { ITeamTagAdd } from "@pnp/graph/teams";
import { pnpTest } from "../pnp-test.js";

describe("Teams", function () {

    let testUserId = "";
    let teamBody = {};
    let teamID = "";
    let operationID = "";

    before(pnpTest("dacb7efb-626e-46fe-bf8f-f54ce8d7e74e", async function () {

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
        // See if a team exists to test other team endpoints
        const response = await this.pnp.graph.teams();
        if (response.length > 0) {
            teamID = response[0].id;
        }
    }));

    // skipping because this is a very time intensive test for an API that is unlikely to change frequently
    it.skip("create()", async function () {
        const teamName = `TestTeam_${getRandomString(4)}`;
        (<any>teamBody).displayName = teamName;
        const teamCreateResult = await this.pnp.graph.teams.create(teamBody);
        teamID = teamCreateResult.teamId;
        operationID = teamCreateResult.operationId;
        return expect(teamID.length > 0).is.true && expect(operationID.length > 0).is.true;
    });

    describe("Team-Details", function () {
        before(async function () {

            // skip if no team exists in the tenant
            if (teamID === "") {
                this.skip();
            }
        });

        it("team.primaryChannel", pnpTest("1d0513c7-cd77-468a-8d67-44b98668421c", async function () {
            const primaryChannel = await this.pnp.graph.teams.getById(teamID).primaryChannel();
            return expect(primaryChannel).is.not.null;
        }));

        it("team.tags", pnpTest("22352393-b2f2-482d-93f4-aa5913f13b36", async function () {
            const tags = await this.pnp.graph.teams.getById(teamID).tags();
            return expect(tags).is.not.null;
        }));

        it("team.tags.getById", pnpTest("5e10e8dd-62c8-43d0-b290-a7890380a122", async function () {
            const tags = await this.pnp.graph.teams.getById(teamID).tags();
            if (tags.length > 0) {
                const tag = await this.pnp.graph.teams.getById(teamID).tags.getById(tags[0].id)();
                return expect(tag).is.not.null;
            } else {
                this.skip();
            }
        }));

        it("team.tags.add", pnpTest("1035de97-0bdf-43c1-ae51-f9f73b4b6d29", async function () {
            const tagName = `TestTag_${getRandomString(4)}`;
            const newTag: ITeamTagAdd = {
                displayName: tagName,
                members: [{ userId: testUserId }],
            };
            const tag = await this.pnp.graph.teams.getById(teamID).tags.add(newTag);
            const success = tag != null;
            if (tag != null) {
                await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).delete();
            }
            return expect(success).is.true;
        }));

        it("team.tags.update", pnpTest("12c5aacb-7f2f-4e32-968d-51ef42142d0b", async function () {
            const tagName = `TestTag_${getRandomString(4)}`;
            const newTag: ITeamTagAdd = {
                displayName: tagName,
                members: [{ userId: testUserId }],
            };
            const tag = await this.pnp.graph.teams.getById(teamID).tags.add(newTag);
            let success = false;
            if (tag != null) {
                const newTagName = `TestTag_${getRandomString(4)}`;
                await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).update({ displayName: newTagName });
                const updatedTag = await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id)();
                success = updatedTag.displayName === newTagName;
                await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).delete();
            }
            return expect(success).is.true;
        }));

        it("team.tags.delete", pnpTest("1639bb3f-013a-4be8-a9f1-818048ba0fe5", async function () {
            const tagName = `TestTag_${getRandomString(4)}`;
            const newTag: ITeamTagAdd = {
                displayName: tagName,
                members: [{ userId: testUserId }],
            };
            const tag = await this.pnp.graph.teams.getById(teamID).tags.add(newTag);
            let success = false;
            if (tag != null) {
                await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).delete();
                try {
                    await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id)();
                } catch (err) {
                    success = true;
                }
            }
            return expect(success).is.true;
        }));

        it("team.tags.members", pnpTest("eef348ab-9749-4f24-834f-829de94e336f", async function () {
            const tagName = `TestTag_${getRandomString(4)}`;
            const newTag: ITeamTagAdd = {
                displayName: tagName,
                members: [{ userId: testUserId }],
            };
            const tag = await this.pnp.graph.teams.getById(teamID).tags.add(newTag);
            let success = false;
            if (tag != null) {
                const members = await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).members();
                if (members != null) {
                    success = true;
                }
                await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).delete();
            }
            return expect(success).is.true;
        }));

        // cannot test without multiple members
        it.skip("team.tags.members.add", async function () {
            const tagName = `TestTag_${getRandomString(4)}`;
            const newTag: ITeamTagAdd = {
                displayName: tagName,
                members: [{ userId: testUserId }],
            };
            const tag = await this.pnp.graph.teams.getById(teamID).tags.add(newTag);
            let success = false;
            if (tag != null) {
                const members = await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).members.add(testUserId);
                if (members != null) {
                    success = true;
                }
                await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).delete();
            }
            return expect(success).is.true;
        });

        it("team.tags.members.getById", pnpTest("4afb371c-2e9e-4740-b072-a4704a674c70", async function () {
            const tagName = `TestTag_${getRandomString(4)}`;
            const newTag: ITeamTagAdd = {
                displayName: tagName,
                members: [{ userId: testUserId }],
            };
            const tag = await this.pnp.graph.teams.getById(teamID).tags.add(newTag);
            let success = false;
            if (tag != null) {
                const members = await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).members();
                if (members != null && members.length > 0) {
                    const member = await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).members.getById(members[0].id)();
                    if (member != null) {
                        success = true;
                    }
                } else {
                    this.skip();
                }
                await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).delete();

            }
            return expect(success).is.true;
        }));

        it("team.tags.members.delete", pnpTest("22fa8084-49fe-4e6d-bbb5-0b753bf624bd", async function () {
            const tagName = `TestTag_${getRandomString(4)}`;
            const newTag: ITeamTagAdd = {
                displayName: tagName,
                members: [{ userId: testUserId }],
            };
            const tag = await this.pnp.graph.teams.getById(teamID).tags.add(newTag);
            let success = false;
            if (tag != null) {
                try {
                    await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).members.getById(testUserId).delete();
                } catch (err) {
                    success = true;
                }
                await this.pnp.graph.teams.getById(teamID).tags.getById(tag.id).delete();
            }
            return expect(success).is.true;
        }));

        // skipping because time consuming, destructive, or not feasible
        it.skip("team.installedApps");
        it.skip("team.installedApps.add");
        it.skip("team.installedApps.getById");
        it.skip("team.archive");
        it.skip("team.unarchive");
        it.skip("team.cloneTeam");
        it.skip("team.removeIncomingChannel");
        it.skip("team.getOperationById");
        it.skip("team.channels.add");

        describe("Teams-Channels", function () {
            let channelId = "";
            before(pnpTest("56550b5b-595d-4772-9bdf-eea63275639c", async function () {
                const channels = await this.pnp.graph.teams.getById(teamID).channels();
                if (channels.length > 0) {
                    channelId = channels[0].id;
                } else {
                    this.skip();
                }
            }));

            it("team.channels", pnpTest("02a0c670-23b4-4e98-9247-6bd23bb07942", async function () {
                const channels = await this.pnp.graph.teams.getById(teamID).channels();
                return expect(channels).is.not.null;
            }));

            it("team.channel.tabs", pnpTest("c1094d98-f76a-4ae5-b45d-4ed1ae0ac4a7", async function () {
                const tabs = await await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).tabs();
                return expect(tabs).is.not.null;

            }));

            // takes too long to execute
            it.skip("team.channel.filesFolder", async function () {
                const filesFolder = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).filesFolder();
                return expect(filesFolder).is.not.null;
            });

            it("team.channel.channelMembers", pnpTest("b3bf8bda-534d-44c6-a624-dbe05daf421e", async function () {
                const channelMembers = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).channelMembers();
                return expect(channelMembers).is.not.null;
            }));

            it("team.channel.channelMembers.getById", pnpTest("c0bc9758-7d7a-4237-84b6-47173b93e198", async function () {
                const channelMembers = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).channelMembers();
                if (channelMembers.length > 0) {
                    const id = channelMembers[0].id;
                    const channelMember = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).channelMembers.getById(id)();
                    return expect(channelMember).is.not.null;
                } else {
                    this.skip();
                }
            }));

            it("team.channel.tabs.getById", pnpTest("788e40e8-ddc6-4f90-afca-9078f2145769", async function () {
                const tabs = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).tabs();
                if (tabs.length > 0) {
                    const tabId = tabs[0].id;
                    const tab = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).tabs.getById(tabId)();
                    return expect(tab).is.not.null;
                } else {
                    this.skip();
                }
            }));

            // skipping because time consuming, destructive, or not feasible
            it.skip("team.channel.archive");
            it.skip("team.channel.unarchive");
            it.skip("team.channel.completeMigration");
            it.skip("team.channel.provisionEmail");
            it.skip("team.channel.removeEmail");
            it.skip("team.channel.sharedWithTeams");
            it.skip("team.channel.sharedWithChannelTeamInfo");
            it.skip("team.channel.removeSharedWithChannelTeamInfo");
            it.skip("team.channel.sharedWithChannelMembers");
            it.skip("team.channel.doesUserHaveAccess");
            it.skip("team.channel.channelMembers.add");
            it.skip("team.channel.channelMembers.updateChannelMember");
            it.skip("team.channel.tabs.add");
        });
    });

    after(pnpTest("f79403ff-f2c8-43cc-b41c-20ded72e6218", async function () {

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
