# Workaround for on-premises SPFx TypeScript Version (SharePoint 2016 or 2019)

_Note this article applies to version 1.4.1 SharePoint Framework projects targeting on-premises only._

When using the Yeoman generator to create a SharePoint Framework 1.4.1 project targeting on-premises it installs TypeScript version 2.2.2 (SP2016) or 2.4.2/2.4.1 (SP2019). Unfortunately this library relies on 3.6.4 or later due to extensive use of default values for generic type parameters in the libraries. To work around this limitation you can follow the steps in this article.

```bash
npm i
npm i -g rimraf # used to remove the node_modules folder (much better/faster)
```

1. Ensure that the **@pnp/sp** package is already installed `npm i @pnp/sp`
1. Remove the package-lock.json file & node_modules `rimraf node_modules` folder and execute `npm install`
1. Open package-lock.json from the root folder
1. Search for `"typescript"` or similar with version 2.4.1 (SP2019) 2.2.2 (SP2016)
1. Replace "2.4.1" or "2.2.2" with "3.6.4"
1. Search for the next `"typescript"` occurrence and replace the block with:

   ```JSON
    "typescript": {
      "version": "3.6.4",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-3.6.4.tgz",
      "integrity": "sha512-unoCll1+l+YK4i4F8f22TaNVPRHcD9PA3yCuZ8g5e0qGqlVlJ/8FSateOLLSagn+Yg5+ZwuPkL8LFUc0Jcvksg==",
      "dev": true
    }
   ```

1. Remove node_modules folder `rimraf node_modules`
1. Run `npm install`
