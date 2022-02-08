# Invokables

For people who have been using the library since the early days you are familiar with the need to use the `()` method to invoke a method chain: Starting with v3 this is no longer possible, you must invoke the object directly to execute the default action for that class:

```TypeScript
const lists = await sp.web.lists();
```
