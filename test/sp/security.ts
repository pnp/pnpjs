import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/security";
import "@pnp/sp/site-users/web";
import { IWeb } from "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";
import { PermissionKind } from "@pnp/sp/security";


describe("Security", function () {

    const testRoleDefName = "PNPJS Test Role Def 38274947";
    let list: IList = null;
    let parentWeb: IWeb = null;

    before(async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const ler = await this.pnp.sp.web.lists.ensure("SecurityTestingList");
        list = ler.list;

        // Capture the parent web for use in role definition tests.
        parentWeb = await this.pnp.sp.web.getParentWeb();

        // Create the test role definition.
        try {
            await parentWeb.roleDefinitions.getByName(testRoleDefName)();
        } catch (err) {
            try {
                await parentWeb.roleDefinitions.add(testRoleDefName, "", 1000, { Low: 1, High: 0 });
            } catch (err) {
                // Do nothing. Assume any error is because the role definition already exists.
            }
        }
    });

    after(async function () {
        if (this.pnp.settings.enableWebTests) {
            // reset the list incase we use it again it will be ready
            if (list != null) {
                return list.resetRoleInheritance();
            }
        }
        return;
    });

    it("roleAssignments", async function () {
        const ra = await list.roleAssignments();
        return expect(ra).to.not.be.null;
    });

    it("firstUniqueAncestorSecurableObject", async function () {

        const a = await list.firstUniqueAncestorSecurableObject();
        return expect(a).to.not.be.null;
    });

    it("getUserEffectivePermissions", async function () {

        const users = await this.pnp.sp.web.siteUsers.top(1).select("LoginName")();
        const bp = await list.getUserEffectivePermissions(users[0].LoginName);
        return expect(bp).to.not.be.null;
    });

    it("getCurrentUserEffectivePermissions", async function () {
        const ep = await list.getCurrentUserEffectivePermissions();
        return expect(ep).to.not.be.null;
    });

    it("userHasPermissions", async function () {
        const users = await this.pnp.sp.web.siteUsers.top(1).select("LoginName")();
        const hp = await list.userHasPermissions(users[0].LoginName, PermissionKind.AddListItems);
        return expect(hp).to.not.be.null;
    });

    it("currentUserHasPermissions", async function () {
        const hp = await list.currentUserHasPermissions(PermissionKind.AddListItems);
        return expect(hp).to.not.be.null;
    });

    it("breakRoleInheritance", async function () {
        const br = await list.breakRoleInheritance(true, true);
        return expect(br).to.not.be.null;
    });

    it("updateRoleDef", async function () {
        // We cannot alter Role Definitions on a subsite, we therefore test updating Role Definitions against the parent site.
        const rd = await parentWeb.roleDefinitions.getByName(testRoleDefName).update({ BasePermissions: { Low: 3, High: 0 } });
        return expect(rd).to.not.be.null;
    });
});
