import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/calendars";
import { HttpRequestError } from "@pnp/queryable";
import { stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";

describe("Calendar", function () {

    let testUserName = "";
    let defaultCalID = "";
    let testEventID = "";

    // Ensure we have the data to test against
    before(async function () {

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
                "end": {
                    "dateTime": startDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "location": {
                    "displayName": "Harry's Bar",
                },
                "start": {
                    "dateTime": endDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "subject": "Let's go for lunch",
                "recurrence": {
                    "pattern": {
                        "type": "weekly",
                        "interval": 1,
                        "daysOfWeek": ["monday"],
                    },
                    "range": {
                        "type": "endDate",
                        "startDate": startRangeString,
                        "endDate": endRangeString,
                    },
                },
            });
        testEventID = event.data.id;
    });

    it("Get Calendars", async function () {
        const calendar = await this.pnp.graph.users.getById(testUserName).calendars();
        return expect(calendar.length).is.greaterThan(0);
    });

    it("Get Calendar by ID", async function () {
        const calendar = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID)();
        return expect(calendar).is.not.null;
    });

    it("Get User's Default Calendar", async function () {
        const calendar = await this.pnp.graph.users.getById(testUserName).calendar();
        return expect(calendar).is.not.null;
    });

    it("Get Events From User's Default Calendar", async function () {
        const events = await this.pnp.graph.users.getById(testUserName).calendar.events();
        return expect(events.length).is.greaterThan(0);
    });

    it("Get All Events From User's Calendars", async function () {
        const events = await this.pnp.graph.users.getById(testUserName).events();
        return expect(events.length).is.greaterThan(0);
    });

    it("Get Event by ID From User's Calendars", async function () {
        const event = await this.pnp.graph.users.getById(testUserName).events.getById(testEventID)();
        return expect(event).is.not.null;
    });

    it("Get Event by ID From User's Default Calendars", async function () {
        const event = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).events.getById(testEventID)();
        return expect(event).is.not.null;
    });

    it("Add Event", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                "end": {
                    "dateTime": startDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "location": {
                    "displayName": "Test Lunch",
                },
                "start": {
                    "dateTime": endDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "subject": "Let's go for lunch",
            });
        const eventAfterAdd = await this.pnp.graph.users.getById(testUserName).events.getById(event.data.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).events.getById(event.data.id).delete();
        return expect(eventAfterAdd).is.not.null;
    });

    it("Update Event", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                "end": {
                    "dateTime": startDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "location": {
                    "displayName": "Test Lunch",
                },
                "start": {
                    "dateTime": endDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "subject": "Let's go for lunch",
            });

        await this.pnp.graph.users.getById(testUserName).events.getById(event.data.id).update({
            reminderMinutesBeforeStart: 10, subject: "Updated Lunch",
        });
        const eventAfterUpdate = await this.pnp.graph.users.getById(testUserName).events.getById(event.data.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).events.getById(event.data.id).delete();
        return expect(eventAfterUpdate.subject).equals("Updated Lunch");
    });

    it("Delete Event", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = startDate;
        endDate.setHours(startDate.getHours() + 1);
        const event = await this.pnp.graph.users.getById(testUserName).calendar.events.add(
            {
                "end": {
                    "dateTime": startDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "location": {
                    "displayName": "Test Lunch",
                },
                "start": {
                    "dateTime": endDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "subject": "Test Delete Lunch",
            });

        // Delete the item we just created
        await this.pnp.graph.users.getById(testUserName).events.getById(event.data.id).delete();
        let deletedEventFound = false;

        try {

            // If we try to find a user that doesn't exist this returns a 404
            await this.pnp.graph.users.getById(testUserName).events.getById(event.data.id)();
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
    });

    // This can't be tested in an application context
    it.skip("Get Group Calendar", async function () {
        const group = await this.pnp.graph.groups.getById("").calendar();
        return expect(group.id).does.not.equal("");
    });

    it("Get Calendar View", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 10);
        const view = await this.pnp.graph.users.getById(testUserName).calendarView(startDate.toISOString(), endDate.toISOString())();
        return expect(view.length).is.greaterThan(0);
    });

    it("Get Instances", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 24);
        const event = this.pnp.graph.users.getById(testUserName).events.getById(testEventID);
        const instances = await event.instances(startDate.toISOString(), endDate.toISOString())();
        return expect(instances.length).is.greaterThan(0);
    });


    // Remove the test data we created
    after(async function () {

        if (!stringIsNullOrEmpty(testUserName) && !stringIsNullOrEmpty(testEventID)) {
            await this.pnp.graph.users.getById(testUserName).calendar.events.getById(testEventID).delete();
        }
        return;
    });
});
