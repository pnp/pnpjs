import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/todo";
import { pnpTest } from "../pnp-test.js";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { ChecklistItem } from "@microsoft/microsoft-graph-types";
import { IDeltaItems } from "@pnp/graph/decorators.js";
import { ITaskList, ITask } from "@pnp/graph/to-do";

describe("To-do", function () {
    let taskList: ITaskList;
    let todoTask: ITask;
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const list = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.add({
            displayName: getRandomString(5),
        });

        const task = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(list.id).tasks.add(
            {
                title:"A new task",
            },
        );
        taskList = this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(list.id);
        todoTask = taskList.tasks.getById(task.id);

        if(!list || !task){
            this.skip();
        }
    });

    it("lists", pnpTest("8de75582-6257-4e2a-b753-7c8be1cf0a38", async function () {
        const lists = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists();
        return expect(lists).to.be.an("array") && expect(lists[0]).to.haveOwnProperty("id");
    }));

    it("lists - getById()", pnpTest("50650ae3-8192-4767-b4b3-9af7a586c11b", async function () {
        const list = await taskList();
        return expect(list.id).is.not.null;
    }));

    it("lists - add", pnpTest("2548a740-4267-4868-8663-e5bf5ae44ae2", async function () {
        let passed = false;
        const list = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.add({
            displayName: "Test" + getRandomString(5),
        });

        if(list){
            passed = true;
            await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(list.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("lists - update", pnpTest("9017c7b8-fb00-4a00-9ef0-51af695679a6", async function () {
        const displayName = "Test " + getRandomString(5);
        const updated = await taskList.update({
            displayName: displayName,
        });
        return expect(updated.id).is.not.null && expect(updated.displayName).equal(displayName);
    }));

    it("lists - delete", pnpTest("ef561648-4380-4629-89bb-9834934e78d1", async function () {
        const list = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.add({
            displayName: "Test" + getRandomString(5),
        });
        if(list){
            return expect(this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(list.id).delete()).to.eventually.be.fulfilled;
        }
        this.skip();
    }));

    it("lists - delta", pnpTest("70cb936e-9ee5-4630-a3c7-6fdf60bbd6fe", async function () {
        const delta: IDeltaItems = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.delta();
        return expect(delta.values).is.an("array");
    }));

    it("tasks", pnpTest("87475a79-f33a-44ff-a998-a5024ad77e13", async function () {
        const tasks = await taskList.tasks();
        return expect(tasks).to.be.an("array") && expect(tasks[0]).to.haveOwnProperty("id");
    }));

    it("tasks - getById()", pnpTest("59d5dd98-1730-40fb-898e-4cd56e5b8260", async function () {
        const task = await todoTask();
        return expect(task.id).is.not.null;
    }));

    it("tasks - add", pnpTest("71958133-bd13-4bde-83c3-b8ea8871a466", async function () {
        let passed = false;
        const task = await taskList.tasks.add({
            title: "Test" + getRandomString(5),
        });

        if(task){
            passed = true;
            await taskList.tasks.getById(task.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("tasks - update", pnpTest("c2071fbb-55d0-4837-a0d8-9a8bc6640f60", async function () {
        const title = "Test " + getRandomString(5);
        const updated = await todoTask.update({
            title: title,
        });
        return expect(updated.id).is.not.null && expect(updated.title).equal(title);
    }));

    it("tasks - delete", pnpTest("104adde8-6514-4b84-b711-ae360e971519", async function () {
        const task = await taskList.tasks.add({
            title: "Test" + getRandomString(5),
        });
        if(task){
            return expect(taskList.tasks.getById(task.id).delete()).to.eventually.be.fulfilled;
        }
        this.skip();
    }));

    it("tasks - delta", pnpTest("8167699b-acd8-4e03-b14c-e5a347b0a131", async function () {
        const delta: IDeltaItems = await taskList.tasks.delta();
        return expect(delta.values).is.an("array");
    }));

    it("fileAttachments", pnpTest("a4fedae2-3116-4488-a743-03253f59a579", async function () {
        const attachments = await todoTask.attachments();
        return expect(attachments).is.an("array");
    }));

    it("fileAttachments getById", pnpTest("e14085f3-c3a2-498c-a781-c269b565ce73", async function () {
        const add = await todoTask.attachments.add(
            {
                "name": getRandomString(10),
                "contentBytes": "VGVzdA==",
                "contentType": "text/plain",
            }
        );
        const attachment = await todoTask.attachments.getById(add.id)();
        return expect(attachment.id).is.not.null;
    }));

    it("fileAttachments add small", pnpTest("1515ae48-15c4-4b0c-81a7-3afd4b83e601", async function () {
        const attachment = await todoTask.attachments.add(
            {
                "name": getRandomString(10),
                "contentBytes": "VGVzdA==",
                "contentType": "text/plain",
            }
        );
        return expect(attachment.id).is.not.null;
    }));

    it("fileAttachments delete", pnpTest("6ab1d551-c0ef-4b6c-a444-ce3f49b777e6", async function () {
        const attachment = await todoTask.attachments.add(
            {
                "name": getRandomString(10),
                "contentBytes": "VGVzdA==",
                "contentType": "text/plain",
            }
        );
        if(attachment){
            return expect(todoTask.attachments.getById((await attachment).id).delete()).to.eventually.be.fulfilled;
        }
        this.skip();
    }));

    it("checklistItems", pnpTest("e79a1dd1-765b-4740-82c9-9b57e202b034", async function () {
        const checklistItems = await todoTask.checklistItems();
        return expect(checklistItems).to.be.an("array");
    }));

    it("checklistItems - getById()", pnpTest("b2a55a7d-1af2-427a-a506-0a015fe7ad43", async function () {
        const newItem = await todoTask.checklistItems.add({
            displayName:getRandomString(10),
        });
        const item: ChecklistItem = await todoTask.checklistItems.getById(newItem.id)();
        return expect(item.id).is.not.null;
    }));

    it("checklistItems - add", pnpTest("be7b039f-2de9-446a-8a3c-e3b8ea5ec237", async function () {
        let passed = false;
        const newItem = await todoTask.checklistItems.add({
            displayName:getRandomString(10),
        });

        if(newItem){
            passed = true;
            await todoTask.checklistItems.getById(newItem.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("checklistItems - update", pnpTest("9568305d-afea-43b1-89ad-5c3f5273383f", async function () {
        const title = "Test " + getRandomString(5);
        const newItem = await todoTask.checklistItems.add({
            displayName:getRandomString(10),
        });

        const updated = await todoTask.checklistItems.getById(newItem.id).update({
            displayName: title,
        });
        return expect(updated.id).is.not.null && expect(updated.displayName).equal(title);
    }));

    it("checklistItems - delete", pnpTest("ff66aa6c-72e9-402e-9937-3a59fd61257f", async function () {
        const newItem = await todoTask.checklistItems.add({
            displayName:getRandomString(10),
        });
        if(newItem){
            return expect(todoTask.checklistItems.getById(newItem.id).delete()).to.eventually.be.fulfilled;
        }
        this.skip();
    }));
    it("linkedResources", pnpTest("200bb895-b956-4120-b3c5-a111d074285f", async function () {
        const resources = await todoTask.resources();
        return expect(resources).to.be.an("array");
    }));

    it("linkedResources - getById()", pnpTest("88a91401-5851-4aea-a3d8-81adf37cabab", async function () {
        const resource = await todoTask.resources.add({
            displayName:getRandomString(10),
            applicationName: "PnPjs" +  getRandomString(5),
        });
        const item = await todoTask.resources.getById(resource.id)();
        return expect(item.id).is.not.null;
    }));

    it("linkedResources - add", pnpTest("e7656849-41f0-4d8c-87a2-69591585ad73", async function () {
        let passed = false;
        const task = await taskList.tasks.add({title: getRandomString(5)});
        const resource = await taskList.tasks.getById(task.id).resources.add({
            applicationName: "PnPjs" + getRandomString(10),
            displayName: getRandomString(5),
        });

        if(resource){
            passed = true;
            await taskList.tasks.getById(task.id).resources.getById(resource.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("linkedResources - update", pnpTest("106acffe-5b35-408b-8879-8d420bbf30c3", async function () {
        const title = "Test " + getRandomString(5);
        const task = await taskList.tasks.add({title: getRandomString(5)});
        const resource = await taskList.tasks.getById(task.id).resources.add({
            applicationName: "PnPjs" + getRandomString(10),
            displayName: getRandomString(5),
        });

        const updated = await taskList.tasks.getById(task.id).resources.getById(resource.id).update({
            displayName: title,
        });
        return expect(updated.id).is.not.null && expect(updated.displayName).equal(title);
    }));

    it("linkedResources - delete", pnpTest("f5be23bd-972b-4c87-86f7-98de738c1257", async function () {
        const task = await taskList.tasks.add({title: getRandomString(5)});
        const resource = await taskList.tasks.getById(task.id).resources.add({
            applicationName: "PnPjs" + getRandomString(10),
            displayName: getRandomString(5),
        });
        if(resource){
            return expect(taskList.tasks.getById(task.id).resources.getById(resource.id).delete()).to.eventually.be.fulfilled;
        }
        this.skip();
    }));

    // Remove the test data we created
    after(async function () {
        const list = await taskList();
        if (!stringIsNullOrEmpty(list.id)) {
            try {
                await taskList.delete();
            } catch (err) {
                console.error(`Cannot clean up test taskList: ${list.id}`);
            }
        }
        return;
    });

});
