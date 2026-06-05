# @pnp/sp/thememanager

The ThemeManager API allows you to manage tenant themes in SharePoint Online. You can add, update, delete, and apply custom themes to your SharePoint sites.
Check out [SharePoint site theming: REST API](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/site-theming/sharepoint-site-theming-rest-api) for more information.

## Theme Manager

[![Selective Imports Banner](https://img.shields.io/badge/Selective%20Imports-informational.svg)](../concepts/selective-imports.md)

## Get tenant theming options

Retrieves the current tenant theming configuration, including the list of available custom themes.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/thememanager";

const sp = spfi(...);

const options = await sp.themeManager.getTenantThemingOptions();

console.log(`Hide default themes: ${options.hideDefaultThemes}`);
console.log(`Custom themes: ${options.themePreviews.length}`);
```

## Add a new tenant theme

Creates a new custom theme available across the tenant.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/thememanager";

const sp = spfi(...);

// Using hex color strings (simple format)
const result = await sp.themeManager.addTenantTheme("My Custom Theme", {
    palette: {
        themePrimary: "#0078d4",
        themeLighterAlt: "#eff6fc",
        themeLighter: "#deecf9",
        themeLight: "#c7e0f4",
        themeTertiary: "#71afe5",
        themeSecondary: "#2b88d8",
        themeDarkAlt: "#106ebe",
        themeDark: "#005a9e",
        themeDarker: "#004578",
        neutralLighterAlt: "#faf9f8",
        neutralLighter: "#f3f2f1",
        neutralLight: "#edebe9",
        neutralQuaternaryAlt: "#e1dfdd",
        neutralQuaternary: "#d0d0d0",
        neutralTertiaryAlt: "#c8c6c4",
        neutralTertiary: "#a19f9d",
        neutralSecondary: "#605e5c",
        neutralPrimaryAlt: "#3b3a39",
        neutralPrimary: "#323130",
        neutralDark: "#201f1e",
        black: "#000000",
        white: "#ffffff",
    }
});

console.log(`Theme added: ${result}`);
```

## Update an existing tenant theme

Updates the palette of an existing custom theme.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/thememanager";

const sp = spfi(...);

const result = await sp.themeManager.updateTenantTheme("My Custom Theme", {
    palette: {
        themePrimary: "#107c10",  // Changed to green
        themeLighterAlt: "#f0fff0",
        // ... rest of palette colors
    }
});

console.log(`Theme updated: ${result}`);
```

## Delete a tenant theme

Removes a custom theme from the tenant.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/thememanager";

const sp = spfi(...);

await sp.themeManager.deleteTenantTheme("My Custom Theme");
```

## Apply a theme to the current web

Applies a theme to the site where the request is made.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/thememanager";

const sp = spfi(...);

await sp.themeManager.applyTheme("My Custom Theme", {
    palette: {
        themePrimary: "#0078d4",
        themeLighterAlt: "#eff6fc",
        themeLighter: "#deecf9",
        themeLight: "#c7e0f4",
        themeTertiary: "#71afe5",
        themeSecondary: "#2b88d8",
        themeDarkAlt: "#106ebe",
        themeDark: "#005a9e",
        themeDarker: "#004578",
        neutralLighterAlt: "#faf9f8",
        neutralLighter: "#f3f2f1",
        neutralLight: "#edebe9",
        neutralQuaternaryAlt: "#e1dfdd",
        neutralQuaternary: "#d0d0d0",
        neutralTertiaryAlt: "#c8c6c4",
        neutralTertiary: "#a19f9d",
        neutralSecondary: "#605e5c",
        neutralPrimaryAlt: "#3b3a39",
        neutralPrimary: "#323130",
        neutralDark: "#201f1e",
        black: "#000000",
        white: "#ffffff",
    }
});
```

## Using RGBA color format

SharePoint also supports colors in RGBA object format for full fidelity with advanced theme properties.

```TypeScript
import { spfi } from "@pnp/sp";
import "@pnp/sp/thememanager";
import { IRGBAColor } from "@pnp/sp/thememanager";

const sp = spfi(...);

// Using RGBA color objects
await sp.themeManager.addTenantTheme("Dark Theme", {
    palette: {
        themePrimary: { R: 82, G: 159, B: 241, A: 255 },
        themeLighterAlt: { R: 3, G: 6, B: 10, A: 255 },
        // ... other colors in RGBA format
    },
    isInverted: true,
    displayMode: "dark"
});
```

## Theme Palette Properties

The theme palette supports the following color slots:

| Property | Description |
|----------|-------------|
| themePrimary | Primary theme color |
| themeLighterAlt | Lightest shade of the theme color |
| themeLighter | Lighter shade of the theme color |
| themeLight | Light shade of the theme color |
| themeTertiary | Tertiary theme color |
| themeSecondary | Secondary theme color |
| themeDarkAlt | Darker alternate theme color |
| themeDark | Dark theme color |
| themeDarker | Darkest theme color |
| neutralLighterAlt | Lightest neutral color |
| neutralLighter | Lighter neutral color |
| neutralLight | Light neutral color |
| neutralQuaternaryAlt | Quaternary alternate neutral |
| neutralQuaternary | Quaternary neutral |
| neutralTertiaryAlt | Tertiary alternate neutral |
| neutralTertiary | Tertiary neutral color |
| neutralSecondary | Secondary neutral color |
| neutralPrimaryAlt | Primary alternate neutral |
| neutralPrimary | Primary neutral color |
| neutralDark | Dark neutral color |
| black | Black color |
| white | White/background color |

For generating theme palettes, use the [Fluent UI Theme Designer](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/).
