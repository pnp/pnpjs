import { Logger } from "@pnp/logging";
import { Util, PnPClientStorage } from "@pnp/common";
import { Settings } from "@pnp/config-store";
import { SPRest } from "@pnp/sp";
import { GraphRest } from "@pnp/graph";


import { setup as _setup, PnPConfiguration } from "./config/pnplibconfig";

/**
 * Root class of the Patterns and Practices namespace, provides an entry point to the library
 */

/**
 * Utility methods
 */
export const util = Util;

/**
 * Provides access to the SharePoint REST interface
 */
export const sp = new SPRest();

/**
 * Provides access to the Microsoft Graph REST interface
 */
export const graph = new GraphRest();

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

// /**
//  * Expose a subset of classes from the library for public consumption
//  */

// creating this class instead of directly assigning to default fixes issue #116
const Def = {
    /**
     * Global configuration instance to which providers can be added
     */
    config: config,
    /**
     * Provides access to the Microsoft Graph REST interface
     */
    graph: graph,
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
