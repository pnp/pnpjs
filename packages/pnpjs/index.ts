import { Logger } from "@pnp/logging";
import {
    PnPClientStorage,
    dateAdd,
    combine,
    getCtxCallback,
    getRandomString,
    getGUID,
    isFunc,
    objectDefinedNotNull,
    isArray,
    assign,
    isUrlAbsolute,
    stringIsNullOrEmpty,
    sanitizeGuid,
} from "@pnp/common";
import { Settings } from "@pnp/config-store";
import { sp as _sp, SPRestAddIn } from "@pnp/sp-addinhelpers";
import { setup as _setup, PnPConfiguration } from "./pnplibconfig";

// trigger attachment of all functionality to mimic the previous pnpjs impl
import "@pnp/sp/presets/all";

/**
 * Re-export everything from the dependencies to match the previous pattern
 */
export * from "@pnp/sp/presets/all";
export * from "@pnp/common";
export * from "@pnp/logging";
export * from "@pnp/config-store";
export * from "@pnp/odata";

/**
 * Utility methods
 */
export const util = {
    assign,
    combine,
    dateAdd,
    getCtxCallback,
    getGUID,
    getRandomString,
    isArray,
    isFunc,
    isUrlAbsolute,
    objectDefinedNotNull,
    sanitizeGuid,
    stringIsNullOrEmpty,
};

/**
 * Provides access to the SharePoint REST interface
 */
export const sp = <SPRestAddIn>_sp;

/**
 * Provides access to local and session storage
 */
export const storage: PnPClientStorage = new PnPClientStorage();

/**
 * Global configuration instance to which providers can be added
 */
export const config = new Settings();

/**
 * Global logging instance to which subscribers can be registered and messages written
 */
export const log = Logger;

/**
 * Allows for the configuration of the library
 */
export const setup: (config: PnPConfiguration) => void = _setup;

// creating this class instead of directly assigning to default fixes a previous issue
const Def = {
    /**
     * Global configuration instance to which providers can be added
     */
    config: config,
    /**
     * Global logging instance to which subscribers can be registered and messages written
     */
    log: log,
    /**
     * Provides access to local and session storage
     */
    setup: setup,
    /**
     * Provides access to the REST interface
     */
    sp: sp,
    /**
     * Provides access to local and session storage
     */
    storage: storage,
    /**
     * Utility methods
     */
    util: util,
};

/**
 * Enables use of the import pnp from syntax
 */
export default Def;
