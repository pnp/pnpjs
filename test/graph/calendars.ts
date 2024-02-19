import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/calendars";
import "@pnp/graph/attachments";

import { HttpRequestError } from "@pnp/queryable";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";


// TODO:: test recording setup

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
                    "displayName": "PnPJs Office",
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
        testEventID = event.id;
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
    
    // This can't be tested in an application context
    it.skip("Get Group Calendar", async function () {
        const group = await this.pnp.graph.groups.getById("").calendar();
        return expect(group.id).does.not.equal("");
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
        const eventAfterAdd = await this.pnp.graph.users.getById(testUserName).events.getById(event.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).events.getById(event.id).delete();
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

        await this.pnp.graph.users.getById(testUserName).events.getById(event.id).update({
            reminderMinutesBeforeStart: 10, subject: "Updated Lunch",
        });
        const eventAfterUpdate = await this.pnp.graph.users.getById(testUserName).events.getById(event.id)();
        // Clean up the added contact
        await this.pnp.graph.users.getById(testUserName).events.getById(event.id).delete();
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
    });

    it("Forward Event", async function () {
        return expect(this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).events.getById(testEventID).forward(
            [{"emailAddress": {"address": testUserName, "name": "PnP Test User"}}],
            "Here is a forward event"
        )).eventually.be.fulfilled;
    });

    it("Cancel Event", async function () {  
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

        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).cancel()).eventually.be.fulfilled;
    });

    it.skip("Accept Event", async function () {
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

        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).accept()).eventually.be.fulfilled;
    });

    it.skip("Tentatively Accept Event", async function () {
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

        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).tentativelyAccept()).eventually.be.fulfilled;
    });

    it("Dismiss Reminder", async function () {
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

        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).dismissReminder()).eventually.be.fulfilled;
    });

    it("Snooze Reminder", async function () {
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

        endDate.setHours(startDate.getHours() + 10);
        return expect(this.pnp.graph.users.getById(testUserName).calendar.events.getById(event.id).snoozeReminder({
            "dateTime": endDate.toISOString(),
            "timeZone": "Pacific Standard Time",
        })).eventually.be.fulfilled;
    });

    it("Get Reminder View", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 10);
        const view = await this.pnp.graph.users.getById(testUserName).reminderView(startDate.toISOString(), endDate.toISOString())();
        return expect(view.length).is.greaterThan(0);
    });

    it("Get User's Schedule", async function () {
        const startDate: Date = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const endDate: Date = new Date(startDate);
        endDate.setHours(startDate.getHours() + 10);
        const schedule = await this.pnp.graph.users.getById(testUserName).calendar.getSchedule(
            {
                "schedules": [
                    testUserName,
                ],
                "startTime": {
                    "dateTime": startDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
                "endTime": {
                    "dateTime": endDate.toISOString(),
                    "timeZone": "Pacific Standard Time",
                },
            });
        return expect(schedule).is.not.null;
    });

    //not available for Application context. Only App Context w/ Shared Calendars.
    it.skip("Find Meeting Times", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 10);
        const meetingTimes = await this.pnp.graph.users.getById(testUserName).findMeetingTimes({
            "attendees": [
                {
                    "type": "required",
                    "emailAddress": {
                      "name": "PnP Test User",
                      "address": testUserName
                    }
                }
              ],
              "timeConstraint": {
                "activityDomain":"work",
                "timeSlots": [
                  {
                    "start": {
                      "dateTime": startDate.toISOString(),
                      "timeZone": "Pacific Standard Time"
                    },
                    "end": {
                      "dateTime": endDate.toISOString(),
                      "timeZone": "Pacific Standard Time"
                    }
                  }
                ]
              },
              "meetingDuration": "PT1H",
              "minimumAttendeePercentage": 100
            }
        );
        return expect(meetingTimes).is.not.null;
    });

    it("Get Calendar View", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 10);
        const view = await this.pnp.graph.users.getById(testUserName).calendarView(startDate.toISOString(), endDate.toISOString())();
        return expect(view.length).is.greaterThan(0);
    });

    it("Get CalendarView Delta", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        startDate.setDate(endDate.getDate() - 10);
        const deltaEvents = await this.pnp.graph.users.getById(testUserName).calendarView(startDate.toISOString(), endDate.toISOString()).delta();

        return expect(deltaEvents).is.not.null;
    });

    it("Get Instances", async function () {
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        endDate.setDate(endDate.getDate() + 24);
        const event = this.pnp.graph.users.getById(testUserName).events.getById(testEventID);
        const instances = await event.instances(startDate.toISOString(), endDate.toISOString())();
        return expect(instances.length).is.greaterThan(0);
    });

    // currently not working
    it.skip("Add Event Attachments", async function () {
        const attachment = await this.pnp.graph.users.getById(testUserName).events.getById(testEventID).attachments.addFile({name: "Test.txt"}, "base64bWFjIGFuZCBjaGVlc2UgdG9kYXk");
        return expect(attachment.id).is.not.null;
    });

     // currently not working
    it.skip("Get Event Attachments", async function () {
        const attachment = await this.pnp.graph.users.getById(testUserName).events.getById(testEventID).attachments.addFile({name: "Test.txt"}, "base64bWFjIGFuZCBjaGVlc2UgdG9kYXk");

        const attachments = await this.pnp.graph.users.getById(testUserName).events.getById(testEventID).attachments();
        return expect(attachments.length).is.greaterThan(0);
    });

    it("Get Calendar Groups", async function () {
        const groups = await this.pnp.graph.users.getById(testUserName).calendarGroups();
        return expect(groups.length).is.greaterThan(0);
    });

    it("Get Calendar Group by ID", async function () {
        const groups = await this.pnp.graph.users.getById(testUserName).calendarGroups();
        if(groups.length > 0) {
            const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(groups[0].id)();
            return expect(group).is.not.null;
        }
    });

    it("Create Calendar Group", async function () { 
        let passed = false;
        const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.add({
            "name": "Test Group"
        });
        
        if(group.id){
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).delete();
        }
        return expect(passed).is.true;
    });

    it("Update Calendar Group", async function () {
        let passed = false;
        const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.add({
            "name": "Test Group"
        });
        await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).update({
            "name": "Updated Test Group"
        });
        const updatedGroup = await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id)();
        if(updatedGroup.id && updatedGroup.name === "Updated Test Group"){
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).delete();
        }
        return expect(passed).is.true;
    });

    it("Delete Calendar Group", async function () {
        let deletedCalendarGroupFound = false;
        const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.add({
            "name": "DeleteGroup" + getRandomString(5)
        });
        await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).delete();  
        try {
            await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id)();          
            deletedCalendarGroupFound = true;
        } catch (e) {
            if (e?.isHttpRequestError) {
                if ((<HttpRequestError>e).status === 404) {
                    console.error((<HttpRequestError>e).statusText);
                }
            } else {
                console.log(e.message);
            }
        }
        return expect(deletedCalendarGroupFound).is.false;
    });

    it("List Calendar Group Calendars", async function () {
        const groups = await this.pnp.graph.users.getById(testUserName).calendarGroups();
        if(groups.length > 0) {
            const calendars = await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(groups[0].id).calendars();
            return expect(calendars.length).is.greaterThan(0);
        }
    });

    it("Create Calendar Group Calendar", async function () {
        let passed = false;
        const group = await this.pnp.graph.users.getById(testUserName).calendarGroups.add({
            "name": "CalendarGroup" + getRandomString(5) 
        });
        const calendar = await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).calendars.add({
            "name": "Calendar" + getRandomString(5)
        });

        if(calendar.id){
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).delete();
            await this.pnp.graph.users.getById(testUserName).calendarGroups.getById(group.id).delete();
        }
        return expect(passed).is.true;
    });

    it("Get Calendar Permissions", async function () {
        const permissions = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions();
        return expect(permissions.length).is.greaterThan(0);
    });

    it("Get Calendar Permission by ID", async function () { 
        const permissions = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions();
        if(permissions.length > 0){
            const permission = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions.getById(permissions[0].id)();
            return expect(permission.id).is.not.null;
        }
        this.skip();
    });

    it("Create Calendar Permissions", async function () {
        let passed = false;
        const calendar = await this.pnp.graph.users.getById(testUserName).calendars.add({
            "name": "Calendar" + getRandomString(5)
        });
        const permission = await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).calendarPermissions.add(
            {
                "emailAddress": {
                    "address": testUserName,
                    "name": "PnP Test User"
                },
                "allowedRoles": ["read"],
                "role": "read"
            });
        if(permission.id){
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).delete();
        }
        return expect(passed).is.true;
    });

    it("Update Calendar Permissions", async function () {
        let passed = false;
        const calendar = await this.pnp.graph.users.getById(testUserName).calendars.add({
            "name": "Calendar" + getRandomString(5)
        });
        const permission = await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).calendarPermissions.add(
            {
                "emailAddress": {
                    "address": testUserName,
                    "name": "PnP Test User"
                },
                "role": "read",
                "allowedRoles": ["read", "write"]
            });

        await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).calendarPermissions.getById(permission.id).update({
            "role": "write"
        });

        const updatedPermission = await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).calendarPermissions.getById(permission.id)();
        if(updatedPermission.id && updatedPermission.role === "write"){
            passed = true;
            await this.pnp.graph.users.getById(testUserName).calendars.getById(calendar.id).delete();
        }
        return expect(passed).is.true;
    });

    it("Delete Calendar Permissions", async function () { 
        let deletePermissionFound = false;
        const permission = await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions.add(
        {
            "emailAddress": {
                "address": testUserName,
                "name": "PnP Test User"
            },
            "role": "read",
            "allowedRoles": ["read", "write"]
        });
        await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions.getById(permission.id).delete();

        try {
            await this.pnp.graph.users.getById(testUserName).calendars.getById(defaultCalID).calendarPermissions.getById(permission.id)();         
            deletePermissionFound = true;
        } catch (e) {
            if (e?.isHttpRequestError) {
                if ((<HttpRequestError>e).status === 404) {
                    console.error((<HttpRequestError>e).statusText);
                }
            } else {
                console.log(e.message);
            }
        }
        return expect(deletePermissionFound).is.false;
    });  

    // Remove the test data we created
    after(async function () {

        if (!stringIsNullOrEmpty(testUserName) && !stringIsNullOrEmpty(testEventID)) {
            await this.pnp.graph.users.getById(testUserName).calendar.events.getById(testEventID).delete();
        }
        return;
    });
});
