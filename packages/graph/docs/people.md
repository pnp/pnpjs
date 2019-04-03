# @pnp/graph/people

The ability to retrieve a list of person objects ordered by their relevance to the user, which is determined by the user's communication and collaboration patterns, and business relationships.

## Get all of the people

Using the people.get() you can retrieve a list of person objects ordered by their relevance to the user.

```TypeScript
import { graph } from "@pnp/graph";

const people = await graph.users.getById('user@tenant.onmicrosoft.com').people.get();

const people = await graph.me.people.get();

```
