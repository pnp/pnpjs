import { expect } from "chai";
import "@pnp/graph/sites/group";
import "@pnp/graph/users";
import "@pnp/graph/files";
import { Drive, Group } from "@microsoft/microsoft-graph-types";
import { hOP, stringIsNullOrEmpty } from "@pnp/core";
import getValidUser from "./utilities/getValidUser.js";
import { pnpTest } from "../pnp-test.js";

describe("Queryable", function () {
    let testUserName = "";

    before(pnpTest("74bb3ab1-7dc3-488d-8691-ce05a96277ff",async function () {

        if (!this.pnp.settings.enableWebTests || stringIsNullOrEmpty(this.pnp.settings.testUser)) {
            this.skip();
        }

        const userInfo = await getValidUser.call(this);
        testUserName = userInfo.userPrincipalName;
    }));

    it("$orderBy", pnpTest("17ba91dc-c70f-4154-9eb5-6440b0795125", async function () {
        const groups = await this.pnp.graph.groups.orderBy("displayName")();
        const groupsClone: Group[] = JSON.parse(JSON.stringify(groups));
        const groupsResort: Group[] = groupsClone.sort((a, b) => {
            if (a.displayName.toUpperCase() < b.displayName.toUpperCase()) {
                return -1;
            }
            if (a.displayName.toUpperCase() > b.displayName.toUpperCase()) {
                return 1;
            }
            return 0;
        });
        let sortTrue = true;
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].displayName !== groupsResort[i].displayName) {
                sortTrue = false;
                break;
            }
        }
        return expect(sortTrue).to.be.true;
    }));

    it("$orderBy-two", pnpTest("63085b50-a892-4bfb-b235-25d0cdbb6de1", async function () {
        const drives = await this.pnp.graph.users.getById(testUserName).drives.orderBy("lastModifiedBy/user/displayName")();
        const drivesClone: Drive[] = JSON.parse(JSON.stringify(drives));
        const drivesResort: Drive[] = drivesClone.sort((a, b) => {
            if (a.lastModifiedBy?.user?.displayName?.toUpperCase() < b.lastModifiedBy?.user?.displayName?.toUpperCase()) {
                return -1;
            }
            if (a.lastModifiedBy?.user?.displayName?.toUpperCase() > b.lastModifiedBy?.user?.displayName?.toUpperCase()) {
                return 1;
            }
            return 0;
        });
        let sortTrue = true;
        for (let i = 0; i < drives.length; i++) {
            if (drives[i].name !== drivesResort[i].name) {
                sortTrue = false;
                break;
            }
        }
        return expect(sortTrue).to.be.true;
    }));

    it("$select", pnpTest("3d52bdef-420f-4972-ad63-1e2616d4fac8", async function () {
        const groups = await this.pnp.graph.groups.select("displayName, description, mail")();
        let group: Group = { "displayName": "", "description": "", "mail": "" };
        if (groups.length > 0) {
            group = groups[0];
        }
        let hasProps = true;
        if (!hOP(group, "displayName")) {
            hasProps = false;
        }
        if (!hOP(group, "description")) {
            hasProps = false;
        }
        if (!hOP(group, "mail")) {
            hasProps = false;
        }
        return expect(hasProps).to.be.true;
    }));

    it("$expand", pnpTest("5b41d896-8bb8-458e-9108-37631412028a", async function () {
        const groups = await this.pnp.graph.groups.expand("members")();
        let hasMembers = true;
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].members == null) {
                hasMembers = false;
                break;
            }
        }
        return expect(hasMembers).to.be.true;
    }));

});
