import { Util } from "../utils/util";
import { Web } from "./webs";
import { spGetEntityUrl } from "./odata";
import { SharePointQueryable, SharePointQueryableInstance } from "./sharepointqueryable";
import { SharePointQueryableSecurable } from "./sharepointqueryablesecurable";
import {
    RoleType,
    SharingLinkKind,
    ShareLinkResponse,
    SharingRole,
    SharingEmailData,
    SharingResult,
    SharingRecipient,
    SharingEntityPermission,
    SharingInformationRequest,
    ObjectSharingSettings,
    SharingInformation,
    ShareObjectOptions,
} from "./types";

/**
 * Internal helper class used to augment classes to include sharing functionality
 */
export class SharePointQueryableShareable extends SharePointQueryable {

    /**
     * Gets a sharing link for the supplied
     *
     * @param kind The kind of link to share
     * @param expiration The optional expiration for this link
     */
    public getShareLink(kind: SharingLinkKind, expiration: Date = null): Promise<ShareLinkResponse> {

        // date needs to be an ISO string or null
        const expString = expiration !== null ? expiration.toISOString() : null;

        // clone using the factory and send the request
        return this.clone(SharePointQueryableShareable, "shareLink").postAsCore<ShareLinkResponse>({
            body: JSON.stringify({
                request: {
                    createLink: true,
                    emailData: null,
                    settings: {
                        expiration: expString,
                        linkKind: kind,
                    },
                },
            }),
        });
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
    public shareWith(loginNames: string | string[], role: SharingRole, requireSignin = false, propagateAcl = false, emailData?: SharingEmailData): Promise<SharingResult> {

        // handle the multiple input types
        if (!Array.isArray(loginNames)) {
            loginNames = [loginNames];
        }

        const userStr = JSON.stringify(loginNames.map(login => { return { Key: login }; }));
        const roleFilter = role === SharingRole.Edit ? RoleType.Contributor : RoleType.Reader;

        // start by looking up the role definition id we need to set the roleValue
        return Web.fromUrl(this.toUrl()).roleDefinitions.select("Id").filter(`RoleTypeKind eq ${roleFilter}`).get().then((def: { Id: number }[]) => {

            if (!Array.isArray(def) || def.length < 1) {
                throw new Error(`Could not locate a role defintion with RoleTypeKind ${roleFilter}`);
            }

            let postBody = {
                includeAnonymousLinkInEmail: requireSignin,
                peoplePickerInput: userStr,
                propagateAcl: propagateAcl,
                roleValue: `role:${def[0].Id}`,
                useSimplifiedRoles: true,
            };

            if (typeof emailData !== "undefined") {

                postBody = Util.extend(postBody, {
                    emailBody: emailData.body,
                    emailSubject: typeof emailData.subject !== "undefined" ? emailData.subject : "",
                    sendEmail: true,
                });
            }

            return this.clone(SharePointQueryableShareable, "shareObject").postAsCore<SharingResult>({
                body: JSON.stringify(postBody),
            });
        });
    }

    /**
     * Shares an object based on the supplied options
     *
     * @param options The set of options to send to the ShareObject method
     * @param bypass If true any processing is skipped and the options are sent directly to the ShareObject method
     */
    public shareObject(options: ShareObjectOptions, bypass = false): Promise<SharingResult> {

        if (bypass) {

            // if the bypass flag is set send the supplied parameters directly to the service
            return this.sendShareObjectRequest(options);
        }

        // extend our options with some defaults
        options = Util.extend(options, {
            group: null,
            includeAnonymousLinkInEmail: false,
            propagateAcl: false,
            useSimplifiedRoles: true,
        }, true);

        return this.getRoleValue(options.role, options.group).then(roleValue => {

            // handle the multiple input types
            if (!Array.isArray(options.loginNames)) {
                options.loginNames = [options.loginNames];
            }

            const userStr = JSON.stringify(options.loginNames.map(login => { return { Key: login }; }));

            let postBody = {
                peoplePickerInput: userStr,
                roleValue: roleValue,
                url: options.url,
            };

            if (typeof options.emailData !== "undefined" && options.emailData !== null) {

                postBody = Util.extend(postBody, {
                    emailBody: options.emailData.body,
                    emailSubject: typeof options.emailData.subject !== "undefined" ? options.emailData.subject : "Shared with you.",
                    sendEmail: true,
                });
            }

            return this.sendShareObjectRequest(postBody);
        });
    }

    /**
     * Calls the web's UnshareObject method
     *
     * @param url The url of the object to unshare
     */
    public unshareObjectWeb(url: string): Promise<SharingResult> {

        return this.clone(SharePointQueryableShareable, "unshareObject").postAsCore<SharingResult>({
            body: JSON.stringify({
                url: url,
            }),
        });
    }

    /**
     * Checks Permissions on the list of Users and returns back role the users have on the Item.
     *
     * @param recipients The array of Entities for which Permissions need to be checked.
     */
    public checkPermissions(recipients: SharingRecipient[]): Promise<SharingEntityPermission[]> {

        return this.clone(SharePointQueryableShareable, "checkPermissions").postAsCore<SharingEntityPermission[]>({
            body: JSON.stringify({
                recipients: recipients,
            }),
        });
    }

    /**
     * Get Sharing Information.
     *
     * @param request The SharingInformationRequest Object.
     */
    public getSharingInformation(request: SharingInformationRequest = null): Promise<SharingInformation> {

        return this.clone(SharePointQueryableShareable, "getSharingInformation").postAsCore<SharingInformation>({
            body: JSON.stringify({
                request: request,
            }),
        });
    }

    /**
     * Gets the sharing settings of an item.
     *
     * @param useSimplifiedRoles Determines whether to use simplified roles.
     */
    public getObjectSharingSettings(useSimplifiedRoles = true): Promise<ObjectSharingSettings> {

        return this.clone(SharePointQueryableShareable, "getObjectSharingSettings").postAsCore<ObjectSharingSettings>({
            body: JSON.stringify({
                useSimplifiedRoles: useSimplifiedRoles,
            }),
        });
    }

    /**
     * Unshares this object
     */
    public unshareObject(): Promise<SharingResult> {

        return this.clone(SharePointQueryableShareable, "unshareObject").postAsCore<SharingResult>();
    }

    /**
     * Deletes a link by type
     *
     * @param kind Deletes a sharing link by the kind of link
     */
    public deleteLinkByKind(kind: SharingLinkKind): Promise<void> {

        return this.clone(SharePointQueryableShareable, "deleteLinkByKind").postCore({
            body: JSON.stringify({ linkKind: kind }),
        });
    }

    /**
     * Removes the specified link to the item.
     *
     * @param kind The kind of link to be deleted.
     * @param shareId
     */
    public unshareLink(kind: SharingLinkKind, shareId = "00000000-0000-0000-0000-000000000000"): Promise<void> {

        return this.clone(SharePointQueryableShareable, "unshareLink").postCore({
            body: JSON.stringify({ linkKind: kind, shareId: shareId }),
        });
    }

    /**
     * Calculates the roleValue string used in the sharing query
     *
     * @param role The Sharing Role
     * @param group The Group type
     */
    protected getRoleValue(role: SharingRole, group: RoleType): Promise<string> {

        // we will give group precedence, because we had to make a choice
        if (typeof group !== "undefined" && group !== null) {

            switch (group) {
                case RoleType.Contributor:
                    return Web.fromUrl(this.toUrl()).associatedMemberGroup.select("Id").getAs<{ Id: number }>().then(g => `group: ${g.Id}`);
                case RoleType.Reader:
                case RoleType.Guest:
                    return Web.fromUrl(this.toUrl()).associatedVisitorGroup.select("Id").getAs<{ Id: number }>().then(g => `group: ${g.Id}`);
                default:
                    throw new Error("Could not determine role value for supplied value. Contributor, Reader, and Guest are supported");
            }
        } else {

            const roleFilter = role === SharingRole.Edit ? RoleType.Contributor : RoleType.Reader;
            return Web.fromUrl(this.toUrl()).roleDefinitions.select("Id").top(1).filter(`RoleTypeKind eq ${roleFilter}`).getAs<{ Id: number }[]>().then(def => {
                if (def.length < 1) {
                    throw new Error("Could not locate associated role definition for supplied role. Edit and View are supported");
                }
                return `role: ${def[0].Id}`;
            });
        }
    }

    private getShareObjectWeb(candidate: string): Promise<Web> {
        return Promise.resolve(Web.fromUrl(candidate, "/_api/SP.Web.ShareObject"));
    }

    private sendShareObjectRequest(options: any): Promise<SharingResult> {

        return this.getShareObjectWeb(this.toUrl()).then(web => {

            return web.expand("UsersWithAccessRequests", "GroupsSharedWith").as(SharePointQueryableShareable).postCore({
                body: JSON.stringify(options),
            });
        });
    }
}

export class SharePointQueryableShareableWeb extends SharePointQueryableSecurable {

    /**
     * Shares this web with the supplied users
     * @param loginNames The resolved login names to share
     * @param role The role to share this web
     * @param emailData Optional email data
     */
    public shareWith(loginNames: string | string[], role: SharingRole = SharingRole.View, emailData?: SharingEmailData): Promise<SharingResult> {

        const dependency = this.addBatchDependency();

        return Web.fromUrl(this.toUrl(), "/_api/web/url").get().then((url: string) => {

            dependency();

            return this.shareObject(Util.combinePaths(url, "/_layouts/15/aclinv.aspx?forSharing=1&mbypass=1"), loginNames, role, emailData);
        });
    }

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
    public shareObject(url: string,
        loginNames: string | string[],
        role: SharingRole,
        emailData?: SharingEmailData,
        group?: RoleType,
        propagateAcl = false,
        includeAnonymousLinkInEmail = false,
        useSimplifiedRoles = true): Promise<SharingResult> {

        return this.clone(SharePointQueryableShareable, null).shareObject({
            emailData: emailData,
            group: group,
            includeAnonymousLinkInEmail: includeAnonymousLinkInEmail,
            loginNames: loginNames,
            propagateAcl: propagateAcl,
            role: role,
            url: url,
            useSimplifiedRoles: useSimplifiedRoles,
        });
    }

    /**
     * Supplies a method to pass any set of arguments to ShareObject
     *
     * @param options The set of options to send to ShareObject
     */
    public shareObjectRaw(options: any): Promise<SharingResult> {
        return this.clone(SharePointQueryableShareable, null).shareObject(options, true);
    }

    /**
     * Unshares the object
     *
     * @param url The url of the object to stop sharing
     */
    public unshareObject(url: string): Promise<SharingResult> {

        return this.clone(SharePointQueryableShareable, null).unshareObjectWeb(url);
    }
}

export class SharePointQueryableShareableItem extends SharePointQueryableSecurable {

    /**
     * Gets a link suitable for sharing for this item
     *
     * @param kind The type of link to share
     * @param expiration The optional expiration date
     */
    public getShareLink(kind: SharingLinkKind = SharingLinkKind.OrganizationView, expiration: Date = null): Promise<ShareLinkResponse> {
        return this.clone(SharePointQueryableShareable, null).getShareLink(kind, expiration);
    }

    /**
     * Shares this item with one or more users
     *
     * @param loginNames string or string[] of resolved login names to which this item will be shared
     * @param role The role (View | Edit) applied to the share
     * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
     */
    public shareWith(loginNames: string | string[], role: SharingRole = SharingRole.View, requireSignin = false, emailData?: SharingEmailData): Promise<SharingResult> {

        return this.clone(SharePointQueryableShareable, null).shareWith(loginNames, role, requireSignin, false, emailData);
    }

    /**
     * Checks Permissions on the list of Users and returns back role the users have on the Item.
     *
     * @param recipients The array of Entities for which Permissions need to be checked.
     */
    public checkSharingPermissions(recipients: SharingRecipient[]): Promise<SharingEntityPermission[]> {

        return this.clone(SharePointQueryableShareable, null).checkPermissions(recipients);
    }

    /**
     * Get Sharing Information.
     *
     * @param request The SharingInformationRequest Object.
     */
    public getSharingInformation(request: SharingInformationRequest = null): Promise<SharingInformation> {

        return this.clone(SharePointQueryableShareable, null).getSharingInformation(request);
    }

    /**
     * Gets the sharing settings of an item.
     *
     * @param useSimplifiedRoles Determines whether to use simplified roles.
     */
    public getObjectSharingSettings(useSimplifiedRoles = true): Promise<ObjectSharingSettings> {

        return this.clone(SharePointQueryableShareable, null).getObjectSharingSettings(useSimplifiedRoles);
    }

    /**
     * Unshare this item
     */
    public unshare(): Promise<SharingResult> {
        return this.clone(SharePointQueryableShareable, null).unshareObject();
    }

    /**
     * Deletes a sharing link by kind
     *
     * @param kind Deletes a sharing link by the kind of link
     */
    public deleteSharingLinkByKind(kind: SharingLinkKind): Promise<void> {

        return this.clone(SharePointQueryableShareable, null).deleteLinkByKind(kind);
    }

    /**
     * Removes the specified link to the item.
     *
     * @param kind The kind of link to be deleted.
     * @param shareId
     */
    public unshareLink(kind: SharingLinkKind, shareId?: string): Promise<void> {

        return this.clone(SharePointQueryableShareable, null).unshareLink(kind, shareId);
    }
}

export class FileFolderShared extends SharePointQueryableInstance {
    /**
     * Gets a link suitable for sharing
     *
     * @param kind The kind of link to get
     * @param expiration Optional, an expiration for this link
     */
    public getShareLink(kind: SharingLinkKind = SharingLinkKind.OrganizationView, expiration: Date = null): Promise<ShareLinkResponse> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.getShareLink(kind, expiration);
        });
    }

    /**
         * Checks Permissions on the list of Users and returns back role the users have on the Item.
         *
         * @param recipients The array of Entities for which Permissions need to be checked.
         */
    public checkSharingPermissions(recipients: SharingRecipient[]): Promise<SharingEntityPermission[]> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.checkPermissions(recipients);
        });
    }

    /**
     * Get Sharing Information.
     *
     * @param request The SharingInformationRequest Object.
     */
    public getSharingInformation(request: SharingInformationRequest = null): Promise<SharingInformation> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.getSharingInformation(request);
        });
    }

    /**
     * Gets the sharing settings of an item.
     *
     * @param useSimplifiedRoles Determines whether to use simplified roles.
     */
    public getObjectSharingSettings(useSimplifiedRoles = true): Promise<ObjectSharingSettings> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.getObjectSharingSettings(useSimplifiedRoles);
        });
    }

    /**
     * Unshare this item
     */
    public unshare(): Promise<SharingResult> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.unshareObject();
        });
    }

    /**
     * Deletes a sharing link by the kind of link
     *
     * @param kind The kind of link to be deleted.
     */
    public deleteSharingLinkByKind(kind: SharingLinkKind): Promise<void> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.deleteLinkByKind(kind);
        });
    }

    /**
     * Removes the specified link to the item.
     *
     * @param kind The kind of link to be deleted.
     * @param shareId The share id to delete
     */
    public unshareLink(kind: SharingLinkKind, shareId?: string): Promise<void> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.unshareLink(kind, shareId);
        });
    }

    /**
     * For files and folders we need to use the associated item end point
     */
    protected getShareable(): Promise<SharePointQueryableShareable> {

        // sharing only works on the item end point, not the file one - so we create a folder instance with the item url internally
        return this.clone(SharePointQueryableShareableFile, "listItemAllFields", false).select("odata.editlink").get().then(d => {

            let shareable = new SharePointQueryableShareable(spGetEntityUrl(d));

            // we need to handle batching
            if (this.hasBatch) {
                shareable = shareable.inBatch(this.batch);
            }

            return shareable;
        });
    }
}

export class SharePointQueryableShareableFile extends FileFolderShared {

    /**
     * Shares this item with one or more users
     *
     * @param loginNames string or string[] of resolved login names to which this item will be shared
     * @param role The role (View | Edit) applied to the share
     * @param shareEverything Share everything in this folder, even items with unique permissions.
     * @param requireSignin If true the user must signin to view link, otherwise anyone with the link can access the resource
     * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
     */
    public shareWith(loginNames: string | string[],
        role: SharingRole = SharingRole.View,
        requireSignin = false,
        emailData?: SharingEmailData): Promise<SharingResult> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.shareWith(loginNames, role, requireSignin, false, emailData);
        });
    }
}

export class SharePointQueryableShareableFolder extends FileFolderShared {

    /**
     * Shares this item with one or more users
     *
     * @param loginNames string or string[] of resolved login names to which this item will be shared
     * @param role The role (View | Edit) applied to the share
     * @param shareEverything Share everything in this folder, even items with unique permissions.
     * @param requireSignin If true the user must signin to view link, otherwise anyone with the link can access the resource
     * @param emailData Optional, if inlucded an email will be sent. Note subject currently has no effect.
     */
    public shareWith(loginNames: string | string[],
        role: SharingRole = SharingRole.View,
        requireSignin = false,
        shareEverything = false,
        emailData?: SharingEmailData): Promise<SharingResult> {

        const dependency = this.addBatchDependency();

        return this.getShareable().then(shareable => {
            dependency();
            return shareable.shareWith(loginNames, role, requireSignin, shareEverything, emailData);
        });
    }
}
