import { expect } from "chai";
import { testSettings } from "../main";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/lists";
import "@pnp/sp/src/security";
import "@pnp/sp/src/site-users/web";
import { IList } from "@pnp/sp/src/lists";
import { PermissionKind } from "@pnp/sp/src/security";

if (testSettings.enableWebTests) {

    describe("Security", function () {

        let list: IList = null;

        before(async function () {

            const ler = await sp.web.lists.ensure("SecurityTestingList");
            list = ler.list;
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

            const users = await sp.web.siteUsers.top(1).select("LoginName")();
            return expect(list.getUserEffectivePermissions(users[0].LoginName)).to.eventually.be.fulfilled;
        });

        it("getCurrentUserEffectivePermissions", async function () {

            return expect(list.getCurrentUserEffectivePermissions()).to.eventually.be.fulfilled;
        });

        it("userHasPermissions", async function () {

            const users = await sp.web.siteUsers.top(1).select("LoginName")();
            return expect(list.userHasPermissions(users[0].LoginName, PermissionKind.AddListItems)).to.eventually.be.fulfilled;
        });

        it("currentUserHasPermissions", async function () {

            return expect(list.currentUserHasPermissions(PermissionKind.AddListItems)).to.eventually.be.fulfilled;
        });

        it("breakRoleInheritance", async function () {

            return expect(list.breakRoleInheritance(true, true)).to.eventually.be.fulfilled;
        });
    });
}
