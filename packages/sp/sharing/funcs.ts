import { body } from "@pnp/queryable";
import { isArray, jsS } from "@pnp/core";
import { SPCollection, SPInstance } from "../spqueryable.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { Web } from "../webs/types.js";
import {
    ShareableQueryable,
    ISharingResult,
    SharingRole,
    IShareObjectOptions,
    SharingLinkKind,
    IShareLinkResponse,
    ISharingInformationRequest,
    ISharingRecipient,
    ISharingEntityPermission,
    ISharingInformation,
    IObjectSharingSettings,
    ISharingEmailData,
    RoleType,
} from "./types.js";
import { spPost } from "../operations.js";
import { RoleDefinitions } from "../security/types.js";
import { emptyGuid } from "../types.js";

/**
 * Shares an object based on the supplied options
 *
 * @param options The set of options to send to the ShareObject method
 * @param bypass If true any processing is skipped and the options are sent directly to the ShareObject method
 */
export async function shareObject(o: ShareableQueryable, options: IShareObjectOptions, bypass = false): Promise<ISharingResult> {

    if (bypass) {

        // if the bypass flag is set send the supplied parameters directly to the service
        return sendShareObjectRequest(o, options);
    }

    // extend our options with some defaults
    options = {
        group: null,
        includeAnonymousLinkInEmail: false,
        propagateAcl: false,
        useSimplifiedRoles: true,
        ...options,
    };

    const roleValue = await getRoleValue.apply(o, [options.role, options.group]);

    // handle the multiple input types
    if (!isArray(options.loginNames)) {
        options.loginNames = [options.loginNames];
    }

    const userStr = jsS(options.loginNames.map(Key => ({ Key })));

    let postBody = {
        peoplePickerInput: userStr,
        roleValue: roleValue,
        url: options.url,
    };

    if (options.emailData !== undefined && options.emailData !== null) {
        postBody = <any>{
            emailBody: options.emailData.body,
            emailSubject: options.emailData.subject !== undefined ? options.emailData.subject : "Shared with you.",
            sendEmail: true,
            ...postBody,
        };
    }

    return sendShareObjectRequest(o, postBody);
}

/**
 * Gets a sharing link for the supplied
 *
 * @param kind The kind of link to share
 * @param expiration The optional expiration for this link
 */
export function getShareLink(this: ShareableQueryable, kind: SharingLinkKind, expiration: Date = null): Promise<IShareLinkResponse> {

    // date needs to be an ISO string or null
    const expString = expiration !== null ? expiration.toISOString() : null;

    // clone using the factory and send the request
    const o = SPInstance(this, "shareLink");
    return spPost<IShareLinkResponse>(o, body({
        request: {
            createLink: true,
            emailData: null,
            settings: {
                expiration: expString,
                linkKind: kind,
            },
        },
    }));
}

/**
 * Checks Permissions on the list of Users and returns back role the users have on the Item.
 *
 * @param recipients The array of Entities for which Permissions need to be checked.
 */
export function checkPermissions(this: ShareableQueryable, recipients: ISharingRecipient[]): Promise<ISharingEntityPermission[]> {

    const o = SPInstance(this, "checkPermissions");
    return spPost<ISharingEntityPermission[]>(o, body({ recipients }));
}

/**
 * Get Sharing Information.
 *
 * @param request The SharingInformationRequest Object.
 * @param expands Expand more fields.
 *
 */
export function getSharingInformation(this: ShareableQueryable, request: ISharingInformationRequest = null, expands: string[] = [], selects = ["*"]): Promise<ISharingInformation> {

    const o = SPInstance(this, "getSharingInformation");
    return spPost(o.select(...selects).expand(...expands), body({ request }));
}

/**
 * Gets the sharing settings of an item.
 *
 * @param useSimplifiedRoles Determines whether to use simplified roles.
 */
export function getObjectSharingSettings(this: ShareableQueryable, useSimplifiedRoles = true): Promise<IObjectSharingSettings> {

    const o = SPInstance(this, "getObjectSharingSettings");
    return spPost<IObjectSharingSettings>(o, body({ useSimplifiedRoles }));
}

/**
 * Unshares this object
 */
export function unshareObject(this: ShareableQueryable): Promise<ISharingResult> {

    return spPost(SPInstance(this, "unshareObject"));
}

/**
 * Deletes a link by type
 *
 * @param kind Deletes a sharing link by the kind of link
 */
export function deleteLinkByKind(this: ShareableQueryable, linkKind: SharingLinkKind): Promise<void> {

    return spPost(SPInstance(this, "deleteLinkByKind"), body({ linkKind }));
}

/**
 * Removes the specified link to the item.
 *
 * @param kind The kind of link to be deleted.
 * @param shareId
 */
export function unshareLink(this: ShareableQueryable, linkKind: SharingLinkKind, shareId = emptyGuid): Promise<void> {

    return spPost(SPInstance(this, "unshareLink"), body({ linkKind, shareId }));
}

/**
 * Shares this instance with the supplied users
 *
 * @param loginNames Resolved login names to share
 * @param role The role
 * @param requireSignin True to require the user is authenticated, otherwise false
 * @param propagateAcl True to apply this share to all children
 * @param emailData If supplied an email will be sent with the indicated properties
 */
export async function shareWith(
    o: ShareableQueryable,
    loginNames: string | string[],
    role: SharingRole,
    requireSignin = false,
    propagateAcl = false,
    emailData?: ISharingEmailData): Promise<ISharingResult> {

    // handle the multiple input types
    if (!isArray(loginNames)) {
        loginNames = [loginNames];
    }

    const userStr = jsS(loginNames.map(login => {
        return { Key: login };
    }));
    const roleFilter = role === SharingRole.Edit ? RoleType.Contributor : RoleType.Reader;

    // start by looking up the role definition id we need to set the roleValue
    const def = await SPCollection([o, extractWebUrl(o.toUrl())], "_api/web/roledefinitions").select("Id").filter(`RoleTypeKind eq ${roleFilter}`)();
    if (!isArray(def) || def.length < 1) {
        throw Error(`Could not locate a role defintion with RoleTypeKind ${roleFilter}`);
    }

    let postBody = {
        includeAnonymousLinkInEmail: requireSignin,
        peoplePickerInput: userStr,
        propagateAcl: propagateAcl,
        roleValue: `role:${def[0].Id}`,
        useSimplifiedRoles: true,
    };

    if (emailData !== undefined) {

        postBody = <any>{
            ...postBody,
            emailBody: emailData.body,
            emailSubject: emailData.subject !== undefined ? emailData.subject : "",
            sendEmail: true,
        };
    }

    return spPost<ISharingResult>(SPInstance(o, "shareObject"), body(postBody));
}

async function sendShareObjectRequest(o: ShareableQueryable, options: any): Promise<Partial<ISharingResult>> {

    const w = Web([o, extractWebUrl(o.toUrl())], "/_api/SP.Web.ShareObject");
    return spPost(w.expand("UsersWithAccessRequests", "GroupsSharedWith"), body(options));
}

/**
 * Calculates the roleValue string used in the sharing query
 *
 * @param role The Sharing Role
 * @param group The Group type
 */
async function getRoleValue(this: ShareableQueryable, role: SharingRole, group: RoleType): Promise<string> {

    // we will give group precedence, because we had to make a choice
    if (group !== undefined && group !== null) {

        switch (group) {
            case RoleType.Contributor: {
                const g1 = await Web([this, "_api/web"], "associatedmembergroup").select("Id")<{ Id: number }>();
                return `group: ${g1.Id}`;
            }
            case RoleType.Reader:
            case RoleType.Guest: {
                const g2 = await Web([this, "_api/web"], "associatedvisitorgroup").select("Id")<{ Id: number }>();
                return `group: ${g2.Id}`;
            }
            default:
                throw Error("Could not determine role value for supplied value. Contributor, Reader, and Guest are supported");
        }
    } else {

        const roleFilter = role === SharingRole.Edit ? RoleType.Contributor : RoleType.Reader;
        const def = await RoleDefinitions([this, "_api/web"]).select("Id").top(1).filter(`RoleTypeKind eq ${roleFilter}`)<{ Id: number }[]>();
        if (def === undefined || def?.length < 1) {
            throw Error("Could not locate associated role definition for supplied role. Edit and View are supported");
        }
        return `role: ${def[0].Id}`;
    }
}

