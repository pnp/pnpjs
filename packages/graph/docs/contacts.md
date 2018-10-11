# @pnp/graph/contacts

The ability to manage contacts and folders in Outlook is a capability introduced in version 1.2.2 of @pnp/graph. Through the methods described
you can add and edit both contacts and folders in a users Outlook.

## Get all of the Contacts

Using the contacts.get() you can get the users contacts from Outlook

```TypeScript
import { graph } from "@pnp/graph";

const contacts = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.get();

const contacts = await graph.me.contacts.get();

```

## Add a new Contact

Using the contacts.add() you can a add Contact to the users Outlook

```TypeScript
import { graph } from "@pnp/graph";

const addedContact = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.add('Pavel', 'Bansky', [<EmailAddress>{address: 'pavelb@fabrikam.onmicrosoft.com', name: 'Pavel Bansky' }], ['+1 732 555 0102']);

const addedContact = await graph.me.contacts.add('Pavel', 'Bansky', [<EmailAddress>{address: 'pavelb@fabrikam.onmicrosoft.com', name: 'Pavel Bansky' }], ['+1 732 555 0102']);

```

## Get Contact by Id

Using the contacts.getById() you can get one of the users Contacts in Outlook

```TypeScript
import { graph } from "@pnp/graph";

const contact = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.getById('userId');

const contact = await graph.me.contacts.getById('userId');

```
## Delete a Contact

Using the delete you can remove one of the users Contacts in Outlook

```TypeScript
import { graph } from "@pnp/graph";

const delContact = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.getById('userId').delete();

const delContact = await graph.me.contacts.getById('userId').delete();

```

## Update a Contact

Using the update you can update one of the users Contacts in Outlook

```TypeScript
import { graph } from "@pnp/graph";

const updContact = await graph.users.getById('user@tenant.onmicrosoft.com').contacts.getById('userId').update({birthday: "1986-05-30" });

const updContact = await graph.me.contacts.getById('userId').update({birthday: "1986-05-30" });

```

## Get all of the Contact Folders

Using the contactFolders.get() you can get the users Contact Folders from Outlook

```TypeScript
import { graph } from "@pnp/graph";

const contactFolders = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.get();

const contactFolders = await graph.me.contactFolders.get();

```

## Add a new Contact Folder

Using the contactFolders.add() you can a add Contact Folder to the users Outlook

```TypeScript
import { graph } from "@pnp/graph";

const addedContactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.add('displayName', '<ParentFolderId>');

const addedContactFolder = await graph.me.contactFolders.contactFolders.add('displayName', '<ParentFolderId>');

```

## Get Contact Folder by Id

Using the contactFolders.getById() you can get one of the users Contact Folders in Outlook

```TypeScript
import { graph } from "@pnp/graph";

const contactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById('folderId');

const contactFolder = await graph.me.contactFolders.getById('folderId');

```
## Delete a Contact Folder

Using the delete you can remove one of the users Contact Folders in Outlook

```TypeScript
import { graph } from "@pnp/graph";

const delContactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById('folderId').delete();

const delContactFolder = await graph.me.contactFolders.getById('folderId').delete();

```

## Update a Contact Folder

Using the update you can update one of the users Contact Folders in Outlook

```TypeScript
import { graph } from "@pnp/graph";

const updContactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById('userId').update({displayName: "value" });

const updContactFolder = await graph.me.contactFolders.getById('userId').update({displayName: "value" });

```

## Get all of the Contacts from the Contact Folder

Using the contacts.get() in the Contact Folder gets the users Contact from the folder.

```TypeScript
import { graph } from "@pnp/graph";

const contactsInContactFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById('folderId').contacts.get();

const contactsInContactFolder = await graph.me.contactFolders.getById('folderId').contacts.get();

```

## Get Child Folders of the Contact Folder

Using the childFolders.get() you can get the Child Folders of the current Contact Folder from Outlook

```TypeScript
import { graph } from "@pnp/graph";

const childFolders = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById('<id>').childFolders.get();

const childFolders = await graph.me.contactFolders.getById('<id>').childFolders.get();

```

## Add a new Child Folder

Using the childFolders.add() you can a add Child Folder in a Contact Folder

```TypeScript
import { graph } from "@pnp/graph";

const addedChildFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById('<id>').childFolders.add('displayName', '<ParentFolderId>');

const addedChildFolder = await graph.me.contactFolders.getById('<id>').childFolders.add('displayName', '<ParentFolderId>');

```

## Get Child Folder by Id

Using the childFolders.getById() you can get one of the users Child Folders in Outlook

```TypeScript
import { graph } from "@pnp/graph";

const childFolder = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById('<id>').childFolders.getById('folderId');

const childFolder = await graph.me.contactFolders.getById('<id>').childFolders.getById('folderId');

```

## Add Contact in Child Folder of Contact Folder
Using contacts.add in the Child Folder of a Contact Folder, adds a new Contact to that folder

```TypeScript
import { graph } from "@pnp/graph";

const addedContact = await graph.users.getById('user@tenant.onmicrosoft.com').contactFolders.getById('<id>').childFolders.getById('folderId').contacts.add('Pavel', 'Bansky', [<EmailAddress>{address: 'pavelb@fabrikam.onmicrosoft.com', name: 'Pavel Bansky' }], ['+1 732 555 0102']);

const addedContact = await graph.me.contactFolders.getById('<id>').childFolders.getById('folderId').contacts.add('Pavel', 'Bansky', [<EmailAddress>{address: 'pavelb@fabrikam.onmicrosoft.com', name: 'Pavel Bansky' }], ['+1 732 555 0102']);

```

