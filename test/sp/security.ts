import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/security";
import "@pnp/sp/site-users/web";
import { IWeb } from "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";
import { PermissionKind } from "@pnp/sp/security";
import { pnpTest } from  "../pnp-test.js";


describe("Security", function () {

    const testRoleDefName = "PNPJS Test Role Def 38274947";
    let list: IList = null;
    let parentWeb: IWeb = null;

    before(pnpTest("563515d3-877f-4693-954b-914d4545c17b", async function () {

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
    }));

    after(pnpTest("0a7edaa5-2c13-41ba-bec4-4c88446ff18d", async function () {
        if (this.pnp.settings.enableWebTests) {
            // reset the list incase we use it again it will be ready
            if (list != null) {
                return list.resetRoleInheritance();
            }
        }
        return;
    }));

    it("roleAssignments", pnpTest("9c77efe9-f9af-4f60-ac51-c634cb191312", async function () {
        const ra = await list.roleAssignments();
        return expect(ra).to.not.be.null;
    }));

    it("firstUniqueAncestorSecurableObject", pnpTest("80da9430-db0e-449d-876a-a01dfcdf9417", async function () {

        const a = await list.firstUniqueAncestorSecurableObject();
        return expect(a).to.not.be.null;
    }));

    it("getUserEffectivePermissions", pnpTest("0b4d2abb-1728-4a48-bf15-f4c5d054571e", async function () {

        const users = await this.pnp.sp.web.siteUsers.top(1).select("LoginName")();
        const bp = await list.getUserEffectivePermissions(users[0].LoginName);
        return expect(bp).to.not.be.null;
    }));

    it("getCurrentUserEffectivePermissions", pnpTest("5d419ff0-d785-4e9a-849a-7a08ac0e9601", async function () {
        const ep = await list.getCurrentUserEffectivePermissions();
        return expect(ep).to.not.be.null;
    }));

    it("userHasPermissions", pnpTest("08fb7585-fc22-41f8-88df-87a78023e4ad", async function () {
        const users = await this.pnp.sp.web.siteUsers.top(1).select("LoginName")();
        const hp = await list.userHasPermissions(users[0].LoginName, PermissionKind.AddListItems);
        return expect(hp).to.not.be.null;
    }));

    it("currentUserHasPermissions", pnpTest("19ac0621-01be-4341-86ec-7bc9a9aa0d73", async function () {
        const hp = await list.currentUserHasPermissions(PermissionKind.AddListItems);
        return expect(hp).to.not.be.null;
    }));

    it("breakRoleInheritance", pnpTest("0d5d355b-eecd-449d-bcd2-6e9bf5d6806a", async function () {
        const br = await list.breakRoleInheritance(true, true);
        return expect(br).to.not.be.null;
    }));

    it("updateRoleDef", pnpTest("90a67b60-0581-4d55-9f47-d7dd6ef6769f", async function () {
        // We cannot alter Role Definitions on a subsite, we therefore test updating Role Definitions against the parent site.
        const rd = await parentWeb.roleDefinitions.getByName(testRoleDefName).update({ BasePermissions: { Low: 3, High: 0 } });
        return expect(rd).to.not.be.null;
    }));
});
