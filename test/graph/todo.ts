import { expect } from "chai";
import "@pnp/graph/users";
import "@pnp/graph/todo";
import { pnpTest } from "../pnp-test.js";
import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { TodoTask, TodoTaskList } from "@microsoft/microsoft-graph-types";

describe("Todo", function () {
    let taskList: TodoTaskList;
    let todoTask: TodoTask;
    before(async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        taskList = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.add({
            displayName: "Travel items" + getRandomString(5)
        });

        todoTask = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList?.id).tasks.add(
            {
                title:"A new task",
                categories: ["Important"],
                linkedResources:[
                   {
                      "webUrl":"https://pnp.github.io/pnpjs/",
                      "applicationName":"PnPjs",
                      "displayName":"PnPjs"
                   },
            ]},
        );
        if(!taskList || !todoTask){
            this.skip();
        }
        
    });

    it("lists", pnpTest("8de75582-6257-4e2a-b753-7c8be1cf0a38", async function () {
        const lists = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists();
        return expect(lists).to.be.an("array") && expect(lists[0]).to.haveOwnProperty("id");
    }));

    it("lists - getById()", pnpTest("50650ae3-8192-4767-b4b3-9af7a586c11b", async function () {
        const list = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id)();
        return expect(list.id).is.not.null;
    }));

    it("lists - add", pnpTest("2548a740-4267-4868-8663-e5bf5ae44ae2", async function () {
        let passed = false;
        const list = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.add({
            displayName: "Test" + getRandomString(5)
        });

        if(list){
            passed = true;
            await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(list.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("lists - update", pnpTest("9017c7b8-fb00-4a00-9ef0-51af695679a6", async function () {
        const displayName = "Test " + getRandomString(5);
        const updated = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).update({
            displayName: displayName
        });
        return expect(updated.id).is.not.null && expect(updated.displayName).equal(displayName);
    }));

    it("lists - delete", pnpTest("ef561648-4380-4629-89bb-9834934e78d1", async function () {
        const list = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.add({
            displayName: "Test" + getRandomString(5)
        });
        if(list){
            const deleted = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(list.id).delete();
            return expect(deleted).to.be(void 0);
        }
        this.skip();
    }));

    it("lists - delta", pnpTest("70cb936e-9ee5-4630-a3c7-6fdf60bbd6fe", async function () {
        const delta = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).delta();
        return expect(delta).is.an("array");
    }));

    it("tasks", pnpTest("87475a79-f33a-44ff-a998-a5024ad77e13", async function () {
        const tasks = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).tasks();
        return expect(tasks).to.be.an("array") && expect(tasks[0]).to.haveOwnProperty("id");
    }));

    it("tasks - getById()", pnpTest("59d5dd98-1730-40fb-898e-4cd56e5b8260", async function () {
        const task = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).tasks.getById(todoTask.id)();
        return expect(task.id).is.not.null;
    }));

    it("tasks - add", pnpTest("71958133-bd13-4bde-83c3-b8ea8871a466", async function () {
        let passed = false;
        const task = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).tasks.add({
            title: "Test" + getRandomString(5)
        });

        if(task){
            passed = true;
            await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).tasks.getById(task.id).delete();
        }
        return expect(passed).is.true;
    }));

    it("tasks - update", pnpTest("c2071fbb-55d0-4837-a0d8-9a8bc6640f60", async function () {
        const title = "Test " + getRandomString(5);
        const updated = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).tasks.getById(todoTask.id).update({
            title: title
        });
        return expect(updated.id).is.not.null && expect(updated.title).equal(title);
    }));

    it("tasks - delete", pnpTest("104adde8-6514-4b84-b711-ae360e971519", async function () {
        const task = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).tasks.add({
            title: "Test" + getRandomString(5)
        });
        if(task){
            const deleted = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).tasks.getById(task.id).delete();
            return expect(deleted).to.be(void 0);
        }
        this.skip();
    }));

    it("tasks - delta", pnpTest("8167699b-acd8-4e03-b14c-e5a347b0a131", async function () {
        const delta = await this.pnp.graph.users.getById(this.pnp.settings.testUser).todo.lists.getById(taskList.id).tasks.delta();
        return expect(delta).is.an("array");
    }));

});
