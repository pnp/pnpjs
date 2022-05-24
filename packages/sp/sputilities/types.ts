import { body } from "@pnp/queryable";
import { _SPQueryable, spInvokableFactory, ISPQueryable, SPInit } from "../spqueryable.js";
import { IPrincipalInfo, PrincipalType, PrincipalSource } from "../types.js";
import { extractWebUrl } from "../utils/extract-web-url.js";
import { spPost } from "../operations.js";
import { combine } from "@pnp/core";

export class _Utilities extends _SPQueryable implements IUtilities {

    constructor(base: string | ISPQueryable, methodName = "") {
        super(base);
        this._url = combine(extractWebUrl(this._url), `_api/SP.Utilities.Utility.${methodName}`);
    }

    public excute<T>(props: any): Promise<T> {
        return spPost(this, body(props));
    }

    public sendEmail(properties: IEmailProperties): Promise<void> {

        if (properties.AdditionalHeaders) {

            // we have to remap the additional headers into this format #2253
            properties.AdditionalHeaders = <any>Reflect.ownKeys(properties.AdditionalHeaders).map(key => ({
                Key: key,
                Value: Reflect.get(properties.AdditionalHeaders, key),
                ValueType: "Edm.String",
            }));
        }

        return UtilitiesCloneFactory(this, "SendEmail").excute<void>({ properties });
    }

    public getCurrentUserEmailAddresses(): Promise<string> {
        return UtilitiesCloneFactory(this, "GetCurrentUserEmailAddresses").excute<string>({});
    }

    public resolvePrincipal(input: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        inputIsEmailOnly: boolean,
        addToUserInfoList: boolean,
        matchUserInfoList = false): Promise<IPrincipalInfo> {
        const params = {
            addToUserInfoList,
            input,
            inputIsEmailOnly,
            matchUserInfoList,
            scopes,
            sources,
        };

        return UtilitiesCloneFactory(this, "ResolvePrincipalInCurrentContext").excute<IPrincipalInfo>(params);
    }

    public searchPrincipals(input: string, scopes: PrincipalType, sources: PrincipalSource, groupName: string, maxCount: number): Promise<IPrincipalInfo[]> {
        const params = {
            groupName: groupName,
            input: input,
            maxCount: maxCount,
            scopes: scopes,
            sources: sources,
        };

        return UtilitiesCloneFactory(this, "SearchPrincipalsUsingContextWeb").excute<IPrincipalInfo[]>(params);
    }

    public createEmailBodyForInvitation(pageAddress: string): Promise<string> {
        const params = {
            pageAddress: pageAddress,
        };

        return UtilitiesCloneFactory(this, "CreateEmailBodyForInvitation").excute<string>(params);
    }

    public expandGroupsToPrincipals(inputs: string[], maxCount = 30): Promise<IPrincipalInfo[]> {
        const params = {
            inputs: inputs,
            maxCount: maxCount,
        };

        const clone = UtilitiesCloneFactory(this, "ExpandGroupsToPrincipals");
        return clone.excute<IPrincipalInfo[]>(params);
    }
}

/**
 * Describes the SharePoint utility methods
 */
export interface IUtilities {

    /**
     * This methods will send an e-mail based on the incoming properties of the IEmailProperties parameter.
     * @param props IEmailProperties object
     */
    sendEmail(props: IEmailProperties): Promise<void>;

    /**
     * This method returns the current user's email addresses known to SharePoint.
     */
    getCurrentUserEmailAddresses(): Promise<string>;

    /**
     * Gets information about a principal that matches the specified Search criteria.
     * @param email E-mail address
     * @param scopes Specifies the type to be used when searching for a principal
     * @param sources Specifies the source to be used when searching for a principal.
     * @param inputIsEmailOnly Specifies whether only the e-mail address will be used when searching for a principal.
     * @param addToUserInfoList Specifies whether the user should be added to the hidden user info list.
     * @param matchUserInfoList [Optional] By default false
     */
    resolvePrincipal(email: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        inputIsEmailOnly: boolean,
        addToUserInfoList: boolean,
        matchUserInfoList?: boolean): Promise<IPrincipalInfo>;

    /**
    * Gets information about the principals that match the specified search criteria.
    * @param input Specifies the value to be used when searching for a principal.
    * @param scopes Specifies the type to be used when searching for a principal.
    * @param sources Specifies the source to be used when searching for a principal.
    * @param groupName Specifies the collection of users to be used when searching for a principal.
    * @param maxCount Specifies the maximum number of principals to be returned in the list.
    */
    searchPrincipals(input: string, scopes: PrincipalType, sources: PrincipalSource, groupName: string, maxCount: number): Promise<IPrincipalInfo[]>;

    /**
     * Gets the external (outside the firewall) URL to a document or resource in a site.
     * @param pageAddress Specifies the URI for the document or resource. It must be a URL.
     */
    createEmailBodyForInvitation(pageAddress: string): Promise<string>;

    /**
     * Resolves the principals contained within the supplied groups.
     * @param inputs A collection of groups to be expanded.
     * @param maxCount Specifies the maximum number of principals to be returned.
     */
    expandGroupsToPrincipals(inputs: string[], maxCount?: number): Promise<IPrincipalInfo[]>;
}

export const Utilities: (base: SPInit, path?: string) => IUtilities = <any>spInvokableFactory(_Utilities);
type UtilitiesCloneType = IUtilities & ISPQueryable & { excute<T>(props: any): Promise<T> };
const UtilitiesCloneFactory = (base: SPInit, path?: string): UtilitiesCloneType => <any>Utilities(base, path);

export interface IEmailProperties {
    /**
     * The list of receivers represented by a string array.
     */
    To: string[];

    /**
     * The list of receivers as CC (carbon copy) represented by a string array.
     * This is optional.
     */
    CC?: string[];

    /**
     * The list of receivers as BCC (blind carbon copy) represented by a string array.
     * This is optional.
     */
    BCC?: string[];

    /**
     * The subject of the email.
     */
    Subject: string;

    /**
     * The body of the email.
     */
    Body: string;

    /**
     * The additional headers appened to the request in key/value pairs.
     */
    AdditionalHeaders?: Record<string, string>;

    /**
     * The from address of the email.
     * This is optional.
     */
    From?: string;
}

export interface IWikiPageCreationInfo {
    /**
     * The server-relative-url of the wiki page to be created.
     */
    ServerRelativeUrl: string;

    /**
     * The wiki content to be set in the wiki page.
     */
    WikiHtmlContent: string;
}
