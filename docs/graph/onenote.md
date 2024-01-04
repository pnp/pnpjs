# Graph OneNote (Notes)
Provides capabilities of working with OneNote files.

Most of the following methods are available on users, groups, and sites. There may be exceptions, so please refer to the link below for more information. Most of the samples here will be using the .me endpoint for reference.

More information can be found in the official Graph documentation:

- [OneNote Resource Type](https://docs.microsoft.com/en-us/graph/api/resources/onenote-api-overview?view=graph-rest-1.0)


## Notebook, INoteBook, Notebooks, INotebooks, OneNote, IOneNote, Page, IPage, Pages, IPages, Section, ISection, Sections, ISections, Resources, IResources
[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)  

## Notebooks

### Get Users Notebooks
Retrieves a list of notebooks for a user.
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const notebooks = await graph.me.onenote.notebooks()
```
### Get Group Notebooks
Retrieves a list of notebooks for a group
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const notebooks = await graph.groups.getById('3dfbeaa7-a097-4032-8965-cd387a79537f').onenote.notebooks()
```
### Get Site Notebooks
Retrieves a list of notebooks for a site
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/sites";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const notebooks = await graph.sites.getById('contoso.sharepoint.com,91dd2418-8fb9-4e0e-919d-c1b31e938386,285cc5a1-cf50-4e4d-8d93-5ba5a8e76e01').onenote.notebooks()
```
### Get User's most recent Notebooks
Retrieves the most recent notebooks for the logged in user. Not available on Sites or Groups.
```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const notebooks = await graph.me.onenote.notebooks.recent();
```
### Create a Notebook
Create a new new notebook

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const userNotebookAdd = await graph.me.onenote.notebooks.add("New Notebook");

```
### Get a Notebook
Retrieve the properties of a notebook by id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const noteBook = await graph.me.onenote.notebooks.getById('eddc09e2-2d4f-4ca3-aadb-89e9a7305d83')();

```
### Copy a Notebook
Copies a notebook to the Notebooks folder in the Documents library of a User or Group. The folder is created if it doesn't exist.

Available for Users and Groups (not Sites).

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

// copy user notebook
const copyOperation = await graph.me.onenote.notebooks.getById('eddc09e2-2d4f-4ca3-aadb-89e9a7305d83').copy({renameAs: "New Notebook Name"});

```
## Sections
### List sections in OneNote
Retrieves a list of OneNote section objects

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const sections = await graph.me.onenote.sections();

```
### List sections in a Notebook
Retrieve a list of section objects from specified notebook

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const sections = await graph.me.onenote.notebooks.getById('eddc09e2-2d4f-4ca3-aadb-89e9a7305d83').sections();

```
### Get a Section
Retrieve a specified Section

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const section = await graph.me.onenote.sections.getById('107542cd-a4da-4bf6-8afc-5cbeb3f9a517')();

```

### Create a new section in a Notebook
Creates a new section in a specified notebook

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const section = await graph.me.onenote.notebooks.getById('eddc09e2-2d4f-4ca3-aadb-89e9a7305d83').sections.add("New Section");

```
### Copy a section to a Notebook
Copies a section to a specified notebook.
For Copy operations, you follow an asynchronous calling pattern: First call the Copy action, and then poll the operation endpoint for the result.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const notebookIdToCopyTo = '1742ad48-23cb-4106-b8ab-8e214283d61a';

const copyOperation = await graph.me.onenote.sections.getById('107542cd-a4da-4bf6-8afc-5cbeb3f9a517').copyToNotebook({id:notebookIdToCopyTo, renameAs:'New Section' });

```
### Copy a section to a Section Group
Copies a section to a specified Section Group.
For Copy operations, you follow an asynchronous calling pattern: First call the Copy action, and then poll the operation endpoint for the result.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const sectionGroupToCopyTo = 'ea12ea17-ac6c-478b-bb6c-76fde6142892';

const copyOperation = await graph.me.onenote.sections.getById('107542cd-a4da-4bf6-8afc-5cbeb3f9a517').copyToSectionGroup({id:sectionGroupToCopyTo, renameAs:'New Section' });

```

## Section Groups
### List section groups
Retrieves a list of OneNote sectionGroup objects

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const sectionGroups = await graph.me.onenote.sectionsGroups();

```
### List section groups in a Notebook
Retrieves a list of OneNote sectionGroup objects

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const sectionGroups = await graph.me.onenote.notebooks.getById('eddc09e2-2d4f-4ca3-aadb-89e9a7305d83').sectionsGroups();

```
### Get a Section Group
Retrieves a section group by id

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const sectionGroup = await graph.me.onenote.sectionsGroups.getById('15ef5f24-ca07-4d74-80c9-a4b7cb1cd7a4')();

```
### Create a Section Group in a Notebook
Creates a new Section Group in a specified Notebook

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const section = await graph.me.onenote.notebooks.getById('eddc09e2-2d4f-4ca3-aadb-89e9a7305d83').sections.add('New Section Group');

```
### List Sections in a Section Group
Retrieves a list of sections in a specified Section Group

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const sections = await graph.me.onenote.sectionGroups.getById('15ef5f24-ca07-4d74-80c9-a4b7cb1cd7a4').sections();

```
### Create a Section in a Section Group
Creates a new section in a specified Section Group

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const section = await graph.me.onenote.sectionGroups.getById('15ef5f24-ca07-4d74-80c9-a4b7cb1cd7a4').sections.add("New Section");

```
## Pages
### List Pages in default OneNote
Retrieves a list of OneNote page objects

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const pages = await graph.me.onenote.pages();

```
### List Pages in a Section
Retrieves a list of OneNote pages in a specified Section

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const pages = await graph.me.onenote.sections.getById('107542cd-a4da-4bf6-8afc-5cbeb3f9a517').pages();

```

### Get a Page
Retrieve a specified Page

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const page = await graph.me.onenote.pages.getById('107542cd-a4da-4bf6-8afc-5cbeb3f9a517')();

```
### Get Contents of a Page
Retrieves HTML content from a specified page. 

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const pageHtml = await graph.me.onenote.pages.getById('107542cd-a4da-4bf6-8afc-5cbeb3f9a517').content();

```

### Create a page
Create a new OneNote page in the default section of the default notebook.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

 var pageData =`<!DOCTYPE html>
    <!DOCTYPE html>
        <html>
            <head>
            <title>A page with <i>rendered</i> images and an <b>attached</b> file</title>
            <meta name="created" content="2015-07-22T09:00:00-08:00" />
            </head>
            <body>
            <p>Here's an image from an online source:</p>
            <img src="https://..." alt="an image on the page" width="500" />
            <p>Here's an image uploaded as binary data:</p>
            <img src="name:imageBlock1" alt="an image on the page" width="300" />
            <p>Here's a file attachment:</p>
            <object data-attachment="FileName.pdf" data="name:fileBlock1" type="application/pdf" />
            </body>
        </html>`;

const page = await graph.me.onenote.pages.add(pageData);

```
### Create a page in a Section
Create a new OneNote page in a specified section

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

 var pageData =`<!DOCTYPE html>
    <!DOCTYPE html>
        <html>
            <head>
            <title>A page with <i>rendered</i> images and an <b>attached</b> file</title>
            <meta name="created" content="2015-07-22T09:00:00-08:00" />
            </head>
            <body>
            <p>Here's an image from an online source:</p>
            <img src="https://..." alt="an image on the page" width="500" />
            <p>Here's an image uploaded as binary data:</p>
            <img src="name:imageBlock1" alt="an image on the page" width="300" />
            <p>Here's a file attachment:</p>
            <object data-attachment="FileName.pdf" data="name:fileBlock1" type="application/pdf" />
            </body>
        </html>`;

const page = await graph.me.onenote.sections.getById('107542cd-a4da-4bf6-8afc-5cbeb3f9a517').pages.add(pageData);

```
### Copy a page to a Section
Copy a page to specified section
For copy operations, you follow an asynchronous calling pattern: First call the Copy action, and then poll the operation endpoint for the result.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const sectionToCopyTo = 'ea12ea17-ac6c-478b-bb6c-76fde6142892';
await graph.me.onenote.pages.getById('6bd3eace-14a2-4859-8855-02724f3e4539').copyToSection({id:sectionToCopyTo, renameAs:'New Copied Page'});

```

### Update a page
Update the content of a OneNote page.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

const oneNotePageUpdate = await graph.me.onenote.pages.getById('6bd3eace-14a2-4859-8855-02724f3e4539').update(                      
    [
        {
        'target':'#para-id',
        'action':'Insert',
        'position':'Before',
        'content':'<img src="image-url-or-part-name" alt="image-alt-text" />'
    }, 
    {
        'target':'#list-id',
        'action':'Append',
        'content':'<li>new-page-content</li>'
    }
    ]
);

```
### Delete a page
Delete a OneNote page.

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

await graph.me.onenote.pages.getById('6bd3eace-14a2-4859-8855-02724f3e4539').delete()

```
## Resources
### Get a Resource
Retrieve the binary data of a file or image resource object. Returned as a Blob

```TypeScript
import { graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/onenote";

const graph = graphfi(...);

// Example of getting a resource
const resourceBlob = await graph.me.onenote.resources.getById('1-b2bce3f55b5d4864be426d7cce66b239!1-5137fae1-07eb-4383-bc8b-0c0c6cf0af39')();

```
