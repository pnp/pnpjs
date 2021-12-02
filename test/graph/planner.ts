import { getRandomString } from "@pnp/core";
import { expect } from "chai";
import { getGraph, testSettings } from "../main.js";
import { GraphFI } from "@pnp/graph";
import { GroupType } from "@pnp/graph/groups";
import "@pnp/graph/planner";

// Tests can't be run until planner support application permissions, incomplete
describe.skip("Planner", function () {

    let _graphfi: GraphFI = null;
    let groupID = "";
    let planID = "";
    let taskID = "";

    before(function () {

        if (!testSettings.enableWebTests) {
            this.skip();
            return;
        }

        _graphfi = getGraph();
    });

    beforeEach(async function () {
        // Clear out variables
        groupID = "";
        planID = "";
        taskID = "";
    });

    it("addPlan", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const plan = await _graphfi.planner.plans.add(groupID, planName);
        planID = plan.data.id;
        return expect(plan.data.title).is.equal(planName);
    });

    it("getPlan", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await _graphfi.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const plan = await _graphfi.planner.plans.getById(planID)();
        return expect(plan.title).is.equal(planName);
    });

    it("updatePlan", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await _graphfi.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const newPlanName = `TestPlan_${getRandomString(4)}`;
        await _graphfi.planner.plans.getById(planID).update({ title: newPlanName }, planAddResult.data["@odata.etag"]);
        const planUpdate = await _graphfi.planner.plans.getById(planID)();
        return expect(planUpdate.title).is.equal(newPlanName);
    });

    it("deletePlan", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await _graphfi.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        await _graphfi.planner.plans.getById(planID).delete();
        const plan = await _graphfi.planner.plans.getById(planID)();
        planID = "";
        return expect(plan).is.undefined;
    });

    it("getPlanDetails", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await _graphfi.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const planDetails = await _graphfi.planner.plans.getById(planID).details();
        return expect(planDetails.id).is.equal(planID);
    });

    it("addPlanTasks", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await _graphfi.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const taskName = `TestTask_${getRandomString(4)}`;
        const planTaskResult = await _graphfi.planner.plans.getById(planID).tasks.add(planID, taskName);
        taskID = planTaskResult.data.id;
        return expect(planTaskResult.data.id).is.not.undefined;
    });

    it("getPlanTasks", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await _graphfi.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const taskName = `TestTask_${getRandomString(4)}`;
        const planTaskResult = await _graphfi.planner.plans.getById(planID).tasks.add(planID, taskName);
        taskID = planTaskResult.data.id;
        const tasks = await _graphfi.planner.plans.getById(planID).tasks();
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
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await _graphfi.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const taskName = `TestTask_${getRandomString(4)}`;
        const planTaskResult = await _graphfi.planner.plans.getById(planID).tasks.add(planID, taskName);
        taskID = planTaskResult.data.id;
        const task = await _graphfi.planner.tasks.getById(taskID)();
        return expect(task.id).is.equal(taskID);
    });

    it("updateTask", async function () {
        const groupName = `TestGroup_${getRandomString(4)}`;
        const groupAddResult = await _graphfi.groups.add(groupName, groupName, GroupType.Office365);
        groupID = groupAddResult.data.id;
        const planName = `TestPlan_${getRandomString(4)}`;
        const planAddResult = await _graphfi.planner.plans.add(groupID, planName);
        planID = planAddResult.data.id;
        const taskName = `TestTask_${getRandomString(4)}`;
        const planTaskResult = await _graphfi.planner.plans.getById(planID).tasks.add(planID, taskName);
        taskID = planTaskResult.data.id;
        const task = await _graphfi.planner.tasks.getById(taskID)();
        return expect(task.id).is.equal(taskID);
    });

    afterEach(async function () {
        if (taskID !== "") {
            await _graphfi.planner.plans.getById(planID).tasks.getById(taskID).delete();
        }
        if (planID !== "") {
            await _graphfi.planner.plans.getById(planID).delete();
        }
        if (groupID !== "") {
            await _graphfi.groups.getById(groupID).delete();
        }
    });
});
