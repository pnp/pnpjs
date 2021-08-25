import { _SPQueryable, spInvokableFactory, ISPQueryable } from "../sharepointqueryable.js";
import { body } from "@pnp/queryable";
import { odataUrlFrom } from "../odata.js";
import { IPrincipalInfo, PrincipalType, PrincipalSource } from "../types.js";
import { File, IFile } from "../files/types.js";
import { extractWebUrl } from "../utils/extractweburl.js";
import { spPost } from "../operations.js";
import { tag } from "../telemetry.js";
import { objectToSPKeyValueCollection } from "../utils/objectToSPKeyValueCollection.js";

export class _Utilities extends _SPQueryable implements IUtilities {

    constructor(baseUrl: string | ISPQueryable, methodName: string) {
        const url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
        super(extractWebUrl(url), `_api/SP.Utilities.Utility.${methodName}`);
    }

    public excute<T>(props: any): Promise<T> {
        return spPost(this, body(props));
    }

    public sendEmail(props: IEmailProperties): Promise<void> {

        let properties: any = {
            Body: props.Body,
            From: props.From,
            Subject: props.Subject,
        };

        if (props.To && props.To.length > 0) {

            properties = { ...properties, To: { results: props.To } };
        }

        if (props.CC && props.CC.length > 0) {

            properties = { ...properties, CC: { results: props.CC } };
        }

        if (props.BCC && props.BCC.length > 0) {

            properties = { ...properties, BCC: { results: props.BCC } };
        }

        if (props.AdditionalHeaders) {

            properties = { ...properties, AdditionalHeaders: objectToSPKeyValueCollection(props.AdditionalHeaders) };
        }

        return tag.configure(UtilitiesCloneFactory(this, "SendEmail"), "u.sendEmail").excute<void>({ properties });
    }

    public getCurrentUserEmailAddresses(): Promise<string> {
        return tag.configure(UtilitiesCloneFactory(this, "GetCurrentUserEmailAddresses"), "u.getCurrentUserEmailAddresses").excute<string>({});
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

        const clone = UtilitiesCloneFactory(this, "ResolvePrincipalInCurrentContext");
        return tag.configure(clone, "u.ResolvePrincipalInCurrentContext").excute<IPrincipalInfo>(params);
    }

    public searchPrincipals(input: string, scopes: PrincipalType, sources: PrincipalSource, groupName: string, maxCount: number): Promise<IPrincipalInfo[]> {
        const params = {
            groupName: groupName,
            input: input,
            maxCount: maxCount,
            scopes: scopes,
            sources: sources,
        };

        const clone = UtilitiesCloneFactory(this, "SearchPrincipalsUsingContextWeb");
        return tag.configure(clone, "u.SearchPrincipalsUsingContextWeb").excute<IPrincipalInfo[]>(params);
    }

    public createEmailBodyForInvitation(pageAddress: string): Promise<string> {
        const params = {
            pageAddress: pageAddress,
        };

        const clone = UtilitiesCloneFactory(this, "CreateEmailBodyForInvitation");
        return tag.configure(clone, "u.CreateEmailBodyForInvitation").excute<string>(params);
    }

    public expandGroupsToPrincipals(inputs: string[], maxCount = 30): Promise<IPrincipalInfo[]> {
        const params = {
            inputs: inputs,
            maxCount: maxCount,
        };

        const clone = UtilitiesCloneFactory(this, "ExpandGroupsToPrincipals");
        return tag.configure(clone, "u.ExpandGroupsToPrincipals").excute<IPrincipalInfo[]>(params);
    }

    public async createWikiPage(info: IWikiPageCreationInfo): Promise<ICreateWikiPageResult> {

        const clone = UtilitiesCloneFactory(this, "CreateWikiPageInContextWeb");
        const newPage = await tag.configure(clone, "u.CreateWikiPageInContextWeb").excute<ICreateWikiPageResult>({ parameters: info });

        return {
            data: newPage,
            file: File(odataUrlFrom(newPage)),
        } as ICreateWikiPageResult;
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

    /**
     * Creates a new Wiki page.
     * @param info Instance of IWikiPageCreationInfo.
     */
    createWikiPage(info: IWikiPageCreationInfo): Promise<ICreateWikiPageResult>;
}

export const Utilities: (baseUrl: string | ISPQueryable, path?: string) => IUtilities = <any>spInvokableFactory(_Utilities);
type UtilitiesCloneType = IUtilities & ISPQueryable & { excute<T>(props: any): Promise<T> };
const UtilitiesCloneFactory = (baseUrl: string | ISPQueryable, path?: string): UtilitiesCloneType => <any>Utilities(baseUrl, path);

export interface ICreateWikiPageResult {
    /**
     * The returned Wiki page represented by raw data.
     */
    data: any;

    /**
     * The returned Wiki page represented as a file which can be further updated.
     */
    file: IFile;
}

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
