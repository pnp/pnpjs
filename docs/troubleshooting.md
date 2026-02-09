# Troubleshooting

This guide covers common issues you may encounter when using PnPjs and how to resolve them.

## Authentication Errors

### 401 Unauthorized

**Symptoms:** Requests fail with a 401 status code.

**Common Causes:**
- Missing or expired access token
- Incorrect API permissions in Azure AD app registration
- Using the wrong authentication method for your environment

**Solutions:**
1. Verify your Azure AD app registration has the correct API permissions (and admin consent if required)
2. Check that your token scopes match the API you're calling:
   - SharePoint: `https://{tenant}.sharepoint.com/.default`
   - Graph: `https://graph.microsoft.com/.default`
3. In SPFx, ensure you're passing `this.context` to the `SPFx` behavior

### 403 Forbidden

**Symptoms:** Requests fail with a 403 status code.

**Common Causes:**
- User lacks permissions to the resource
- App-only permissions not configured correctly
- Attempting to access a resource that requires elevated permissions

**Solutions:**
1. Verify the user/app has appropriate permissions on the SharePoint site or resource
2. For app-only access, ensure the Azure AD app has the correct application permissions (not just delegated)
3. Check if the site has unique permissions that might block access

## Module/Import Errors

### "Module not found" in Node.js

**Symptoms:** Error like `Cannot find module '@pnp/sp/webs'`

**Cause:** Node.js ESM resolution requires the full path including `index.js` for sub-module imports.

**Solution:** Add `index.js` to your selective imports:

```typescript
// ❌ Incorrect
import "@pnp/sp/webs";

// ✅ Correct for Node.js
import "@pnp/sp/webs/index.js";
```

> Note: Root imports like `import { spfi } from "@pnp/sp"` work without modification.

### TypeScript Type Errors with Selective Imports

**Symptoms:** TypeScript shows errors for missing properties on `sp.web` or similar.

**Cause:** Selective imports only add functionality when the module is imported.

**Solution:** Import both the module and its types:

```typescript
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { IList } from "@pnp/sp/lists";
```

## CORS Errors

### CORS Error in Browser Applications

**Symptoms:** Browser console shows "Access-Control-Allow-Origin" errors.

**Common Causes:**
- Running a standalone SPA trying to call SharePoint directly
- Missing or incorrect CORS configuration

**Solutions:**
1. **For SPFx:** Use the `SPFx` behavior which handles authentication via the framework
2. **For standalone SPAs:** Use `@pnp/msaljsclient` with proper Azure AD app registration configured for SPA redirect URIs
3. **For local development:** Consider using a proxy or the SharePoint workbench

## Common Runtime Errors

### "sp.web is not a function" or "Cannot read property 'web' of undefined"

**Cause:** The `spfi()` factory wasn't configured with behaviors, or selective imports are missing.

**Solution:**

```typescript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs"; // Don't forget this!

// Must configure with behaviors
const sp = spfi().using(SPFx(this.context));

// Now sp.web will work
const web = await sp.web();
```

### "Cannot call spfi() multiple times" or stale context issues

**Cause:** Creating new `spfi()` instances in event handlers or render methods.

**Solution:** Initialize once in `onInit` or use a [project config file](./concepts/project-preset.md):

```typescript
// ❌ Wrong - creates new instance on every click
async onClick() {
    const sp = spfi().using(SPFx(this.context));
    const items = await sp.web.lists.getByTitle("Tasks").items();
}

// ✅ Correct - initialize once, reuse
private sp: SPFI;

onInit() {
    this.sp = spfi().using(SPFx(this.context));
}

async onClick() {
    const items = await this.sp.web.lists.getByTitle("Tasks").items();
}
```

## Batching Issues

### Batch requests failing or returning unexpected results

**Cause:** Mixing `await` with batched calls stops execution before the batch executes.

**Solution:** Use `.then()` syntax for batched calls:

```typescript
const [batchedSP, execute] = sp.batched();

// ❌ Wrong - this will hang
const web = await batchedSP.web();

// ✅ Correct - use .then()
let webResult;
batchedSP.web().then(r => webResult = r);

await execute();
console.log(webResult);
```

## Getting Help

If you're still stuck:

1. Search [existing issues](https://github.com/pnp/pnpjs/issues) on GitHub
2. Open a [new issue](https://github.com/pnp/pnpjs/issues/new) with:
   - PnPjs version
   - Environment (SPFx version, Node.js version, browser)
   - Minimal code to reproduce the issue
   - Full error message and stack trace
