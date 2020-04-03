import { body } from "@pnp/odata";
import { jsS, assign } from "@pnp/common";
import { SharePointQueryableCollection, _SharePointQueryableInstance, SharePointQueryableInstance } from "../sharepointqueryable";
import { extractWebUrl } from "../utils/extractweburl";
import { Web, _Web } from "../webs/types";
import { _File } from "../files/types";
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
} from "./types";
import { spPost } from "../operations";
import { tag } from "../telemetry";
import { RoleDefinitions } from "../security/types";
import { emptyGuid } from "../splibconfig";

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
    options = assign(options, {
        group: null,
        includeAnonymousLinkInEmail: false,
        propagateAcl: false,
        useSimplifiedRoles: true,
    }, true);

    const roleValue = await getRoleValue(options.role, options.group);

    // handle the multiple input types
    if (!Array.isArray(options.loginNames)) {
        options.loginNames = [options.loginNames];
    }

    const userStr = jsS(options.loginNames.map(Key => ({ Key })));

    let postBody = {
        peoplePickerInput: userStr,
        roleValue: roleValue,
        url: options.url,
    };

    if (options.emailData !== undefined && options.emailData !== null) {
        postBody = assign(postBody, {
            emailBody: options.emailData.body,
            emailSubject: options.emailData.subject !== undefined ? options.emailData.subject : "Shared with you.",
            sendEmail: true,
        });
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
    const o = tag.configure(this.clone(SharePointQueryableInstance, "shareLink"), "sh.getShareLink");
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

    const o = tag.configure(this.clone(SharePointQueryableInstance, "checkPermissions"), "sh.checkPermissions");
    return spPost<ISharingEntityPermission[]>(o, body({ recipients }));
}

/**
 * Get Sharing Information.
 *
 * @param request The SharingInformationRequest Object.
 * @param expands Expand more fields.
 * 
 */
export function getSharingInformation(this: ShareableQueryable, request: ISharingInformationRequest = null, expands: string[] = []): Promise<ISharingInformation> {

    const o = tag.configure(this.clone(SharePointQueryableInstance, "getSharingInformation"), "sh.getSharingInformation");
    return spPost(o.expand(...expands), body({ request }));
}

/**
 * Gets the sharing settings of an item.
 *
 * @param useSimplifiedRoles Determines whether to use simplified roles.
 */
export function getObjectSharingSettings(this: ShareableQueryable, useSimplifiedRoles = true): Promise<IObjectSharingSettings> {

    const o = tag.configure(this.clone(SharePointQueryableInstance, "getObjectSharingSettings"), "sh.getObjectSharingSettings");
    return spPost<IObjectSharingSettings>(o, body({ useSimplifiedRoles }));
}

/**
 * Unshares this object
 */
export function unshareObject(this: ShareableQueryable): Promise<ISharingResult> {

    return spPost(tag.configure(this.clone(SharePointQueryableInstance, "unshareObject"), "sh.unshareObject"));
}

/**
 * Deletes a link by type
 *
 * @param kind Deletes a sharing link by the kind of link
 */
export function deleteLinkByKind(this: ShareableQueryable, linkKind: SharingLinkKind): Promise<void> {

    return spPost(tag.configure(this.clone(SharePointQueryableInstance, "deleteLinkByKind"), "sh.deleteLinkByKind"), body({ linkKind }));
}

/**
 * Removes the specified link to the item.
 *
 * @param kind The kind of link to be deleted.
 * @param shareId
 */
export function unshareLink(this: ShareableQueryable, linkKind: SharingLinkKind, shareId = emptyGuid): Promise<void> {

    return spPost(tag.configure(this.clone(SharePointQueryableInstance, "unshareLink"), "sh.unshareLink"), body({ linkKind, shareId }));
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
    if (!Array.isArray(loginNames)) {
        loginNames = [loginNames];
    }

    const userStr = jsS(loginNames.map(login => { return { Key: login }; }));
    const roleFilter = role === SharingRole.Edit ? RoleType.Contributor : RoleType.Reader;

    // start by looking up the role definition id we need to set the roleValue
    // remove need to reference Web here, which created a circular build issue
    const w = SharePointQueryableCollection("_api/web", "roledefinitions");
    const def = await w.select("Id").filter(`RoleTypeKind eq ${roleFilter}`).get();
    if (!Array.isArray(def) || def.length < 1) {
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
        postBody = assign(postBody, {
            emailBody: emailData.body,
            emailSubject: emailData.subject !== undefined ? emailData.subject : "",
            sendEmail: true,
        });
    }

    return spPost<ISharingResult>(tag.configure(o.clone(SharePointQueryableInstance, "shareObject"), "sh.shareWith"), body(postBody));
}

function sendShareObjectRequest(o: ShareableQueryable, options: any): Promise<ISharingResult> {

    const w = tag.configure(Web(extractWebUrl(o.toUrl()), "/_api/SP.Web.ShareObject"), "sh.sendShareObjectRequest");
    return spPost(w.expand("UsersWithAccessRequests", "GroupsSharedWith"), body(options));
}

/**
 * Calculates the roleValue string used in the sharing query
 *
 * @param role The Sharing Role
 * @param group The Group type
 */
async function getRoleValue(role: SharingRole, group: RoleType): Promise<string> {

    // we will give group precedence, because we had to make a choice
    if (group !== undefined && group !== null) {

        switch (group) {
            case RoleType.Contributor:
                const g1 = await Web("_api/web", "associatedmembergroup").select("Id")<{ Id: number; }>();
                return `group: ${g1.Id}`;
            case RoleType.Reader:
            case RoleType.Guest:
                const g2 = await Web("_api/web", "associatedvisitorgroup").select("Id")<{ Id: number; }>();
                return `group: ${g2.Id}`;
            default:
                throw Error("Could not determine role value for supplied value. Contributor, Reader, and Guest are supported");
        }
    } else {

        const roleFilter = role === SharingRole.Edit ? RoleType.Contributor : RoleType.Reader;
        const def = await RoleDefinitions("_api/web").select("Id").top(1).filter(`RoleTypeKind eq ${roleFilter}`)<{ Id: number; }[]>();
        if (def.length < 1) {
            throw Error("Could not locate associated role definition for supplied role. Edit and View are supported");
        }
        return `role: ${def[0].Id}`;
    }
}

