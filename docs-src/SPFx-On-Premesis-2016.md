# Workaround for SPFx TypeScript Version

_Note this article applies to version 1.4.1 SharePoint Framework projects targetting on-premesis only._

When using the Yeoman generator to create a SharePoint Framework 1.4.1 project targeting on-premesis it installs TypeScript version 2.2.2. Unfortunately this library relies on 2.4.2 or later due to extensive use of default values for generic type parameters in the libraries. To work around this limitation you can follow the steps in this article.

1. Open package-lock.json
2. Search for `"typescript": "2.2.2"`
3. Replace "2.2.2" with "2.4.2"
4. Search for the next "typescript" occurance and replace the block with:
```JSON
"typescript": {
  "version": "2.4.2",
  "resolved": "https://registry.npmjs.org/typescript/-/typescript-2.4.2.tgz",
  "integrity": "sha1-+DlfhdRZJ2BnyYiqQYN6j4KHCEQ=",
  "dev": true
}
```

![Replacement blocks highlighted](img/SPFx-On-Premesis-2016-1.png)

5. Remove node_modules folder `rm -rf node_modules/`
6. Run `npm install`


This can be checked with:

```
npm list typescript
```

```
+-- @microsoft/sp-build-web@1.1.0
| `-- @microsoft/gulp-core-build-typescript@3.1.1
|   +-- @microsoft/api-extractor@2.3.8
|   | `-- typescript@2.4.2
|   `-- typescript@2.4.2
```
