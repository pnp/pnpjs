import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/planner";
import { IPlanAdd } from "@pnp/graph/planner";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

// Tests can't be run until planner support application permissions, incomplete
describe("Planner", function () {
    const planTemplate: IPlanAdd = {
        container: {
            url: "",
        },
        title: "",
    };

    const PlanIds = [];

    before(pnpTest("d9dd0d07-580e-48f8-8b26-7c7206667d69", async function () {

        if ((!this.pnp.settings.enableWebTests) || (!this.pnp.settings.testGroupId)) {
            this.skip();
        }
        planTemplate.container.url = `https://graph.microsoft.com/v1.0/groups/${this.pnp.settings.testGroupId}`;
    }));

    describe("Plans", function () {

        it("List", pnpTest("ae54e3b2-0032-4918-9017-fa77597d786f", async function () {
            const { planName } = await this.props({
                planName: `TestPlan_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            const plans = await this.pnp.graph.groups.getById(this.pnp.settings.testGroupId).plans();
            let planExists = false;
            plans.forEach(element => {
                if (element.id === planAdd.id) {
                    planExists = true;
                    return planExists === true;
                }
            });
            return expect(planExists).is.true;
        }));

        it("Add", pnpTest("6f23d1da-10dc-4f81-b8c2-9936d8a407de", async function () {
            const { planName } = await this.props({
                planName: `TestPlan_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            return expect(planAdd.title).is.equal(planName);
        }));

        it("GetById", pnpTest("a5ebc34d-a88a-44ac-8704-40e1d5d0ac02", async function () {
            const { planName } = await this.props({
                planName: `TestPlan_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            const plan = await this.pnp.graph.planner.plans.getById(planAdd.id)();
            return expect(plan.title).is.equal(planName);
        }));

        it("Update", pnpTest("73e486c6-9e03-4dac-a4fb-2c89feaaa88f", async function () {
            const { planName, newPlanName } = await this.props({
                planName: `TestPlan_${getRandomString(4)}`,
                newPlanName: `TestPlan_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            await this.pnp.graph.planner.plans.getById(planAdd.id).update({ title: newPlanName }, planAdd["@odata.etag"]);
            const planUpdate = await this.pnp.graph.planner.plans.getById(planAdd.id)();
            return expect(planUpdate.title).is.equal(newPlanName);
        }));

        // This logs to the console when it passes, ignore those messages
        it("Delete", pnpTest("8e488310-8243-43ae-9027-1d33bdd9c81d", async function () {
            const { planName } = await this.props({
                planName: `TestPlan_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            await this.pnp.graph.planner.plans.getById(planAdd.id).delete(planAdd["@odata.etag"]);
            let plan = "FAILED";
            try {
                await this.pnp.graph.planner.plans.getById(planAdd.id)();
            } catch (e) {
                plan = null;
            }
            return expect(plan).is.null;
        }));

        it("GetDetails", pnpTest("8149476d-6b6f-439d-a41d-4e58011b2883", async function () {
            const { planName } = await this.props({
                planName: `TestPlan_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            const planDetails = await this.pnp.graph.planner.plans.getById(planAdd.id).details();
            return expect(planDetails.id).length.greaterThan(0);
        }));

        it("UpdateDetails", pnpTest("9f35d6bb-d006-40e3-9a35-737bf50e1d9d", async function () {
            const { planName, categoryName } = await this.props({
                planName: `TestPlan_${getRandomString(4)}`,
                categoryName: `TestCategory_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            const planDetails = await this.pnp.graph.planner.plans.getById(planAdd.id).details();
            await this.pnp.graph.planner.plans.getById(planAdd.id).details.update({ categoryDescriptions: { category1: categoryName } }, planDetails["@odata.etag"]);
            const planDetailsCheck = await this.pnp.graph.planner.plans.getById(planAdd.id).details();
            return expect(planDetailsCheck.categoryDescriptions.category1).is.equal(categoryName);
        }));
    });

    describe("Buckets", function () {
        let PlanID = null;
        const bucketTemplate = {
            planId: "",
            name: "",
        };

        before(pnpTest("07917508-fcc3-49a6-a5eb-da5ff2e7fbd8",async function () {
            const { planName } = await this.props({
                planName: `BucketTestPlan_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            PlanID = planAdd.id;
            bucketTemplate.planId = PlanID;
        }));

        it("List", pnpTest("df82cf59-6b63-44c7-b096-b499b2164d80", async function () {
            const { bucketName } = await this.props({
                bucketName: `TestBucket_${getRandomString(4)}`,
            });
            const newBucket = JSON.parse(JSON.stringify(bucketTemplate));
            newBucket.name = bucketName;
            const planTaskResult = await this.pnp.graph.planner.buckets.add(newBucket);
            const buckets = await this.pnp.graph.groups.getById(this.pnp.settings.testGroupId).plans.getById(PlanID).buckets();
            let bucketExists = false;
            buckets.forEach(element => {
                if (element.id === planTaskResult.id) {
                    bucketExists = true;
                    return bucketExists === true;
                }
            });
            return expect(bucketExists).is.true;
        }));

        it("Add", pnpTest("27b20447-cea8-403d-b5e5-39280134e7c9", async function () {
            const { bucketName } = await this.props({
                bucketName: `TestBucket_${getRandomString(4)}`,
            });
            const newBucket = JSON.parse(JSON.stringify(bucketTemplate));
            newBucket.name = bucketName;
            const planBucketResult = await this.pnp.graph.planner.buckets.add(newBucket);
            return expect(planBucketResult.id).is.not.undefined;
        }));

        it("GetById", pnpTest("3c332a8c-977c-4a78-bed3-f6fe6780feb3", async function () {
            const { bucketName } = await this.props({
                bucketName: `TestBucket_${getRandomString(4)}`,
            });
            const newBucket = JSON.parse(JSON.stringify(bucketTemplate));
            newBucket.name = bucketName;
            const planBucketResult = await this.pnp.graph.planner.buckets.add(newBucket);
            const bucket = await this.pnp.graph.planner.buckets.getById(planBucketResult.id)();
            return expect(bucket.name).is.equal(bucketName);
        }));

        it("Update", pnpTest("6440de98-2ef6-45d1-979b-84ea2858e0a1", async function () {
            const { bucketName, newBucketName } = await this.props({
                bucketName: `TestBucket_${getRandomString(4)}`,
                newBucketName: `TestBucket_${getRandomString(4)}`,
            });
            const newBucket = JSON.parse(JSON.stringify(bucketTemplate));
            newBucket.name = bucketName;
            const planBucketAdd = await this.pnp.graph.planner.buckets.add(newBucket);
            await this.pnp.graph.planner.buckets.getById(planBucketAdd.id).update({ name: newBucketName }, planBucketAdd["@odata.etag"]);
            const bucket = await this.pnp.graph.planner.buckets.getById(planBucketAdd.id)();
            return expect(bucket.name).is.equal(newBucketName);
        }));

        // This logs to the console when it passes, ignore those messages
        it("Delete", pnpTest("7f2e66ce-97e7-43a7-b099-cf2b66d0cce3", async function () {
            const { bucketName } = await this.props({
                bucketName: `TestBucket_${getRandomString(4)}`,
            });
            const newBucket = JSON.parse(JSON.stringify(bucketTemplate));
            newBucket.name = bucketName;
            const planBucketAdd = await this.pnp.graph.planner.buckets.add(newBucket);
            await this.pnp.graph.planner.buckets.getById(planBucketAdd.id).delete(planBucketAdd["@odata.etag"]);
            let bucket = "FAILED";
            try {
                bucket = await this.pnp.graph.planner.plans.getById(PlanID).buckets.getById(planBucketAdd.id)();
            } catch (e) {
                bucket = null;
            }
            return expect(bucket).is.null;
        }));
    });


    describe("Tasks", function () {

        let PlanID = null;
        let BucketID = null;

        const taskTemplate = {
            planId: "",
            bucketId: "",
            title: "",
        };

        before(pnpTest("f28a1d53-42bc-4f8d-b059-bbd3f4afef2b",async function () {
            const { planName, bucketName } = await this.props({
                planName: `TaskTestPlan_${getRandomString(4)}`,
                bucketName: `TaskTestBucket_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            PlanID = planAdd.id;
            taskTemplate.planId = PlanID;
            const newBucket = { planId: PlanID, name: bucketName };
            const planBucketResult = await this.pnp.graph.planner.buckets.add(newBucket);
            BucketID = planBucketResult.id;
            taskTemplate.bucketId = BucketID;
        }));

        it("List", pnpTest("9c5dfa30-07cf-43c7-b315-14f47d6456b1", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskResult = await this.pnp.graph.planner.tasks.add(newTask);
            const tasks = await this.pnp.graph.planner.plans.getById(PlanID).tasks();
            let taskExists = false;
            tasks.forEach(element => {
                if (element.id === planTaskResult.id) {
                    taskExists = true;
                    return taskExists === true;
                }
            });
            return expect(taskExists).is.true;
        }));

        it("Add", pnpTest("551e7368-8391-4146-8f98-2fcf92ae0b0e", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskResult = await this.pnp.graph.planner.tasks.add(newTask);
            return expect(planTaskResult.id).is.not.undefined;
        }));

        it("GetById", pnpTest("501ffcf9-b758-4ada-b07b-5ec9b8145d1d", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskResult = await this.pnp.graph.planner.tasks.add(newTask);
            const task = await this.pnp.graph.planner.tasks.getById(planTaskResult.id)();
            return expect(task.title).is.equal(taskName);
        }));

        it("Update", pnpTest("a32fca02-5748-4fdb-8af5-3a39f45ac545", async function () {
            const { taskName, newTaskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
                newTaskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).update({ title: newTaskName }, planTaskAdd["@odata.etag"]);
            const task = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id)();
            return expect(task.title).is.equal(newTaskName);
        }));

        // This logs to the console when it passes, ignore those messages
        it("Delete", pnpTest("55c576fc-e3db-4ac6-b4be-affe243c0261", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).delete(planTaskAdd["@odata.etag"]);
            let task = "FAILED";
            try {
                task = await this.pnp.graph.planner.plans.getById(PlanID).tasks.getById(planTaskAdd.id)();
            } catch (e) {
                task = null;
            }
            return expect(task).is.null;
        }));

        it("GetDetails", pnpTest("dc19913b-ec7b-4a57-9060-81e4f929da27", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const planTaskDetails = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).details();
            return expect(planTaskDetails.id).length.greaterThan(0);
        }));

        it("UpdateDetails", pnpTest("f057c952-dcf1-40d2-8515-7bcd4ddb6396", async function () {
            const { taskName, description } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
                description: `TestDescription_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const planTaskDetails = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).details();
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).details.update({ description: description }, planTaskDetails["@odata.etag"]);
            const planTaskDetailsCheck = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).details();
            return expect(planTaskDetailsCheck.description).is.equal(description);
        }));

        it("Plan: ListTasks", pnpTest("49c63e35-83e8-462a-9cc2-1602e44e33aa", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskResult = await this.pnp.graph.planner.tasks.add(newTask);
            const planTasks = await this.pnp.graph.planner.plans.getById(PlanID).tasks();
            let planExists = false;
            planTasks.forEach(element => {
                if (element.id === planTaskResult.id) {
                    planExists = true;
                    return planExists === true;
                }
            });
            return expect(planExists).is.true;
        }));

        it("Bucket: ListTasks", pnpTest("1b6edd24-c0df-4d67-8747-fc870136263c", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskResult = await this.pnp.graph.planner.tasks.add(newTask);
            const bucketTasks = await this.pnp.graph.planner.buckets.getById(BucketID).tasks();
            let bucketExists = false;
            bucketTasks.forEach(element => {
                if (element.id === planTaskResult.id) {
                    bucketExists = true;
                    return bucketExists === true;
                }
            });
            return expect(bucketExists).is.true;
        }));

        it("AssignedTaskBoardFormat: Get", pnpTest("85cc0286-dbc6-4302-9feb-406206a7d2b6", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const atbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).assignedToTaskBoardFormat();
            return expect(atbf.id).length.greaterThan(0);
        }));

        it("AssignedTaskBoardFormat: Update", pnpTest("a8d7c7e2-6d51-415b-918c-824cdc595218", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const atbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).assignedToTaskBoardFormat();
            const newValue = " 123!";
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).assignedToTaskBoardFormat.update({ unassignedOrderHint: newValue }, atbf["@odata.etag"]);
            const atbfUpdate = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).assignedToTaskBoardFormat();
            return expect(atbfUpdate.unassignedOrderHint).is.not.empty;
        }));

        it("BucketTaskBoardFormat: Get", pnpTest("fba56528-086e-43d9-940e-d980724c415c", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const btbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).bucketTaskBoardFormat();
            return expect(btbf.id).length.greaterThan(0);
        }));

        it("BucketTaskBoardFormat: Update", pnpTest("26ecdfbc-6c2d-4d34-b502-b0fdf715ed24", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const btbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).bucketTaskBoardFormat();
            const newValue = " 123!";
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).bucketTaskBoardFormat.update({ orderHint: newValue }, btbf["@odata.etag"]);
            const btbfUpdate = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).bucketTaskBoardFormat();
            return expect(btbfUpdate.orderHint).is.not.empty;
        }));

        it("ProgressTaskBoardTaskFormat: Get", pnpTest("a2a58a2b-19bb-4a7e-8c25-dc47a836f5d2", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const ptbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).progressTaskBoardFormat();
            return expect(ptbf.id).length.greaterThan(0);
        }));

        it("ProgressTaskBoardTaskFormat: Update", pnpTest("e83d65a3-6ff7-46b4-8370-9de11cb1fdb5", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const ptbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).progressTaskBoardFormat();
            const newValue = " 123!";
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).progressTaskBoardFormat.update({ orderHint: newValue }, ptbf["@odata.etag"]);
            const ptbfUpdate = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).progressTaskBoardFormat();
            return expect(ptbfUpdate.orderHint).is.not.empty;
        }));


    });

    describe("User Tasks", function () {
        let PlanID = null;
        let testUserName = null;
        const taskTemplate = {
            planId: "",
            title: "",
            assignments: {},
        };

        before(pnpTest("ce014912-3d08-42c1-8dd1-b257ab4bdce5", async function () {
            if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
                this.skip();
            }
            const { planName } = await this.props({
                planName: `TaskTestPlan_${getRandomString(4)}`,
            });
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            PlanID = planAdd.id;
            const userInfo = await getValidUser.call(this);
            testUserName = userInfo.userPrincipalName;
            const user = await this.pnp.graph.users.getById(testUserName)();
            taskTemplate.planId = PlanID;
            taskTemplate.assignments[user.id] = {
                "@odata.type": "#microsoft.graph.plannerAssignment",
                orderHint: " !",
            };
        }));

        it("List", pnpTest("9d42bbe1-28c8-4247-a364-3c9af8f59334", async function () {
            const { taskName } = await this.props({
                taskName: `TestTask_${getRandomString(4)}`,
            });
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskResult = await this.pnp.graph.planner.tasks.add(newTask);
            const userTasks = await this.pnp.graph.users.getById(testUserName).tasks();
            let taskExists = false;
            userTasks.forEach(element => {
                if (element.id === planTaskResult.id) {
                    taskExists = true;
                    return taskExists === true;
                }
            });
            return expect(taskExists).is.true;
        }));
    });

    // This logs to the console when it passes, ignore those messages
    after(pnpTest("52a7b086-78f5-4874-af3d-71e808108a5d",async function () {
        if (PlanIds.length > 0) {
            PlanIds.forEach(async (id) => {
                try{
                    const plan = await this.pnp.graph.planner.plans.getById(id)();
                    if(plan != null){
                        await this.pnp.graph.planner.plans.getById(id).delete();
                    }
                }catch(err){
                    // ignore
                }
            });
        }
    }));
});
