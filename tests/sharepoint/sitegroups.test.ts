import { expect } from "chai";
import { SiteGroup, SiteGroups } from "../../src/sharepoint/sitegroups";
import { toMatchEndRegex } from "../testutils";

describe("SiteGroups", () => {

    let siteGroups: SiteGroups;

    beforeEach(() => {
        siteGroups = new SiteGroups("_api/web");
    });

    it("Should be an object", () => {
        expect(siteGroups).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/sitegroups", () => {
            expect(siteGroups.toUrl()).to.match(toMatchEndRegex("_api/web/sitegroups"));
        });
    });

    describe("getById", () => {
        it("should return _api/web/sitegroups(12)", () => {
            expect(siteGroups.getById(12).toUrl()).to.match(toMatchEndRegex("_api/web/sitegroups(12)"));
        });
    });

    describe("getByName", () => {
        it("should return _api/web/sitegroups/getByName('Group Name')", () => {
            expect(siteGroups.getByName("Group Name").toUrl()).to.match(toMatchEndRegex("_api/web/sitegroups/getByName('Group Name')"));
        });
    });
});

describe("SiteGroup", () => {

    let group: SiteGroup;

    beforeEach(() => {
        group = new SiteGroups("_api/web").getById(1);
    });

    it("Should be an object", () => {
        expect(group).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/sitegroups(1)", () => {
            expect(group.toUrl()).to.match(toMatchEndRegex("_api/web/sitegroups(1)"));
        });
    });

    describe("users", () => {
        it("Should return _api/web/sitegroups", () => {
            expect(group.users.toUrl()).to.match(toMatchEndRegex("_api/web/sitegroups(1)/users"));
        });
    });
});
