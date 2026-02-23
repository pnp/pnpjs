# Typing Return Objects

Whenever you make a request of the library for data from an object and utilize the `select` method to reduce the size of the objects in the payload its preferable in TypeScript to be able to type that returned object. The library provides you a method to do so by using TypeScript's Generics declaration.

By defining the objects type in the <> after the closure of the select method the resulting object is typed.

```TypesScript
  .select("Title")<{Title: string}>()
```

Below are some examples of typing the return payload:

```TypeScript
  const _sp = spfi().using(SPFx(this.context));

  //Typing the Title property of a field
  const field = await _sp.site.rootWeb.fields.getById(titleFieldId).select("Title")<{ Title: string }>();
            
  //Typing the ParentWebUrl property of the selected list.
  const testList = await _sp.web.lists.getByTitle('MyList').select("ParentWebUrl")<{ ParentWebUrl: string }>();
```

> There have been discussions in the past around auto-typing based on select and the expected properties of the return object. We haven't done so for a few reasons: there is no even mildly complex way to account for all the possibilities expand introduces to selects, and if we "ignore" expand it effectively makes the select typings back to "any". Looking at template types etc, we haven't yet seen a way to do this that makes it worth the effort and doesn't introduce some other limitation or confusion.
