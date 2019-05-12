import { expect } from "chai";
import { Views } from "../src/views";
import { toMatchEndRegex } from "./utils";

describe("Views", () => {
    it("Should be an object", () => {
        const views = new Views("_api/web/lists/getByTitle('Tasks')");
        expect(views).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/Views", () => {
            const views = new Views("_api/web/lists/getByTitle('Tasks')");
            expect(views.toUrl()).to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/views"));
        });
    });
    describe("getById", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/Views('7b7c777e-b749-4f58-a825-53084f2941b0')", () => {
            const views = new Views("_api/web/lists/getByTitle('Tasks')");
            const view = views.getById("7b7c777e-b749-4f58-a825-53084f2941b0");
            expect(view.toUrl())
                .to.match(toMatchEndRegex("_api/web/lists/getByTitle('Tasks')/views('7b7c777e-b749-4f58-a825-53084f2941b0')"));
        });
    });
    describe("getByTitle", () => {
        it("Should return /_api/web/lists/getByTitle('Tasks')/views/getbytitle('All%20Tasks')", () => {
            const views = new Views("_api/web/lists/getByTitle('Tasks')");
            const view = views.getByTitle("All Tasks");
            expect(view.toUrl())
                .to.match(toMatchEndRegex("/_api/web/lists/getByTitle('Tasks')/views/getbytitle('All%20Tasks')"));
        });
    });
});
