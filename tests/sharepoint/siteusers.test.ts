import { expect } from "chai";
import { SiteUser, SiteUsers } from "../../src/sharepoint/siteusers";
import { toMatchEndRegex } from "../testutils";

describe("SiteUsers", () => {

    let users: SiteUsers;

    beforeEach(() => {
        users = new SiteUsers("_api/web");
    });

    it("Should be an object", () => {
        expect(users).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/siteusers", () => {
            expect(users.toUrl()).to.match(toMatchEndRegex("_api/web/siteusers"));
        });
    });

    describe("getByEmail", () => {
        it("Should return _api/web/siteusers/getByEmail('user@user.com')", () => {
            let user = users.getByEmail("user@user.com");
            expect(user.toUrl()).to.match(toMatchEndRegex("_api/web/siteusers/getByEmail('user@user.com')"));
        });
    });

    describe("getById", () => {
        it("Should return _api/web/siteusers/getById(12)", () => {
            let user = users.getById(12);
            expect(user.toUrl()).to.match(toMatchEndRegex("_api/web/siteusers/getById(12)"));
        });
    });

    describe("getByLoginName", () => {
        it("Should return _api/web/siteusers(@v)?@v='i%3A0%23.f%7Cmembership%7Cuser%40tenant.com'", () => {
            let user = users.getByLoginName("i:0#.f|membership|user@tenant.com");
            expect(user.toUrlAndQuery()).to.match(toMatchEndRegex("_api/web/siteusers(@v)?@v='i%3A0%23.f%7Cmembership%7Cuser%40tenant.com'"));
        });
    });
});

describe("SiteUser", () => {

    let user: SiteUser;

    beforeEach(() => {
        user = new SiteUsers("_api/web").getById(2);
    });

    it("Should be an object", () => {
        expect(user).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/siteusers/getById(2)", () => {
            expect(user.toUrl()).to.match(toMatchEndRegex("_api/web/siteusers/getById(2)"));
        });
    });

    describe("groups", () => {
        it("Should return _api/web/siteusers/getById(2)/groups", () => {
            expect(user.groups.toUrl()).to.match(toMatchEndRegex("_api/web/siteusers/getById(2)/groups"));
        });
    });
});
