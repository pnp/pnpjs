# @pnp/sp/search

Using search you can access content throughout your organization in a secure and consistent manner. The library provides support for searching and suggest - as well as some interfaces and helper classes to make building your queries and processing responses easier.

## Search

[![Invokable Banner](https://img.shields.io/badge/Invokable-informational.svg)](../concepts/invokable.md) [![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

Search is accessed directly from the root sp object and can take either a string representing the query text, a plain object matching the ISearchQuery interface, or a SearchQueryBuilder instance.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/search";
import { ISearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp/search";

const sp = spfi(...);

// text search using SharePoint default values for other parameters
const results: SearchResults = await sp.search("test");

console.log(results.ElapsedTime);
console.log(results.RowCount);
console.log(results.PrimarySearchResults);


// define a search query object matching the ISearchQuery interface
const results2: SearchResults = await sp.search(<ISearchQuery>{
    Querytext: "test",
    RowLimit: 10,
    EnableInterleaving: true,
});

console.log(results2.ElapsedTime);
console.log(results2.RowCount);
console.log(results2.PrimarySearchResults);

// define a query using a builder
const builder = SearchQueryBuilder("test").rowLimit(10).enableInterleaving.enableQueryRules.processPersonalFavorites;
const results3 = await sp.search(builder);

console.log(results3.ElapsedTime);
console.log(results3.RowCount);
console.log(results3.PrimarySearchResults);
```

## Search Result Caching

Starting with v3 you can use any of the caching behaviors with search and the results will be cached. Please see here [for more details on caching options](https://pnp.github.io/pnpjs/queryable/behaviors/#caching).

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/search";
import { ISearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp/search";
import { Caching } from "@pnp/queryable";

const sp = spfi(...).using(Caching());

sp.search({/* ... query */}).then((r: SearchResults) => {

    console.log(r.ElapsedTime);
    console.log(r.RowCount);
    console.log(r.PrimarySearchResults);
});

// use a query builder
const builder = SearchQueryBuilder("test").rowLimit(3);

// supply a search query builder and caching options
const results2 = await sp.search(builder);

console.log(results2.TotalRows);
```

## Paging with SearchResults.getPage

Paging is controlled by a start row and page size parameter. You can specify both arguments in your initial query however you can use the getPage method to jump to any page. The second parameter page size is optional and will use the previous RowLimit or default to 10.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/search";
import { SearchResults, SearchQueryBuilder } from "@pnp/sp/search";

const sp = spfi(...);

// this will hold our current results
let currentResults: SearchResults = null;
let page = 1;

// triggered on page load or through some other means
function onStart() {

    // construct our query that will be used throughout the paging process, likely from user input
    const q = SearchQueryBuilder("test").rowLimit(5);
    const results = await sp.search(q);
    currentResults = results; // set the current results
    page = 1; // reset page counter
    // update UI...
}

// triggered by an event
async function next() {

    currentResults = await currentResults.getPage(++page);
    // update UI...
}

// triggered by an event
async function prev() {

    currentResults = await currentResults.getPage(--page);
    // update UI...
}
```

## SearchQueryBuilder

The SearchQueryBuilder allows you to build your queries in a fluent manner. It also accepts constructor arguments for query text and a base query plain object, should you have a shared configuration for queries in an application you can define them once. The methods and properties match those on the SearchQuery interface. Boolean properties add the flag to the query while methods require that you supply one or more arguments. Also arguments supplied later in the chain will overwrite previous values.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/search";
import { SearchQueryBuilder, SearchResults, ISearchQuery } from "@pnp/sp/search";

const sp = spfi(...);

// basic usage
let q = SearchQueryBuilder().text("test").rowLimit(4).enablePhonetic;

sp.search(q).then(h => { /* ... */ });

// provide a default query text at creation
let q2 = SearchQueryBuilder("text").rowLimit(4).enablePhonetic;

const results: SearchResults = await sp.search(q2);

// provide query text and a template for
// shared settings across queries that can
// be overwritten by individual builders
const appSearchSettings: ISearchQuery = {
    EnablePhonetic: true,
    HiddenConstraints: "reports"
};

let q3 = SearchQueryBuilder("test", appSearchSettings).enableQueryRules;
let q4 = SearchQueryBuilder("financial data", appSearchSettings).enableSorting.enableStemming;
const results2 = await sp.search(q3);
const results3 = sp.search(q4);
```

## Search Suggest

Search suggest works in much the same way as search, except against the suggest end point. It takes a string or a plain object that matches ISuggestQuery.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/search";
import { ISuggestQuery, ISuggestResult } from "@pnp/sp/search";

const sp = spfi(...);

const results = await sp.searchSuggest("test");

const results2 = await sp.searchSuggest({
    querytext: "test",
    count: 5,
} as ISuggestQuery);
```

## Search Factory

You can also configure a search or suggest query against any valid SP url using the factory methods.

> In this case you'll need to ensure you add observers, or use the [tuple constructor](../queryable/queryable.md/#queryable-constructor) to inherit

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/web";
import "@pnp/sp/search";
import { Search, Suggest } from "@pnp/sp/search";
import { SPDefault } from "@pnp/nodejs";

const sp = spfi(...);

// set the url for search
const searcher = Search([sp.web, "https://mytenant.sharepoint.com/sites/dev"]);

// this can accept any of the query types (text, ISearchQuery, or SearchQueryBuilder)
const results = await searcher("test");

// you can reuse the ISearch instance
const results2 = await searcher("another query");

// same process works for Suggest
const suggester = Suggest([sp.web, "https://mytenant.sharepoint.com/sites/dev"]);

const suggestions = await suggester({ querytext: "test" });

// resetting the observers on the instance
const searcher2 = Search("https://mytenant.sharepoint.com/sites/dev").using(SPDefault({
  msal: {
    config: {...},
    scopes: [...],
  },
}));

const results3 = await searcher2("test");
```
