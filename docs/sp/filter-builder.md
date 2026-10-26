# Filter Builder

PnPjs provides a fluent, strongly-typed filter builder for SharePoint queryables through `.where(...)`.

Use this when you want type-safe filters instead of writing raw OData strings in `.filter(...)`.

## Import

This feature is a selective import.

```TypeScript
import "@pnp/sp/filter-builder";
```

## Where It Works

The filter builder is added to SharePoint collections that support OData `$filter`, including common cases like:

- Lists: `sp.web.lists.where(...)`
- Items: `sp.web.lists.getByTitle("MyList").items.where(...)`
- Fields: `sp.web.lists.getByTitle("MyList").fields.where(...)`

## Basic Examples

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/filter-builder";

const sp = spfi(...);

const activeItems = await sp.web.lists.getByTitle("MyList").items.where(item =>
    item.text("Status").eq("Active")
)();

const largeLists = await sp.web.lists.where(list =>
    list.number("ItemCount").gt(5000)
)();
```

## Generic Type Support

The generic is optional, but improves IntelliSense and field-name safety.

```TypeScript
interface ITaskItem {
    Title: string;
    Status: string;
    Priority: number;
    DueDate: Date;
    IsUrgent: boolean;
}

const items = await sp.web.lists.getByTitle("Tasks").items.where<ITaskItem>(item =>
    item.text("Status").eq("Active")
        .and.number("Priority").ge(5)
        .and.bool("IsUrgent").eq(false)
)();
```

## Supported Field Types and Operations

| Field Type | Builder | Methods |
| --- | --- | --- |
| Text-like fields | `.text("Field")` | `eq`, `ne`, `startsWith`, `substringOf`, `in`, `notIn`, `isNull`, `isNotNull` |
| Number-like fields | `.number("Field")` | `eq`, `ne`, `gt`, `lt`, `ge`, `le`, `in`, `notIn`, `isNull`, `isNotNull` |
| Date/DateTime fields | `.date("Field")` | `eq`, `ne`, `gt`, `lt`, `ge`, `le`, `in`, `notIn`, `isBetween`, `isToday`, `isNull`, `isNotNull` |
| Boolean fields | `.bool("Field")` | `eq`, `ne`, `isNull`, `isNotNull` |
| Lookup subfields | `.lookup("Field")` | `eq`, `ne`, `in`, `notIn` |
| Lookup ID values | `.lookupId("Field")` | `eq`, `ne`, `in`, `notIn` |

## Grouping and Composition

Use `and` / `or` chaining, including grouped expressions.

```TypeScript
const results = await sp.web.lists.getByTitle("MyList").items.where(item =>
    item.text("Title").startsWith("Test").and(group =>
        group.text("Status").eq("Active").or.number("Priority").gt(7)
    )
)();
```

## Lookup Examples

```TypeScript
const categoryA = await sp.web.lists.getByTitle("Products").items.where(item =>
    item.lookup("Category").eq("Title", "Category_A")
)();

const categoryIds = await sp.web.lists.getByTitle("Products").items.where(item =>
    item.lookupId("Category").in([1, 2, 3])
)();
```

## Use with Other OData Operations

```TypeScript
const results = await sp.web.lists.getByTitle("MyList").items
    .where(item => item.text("Status").eq("Active"))
    .select("Title", "Priority", "Status")
    .top(10)
    .orderBy("Priority", false)();
```

## Notes

- `.where(...)` and `.filter(...)` can both be used, but `.where(...)` is preferred for typed fluent filters.
- Some SharePoint field types (for example taxonomy metadata filters) still require CAML query patterns.
