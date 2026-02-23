# @pnp/graph/places

This module allows you to work with Exchange resources such as rooms and roomLists.

## IPlaces, Places, IPlace, Place, IRoom, Room, IRoomList, RoomList, IRoomLists, RoomLists

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Get all rooms in a Tenant

This example shows how to retrieve all rooms in a tenant

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/places";

const graph = graphfi(...);
const rooms = graph.places.rooms();
```
## Get all roomlists in a tenant

This example shows how to retrieve all roomlists in a tenant

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/places";

const graph = graphfi(...);
const roomLists = graph.places.roomlists();

```
## Get Rooms in room list

This example shows how to retrieve all rooms in a roomlist

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/places";

const graph = graphfi(...);
const roomsByList = await graph.places.roomLists.getById("05fb1ae2-6de6-4fa8-b852-fb0cf671b896").rooms();

```
## Get Place by Id

This example shows how to retrieve a place (room, roomlist) by id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/places";

const graph = graphfi(...);

const roomById = await graph.places.getById("05fb1ae2-6de6-4fa8-b852-fb0cf671b896")();

```
## Update a place 

This example shows how to update a place (room, roomlist)

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/places";

const graph = graphfi(...);

var updatedRoom = await graph.places.getById("05fb1ae2-6de6-4fa8-b852-fb0cf671b896").update(
  {
      '@odata.type': "microsoft.graph.room",
      "nickname": "Conf Room",
      "building": "1",
      "label": "100",
      "capacity": 50,
      "isWheelChairAccessible": false,
  });

```
