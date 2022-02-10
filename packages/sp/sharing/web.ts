import { _Web, Web } from "../webs/types.js";
import { ISharingEmailData, ISharingResult, SharingRole } from "./types.js";
import { RoleType } from "./types.js";
import { shareObject } from "./funcs.js";
import { combine } from "@pnp/core";
import { body } from "@pnp/queryable";
import { spPost } from "../operations.js";

/**
 * Extend _Web
 */
declare module "../webs/types" {
    interface _Web {
        shareWith: (loginNames: string | string[], role?: SharingRole, emailData?: ISharingEmailData) => Promise<ISharingResult>;
        shareObject: (url: string,
            loginNames: string | string[],
            role: SharingRole,
            emailData?: ISharingEmailData,
            group?: RoleType,
            propagateAcl?: boolean,
            includeAnonymousLinkInEmail?: boolean,
            useSimplifiedRoles?: boolean) => Promise<ISharingResult>;
        shareObjectRaw(options: any): Promise<ISharingResult>;
        unshareObject(url: string): Promise<ISharingResult>;
    }
    interface IWeb {
        shareWith: (loginNames: string | string[], role?: SharingRole, emailData?: ISharingEmailData) => Promise<ISharingResult>;
        shareObject: (url: string,
            loginNames: string | string[],
            role: SharingRole,
            emailData?: ISharingEmailData,
            group?: RoleType,
            propagateAcl?: boolean,
            includeAnonymousLinkInEmail?: boolean,
            useSimplifiedRoles?: boolean) => Promise<ISharingResult>;
        shareObjectRaw(options: any): Promise<ISharingResult>;
        unshareObject(url: string): Promise<ISharingResult>;
    }
}

/**
 * Shares this web with the supplied users (not supported for batching)
 * @param loginNames The resolved login names to share
 * @param role The role to share this web
 * @param emailData Optional email data
 */
_Web.prototype.shareWith = async function (
    this: _Web,
    loginNames: string | string[],
    role: SharingRole = SharingRole.View,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    const url = await this.select("Url")();

    return this.shareObject(combine(url.Url, "/_layouts/15/aclinv.aspx?forSharing=1&mbypass=1"), loginNames, role, emailData);
};

/**
 * Provides direct access to the static web.ShareObject method
 *
 * @param url The url to share
 * @param loginNames Resolved loginnames string[] of a single login name string
 * @param roleValue Role value
 * @param emailData Optional email data
 * @param groupId Optional group id
 * @param propagateAcl
 * @param includeAnonymousLinkInEmail
 * @param useSimplifiedRoles
 */
_Web.prototype.shareObject = function (
    this: _Web,
    url: string,
    loginNames: string | string[],
    role: SharingRole,
    emailData?: ISharingEmailData,
    group?: RoleType,
    propagateAcl = false,
    includeAnonymousLinkInEmail = false,
    useSimplifiedRoles = true): Promise<ISharingResult> {

    return shareObject(this, {
        emailData: emailData,
        group: group,
        includeAnonymousLinkInEmail: includeAnonymousLinkInEmail,
        loginNames: loginNames,
        propagateAcl: propagateAcl,
        role: role,
        url: url,
        useSimplifiedRoles: useSimplifiedRoles,
    });
};

/**
 * Supplies a method to pass any set of arguments to ShareObject
 *
 * @param options The set of options to send to ShareObject
 */
_Web.prototype.shareObjectRaw = function (this: _Web, options: any): Promise<ISharingResult> {
    return shareObject(this, options, true);
};

/**
 * Supplies a method to pass any set of arguments to ShareObject
 *
 * @param options The set of options to send to ShareObject
 */
_Web.prototype.unshareObject = function (this: _Web, url: string): Promise<ISharingResult> {
    return spPost(Web(this, "unshareObject"), body({ url }));
};
