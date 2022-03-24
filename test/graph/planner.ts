import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import { GroupType } from "@pnp/graph/groups";
import "@pnp/graph/planner";

// Tests can't be run until planner support application permissions, incomplete
describe.skip("Planner", function () {

    let groupID = "";
    let planID = "";
    let taskID = "";

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    beforeEach(async function () {
        // Clear out variables
        groupID = "";
        planID = "";
        taskID = "";
    });

    it("addPlan", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const plan = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = plan.data.id;
        return expect(plan.data.title).is.equal(planName);
    });

    it("getPlan", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const plan = await this.pnp.graph.planner.plans.getById(planID)();
        return expect(plan.title).is.equal(planName);
    });

    it("updatePlan", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const newPlanName = `TestPlan_${getRandomString(4)}`;
        await this.pnp.graph.planner.plans.getById(planID).update({ title: newPlanName }, planAddResult.data["@odata.etag"]);
        const planUpdate = await this.pnp.graph.planner.plans.getById(planID)();
        return expect(planUpdate.title).is.equal(newPlanName);
    });

    it("deletePlan", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        await this.pnp.graph.planner.plans.getById(planID).delete();
        const plan = await this.pnp.graph.planner.plans.getById(planID)();
        planID = "";
        return expect(plan).is.undefined;
    });

    it("getPlanDetails", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const planDetails = await this.pnp.graph.planner.plans.getById(planID).details();
        return expect(planDetails.id).is.equal(planID);
    });

    it("addPlanTasks", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const taskName = `TestTask_${getRandomString(4)}`;
        const planTaskResult = await this.pnp.graph.planner.plans.getById(planID).tasks.add(planID, taskName);
        taskID = planTaskResult.data.id;
        return expect(planTaskResult.data.id).is.not.undefined;
    });

    it("getPlanTasks", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const taskName = `TestTask_${getRandomString(4)}`;
        const planTaskResult = await this.pnp.graph.planner.plans.getById(planID).tasks.add(planID, taskName);
        taskID = planTaskResult.data.id;
        const tasks = await this.pnp.graph.planner.plans.getById(planID).tasks();
        let taskExists = false;
        tasks.forEach(element => {
            if (element.id === taskID) {
                taskExists = true;
                return taskExists === true;
            }
        });
        return expect(taskExists).is.not.true;
    });

    it("getTasksById", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const taskName = `TestTask_${getRandomString(4)}`;
        const planTaskResult = await this.pnp.graph.planner.plans.getById(planID).tasks.add(planID, taskName);
        taskID = planTaskResult.data.id;
        const task = await this.pnp.graph.planner.tasks.getById(taskID)();
        return expect(task.id).is.equal(taskID);
    });

    it("updateTask", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await this.pnp.graph.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await this.pnp.graph.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const taskName = `TestTask_${getRandomString(4)}`;
        const planTaskResult = await this.pnp.graph.planner.plans.getById(planID).tasks.add(planID, taskName);
        taskID = planTaskResult.data.id;
        const task = await this.pnp.graph.planner.tasks.getById(taskID)();
        return expect(task.id).is.equal(taskID);
    });

    afterEach(async function () {
        const promises = [Promise.resolve()];
        if (taskID !== "") {
            promises.push(this.pnp.graph.planner.plans.getById(planID).tasks.getById(taskID).delete());
        }
        if (planID !== "") {
            promises.push(this.pnp.graph.planner.plans.getById(planID).delete());
        }
        if (groupID !== "") {
            promises.push(this.pnp.graph.groups.getById(groupID).delete());
        }
        return Promise.all(promises);
    });
});
