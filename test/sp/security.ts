import { expect } from "chai";
import { getSP, testSettings } from "../main.js";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/security";
import "@pnp/sp/site-users/web";
import { IWeb } from "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";
import { PermissionKind } from "@pnp/sp/security";
import { SPFI } from "@pnp/sp";

if (testSettings.enableWebTests) {

    describe("Security", function () {

        const testRoleDefName = "PNPJS Test Role Def 38274947";
        let list: IList = null;
        let parentWeb: IWeb = null;
        let _spfi: SPFI = null;

        before(async function () {
            _spfi = getSP();
            const ler = await _spfi.web.lists.ensure("SecurityTestingList");
            list = ler.list;
        });

        before(async function () {
            // Capture the parent web for use in role definition tests.
            parentWeb = await _spfi.web.getParentWeb();

            // Create the test role definition.
            try {
                await parentWeb.roleDefinitions.add(testRoleDefName, "", 1000, { Low: 1, High: 0 });
            } catch (err) {
                // Do nothing. Assume any error is because the role definition already exists.
            }
        });

        after(async function () {

            // reset the list incase we use it again it will be ready
            await list.resetRoleInheritance();
        });

        it("roleAssignments", function () {

            return expect(list.roleAssignments()).to.eventually.be.fulfilled;
        });

        it("firstUniqueAncestorSecurableObject", function () {

            return expect(list.firstUniqueAncestorSecurableObject()).to.eventually.be.fulfilled;
        });

        it("getUserEffectivePermissions", async function () {

            const users = await _spfi.web.siteUsers.top(1).select("LoginName")();
            return expect(list.getUserEffectivePermissions(users[0].LoginName)).to.eventually.be.fulfilled;
        });

        it("getCurrentUserEffectivePermissions", async function () {

            return expect(list.getCurrentUserEffectivePermissions()).to.eventually.be.fulfilled;
        });

        it("userHasPermissions", async function () {

            const users = await _spfi.web.siteUsers.top(1).select("LoginName")();
            return expect(list.userHasPermissions(users[0].LoginName, PermissionKind.AddListItems)).to.eventually.be.fulfilled;
        });

        it("currentUserHasPermissions", async function () {

            return expect(list.currentUserHasPermissions(PermissionKind.AddListItems)).to.eventually.be.fulfilled;
        });

        it("breakRoleInheritance", async function () {

            return expect(list.breakRoleInheritance(true, true)).to.eventually.be.fulfilled;
        });

        it("updateRoleDef", async function () {
            // We cannot alter Role Definitions on a subsite, we therefore test updating Role Definitions agains the parent site.
            return expect(parentWeb.roleDefinitions.getByName(testRoleDefName).update({ BasePermissions: { Low: 3, High: 0 } })).to.eventually.be.fulfilled;
        });
    });
}
