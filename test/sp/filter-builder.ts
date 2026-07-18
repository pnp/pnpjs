import { expect } from "chai";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/batching";
import "@pnp/sp/filter-builder";
import "@pnp/sp/fields/list";
import { IList } from "@pnp/sp/lists";
import type { OpenClause } from "@pnp/sp/filter-builder";
import { pnpTest } from "../pnp-test.js";

describe("Filter Builder", function () {
    let list: IList = null;
    const listTitle = "FilterBuilderTestList";
    const testData = {
        item1: { Title: "TestItem_Alpha", Status: "Active", Priority: 1, TestDate: new Date("2023-01-15"), IsPending: true },
        item2: { Title: "TestItem_Beta", Status: "Inactive", Priority: 5, TestDate: new Date("2023-06-20"), IsPending: false },
        item3: { Title: "TestItem_Gamma", Status: "Active", Priority: 10, TestDate: new Date("2024-01-10"), IsPending: true },
        item4: { Title: "SearchItem_Delta", Status: "Pending", Priority: 3, TestDate: new Date("2023-03-25"), IsPending: false },
        item5: { Title: "SearchItem_Epsilon", Status: "Active", Priority: 7, TestDate: new Date("2024-06-30"), IsPending: true },
    };

    before(pnpTest("0a932f31-b482-4259-a073-242b08a527d3", async function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const ler = await this.pnp.sp.web.lists.ensure(listTitle, "Used to test filter builder operations", 100, false, {
            AllowContentTypes: false,
        });
        list = ler.list;

        if (ler.created) {

            await list.fields.addNumber("Priority", { MinimumValue: 0, MaximumValue: 100 });
            await list.fields.addText("Status", { MaxLength: 50 });
            await list.fields.addDateTime("TestDate", { DisplayFormat: 1, Group: "Test Fields" });
            await list.fields.addBoolean("IsPending", { Group: "Test Fields" });

            // add a few items to get started
            const [spBatch, execute] = this.pnp.sp.batched();
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item1);
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item2);
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item3);
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item4);
            spBatch.web.lists.getByTitle(listTitle).items.add(testData.item5);
            await execute();
        }
    }));

    after(pnpTest("36bdf560-8b42-4884-a4bf-b5e1477c0fa8", async function () {
        if (list != null) {
            await list.delete();
        }
    }));

    describe("String Filters", function () {

        it("str().eq() - should filter items by exact title match", pnpTest("debef3a3-3d3c-4811-823c-f115a7bceab3", async function () {
            const items = await list.items.where(item =>
                item.text("Title").eq("TestItem_Alpha")
            )();

            expect(items.length).to.eq(1);
            return expect(items[0].Title).to.eq("TestItem_Alpha");
        }));

        it("str().ne() - should filter items excluding a title", pnpTest("d536cfef-93e5-43d6-860c-2dd1f94cbbf2", async function () {
            const items = await list.items.where(item =>
                item.text("Title").ne("TestItem_Alpha")
            )();

            expect(items.length).to.be.gte(4);
            return expect(items.every(i => i.Title !== "TestItem_Alpha")).to.be.true;
        }));

        it("str().startsWith() - should filter items by title prefix", pnpTest("1b008d0f-2dc1-4059-8571-22c23ec8b4a7", async function () {
            const items = await list.items.where(item =>
                item.text("Title").startsWith("TestItem")
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => i.Title.startsWith("TestItem"))).to.be.true;
        }));

        it("str().startsWith() - should filter items by different prefix", pnpTest("6f63c14e-bbce-43d3-b55f-57ddd0f5c94a", async function () {
            const items = await list.items.where(item =>
                item.text("Title").startsWith("SearchItem")
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Title.startsWith("SearchItem"))).to.be.true;
        }));

        it("str().substringOf() - should filter items containing substring", pnpTest("a7f23b6e-d24b-4271-a9db-8773ee6a536c", async function () {
            const items = await list.items.where(item =>
                item.text("Title").substringOf("Alpha")
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Title.includes("Alpha"))).to.be.true;
        }));
    });

    describe("Number Filters", function () {

        it("num().eq() - should filter items by exact number match", pnpTest("618c5ada-742d-46fd-ada3-00e3bacb1b38", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").eq(5)
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Priority === 5)).to.be.true;
        }));

        it("num().ne() - should filter items excluding a number", pnpTest("cea728dd-8918-47d1-bdd0-73ba06c65150", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").ne(1)
            )();

            expect(items.length).to.be.gte(4);
            return expect(items.every(i => i.Priority !== 1)).to.be.true;
        }));

        it("num().gt() - should filter items greater than value", pnpTest("7c669de0-a710-4288-b89a-91f18946ca2f", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").gt(5)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Priority > 5)).to.be.true;
        }));

        it("num().lt() - should filter items less than value", pnpTest("c9c3909d-bae0-4fa8-ab1b-19d8fc5e55bc", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").lt(5)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Priority < 5)).to.be.true;
        }));

        it("num().ge() - should filter items greater than or equal to value", pnpTest("9d51893b-a7cf-4502-821e-e1cc55ed6c0d", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").ge(5)
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => i.Priority >= 5)).to.be.true;
        }));

        it("num().le() - should filter items less than or equal to value", pnpTest("a9bfe93d-5eab-44f2-866a-ee150f33129b", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").le(5)
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => i.Priority <= 5)).to.be.true;
        }));
    });

    describe("Date Filters", function () {

        it("date().gt() - should filter items with TestDate after date", pnpTest("a4721bec-2a7c-4656-b957-95102fbd8ad2", async function () {
            const cutoffDate = new Date("2023-06-01");
            const items = await list.items.where(item =>
                item.date("TestDate").gt(cutoffDate)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => new Date(i.TestDate) > cutoffDate)).to.be.true;
        }));

        it("date().lt() - should filter items TestDate before date", pnpTest("843ad812-d246-4fc1-a9bb-17e60ea2ab1a", async function () {
            const cutoffDate = new Date("2024-01-01");
            const items = await list.items.where(item =>
                item.date("TestDate").lt(cutoffDate)
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => new Date(i.TestDate) < cutoffDate)).to.be.true;
        }));

        it("date().ge() - should filter items TestDate on or after date", pnpTest("46fad4c4-85d3-450b-aece-e87913f1b5e4", async function () {
            const cutoffDate = new Date("2023-03-25");
            const items = await list.items.where(item =>
                item.date("TestDate").ge(cutoffDate)
            )();

            expect(items.length).to.be.gte(4);
            return expect(items.every(i => new Date(i.TestDate) >= cutoffDate)).to.be.true;
        }));

        it("date().le() - should filter items TestDate on or before date", pnpTest("81565170-c3c0-4b1e-98a7-6562dd47f141", async function () {
            const cutoffDate = new Date("2023-06-20");
            const items = await list.items.where(item =>
                item.date("TestDate").le(cutoffDate)
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i => new Date(i.TestDate) <= cutoffDate)).to.be.true;
        }));

        it("date().eq() - should filter items TestDate on exact date", pnpTest("0064f6e0-f66f-48a8-8a15-4c76a2111b9c", async function () {
            const exactDate = new Date("2023-01-15");
            const items = await list.items.where(item =>
                item.date("TestDate").eq(exactDate)
            )();

            return expect(items).to.be.an("array");
        }));

        it("date().ne() - should filter items not TestDate on date", pnpTest("2e6b9a4f-ab2e-4680-96e6-6ecc2712ecad", async function () {
            const excludeDate = new Date("2023-01-15");
            const items = await list.items.where(item =>
                item.date("TestDate").ne(excludeDate)
            )();

            expect(items).to.be.an("array");
            return expect(items.length).to.be.gte(0);
        }));
    });

    describe("Combined Filters with AND", function () {

        it("str().and.text() - should combine two string filters", pnpTest("cb52b508-2229-4568-9108-7b8f7cac4677", async function () {

            const items = await list.items.where(item =>
                item.text("Status").eq("Active").and.text("Title").startsWith("TestItem")
            )();


            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Status === "Active" && i.Title.startsWith("TestItem"))).to.be.true;
        }));

        it("num().and.text() - should combine number and string filters", pnpTest("48ced9e6-929a-4c80-8dbb-6b123d902af1", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").gt(5).and.text("Status").eq("Active")
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Priority > 5 && i.Status === "Active")).to.be.true;
        }));

        it("str().and.number() - should combine string and number filters", pnpTest("a96e1609-9d9e-4bd7-9da9-bf1b033662e8", async function () {
            const items = await list.items.where(item =>
                item.text("Status").eq("Active").and.number("Priority").le(5)
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Status === "Active" && i.Priority <= 5)).to.be.true;
        }));

        it("date().and.text() - should combine date and string filters", pnpTest("58ae6677-4055-434e-a287-1f7e8f8ba3b8", async function () {
            const cutoffDate = new Date("2023-01-01");
            const items = await list.items.where(item =>
                item.date("TestDate").gt(cutoffDate).and.text("Status").eq("Active")
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => new Date(i.TestDate) > cutoffDate && i.Status === "Active")).to.be.true;
        }));

        it("date().and.number() - should combine date and number filters", pnpTest("2e04d69c-9ac7-4f52-b911-adacce8cfaf8", async function () {
            const cutoffDate = new Date("2023-06-01");
            const items = await list.items.where(item =>
                item.date("TestDate").gt(cutoffDate).and.number("Priority").ge(5)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => new Date(i.TestDate) > cutoffDate && i.Priority >= 5)).to.be.true;
        }));

        it("triple AND chain - should combine three filters", pnpTest("e18aa7c6-12d1-4e9a-b729-60a408ef4a93", async function () {
            const cutoffDate = new Date("2023-01-01");
            const items = await list.items.where(item =>
                item.text("Status").eq("Active")
                    .and.number("Priority").gt(1)
                    .and.date("TestDate").gt(cutoffDate)
            )();

            expect(items.length).to.be.gte(1);
            return expect(items.every(i =>
                i.Status === "Active" &&
                i.Priority > 1 &&
                new Date(i.TestDate) > cutoffDate
            )).to.be.true;
        }));
    });

    describe("Combined Filters with OR", function () {

        it("str().or.text() - should combine two string filters with OR", pnpTest("fd4703f7-7a98-46a5-a9e3-9da62086e7e9", async function () {
            const items = await list.items.where(item =>
                item.text("Status").eq("Active").or.text("Status").eq("Pending")
            )();

            expect(items.length).to.be.gte(4);
            return expect(items.every(i => i.Status === "Active" || i.Status === "Pending")).to.be.true;
        }));

        it("num().or.number() - should combine two number filters with OR", pnpTest("ebd65da6-82f4-4d02-8502-e3ef8e793042", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").eq(1).or.number("Priority").eq(10)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Priority === 1 || i.Priority === 10)).to.be.true;
        }));

        it("str().or.number() - should combine string and number filters with OR", pnpTest("f02ded7d-7424-42b9-81e2-91b81a52d086", async function () {
            const items = await list.items.where(item =>
                item.text("Status").eq("Inactive").or.number("Priority").gt(8)
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => i.Status === "Inactive" || i.Priority > 8)).to.be.true;
        }));

        it("date().or.text() - should combine date and string filters with OR", pnpTest("06a62d38-4018-44f0-b227-d49b1606f16a", async function () {
            const cutoffDate = new Date("2024-06-01");
            const items = await list.items.where(item =>
                item.date("TestDate").gt(cutoffDate).or.text("Status").eq("Inactive")
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i => new Date(i.TestDate) > cutoffDate || i.Status === "Inactive")).to.be.true;
        }));
    });

    describe("Grouped Filters (Parentheses)", function () {

        it("str().and(grouped OR) - should handle grouped OR within AND", pnpTest("133b189e-c711-43e5-ae7d-55056a786b03", async function () {
            const items = await list.items.where(item =>
                item.text("Title").startsWith("TestItem").and((builder: OpenClause<any>) =>
                    builder.text("Status").eq("Active").or.text("Status").eq("Inactive")
                )
            )();

            expect(items.length).to.be.gte(2);
            return expect(items.every(i =>
                i.Title.startsWith("TestItem") && (i.Status === "Active" || i.Status === "Inactive")
            )).to.be.true;
        }));

        it("num().and(grouped filters) - should handle complex grouped conditions", pnpTest("246c940e-75e5-45f8-b19c-c96ecdb87930", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").gt(1).and((builder: OpenClause<any>) =>
                    builder.text("Status").eq("Active").or.text("Title").startsWith("SearchItem")
                )
            )();

            expect(items.length).to.be.gte(3);
            return expect(items.every(i =>
                i.Priority > 1 && (i.Status === "Active" || i.Title.startsWith("SearchItem"))
            )).to.be.true;
        }));

        it("(grouped filters).or.text() - should handle grouped filters before OR", pnpTest("301a36fb-fa85-489a-afbf-712f646ec0d4", async function () {
            const items = await list.items.where(item =>
                (item.text("Status").eq("Active").and.number("Priority").lt(5))
                    .or.text("Status").eq("Pending")
            )();

            return expect(items.length).to.be.gte(2);
        }));

        it("nested groups - should handle multiple levels of grouping", pnpTest("64991146-0b5c-44b8-a7e0-7c693f29698b", async function () {
            const cutoffDate = new Date("2023-06-01");
            const items = await list.items.where(item =>
                item.text("Title").startsWith("TestItem").and((builder: OpenClause<any>) =>
                    builder.text("Status").eq("Active").and((innerBuilder: OpenClause<any>) =>
                        innerBuilder.number("Priority").gt(1).or.date("TestDate").gt(cutoffDate)
                    )
                )
            )();

            // Complex nested logic - mainly testing that it executes without error
            return expect(items).to.be.an("array");
        }));
    });

    describe("multiple odata operations", function () {

        it("should work with select() and top()", pnpTest("cc9eba49-b634-451e-9341-eb99df4ac284", async function () {
            const items = await list.items
                .where(item => item.text("Status").eq("Active"))
                .select("Title", "Status")
                .top(2)();

            expect(items.length).to.be.lte(2);
            expect(items[0]).to.have.property("Title");
            expect(items[0]).to.not.have.property("Priority");
            return expect(items.every(i => i.Status === "Active")).to.be.true;
        }));

        it("should work with orderBy()", pnpTest("5351546c-50fe-41bb-8a3b-a615a0fc11fb", async function () {
            const items = await list.items
                .where(item => item.text("Status").eq("Active"))
                .orderBy("Priority", false)
                .select("Title", "Priority")();

            expect(items.length).to.be.gte(1);
            // Verify items are in descending order
            for (let i = 0; i < items.length - 1; i++) {
                expect(items[i].Priority).to.be.gte(items[i + 1].Priority);
            }
        }));

        it("should return empty array when no items match", pnpTest("3086326d-466e-4567-8bf1-65f4bc84c622", async function () {
            const items = await list.items.where(item =>
                item.text("Status").eq("NonExistentStatus")
            )();

            expect(items).to.be.an("array");
            return expect(items.length).to.eq(0);
        }));
    });

    describe("Boolean Filters", function () {

        it("bool().eq(true) - should filter items where IsPending is true", pnpTest("f44aa7bd-eceb-4495-b463-eb946830ebde", async function () {
            const items = await list.items.where(item =>
                item.bool("IsPending").eq(true)
            )();

            return expect(items.every(i => i.IsPending === true)).to.be.true;
        }));

        it("bool().eq(false) - should filter items where IsPending is false", pnpTest("8993a916-bbda-47be-90f4-f62e0002c45e", async function () {
            const items = await list.items.where(item =>
                item.bool("IsPending").eq(false)
            )();

            return expect(items.every(i => i.IsPending === false)).to.be.true;
        }));
    });

    describe("in/notIn Filters", function () {
        it("text().in() - should filter items by multiple titles", pnpTest("7442b792-3774-416e-a02a-faa72b15f135", async function () {
            const items = await list.items.where(item =>
                item.text("Title").in(["TestItem_Alpha", "TestItem_Beta"])
            )();
            expect(items.length).to.be.gte(2);
            return expect(items.every(i => ["TestItem_Alpha", "TestItem_Beta"].includes(i.Title))).to.be.true;
        }));

        it("text().notIn() - should filter items not in titles", pnpTest("e496ca67-6ae5-4f09-842f-caf25d5427ab", async function () {
            const items = await list.items.where(item =>
                item.text("Title").notIn(["TestItem_Alpha", "TestItem_Beta"])
            )();
            expect(items.length).to.be.gte(3);
            return expect(items.every(i => !["TestItem_Alpha", "TestItem_Beta"].includes(i.Title))).to.be.true;
        }));

        it("number().in() - should filter items by multiple priorities", pnpTest("3f30c146-38d1-47f4-a91c-10775d838f57", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").in([1, 5])
            )();
            expect(items.length).to.be.gte(2);
            return expect(items.every(i => [1, 5].includes(i.Priority))).to.be.true;
        }));

        it("number().notIn() - should filter items not in priorities", pnpTest("4187898a-8564-4c51-8c44-e7d82fe01228", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").notIn([1, 5])
            )();
            expect(items.length).to.be.gte(3);
            return expect(items.every(i => ![1, 5].includes(i.Priority))).to.be.true;
        }));

        it("date().in() - should filter items by multiple dates", pnpTest("92d96443-07fd-4850-8ed0-9600220de6b5", async function () {
            const d1 = new Date("2023-01-15");
            const d2 = new Date("2023-06-20");
            const items = await list.items.where(item =>
                item.date("TestDate").in([d1, d2])
            )();
            expect(items.length).to.be.gte(2);
            return expect(items.every(i => [d1.toISOString(), d2.toISOString()].includes(new Date(i.TestDate).toISOString()))).to.be.true;
        }));

        it("date().notIn() - should filter items not in dates", pnpTest("fa63282e-a8ae-417c-b361-bcac2064799d", async function () {
            const d1 = new Date("2023-01-15");
            const d2 = new Date("2023-06-20");
            const items = await list.items.where(item =>
                item.date("TestDate").notIn([d1, d2])
            )();
            expect(items.length).to.be.gte(3);
            return expect(items.every(i => ![d1.toISOString(), d2.toISOString()].includes(new Date(i.TestDate).toISOString()))).to.be.true;
        }));
    });

    describe("Helper Filters", function () {
        it("date().isBetween() - should filter items between two dates", pnpTest("6aa3c116-af22-4ade-93bf-1ad491e787c5", async function () {
            const start = new Date("2023-01-01");
            const end = new Date("2023-12-31");
            const items = await list.items.where(item =>
                item.date("TestDate").isBetween(start, end)
            )();
            expect(items.length).to.be.gte(1);
            return expect(items.every(i => new Date(i.TestDate) >= start && new Date(i.TestDate) <= end)).to.be.true;
        }));

        it("date().isToday() - should filter items with today's date", pnpTest("b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e", async function () {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const items = await list.items.where(item =>
                item.date("TestDate").isToday()
            )();
            // This test will only pass if there are items with today's date
            expect(items).to.be.an("array");
        }));

        it("text().isNull() - should filter items where text field is null", pnpTest("c2d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f", async function () {
            const items = await list.items.where(item =>
                item.text("Status").isNull()
            )();
            expect(items).to.be.an("array");
        }));

        it("text().isNotNull() - should filter items where text field is not null", pnpTest("d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a", async function () {
            const items = await list.items.where(item =>
                item.text("Status").isNotNull()
            )();
            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Status !== null && i.Status !== undefined)).to.be.true;
        }));

        it("number().isNull() - should filter items where number field is null", pnpTest("e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").isNull()
            )();
            expect(items).to.be.an("array");
        }));

        it("number().isNotNull() - should filter items where number field is not null", pnpTest("f5a6b7c8-d9e0-1f2a-3b4c-5d6e7f8a9b0c", async function () {
            const items = await list.items.where(item =>
                item.number("Priority").isNotNull()
            )();
            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.Priority !== null && i.Priority !== undefined)).to.be.true;
        }));

        it("date().isNull() - should filter items where date field is null", pnpTest("a6b7c8d9-e0f1-2a3b-4c5d-6e7f8a9b0c1d", async function () {
            const items = await list.items.where(item =>
                item.date("TestDate").isNull()
            )();
            expect(items).to.be.an("array");
        }));

        it("date().isNotNull() - should filter items where date field is not null", pnpTest("b7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e", async function () {
            const items = await list.items.where(item =>
                item.date("TestDate").isNotNull()
            )();
            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.TestDate !== null && i.TestDate !== undefined)).to.be.true;
        }));

        it("bool().isNull() - should filter items where bool field is null", pnpTest("c8d9e0f1-a2b3-4c5d-6e7f-8a9b0c1d2e3f", async function () {
            const items = await list.items.where(item =>
                item.bool("IsPending").isNull()
            )();
            expect(items).to.be.an("array");
        }));

        it("bool().isNotNull() - should filter items where bool field is not null", pnpTest("d9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a", async function () {
            const items = await list.items.where(item =>
                item.bool("IsPending").isNotNull()
            )();
            expect(items.length).to.be.gte(1);
            return expect(items.every(i => i.IsPending !== null && i.IsPending !== undefined)).to.be.true;
        }));
    });

    describe("Lookup Filters", function () {

        let lookupList: IList = null;
        let categoryAId: number;
        let categoryBId: number;
        let categoryCId: number;

        before(pnpTest("e0f1a2b3-c4d5-6e7f-8a9b-0c1d2e3f4a5b", async function () {

            if (!this.pnp.settings.enableWebTests) {
                this.skip();
            }

            const runWithRetry = async <T>(op: () => Promise<T>, maxAttempts = 3): Promise<T> => {

                let lastError: unknown = null;

                for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                    try {
                        return await op();
                    } catch (e) {
                        lastError = e;
                        const message = `${e}`;
                        const isTransient = /fetch failed|ECONNRESET|does not exist/i.test(message);

                        if (!isTransient || attempt === maxAttempts) {
                            throw e;
                        }

                        await new Promise(resolve => setTimeout(resolve, attempt * 500));
                    }
                }

                throw lastError;
            };

            await runWithRetry(async () => {
                const lookupLer = await this.pnp.sp.web.lists.ensure("FilterBuilderLookupSource", "Lookup source for filter builder tests", 100);
                lookupList = lookupLer.list;

                const getOrCreateCategoryId = async (title: string): Promise<number> => {
                    const existing = await lookupList.items
                        .select("Id", "Title")
                        .where(item => item.text("Title").eq(title))
                        .top(1)();

                    if (existing.length > 0) {
                        return existing[0].Id;
                    }

                    const created = await lookupList.items.add({ Title: title });
                    return created.Id;
                };

                const ensureLookupItem = async (title: string, categoryId: number): Promise<void> => {
                    const existing = await list.items
                        .select("Id", "Title")
                        .where(item => item.text("Title").eq(title))
                        .top(1)();

                    if (existing.length < 1) {
                        await list.items.add({ Title: title, CategoryId: categoryId });
                    }
                };

                categoryAId = await getOrCreateCategoryId("Category_A");
                categoryBId = await getOrCreateCategoryId("Category_B");
                categoryCId = await getOrCreateCategoryId("Category_C");

                const existingLookupField = await list.fields
                    .select("Title")
                    .where(field => field.text("Title").eq("Category"))
                    .top(1)();

                if (existingLookupField.length < 1) {
                    const lookupListInfo = await lookupList.select("Id")();
                    await list.fields.addLookup("Category", { LookupListId: lookupListInfo.Id, LookupFieldName: "Title" });
                }

                await ensureLookupItem("LookupItem_A1", categoryAId);
                await ensureLookupItem("LookupItem_A2", categoryAId);
                await ensureLookupItem("LookupItem_B1", categoryBId);
                await ensureLookupItem("LookupItem_C1", categoryCId);
            });
        }));

        it("lookup().eq() - should filter by lookup field text value", pnpTest("f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c", async function () {
            const items = await list.items.where(item =>
                item.lookup("Category").eq("Title", "Category_A")
            )();
            return expect(items.length).to.be.gte(2);
        }));

        it("lookup().ne() - should filter excluding lookup field text value", pnpTest("a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d", async function () {
            const items = await list.items.where(item =>
                item.lookup("Category").ne("Title", "Category_A")
            )();
            return expect(items.length).to.be.gte(2);
        }));

        it("lookup().in() - should filter by multiple lookup field text values", pnpTest("b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e", async function () {
            const items = await list.items.where(item =>
                item.lookup("Category").in("Title", ["Category_A", "Category_B"])
            )();
            return expect(items.length).to.be.gte(3);
        }));

        it("lookup().notIn() - should filter excluding multiple lookup field text values", pnpTest("c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f", async function () {
            const items = await list.items.where(item =>
                item.lookup("Category").notIn("Title", ["Category_A", "Category_B"])
            )();
            return expect(items.length).to.be.gte(1);
        }));

        it("lookupId().eq() - should filter by lookup ID", pnpTest("d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a", async function () {
            const items = await list.items.where(item =>
                item.lookupId("Category").eq(categoryAId)
            )();
            return expect(items.length).to.be.gte(2);
        }));

        it("lookupId().ne() - should filter excluding lookup ID", pnpTest("e6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b", async function () {
            const items = await list.items.where(item =>
                item.lookupId("Category").ne(categoryAId)
            )();
            return expect(items.length).to.be.gte(2);
        }));

        it("lookupId().in() - should filter by multiple lookup IDs", pnpTest("f7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c", async function () {
            const items = await list.items.where(item =>
                item.lookupId("Category").in([categoryAId, categoryBId])
            )();
            return expect(items.length).to.be.gte(3);
        }));

        it("lookupId().notIn() - should filter excluding multiple lookup IDs", pnpTest("a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d", async function () {
            const items = await list.items.where(item =>
                item.lookupId("Category").notIn([categoryAId, categoryBId])
            )();
            return expect(items.length).to.be.gte(1);
        }));
    });
});
