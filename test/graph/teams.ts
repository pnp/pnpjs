import { getRandomString, delay, stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/teams";
import "@pnp/graph/groups";
import getValidUser from "./utilities/getValidUser.js";
import { ITeamTagAdd } from "@pnp/graph/teams";

describe("Teams", function () {

    let testUserId = "";
    let teamBody = {};
    let teamID = "";
    let operationID = "";

    before(async function () {

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
    });

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

        it("team.primaryChannel", async function () {
            const primaryChannel = await this.pnp.graph.teams.getById(teamID).primaryChannel();
            return expect(primaryChannel).is.not.null;
        });

        it("team.tags", async function () {
            const tags = await this.pnp.graph.teams.getById(teamID).tags();
            return expect(tags).is.not.null;
        });

        it("team.tags.getById", async function () {
            const tags = await this.pnp.graph.teams.getById(teamID).tags();
            if (tags.length > 0) {
                const tag = await this.pnp._graph.teams.getById(teamID).tags.getById(tags[0].id)();
                return expect(tag).is.not.null;
            } else {
                this.skip();
            }
        });

        it("team.tags.add", async function () {
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
        });

        it("team.tags.update", async function () {
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
        });

        it("team.tags.delete", async function () {
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
        });

        it("team.tags.members", async function () {
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
        });

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

        it("team.tags.members.getById", async function () {
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
        });

        it("team.tags.members.delete", async function () {
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
        });

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
            before(async function () {
                const channels = await this.pnp.graph.teams.getById(teamID).channels();
                if (channels.length > 0) {
                    channelId = channels[0].id;
                } else {
                    this.skip();
                }
            });

            it("team.channels", async function () {
                const channels = await this.pnp.graph.teams.getById(teamID).channels();
                return expect(channels).is.not.null;
            });

            it("team.channels.getAllMessages", async function () {
                const getAllMessages = await this.pnp.graph.teams.getById(teamID).channels.getAllMessages(undefined);
                return expect(getAllMessages).is.not.null;
            });

            // takes too long to execute
            it.skip("team.channels.getAllRetainedMessages", async function () {
                console.log("TeamId", teamID);
                const getAllRetainedMessages = await this.pnp.graph.teams.getById(teamID).channels.getAllRetainedMessages(undefined);
                return expect(getAllRetainedMessages).is.not.null;
            });

            it("team.channel.tabs", async function () {
                const tabs = await await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).tabs();
                return expect(tabs).is.not.null;

            });

            it("team.channel.messages", async function () {
                const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
                return expect(messages).is.not.null;
            });

            // takes too long to execute
            it.skip("team.channel.filesFolder", async function () {
                const filesFolder = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).filesFolder();
                return expect(filesFolder).is.not.null;
            });

            it("team.channel.channelMembers", async function () {
                const channelMembers = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).channelMembers();
                return expect(channelMembers).is.not.null;
            });

            it("team.channel.channelMembers.getById", async function () {
                const channelMembers = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).channelMembers();
                if (channelMembers.length > 0) {
                    const id = channelMembers[0].id;
                    const channelMember = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).channelMembers.getById(id)();
                    return expect(channelMember).is.not.null;
                } else {
                    this.skip();
                }
            });

            it("team.channel.messages.getById", async function () {
                const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
                if (messages.length > 0) {
                    const messageId = messages[0].id;
                    const message = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages.getById(messageId)();
                    return expect(message).is.not.null;
                } else {
                    this.skip();
                }
            });
            it("team.channel.message.replies", async function () {
                const messages = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages();
                if (messages.length > 0) {
                    const messageId = messages[0].id;
                    const messageReply = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).messages.getById(messageId).replies();
                    return expect(messageReply).is.not.null;
                } else {
                    this.skip();
                }
            });

            it("team.channel.tabs.getById", async function () {
                const tabs = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).tabs();
                if (tabs.length > 0) {
                    const tabId = tabs[0].id;
                    const tab = await this.pnp.graph.teams.getById(teamID).channels.getById(channelId).tabs.getById(tabId)();
                    return expect(tab).is.not.null;
                } else {
                    this.skip();
                }
            });

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
            it.skip("team.channel.messages.add");
            it.skip("team.channel.tabs.add");
        });
    });

    after(async function () {

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
    });
});