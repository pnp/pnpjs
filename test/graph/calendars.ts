import { expect } from "chai";
import { getGraph, testSettings } from "../main.js";
import "@pnp/graph/users";
import "@pnp/graph/calendars";
import { HttpRequestError } from "@pnp/queryable";
import { stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";

describe("Calendar", function () {


    // We can't test for _graphRest.me calls in an application context
    if (testSettings.enableWebTests && testSettings.testUser?.length > 0) {
        let _graphRest = null;
        let testUserName = "";
        let defaultCalID = "";
        let testEventID = "";

        // Ensure we have the data to test against
        before(async function () {
            _graphRest = getGraph();

            const userInfo = await getValidUser();
            testUserName = userInfo.userPrincipalName;

            // Get default calendar
            const defaultCal = await _graphRest.users.getById(testUserName).calendar();
            defaultCalID = defaultCal.id;

            // Add test event
            const startDate: Date = new Date();
            startDate.setDate(startDate.getDate() + 5);
            const endDate: Date = startDate;
            endDate.setHours(startDate.getHours() + 1);
            const event = await _graphRest.users.getById(testUserName).calendar.events.add(
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
                });
            testEventID = event.data.id;
        });

        it("Get Calendars", async function () {
            const calendar = await _graphRest.users.getById(testUserName).calendars();
            return expect(calendar.length).is.greaterThan(0);
        });

        it("Get Calendar by ID", async function () {
            const calendar = await _graphRest.users.getById(testUserName).calendars.getById(defaultCalID)();
            return expect(calendar).is.not.null;
        });

        it("Get User's Default Calendar", async function () {
            const calendar = await _graphRest.users.getById(testUserName).calendar();
            return expect(calendar).is.not.null;
        });

        it("Get Events From User's Default Calendar", async function () {
            const events = await _graphRest.users.getById(testUserName).calendar.events();
            return expect(events.length).is.greaterThan(0);
        });

        it("Get All Events From User's Calendars", async function () {
            const events = await _graphRest.users.getById(testUserName).events();
            return expect(events.length).is.greaterThan(0);
        });

        it("Get Event by ID From User's Calendars", async function () {
            const event = await _graphRest.users.getById(testUserName).events.getById(testEventID)();
            return expect(event).is.not.null;
        });

        it("Get Event by ID From User's Default Calendars", async function () {
            const event = await _graphRest.users.getById(testUserName).calendars.getById(defaultCalID).events.getById(testEventID)();
            return expect(event).is.not.null;
        });

        it("Add Event", async function () {
            const startDate: Date = new Date();
            startDate.setDate(startDate.getDate() + 1);
            const endDate: Date = startDate;
            endDate.setHours(startDate.getHours() + 1);
            const event = await _graphRest.users.getById(testUserName).calendar.events.add(
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
            const eventAfterAdd = await _graphRest.users.getById(testUserName).events.getById(event.data.id)();
            // Clean up the added contact
            await _graphRest.users.getById(testUserName).events.getById(event.data.id).delete();
            return expect(eventAfterAdd).is.not.null;
        });

        it("Update Event", async function () {
            const startDate: Date = new Date();
            startDate.setDate(startDate.getDate() + 1);
            const endDate: Date = startDate;
            endDate.setHours(startDate.getHours() + 1);
            const event = await _graphRest.users.getById(testUserName).calendar.events.add(
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

            await _graphRest.users.getById(testUserName).events.getById(event.data.id).update({
                reminderMinutesBeforeStart: 10, subject: "Updated Lunch",
            });
            const eventAfterUpdate = await _graphRest.users.getById(testUserName).events.getById(event.data.id)();
            // Clean up the added contact
            await _graphRest.users.getById(testUserName).events.getById(event.data.id).delete();
            return expect(eventAfterUpdate.subject).equals("Updated Lunch");
        });

        it("Delete Event", async function () {
            const startDate: Date = new Date();
            startDate.setDate(startDate.getDate() + 1);
            const endDate: Date = startDate;
            endDate.setHours(startDate.getHours() + 1);
            const event = await _graphRest.users.getById(testUserName).calendar.events.add(
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
            await _graphRest.users.getById(testUserName).events.getById(event.data.id).delete();
            let deletedEventFound = false;

            try {

                // If we try to find a user that doesn't exist this returns a 404
                await _graphRest.users.getById(testUserName).events.getById(event.data.id)();
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
        // it("Get Group Calendar", async function () {
        //    const group = await _graphRest.groups.getById(groupID).calendar();
        //    return expect(group.id).does.not.equal("");
        // });

        it("Get Calendar View", async function () {
            const startDate: Date = new Date();
            const endDate: Date = new Date();
            endDate.setDate(endDate.getDate() + 10);
            const view = await _graphRest.users.getById(testUserName).calendarView(startDate.toISOString(), endDate.toISOString())();
            return expect(view.length).is.greaterThan(0);
        });

        // Remove the test data we created
        this.afterAll(async function () {

            if (!stringIsNullOrEmpty(testUserName) && !stringIsNullOrEmpty(testEventID)) {
                await _graphRest.users.getById(testUserName).calendar.events.getById(testEventID).delete();
            }
        });
    }
});
