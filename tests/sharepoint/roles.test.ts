import { expect } from "chai";
import {
    RoleAssignment,
    RoleAssignments,
    RoleDefinitions,
} from "../../src/sharepoint/roles";
import { toMatchEndRegex } from "../testutils";

describe("RoleAssignments", () => {
    it("Should be an object", () => {
        let roleAssignments = new RoleAssignments("_api/web");
        expect(roleAssignments).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/roleassignments", () => {
            let roleAssignments = new RoleAssignments("_api/web");
            expect(roleAssignments.toUrl()).to.match(toMatchEndRegex("_api/web/roleassignments"));
        });
    });

    describe("getById", () => {
        it("Should return _api/web/roleassignments(1)", () => {
            let roleAssignments = new RoleAssignments("_api/web");
            expect(roleAssignments.getById(1).toUrl()).to.match(toMatchEndRegex("_api/web/roleassignments(1)"));
        });
    });
});

describe("RoleAssignment", () => {

    let baseUrl = "_api/web/roleassignments(1)";

    it("Should be an object", () => {
        let roleAssignment = new RoleAssignment(baseUrl);
        expect(roleAssignment).to.be.a("object");
    });

    describe("groups", () => {
        it("Should return " + baseUrl + "/groups", () => {
            let roleAssignment = new RoleAssignment(baseUrl);
            expect(roleAssignment.groups.toUrl()).to.match(toMatchEndRegex(baseUrl + "/groups"));
        });
    });

    describe("bindings", () => {
        it("Should return " + baseUrl + "/roledefinitionbindings", () => {
            let roleAssignment = new RoleAssignment(baseUrl);
            expect(roleAssignment.bindings.toUrl()).to.match(toMatchEndRegex(baseUrl + "/roledefinitionbindings"));
        });
    });
});

describe("RoleDefinitions", () => {

    let baseUrl = "_api/web";

    let roleDefinitions: RoleDefinitions;

    beforeEach(() => {
        roleDefinitions = new RoleDefinitions(baseUrl);
    });

    it("Should be an object", () => {
        expect(roleDefinitions).to.be.a("object");
    });

    describe("getById", () => {
        it("Should return " + baseUrl + "/roledefinitions/getById(1)", () => {
            expect(roleDefinitions.getById(1).toUrl()).to.match(toMatchEndRegex(baseUrl + "/roledefinitions/getById(1)"));
        });
    });

    describe("getByName", () => {
        it("Should return " + baseUrl + "/getbyname('name')", () => {
            expect(roleDefinitions.getByName("name").toUrl()).to.match(toMatchEndRegex(baseUrl + "/roledefinitions/getbyname('name')"));
        });
    });

    describe("getByType", () => {
        it("Should return " + baseUrl + "/getbytype(1)", () => {
            expect(roleDefinitions.getByType(1).toUrl()).to.match(toMatchEndRegex(baseUrl + "/roledefinitions/getbytype(1)"));
        });
    });
});
