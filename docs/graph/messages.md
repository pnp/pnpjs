# Graph Messages (Mail)

More information can be found in the official Graph documentation:

- [Message Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/message?view=graph-rest-1.0)

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get User's Messages

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/messages";

const graph = graphfi(...);

const currentUser = graph.me;
const messages = await currentUser.messages();
```
