# Transition Guide

It is our hope that the transition from version 2.\* to 3.\* will be as painless as possible, however given the transition we have made from a global sp object to an instance based object some architectural and inital setup changes will need to be addressed. In the following sections we endevor to provide an overview of what changes will be required. If we missed something, please let us know in the issues list so we can update the guide. Thanks!

For a full, detailed list of what's been added, updated, and removed please see our [CHANGELOG](../../CHANGELOG.md)

## Benefits and Advancements in V3

//TODO: Patrick to write

## Global vs Instance Architecture

The biggest change in version 3 of the library is the movement away from the globally defined sp and graph objects. Starting in version 2.1.0 we added the concept of `Isolated Runtime` which allowed you to create a seperate instance of the global object that would have a seperate configuration. We found that the implementation was finicky and prone to issue and so have rebuilt the internals of the library from the ground up to better address this need. In doing so the decision was made not to offer a global object at all.

Becuase of this change, any architecture that relies on the `sp` or `graph` objects being configured during initialization and then reused throught the solution will need to be rethought. Either by creating a new `spfi`/`graphfi` object wherever it's required or by creating a [service arcitecture](./getting-started/#establish-context-within-an-spfx-service) that can return a previously configured instance or utilize an instance and return the results. Essentially the `sp` and `graph` objects have been deprecated and will need to be replaced.

For more information on getting started with these new setup methods please see the [Getting Started](./getting-started.md) docs or for a deeper look into the Queryable interface see [Queryable](./querable/index.md).

## AssignFrom and CopyFrom

With the new Querable instance architecture we have provided a way to branch from one instance to another. To do this we provide two methods AssignFrom and CopyFrom. These methods can be helpful when you want to establish a new instance that you might apply other behaviors to but want to reuse the configuration from a source. To learn more about them check out the [Core/Bahaviors](./core/behaviors.md) documentation.

## Batching

Another benefit of the new updated internals in a significantly streamlined and simplified process for batching requests. Essentially the interface for both SP and Graph function the same.

A new package called "Batched" will need to be imported which then provides the batched interface which will return a tuple with a new Querable instance and an execute function. To see more details check out the [Batching](./concepts/batching.md)

## Web -> SPFI

In V2, to connect to a different web you would use the function

```ts
const web = Web({Other Web URL});
```

In V3 you would create a new instance of queryable connecting to the web of your choice. Th`is new method provides you significantly more flexibility by not only allowing you to easily connect to other webs in the same tenant but also to webs in other tenants.

```ts
const spWebA = spfi().using(SPDefault(this.context));

// Create a new instance of Queryable
const spWebB = spfi({Other Web URL}).using(SPDefault(this.context));

// Copy/Assign a new instance of Queryable using the existing
const spWebB = spfi({Other Web URL}).using(AssignFrom(sp.web));

// Create a new instance of Queryable using other credentials?
const spWebB = spfi({Other Web URL}).using(SPDefault(this.context));

```
