import { expect } from "chai";
import "@pnp/graph/sites/group";
import { Group } from "@microsoft/microsoft-graph-types";
import { hOP } from "@pnp/core";

describe.only("Queryable", function () {

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }
    });

    it("$orderBy", async function () {
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
    });

    it("$select", async function () {
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
    });

    it("$expand", async function () {
        const groups = await this.pnp.graph.groups.expand("members")();
        let hasMembers = true;
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].members == null) {
                hasMembers = false;
                break;
            }
        }
        return expect(hasMembers).to.be.true;
    });

});
