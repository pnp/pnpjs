import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/calendars";
import "@pnp/graph/attachments";

import { HttpRequestError } from "@pnp/queryable";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { fail } from "assert";
import { pnpTest } from "../pnp-test.js";
// TODO:: test recording setup
describe("Calendar", function () {

    let testUserName = "";
    let defaultCalID = "";
    let testEventID = "";

    // Ensure we have the data to test against
    before(pnpTest("c4e5a948-a712-4671-9749-7deae571e91c", async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;

        // Get default calendar
        const defaultCal = await this.pnp.graph.users.getById(testUserName).calendar();
        defaultCalID = defaultCal.id;

        // Add test event
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 5);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const endRange: Date = new Date();
        endRange.setDate(endRange.getDate() + 100);
        const startRangeString = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
        const endRangeString = `${endRange.getFullYear()}-${endRange.getMonth() + 1}-${endRange.getDate()}`;
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "PnPJs Office",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Let's go for lunch",
                recurrence: {
                    pattern: {
                        type: "weekly",
                        interval: 1,
                        daysOfWeek: ["monday"],
                    },
                    range: {
                        type: "endDate",
                        startDate: startRangeString,
                        endDate: endRangeString,
                    },
                },
            });
        testEventID = event.id;
    }));

    it("Get Calendars", pnpTest("f70b640a-c95c-4565-81b4-3f190c396af4", async function () {
        const calendar = await this.pnp.graph.users.getById(testUserName).calendars();
        return expect(calendar.length).is.greaterThan(0);
    }));

    it("Get Calendar by ID", pnpTest("afe25801-3ca1-4f66-8d9b-0f39448a2b3a", async function () {
        const calendar = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID)();
        return expect(calendar).is.not.null;
    }));

    it("Get User's Default Calendar", pnpTest("4dccef58-3594-476b-bd9e-b7c7993a0e31", async function () {
        const calendar = await this.pnp.graph.users.getById(testUserName).calendar();
        return expect(calendar).is.not.null;
    }));

    // This can't be tested in an application context
    it.skip("Get Group Calendar", pnpTest("879addba-2d90-4e2d-82e8-a8c4bd8a5408", async function () {
        const group = await this.pnp.graph.groups.getById("").calendar();
        return expect(group.id).does.not.equal("");
    }));

    it("Get Events From User's Default Calendar", pnpTest("e480b52a-16de-41ad-9caa-f3e2190c6566", async function () {
        const events = await this.pnp.graph.users.getById(testUserName).calendar.events();
        return expect(events.length).is.greaterThan(0);
    }));

    it("Get All Events From User's Calendars", pnpTest("68258d8a-e567-4e3f-8269-b2fb61c04182", async function () {
        const events = await this.pnp.graph.users.getById(testUserName).events();
        return expect(events.length).is.greaterThan(0);
    }));

    it("Get Event by ID From User's Calendars", pnpTest("4989a4de-50d0-40f8-852d-7dadec4b48ab", async function () {
        const event = await this.pnp.graph.users.getById(testUserName).events.getById(testEventID)();
        return expect(event).is.not.null;
    }));

    it("Get Event by ID From User's Default Calendars", pnpTest("94e86f15-610a-49ee-a97b-25001675bf66", async function () {
        const event = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).events.getById(testEventID)();
        return expect(event).is.not.null;
    }));

    it("Add Event", pnpTest("d0e63d41-3ffc-4375-aec7-d613c74e0e7a", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "Test Lunch",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Let's go for lunch",
            });
        const eventAfterAdd = await this.pnp.graph.users.getById(testUserName).events.getById(event.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).events.getById(event.id).delete();
        return expect(eventAfterAdd).is.not.null;
    }));

    it("Update Event", pnpTest("23a99784-b3fd-4d15-915c-35ae6fbe2c3a", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "Test Lunch",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Let's go for lunch",
            });

        await this.pnp.graph.users.getById(testUserName).events.getById(event.id).update({
            reminderMinutesBeforeStart: 10, subject: "Updated Lunch",
        });
        const eventAfterUpdate = await this.pnp.graph.users.getById(testUserName).events.getById(event.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).events.getById(event.id).delete();
        return expect(eventAfterUpdate.subject).equals("Updated Lunch");
    }));

    it("Delete Event", pnpTest("7bb91d74-9dfe-4225-9479-e9d09797f8f0", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "Test Lunch",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Test Delete Lunch",
            });

        // Delete the item we just created
        await this.pnp.graph.users.getById(testUserName).events.getById(event.id).delete();
        let deletedEventFound = false;

        try {

            // If we try to find a user that doesn't exist this returns a 404
            await this.pnp.graph.users.getById(testUserName).events.getById(event.id)();
            deletedEventFound = true;

        } catch (e) {
            if (e?.isHttpRequestError) {
                if ((<HttpRequestError>e).status === 404) {
                    console.error((<HttpRequestError>e).statusText);
                }
            } else {
                console.log(e.message);
            }
        }

        return expect(deletedEventFound).is.false;
    }));

    it("Forward Event", pnpTest("4868e478-5814-439a-8574-a9c55b3a62e1", async function () {
        return expect(this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).events.getById(testEventID).forward(
            {
                ToRecipients: [{ emailAddress: { address: testUserName, name: "PnP Test User" } }],
                Comment: "Here is a forward event",
            }
        )).eventually.be.fulfilled;
    }));

    it.skip("Decline Event", pnpTest("768189f7-83aa-4675-b0bc-ba5ee1b82d3b", async function () {
        return expect(true);
    }));

    it("Cancel Event", pnpTest("7e666700-25c5-4e24-83a4-8bd84bd45f7c", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "Test Lunch",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Test Delete Lunch",
            });

        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).cancel()).eventually.be.fulfilled;
    }));

    it.skip("Accept Event", pnpTest("ea5058b1-63a2-477e-a848-b73736f22e94", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "Test Lunch",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Test Delete Lunch",
            });

        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).accept()).eventually.be.fulfilled;
    }));

    it.skip("Tentatively Accept Event", pnpTest("13688c69-e579-4999-b547-41dbfbcedf7a", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);

        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "Test Lunch",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Test Delete Lunch",
            });

        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).tentativelyAccept(
            "I might be able to make it",
            true,
            {
                start: {
                    dateTime: "2019-12-02T19:00:00",
                    timeZone: "Pacific Standard Time",
                },
                end: {
                    dateTime: "2019-12-02T19:00:00",
                    timeZone: "Pacific Standard Time",
                },
            }
        )).eventually.be.fulfilled;
    }));

    it("Dismiss Reminder", pnpTest("964255df-d082-4845-8cc3-a9f896109e58", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "Test Lunch",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Test Delete Lunch",
            });

        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).dismissReminder()).eventually.be.fulfilled;
    }));

    it("Snooze Reminder", pnpTest("51772ab9-6f25-4d6b-8a8f-b027fa38204c", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                end: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                location: {
                    displayName: "Test Lunch",
                },
                start: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                subject: "Test Delete Lunch",
            });

        endDate.setHours(startDate.getHours() + 10);
        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).snoozeReminder({
            dateTime: endDate.toISOString(),
            timeZone: "Pacific Standard Time",
        })).eventually.be.fulfilled;
    }));

    it("Get Reminder View", pnpTest("a0dda9ec-250e-4a3d-be84-673a291497c8", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 10);
        const view = await this.pnp.graph.users.getById(testUserName).reminderView(startDate.toISOString(), endDate.toISOString())();
        return expect(view.length).is.greaterThan(0);
    }));

    it("Get User's Schedule", pnpTest("52c9d35c-5720-4370-b3d2-15285bef16ab", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = new Date(startDate);
        endDate.setHours(startDate.getHours() + 10);
        const schedule = await this.pnp.graph.users.getById(testUserName).calendar.getSchedule(
            {
                schedules: [
                    testUserName,
                ],
                startTime: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
                endTime: {
                    dateTime: endDate.toISOString(),
                    timeZone: "Pacific Standard Time",
                },
            });
        return expect(schedule).is.not.null;
    }));

    // not available for Application context. Only App Context w/ Shared Calendars.
    it.skip("Find Meeting Times", pnpTest("50a9593a-d4a9-40ce-b004-08833a322721", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 10);
        const meetingTimes = await this.pnp.graph.users.getById(testUserName).findMeetingTimes({
            attendees: [
                {
                    type: "required",
                    emailAddress: {
                        name: "PnP Test User",
                        address: testUserName,
                    },
                },
            ],
            timeConstraint: {
                activityDomain: "work",
                timeSlots: [
                    {
                        start: {
                            dateTime: startDate.toISOString(),
                            timeZone: "Pacific Standard Time",
                        },
                        end: {
                            dateTime: endDate.toISOString(),
                            timeZone: "Pacific Standard Time",
                        },
                    },
                ],
            },
            meetingDuration: "PT1H",
            minimumAttendeePercentage: 100,
        }
        );
        return expect(meetingTimes).is.not.null;
    }));

    it("Get Calendar View", pnpTest("77f6167f-b3af-453d-b820-5493bc0b52f6", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 10);
        const view = await this.pnp.graph.users.getById(testUserName).calendarView(startDate.toISOString(), endDate.toISOString())();
        return expect(view.length).is.greaterThan(0);
    }));

    it("Get CalendarView Delta", pnpTest("ba721341-1a7c-497d-bfd1-83c55d7a4471", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        startDate.setDate(endDate.getDate() - 10);
        const deltaEvents = await this.pnp.graph.users.getById(testUserName).calendarView(startDate.toISOString(), endDate.toISOString()).delta();

        return expect(deltaEvents).is.not.null;
    }));

    it("Get Instances", pnpTest("bf4e26ca-a608-4bee-bdb3-92285e2f9f55",  async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 24);
        const event = this.pnp.graph.users.getById(testUserName).events.getById(testEventID);
        const instances = await event.instances(startDate.toISOString(), endDate.toISOString())();
        return expect(instances.length).is.greaterThan(0);
    }));

    // currently not working
    it.skip("Add Event Attachments", pnpTest("b60e27d4-6d73-48cf-9851-5b54e7adcda6", async function () {
        const attachment = await this.pnp.graph.users.getById(testUserName).events.getById(testEventID).attachments.addFile(
            { name: "Test.txt" }, "base64bWFjIGFuZCBjaGVlc2UgdG9kYXk");
        return expect(attachment.id).is.not.null;
    }));

    // currently not working
    it.skip("Get Event Attachments", pnpTest("248a511b-ead8-47f3-ac87-fdb3aeecbb1e", async function () {
        // const attachment = await this.pnp.graph.users.getById(testUserName).events.getById(testEventID).attachments.addFile(
        // { name: "Test.txt" }, "base64bWFjIGFuZCBjaGVlc2UgdG9kYXk");

        const attachments = await this.pnp.graph.users.getById(testUserName).events.getById(testEventID).attachments();
        return expect(attachments.length).is.greaterThan(0);
    }));

    it("Get Calendar Groups", pnpTest("545ca655-1dd7-4377-92fe-7dd49b6da1c2", async function () {
        const groups = await this.pnp.graph.users.getById(testUserName).calendarGroups();
        return expect(groups.length).is.greaterThan(0);
    }));

    it("Get Calendar Group by ID", pnpTest("363f2d43-8950-43ff-91fb-11471efb728e", async function () {
        const groups = await this.pnp.graph.users.getById(testUserName).calendarGroups();
        if (groups.length > 0) {
            const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(groups[0].id)();
            return expect(group).is.not.null;
        }
    }));

    it("Create Calendar Group", pnpTest("c0639e4b-7ae2-4188-8878-6942726c88ad", async function () {
        let passed = false;
        const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.add({
            name: "Test Group",
        });

        if (group.id) {
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("Update Calendar Group", pnpTest("f4bb5d4a-25fb-46b8-9484-d83b7cbd78e4", async function () {
        let passed = false;
        const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.add({
            name: "Test Group",
        });
        await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).update({
            name: "Updated Test Group",
        });
        const updatedGroup = await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id)();
        if (updatedGroup.id && updatedGroup.name === "Updated Test Group") {
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).delete();
        }
        return expect(passed).is.true;
    }));

    // This logs to the console when it passes, ignore those messages
    it("Delete Calendar Group", pnpTest("efc3ce3f-4876-4f18-830c-200ca3ced2c9", async function () {
        let deletedCalendarGroupFound = false;
        const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.add({
            name: "DeleteGroup" + getRandomString(5),
        });
        await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).delete();
        try {
            await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id)();
            deletedCalendarGroupFound = true;
        } catch (e) {
            if (e?.isHttpRequestError) {
                if ((<HttpRequestError>e).status === 404) {
                    // do nothing
                }
            } else {
                console.log(e.message);
            }
        }
        return expect(deletedCalendarGroupFound).is.false;
    }));

    it("List Calendar Group Calendars", pnpTest("d6242763-62e9-4140-b15a-988dd0b25a45", async function () {
        const groups = await this.pnp.graph.users.getById(testUserName).calendarGroups();
        if (groups.length > 0) {
            const calendars = await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(groups[0].id).calendars();
            return expect(calendars.length).is.greaterThan(0);
        }
    }));

    it("Create Calendar Group Calendar", pnpTest("e09d93fb-fe26-4b81-a400-4021bd9fccef", async function () {
        let passed = false;
        const { groupName, calendarName } = await this.props({
            groupName: "CalendarGroup" + getRandomString(5),
            calendarName: "Calendar" + getRandomString(5),
        });
        const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.add({
            name: groupName,
        });
        const calendar = await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).calendars.add({
            name: calendarName,
        });

        if (calendar.id) {
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).delete();
            await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("Get Calendar Permissions", pnpTest("75f16d8d-2ca8-445e-a9da-f117d9eb4a31", async function () {
        const permissions = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions();
        return expect(permissions.length).is.greaterThan(0);
    }));

    it("Get Calendar Permission by ID", pnpTest("5dbd8d84-7b2a-4e4c-b6e4-7fecb31e81f8", async function () {
        const permissions = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions();
        if (permissions.length > 0) {
            const permission = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions.getById(permissions[0].id)();
            return expect(permission.id).is.not.null;
        }
        this.skip();
    }));

    it("Create Calendar Permissions", pnpTest("2c53d9b2-5eaf-49d0-9934-a7538104fca5", async function () {
        let passed = false;
        const { name } = await this.props({
            name: "Calendar" + getRandomString(5),
        });
        const calendar = await this.pnp.graph.users.getById(testUserName).calendars.add({
            name: name,
        });
        const permission = await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).calendarPermissions.add(
            {
                emailAddress: {
                    address: testUserName,
                    name: "PnP Test User",
                },
                allowedRoles: ["read"],
                role: "read",
            });
        if (permission.id) {
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("Update Calendar Permissions", pnpTest("d2c258f9-0f69-4b0d-909a-8311656821fd", async function () {
        let passed = false;
        const { name } = await this.props({
            name: "Calendar" + getRandomString(5),
        });
        const calendar = await this.pnp.graph.users.getById(testUserName).calendars.add({
            name: name,
        });
        const permission = await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).calendarPermissions.add(
            {
                emailAddress: {
                    address: testUserName,
                    name: "PnP Test User",
                },
                role: "read",
                allowedRoles: ["read", "write"],
            });

        if (permission.id) {
            await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).calendarPermissions.getById(permission.id).update({
                role: "write",
            });

            const updatedPermission = await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).calendarPermissions.getById(permission.id)();
            if (updatedPermission.id && updatedPermission.role === "write") {
                passed = true;
                await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).delete();
            }
            return expect(passed).is.true;
        } else {
            return fail("Permissions could not be created on the calendar object, test could not be completed.");
        }
    }));

    // This logs to the console when it passes, ignore those messages
    it("Delete Calendar Permissions", pnpTest("402a95b4-5962-45f3-90d9-9eab2adbaef2", async function () {
        let deletePermissionFound = false;
        const permission = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions.add(
            {
                emailAddress: {
                    address: testUserName,
                    name: "PnP Test User",
                },
                role: "read",
                allowedRoles: ["read", "write"],
            });
        await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions.getById(permission.id).delete();

        try {
            await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions.getById(permission.id)();
            deletePermissionFound = true;
        } catch (e) {
            if (e?.isHttpRequestError) {
                if ((<HttpRequestError>e).status === 404) {
                    // do nothing
                }
            } else {
                console.log(e.message);
            }
        }
        return expect(deletePermissionFound).is.false;
    }));

    // Remove the test data we created
    after(pnpTest("c2b8da34-62f5-4b2c-9be7-d491476801fe", async function () {

        if (!stringIsNullOrEmpty(testUserName) && !stringIsNullOrEmpty(testEventID)) {
            await this.pnp.graph.users.getById(testUserName).calendar.events.getById(testEventID).delete();
        }
        return;
    }));
});
