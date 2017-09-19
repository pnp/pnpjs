import { expect } from "chai";
import {
    RoleAssignment,
    RoleAssignments,
    RoleDefinitions,
} from "../src/roles";
import { toMatchEndRegex } from "./utils";

describe("RoleAssignments", () => {
    it("Should be an object", () => {
        const roleAssignments = new RoleAssignments("_api/web");
        expect(roleAssignments).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/roleassignments", () => {
            const roleAssignments = new RoleAssignments("_api/web");
            expect(roleAssignments.toUrl()).to.match(toMatchEndRegex("_api/web/roleassignments"));
        });
    });

    describe("getById", () => {
        it("Should return _api/web/roleassignments(1)", () => {
            const roleAssignments = new RoleAssignments("_api/web");
            expect(roleAssignments.getById(1).toUrl()).to.match(toMatchEndRegex("_api/web/roleassignments(1)"));
        });
    });
});

describe("RoleAssignment", () => {

    const baseUrl = "_api/web/roleassignments(1)";

    it("Should be an object", () => {
        const roleAssignment = new RoleAssignment(baseUrl);
        expect(roleAssignment).to.be.a("object");
    });

    describe("groups", () => {
        it("Should return " + baseUrl + "/groups", () => {
            const roleAssignment = new RoleAssignment(baseUrl);
            expect(roleAssignment.groups.toUrl()).to.match(toMatchEndRegex(baseUrl + "/groups"));
        });
    });

    describe("bindings", () => {
        it("Should return " + baseUrl + "/roledefinitionbindings", () => {
            const roleAssignment = new RoleAssignment(baseUrl);
            expect(roleAssignment.bindings.toUrl()).to.match(toMatchEndRegex(baseUrl + "/roledefinitionbindings"));
        });
    });
});

describe("RoleDefinitions", () => {

    const baseUrl = "_api/web";

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
