import { ISPQueryable, _SPQueryable, spPost } from "../spqueryable.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { headers, body } from "@pnp/queryable";
import { combine } from "@pnp/core";

export class _ThemeManager extends _SPQueryable {

    constructor(base: string | ISPQueryable, methodName = "") {
        super(base);
        this._url = combine(extractWebUrl(this._url), `_api/thememanager/${methodName}`);
    }

    public run<T>(props: any): Promise<T> {
        return spPost<T>(this, body(props, headers({ "Content-Type": "application/json;charset=utf-8" })));
    }

    /**
     * Gets the current tenant theming options including available themes
     *
     * @returns Tenant theming options
     */
    public getTenantThemingOptions(): Promise<ITenantThemingOptions> {
        return ThemeManagerCloneFactory(this, "GetTenantThemingOptions").run<ITenantThemingOptions>({});
    }

    /**
     * Adds a new tenant theme
     *
     * @param name The name of the theme
     * @param themeJson The theme definition as a JSON object containing the palette
     * @returns True if the theme was added successfully
     */
    public addTenantTheme(name: string, themeJson: IThemeJson | string): Promise<boolean> {
        const themeJsonString = typeof themeJson === "string" ? themeJson : JSON.stringify(themeJson);
        return ThemeManagerCloneFactory(this, "AddTenantTheme").run<boolean>({ name, themeJson: themeJsonString });
    }

    /**
     * Deletes a tenant theme by name
     *
     * @param name The name of the theme to delete
     */
    public deleteTenantTheme(name: string): Promise<void> {
        return ThemeManagerCloneFactory(this, "DeleteTenantTheme").run<void>({ name });
    }

    /**
     * Updates an existing tenant theme
     *
     * @param name The name of the theme to update
     * @param themeJson The updated theme definition as a JSON object containing the palette
     * @returns True if the theme was updated successfully
     */
    public updateTenantTheme(name: string, themeJson: IThemeJson | string): Promise<boolean> {
        const themeJsonString = typeof themeJson === "string" ? themeJson : JSON.stringify(themeJson);
        return ThemeManagerCloneFactory(this, "UpdateTenantTheme").run<boolean>({ name, themeJson: themeJsonString });
    }

    /**
     * Applies a theme to the current web
     *
     * @param name The name of the theme
     * @param themeJson The theme definition as a JSON object containing the palette
     */
    public applyTheme(name: string, themeJson: IThemeJson | string): Promise<void> {
        const themeJsonString = typeof themeJson === "string" ? themeJson : JSON.stringify(themeJson);
        return ThemeManagerCloneFactory(this, "ApplyTheme").run<void>({ name, themeJson: themeJsonString });
    }
}
export interface IThemeManager extends _ThemeManager { }
export const ThemeManager = (base: ISPQueryable | string, methodName?: string): IThemeManager => new _ThemeManager(base, methodName);

type ThemeManagerCloneType = IThemeManager & ISPQueryable & { run<T>(props: any): Promise<T> };
const ThemeManagerCloneFactory = (baseUrl: string | ISPQueryable, methodName = ""): ThemeManagerCloneType => <any>ThemeManager(baseUrl, methodName);

/**
 * RGBA color format used by SharePoint theming
 */
export interface IRGBAColor {
    R: number;
    G: number;
    B: number;
    A: number;
}

/**
 * Theme color - can be hex string (e.g. "#0078d4") or RGBA object
 */
export type ThemeColor = string | IRGBAColor;

/**
 * Theme palette containing all color slots
 */
export interface IThemePalette {
    themePrimary: ThemeColor;
    themeLighterAlt: ThemeColor;
    themeLighter: ThemeColor;
    themeLight: ThemeColor;
    themeTertiary: ThemeColor;
    themeSecondary: ThemeColor;
    themeDarkAlt: ThemeColor;
    themeDark: ThemeColor;
    themeDarker: ThemeColor;
    neutralLighterAlt: ThemeColor;
    neutralLighter: ThemeColor;
    neutralLight: ThemeColor;
    neutralQuaternaryAlt: ThemeColor;
    neutralQuaternary: ThemeColor;
    neutralTertiaryAlt: ThemeColor;
    neutralTertiary: ThemeColor;
    neutralSecondaryAlt?: ThemeColor;
    neutralSecondary: ThemeColor;
    neutralPrimaryAlt: ThemeColor;
    neutralPrimary: ThemeColor;
    neutralDark: ThemeColor;
    black: ThemeColor;
    white: ThemeColor;
    primaryBackground?: ThemeColor;
    primaryText?: ThemeColor;
    backgroundColor?: ThemeColor;
    error?: ThemeColor;
    disabledBackground?: ThemeColor;
    disabledText?: ThemeColor;
}

/**
 * Color pair used in secondary colors configuration
 */
export interface IThemeColorPair {
    themePrimary: IRGBAColor;
    backgroundColor: IRGBAColor;
}

/**
 * Theme JSON structure for the themeJson parameter
 */
export interface IThemeJson {
    /**
     * The palette containing all theme colors
     */
    palette: IThemePalette;
    /**
     * Optional background image URI
     */
    backgroundImageUri?: string;
    /**
     * Cache token for the theme
     */
    cacheToken?: string;
    /**
     * Whether this is the default theme
     */
    isDefault?: boolean;
    /**
     * Whether the theme is inverted (dark theme)
     */
    isInverted?: boolean;
    /**
     * Theme version
     */
    version?: string;
    /**
     * Display mode - "light" or "dark"
     */
    displayMode?: "light" | "dark";
    /**
     * Secondary color configurations for light and dark modes
     */
    secondaryColors?: {
        light: IThemeColorPair[];
        dark: IThemeColorPair[];
    };
    /**
     * Alternate mode palette configuration
     */
    otherMode?: {
        palette: IThemePalette;
        isInverted: boolean;
        displayMode: string;
    };
    /**
     * Theme schema version
     */
    themeSchemaVersion?: string;
}

/**
 * Theme information returned from GetTenantThemingOptions
 */
export interface IThemeInfo {
    /**
     * The name of the theme
     */
    name: string;
    /**
     * The theme JSON definition
     */
    themeJson: string;
}

/**
 * Tenant theming options returned from GetTenantThemingOptions
 */
export interface ITenantThemingOptions {
    /**
     * Whether default themes are hidden
     */
    hideDefaultThemes: boolean;
    /**
     * List of custom themes available in the tenant
     */
    themePreviews: IThemeInfo[];
}
