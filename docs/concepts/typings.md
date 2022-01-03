# Typing Return Objects

Whenever you make a request of the library for data from an object and utilize the `select` method to reduce the size of the objects in the payload its preferable in Typescript to be able to type that returned object. The library provides you a method to do so by using TypeScript's Generics declaration.

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
