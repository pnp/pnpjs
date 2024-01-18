import { getRandomString, stringIsNullOrEmpty } from "@pnp/core";
import { expect } from "chai";
import "@pnp/graph/planner";
import { IPlanAdd } from "@pnp/graph/planner";
import getValidUser from "./utilities/getValidUser.js";

// Tests can't be run until planner support application permissions, incomplete
describe.only("Planner", function () {
    const planTemplate: IPlanAdd = {
        container: {
            url: "",
        },
        title: "",
    };

    const PlanIds = [];

    before(async function () {

        if ((!this.pnp.settings.enableWebTests) || (!this.pnp.settings.testGroupId)) {
            this.skip();
        }
        planTemplate.container.url = `https://graph.microsoft.com/v1.0/groups/${this.pnp.settings.testGroupId}`;
    });

    describe("Plans", function () {

        it("List", async function () {
            const planName = `TestPlan_${getRandomString(4)}`;
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
        });

        it("Add", async function () {
            const planName = `TestPlan_${getRandomString(4)}`;
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            return expect(planAdd.title).is.equal(planName);
        });

        it("GetById", async function () {
            const planName = `TestPlan_${getRandomString(4)}`;
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            const plan = await this.pnp.graph.planner.plans.getById(planAdd.id)();
            return expect(plan.title).is.equal(planName);
        });

        it("Update", async function () {
            const planName = `TestPlan_${getRandomString(4)}`;
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            const newPlanName = `TestPlan_${getRandomString(4)}`;
            await this.pnp.graph.planner.plans.getById(planAdd.id).update({ title: newPlanName }, planAdd["@odata.etag"]);
            const planUpdate = await this.pnp.graph.planner.plans.getById(planAdd.id)();
            return expect(planUpdate.title).is.equal(newPlanName);
        });

        it("Delete", async function () {
            const planName = `TestPlan_${getRandomString(4)}`;
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
        });

        it("GetDetails", async function () {
            const planName = `TestPlan_${getRandomString(4)}`;
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            const planDetails = await this.pnp.graph.planner.plans.getById(planAdd.id).details();
            return expect(planDetails.id).length.greaterThan(0);
        });

        it("UpdateDetails", async function () {
            const planName = `TestPlan_${getRandomString(4)}`;
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            const category = `TestCategory_${getRandomString(4)}`;
            const planDetails = await this.pnp.graph.planner.plans.getById(planAdd.id).details();
            await this.pnp.graph.planner.plans.getById(planAdd.id).details.update({ categoryDescriptions: { category1: category } }, planDetails["@odata.etag"]);
            const planDetailsCheck = await this.pnp.graph.planner.plans.getById(planAdd.id).details();
            return expect(planDetailsCheck.categoryDescriptions.category1).is.equal(category);
        });
    });

    describe("Buckets", function () {
        let PlanID = null;
        const bucketTemplate = {
            planId: "",
            name: "",
        };

        before(async function () {
            const planName = `BucketTestPlan_${getRandomString(4)}`;
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            PlanID = planAdd.id;
            bucketTemplate.planId = PlanID;
        });

        it("List", async function () {
            const bucketName = `TestBucket_${getRandomString(4)}`;
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
        });

        it("Add", async function () {
            const bucketName = `TestBucket_${getRandomString(4)}`;
            const newBucket = JSON.parse(JSON.stringify(bucketTemplate));
            newBucket.name = bucketName;
            const planBucketResult = await this.pnp.graph.planner.buckets.add(newBucket);
            return expect(planBucketResult.id).is.not.undefined;
        });

        it("GetById", async function () {
            const bucketName = `TestBucket_${getRandomString(4)}`;
            const newBucket = JSON.parse(JSON.stringify(bucketTemplate));
            newBucket.name = bucketName;
            const planBucketResult = await this.pnp.graph.planner.buckets.add(newBucket);
            const bucket = await this.pnp.graph.planner.buckets.getById(planBucketResult.id)();
            return expect(bucket.name).is.equal(bucketName);
        });

        it("Update", async function () {
            const bucketName = `TestBucket_${getRandomString(4)}`;
            const newBucket = JSON.parse(JSON.stringify(bucketTemplate));
            newBucket.name = bucketName;
            const planBucketAdd = await this.pnp.graph.planner.buckets.add(newBucket);
            const newBucketName = `TestBucket_${getRandomString(4)}`;
            await this.pnp.graph.planner.buckets.getById(planBucketAdd.id).update({ name: newBucketName }, planBucketAdd["@odata.etag"]);
            const bucket = await this.pnp.graph.planner.buckets.getById(planBucketAdd.id)();
            return expect(bucket.name).is.equal(newBucketName);
        });

        it("Delete", async function () {
            const bucketName = `TestBucket_${getRandomString(4)}`;
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
        });
    });


    describe("Tasks", function () {

        let PlanID = null;
        let BucketID = null;

        const taskTemplate = {
            planId: "",
            bucketId: "",
            title: "",
        };

        before(async function () {
            const planName = `TaskTestPlan_${getRandomString(4)}`;
            const newPlan = JSON.parse(JSON.stringify(planTemplate));
            newPlan.title = planName;
            const planAdd = await this.pnp.graph.planner.plans.add(newPlan);
            PlanIds.push(planAdd.id);
            PlanID = planAdd.id;
            taskTemplate.planId = PlanID;
            const newBucket = { planId: PlanID, name: `TaskTestBucket_${getRandomString(4)}` };
            const planBucketResult = await this.pnp.graph.planner.buckets.add(newBucket);
            BucketID = planBucketResult.id;
            taskTemplate.bucketId = BucketID;
        });

        it("List", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
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
        });

        it("Add", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskResult = await this.pnp.graph.planner.tasks.add(newTask);
            return expect(planTaskResult.id).is.not.undefined;
        });

        it("GetById", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskResult = await this.pnp.graph.planner.tasks.add(newTask);
            const task = await this.pnp.graph.planner.tasks.getById(planTaskResult.id)();
            return expect(task.title).is.equal(taskName);
        });

        it("Update", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const newTaskName = `TestTask_${getRandomString(4)}`;
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).update({ title: newTaskName }, planTaskAdd["@odata.etag"]);
            const task = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id)();
            return expect(task.title).is.equal(newTaskName);
        });

        it("Delete", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
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
        });

        it("GetDetails", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const planTaskDetails = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).details();
            return expect(planTaskDetails.id).length.greaterThan(0);
        });

        it("UpdateDetails", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const planTaskDetails = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).details();
            const description = `TestDescription_${getRandomString(4)}`;
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).details.update({ description: description }, planTaskDetails["@odata.etag"]);
            const planTaskDetailsCheck = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).details();
            return expect(planTaskDetailsCheck.description).is.equal(description);
        });

        it("Plan: ListTasks", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
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
        });

        it("Bucket: ListTasks", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
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
        });

        it("AssignedTaskBoardFormat: Get", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const atbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).assignedToTaskBoardFormat();
            return expect(atbf.id).length.greaterThan(0);
        });

        it("AssignedTaskBoardFormat: Update", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const atbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).assignedToTaskBoardFormat();
            const newValue = " 123!";
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).assignedToTaskBoardFormat.update({ unassignedOrderHint: newValue }, atbf["@odata.etag"]);
            const atbfUpdate = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).assignedToTaskBoardFormat();
            return expect(atbfUpdate.unassignedOrderHint).is.not.empty;
        });

        it("BucketTaskBoardFormat: Get", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const btbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).bucketTaskBoardFormat();
            return expect(btbf.id).length.greaterThan(0);
        });

        it("BucketTaskBoardFormat: Update", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const btbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).bucketTaskBoardFormat();
            const newValue = " 123!";
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).bucketTaskBoardFormat.update({ orderHint: newValue }, btbf["@odata.etag"]);
            const btbfUpdate = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).bucketTaskBoardFormat();
            return expect(btbfUpdate.orderHint).is.not.empty;
        });

        it("ProgressTaskBoardTaskFormat: Get", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const ptbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).progressTaskBoardFormat();
            return expect(ptbf.id).length.greaterThan(0);
        });

        it("ProgressTaskBoardTaskFormat: Update", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
            const newTask = JSON.parse(JSON.stringify(taskTemplate));
            newTask.title = taskName;
            const planTaskAdd = await this.pnp.graph.planner.tasks.add(newTask);
            const ptbf = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).progressTaskBoardFormat();
            const newValue = " 123!";
            await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).progressTaskBoardFormat.update({ orderHint: newValue }, ptbf["@odata.etag"]);
            const ptbfUpdate = await this.pnp.graph.planner.tasks.getById(planTaskAdd.id).progressTaskBoardFormat();
            return expect(ptbfUpdate.orderHint).is.not.empty;
        });


    });

    describe("User Tasks", function () {
        let PlanID = null;
        let testUserName = null;
        const taskTemplate = {
            planId: "",
            title: "",
            assignments: {},
        };

        before(async function () {
            if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
                this.skip();
            }

            const planName = `TaskTestPlan_${getRandomString(4)}`;
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
        });

        it("List", async function () {
            const taskName = `TestTask_${getRandomString(4)}`;
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
        });
    });

    after(async function () {
        if (PlanIds.length > 0) {
            PlanIds.forEach(async (id) => {
                await this.pnp.graph.planner.plans.getById(id).delete();
            });
        }
    });
});
