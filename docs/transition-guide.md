# Transition Guide

It is our hope that the transition from version 2.\* to 3.\* will be as painless as possible, however given the transition we have made from a global sp object to an instance based object some architectural and inital setup changes will need to be addressed. In the following sections we endevor to provide an overview of what changes will be required. If we missed something, please let us know in the issues list so we can update the guide. Thanks!

For a full, detailed list of what's been added, updated, and removed please see our [CHANGELOG](https://github.com/pnp/pnpjs/blob/main/CHANGELOG.md)

For a full sample project, utilizing SPFx 1.14 and V3 that showcases some of the more dramatic changes to the library check out this [sample](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-pnp-js-sample).

## Benefits and Advancements in V3

For version 2 the core themes were selective imports, a model based on factory functions & interfaces, and improving the docs. This foundation gave us the opportunity to re-write the entire request pipeline internals with minimal external library changes - showing a bit of long-term planning 🙂. With version 3 your required updates are likely to only affect the initial configuration of the library, a huge accomplishment when updating the entire internals.

Our request pipeline remained largely unchanged since it was first written ~5 years ago, hard to change something so central to the library. The advantage of this update it is now easy for developers to inject their own logic into the request process. As always, this work was based on feedback over the years and understanding how we can be a better library. The new observer design allows you to customize every aspect of the request, in a much clearer way than was previously possible. In addition this work greatly reduced internal boilerplate code and optimized for library size. We reduced the size of sp & graph libraries by almost 2/3. As well we embraced a fully async design built around the new [Timeline](core/timeline.md). Check out the new model around authoring [observers](core/observers.md) and understand how they relate to [moments](core/moments.md). We feel this new architecture will allow far greater flexibility for consumers of the library to customize the behavior to exactly meet their needs.

We also used this as an opportunity to remove duplicate methods, clean up and improve our typings & method signatures, and drop legacy methods. Be sure to review the [changelog](https://github.com/pnp/pnpjs/blob/version-3/CHANGELOG.md). As always we do our best to minimize breaking changes but major versions are breaking versions.

We thank you for using the library. Your continued feedback drives these improvements, and we look forward to seeing what you build!

## Global vs Instance Architecture

The biggest change in version 3 of the library is the movement away from the globally defined sp and graph objects. Starting in version 2.1.0 we added the concept of `Isolated Runtime` which allowed you to create a separate instance of the global object that would have a separate configuration. We found that the implementation was finicky and prone to issues, so we have rebuilt the internals of the library from the ground up to better address this need. In doing so, we decided not to offer a global object at all.

Because of this change, any architecture that relies on the `sp` or `graph` objects being configured during initialization and then reused throughout the solution will need to be rethought. Essentially you have three options:

1. Create a new `spfi`/`graphfi` object wherever it's required.
1. Create a [service architecture](../getting-started/#establish-context-within-an-spfx-service) that can return a previously configured instance or utilize an instance and return the results
1. Utilize a [Project Preset file](./concepts/project-preset.md).

In other words, the `sp` and `graph` objects have been deprecated and will need to be replaced.

For more information on getting started with these new setup methods please see the [Getting Started](./getting-started.md) docs for a deeper look into the Queryable interface see [Queryable](./queryable/queryable.md).

## AssignFrom and CopyFrom

With the new Querable instance architecture we have provided a way to branch from one instance to another. To do this we provide two methods: AssignFrom and CopyFrom. These methods can be helpful when you want to establish a new instance to which you might apply other behaviors but want to reuse the configuration from a source. To learn more about them check out the [Core/Behaviors](./core/behaviors.md) documentation.

## Dropping ".get()"

If you are still using the `queryableInstance.get()` method of queryable you must replace it with a direct invoke call `queryableInstance()`.

## Batching

Another benefit of the new updated internals is a significantly streamlined and simplified process for batching requests. Essentially, the interface for SP and Graph now function the same.

A new module called "batching" will need to be imported which then provides the batched interface which will return a tuple with a new Querable instance and an execute function. To see more details check out [Batching](./concepts/batching.md).

## Web -> SPFI

In V2, to connect to a different web you would use the function

```TypeScript
const web = Web({Other Web URL});
```

In V3 you would create a new instance of queryable connecting to the web of your choice. This new method provides you significantly more flexibility by not only allowing you to easily connect to other webs in the same tenant but also to webs in other tenants.

We are seeing a significant number of people report an error when using this method:

`No observers registered for this request.`

which results when it hasn't been updated to use the version 3 convention. Please see the examples below to pick the one that most suits your codebase.

```TypeScript
import { spfi, SPFx } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";

const spWebA = spfi().using(SPFx(this.context));

// Easiest transition is to use the tuple pattern and the Web constructor which will copy all the observers from the object but set the url to the one provided
const spWebE = Web([spWebA.web, "{Absolute URL of Other Web}"]);

// Create a new instance of Queryable
const spWebB = spfi("{Other Web URL}").using(SPFx(this.context));

// Copy/Assign a new instance of Queryable using the existing
const spWebC = spfi("{Other Web URL}").using(AssignFrom(sp.web));

// Create a new instance of Queryable using other credentials?
const spWebD = spfi("{Other Web URL}").using(SPFx(this.context));

```

Please see the documentation for more information on the updated [Web constructor](./sp/webs.md).

## Dropping -Commonjs Packages

Starting with v3 we are dropping the commonjs versions of all packages. Previously we released these as we worked to transition to esm and the current node didn't yet support esm. With esm now a supported module type, and having done the work to ensure they work in node we feel it is a good time to drop the -commonjs variants. Please see documentation on [Getting started with NodeJS Project using TypeScript producing CommonJS modules](getting-started.md#node-project-using-typescript-producing-commonjs-modules)
