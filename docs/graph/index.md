# @pnp/graph

[![npm version](https://badge.fury.io/js/%40pnp%2Fgraph.svg)](https://badge.fury.io/js/%40pnp%2Fgraph)

This package contains the fluent api used to call the graph rest services.

## Getting Started

Install the library and required dependencies

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/graph --save`

Import the library into your application and access the root sp object

```TypeScript
import { graph } from "@pnp/graph";

(function main() {

    // here we will load the current web's properties
    graph.groups.get().then(g => {

        console.log(`Groups: ${JSON.stringify(g, null, 4)}`);
    });
})()
```

## Getting Started with SharePoint Framework

Install the library and required dependencies

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/graph --save`

Import the library into your application, update OnInit, and access the root sp object in render

```TypeScript
import { graph } from "@pnp/graph";

// ...

public onInit(): Promise<void> {

  return super.onInit().then(_ => {

    // other init code may be present

    graph.setup({
      spfxContext: this.context
    });
  });
}

// ...

public render(): void {

    // A simple loading message
    this.domElement.innerHTML = `Loading...`;

    // here we will load the current web's properties
    graph.groups.get().then(groups => {

        this.domElement.innerHTML = `Groups: <ul>${groups.map(g => `<li>${g.displayName}</li>`).join("")}</ul>`;
    });
}
```

## Getting Started on Nodejs

Install the library and required dependencies

`npm install @pnp/logging @pnp/common @pnp/odata @pnp/graph @pnp/nodejs --save`

Import the library into your application, setup the node client, make a request

```TypeScript
import { graph } from "@pnp/graph";
import { AdalFetchClient } from "@pnp/nodejs";

// do this once per page load
graph.setup({
    graph: {
        fetchClientFactory: () => {
            return new AdalFetchClient("{tenant}.onmicrosoft.com", "AAD Application Id", "AAD Application Secret");
        },
    },
});

// here we will load the groups information
graph.groups.get().then(g => {

    console.log(`Groups: ${JSON.stringify(g, null, 4)}`);
});
```

## UML
![Graphical UML diagram](../../documentation/img/pnpjs-graph-uml.svg)

Graphical UML diagram of @pnp/graph. Right-click the diagram and open in new tab if it is too small.
