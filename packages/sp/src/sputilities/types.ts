import { _SharePointQueryable, ISharePointQueryable, spInvokableFactory } from "../sharepointqueryable";
import { assign, TypedHash } from "@pnp/common";
import { SPBatch } from "../batch";
import { ICachingOptions, body } from "@pnp/odata";
import { odataUrlFrom } from "../odata";
import { IPrincipalInfo, PrincipalType, PrincipalSource } from "../types";
import { metadata } from "../utils/metadata";
import { File, IFile } from "../files/types";
import { extractWebUrl } from "../utils/extractweburl";
import { spPost } from "../operations";
import { clientTagMethod } from "../decorators";

export class _Utilities extends _SharePointQueryable implements IUtilities {
    constructor(baseUrl: string | ISharePointQueryable, methodName: string) {
        const url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
        super(extractWebUrl(url), `_api/SP.Utilities.Utility.${methodName}`);
    }

    public excute<T>(props: any): Promise<T> {
        return spPost(this, body(props));
    }

    public sendEmail(props: IEmailProperties): Promise<void> {
        const params = {
            properties: assign(metadata("SP.Utilities.EmailProperties"), {
                Body: props.Body,
                From: props.From,
                Subject: props.Subject,
            }),
        };

        if (props.To && props.To.length > 0) {

            params.properties = assign(params.properties, {
                To: { results: props.To },
            });
        }

        if (props.CC && props.CC.length > 0) {

            params.properties = assign(params.properties, {
                CC: { results: props.CC },
            });
        }

        if (props.BCC && props.BCC.length > 0) {

            params.properties = assign(params.properties, {
                BCC: { results: props.BCC },
            });
        }

        if (props.AdditionalHeaders) {
            params.properties = assign(params.properties, {
                AdditionalHeaders: props.AdditionalHeaders,
            });
        }

        return clientTagMethod.configure(this.clone(UtilitiesCloneFactory, "SendEmail", true), "u.sendEmail").excute<void>(params);
    }

    public getCurrentUserEmailAddresses(): Promise<string> {
        return clientTagMethod.configure(this.clone(UtilitiesCloneFactory, "GetCurrentUserEmailAddresses", true), "u.getCurrentUserEmailAddresses").excute<string>({});
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

        const clone = this.clone(UtilitiesCloneFactory, "ResolvePrincipalInCurrentContext", true);
        return clientTagMethod.configure(clone, "u.ResolvePrincipalInCurrentContext").excute<IPrincipalInfo>(params);
    }

    public searchPrincipals(input: string, scopes: PrincipalType, sources: PrincipalSource, groupName: string, maxCount: number): Promise<IPrincipalInfo[]> {
        const params = {
            groupName: groupName,
            input: input,
            maxCount: maxCount,
            scopes: scopes,
            sources: sources,
        };

        const clone = this.clone(UtilitiesCloneFactory, "SearchPrincipalsUsingContextWeb", true);
        return clientTagMethod.configure(clone, "u.SearchPrincipalsUsingContextWeb").excute<IPrincipalInfo[]>(params);
    }

    public createEmailBodyForInvitation(pageAddress: string): Promise<string> {
        const params = {
            pageAddress: pageAddress,
        };

        const clone = this.clone(UtilitiesCloneFactory, "CreateEmailBodyForInvitation", true);
        return clientTagMethod.configure(clone, "u.CreateEmailBodyForInvitation").excute<string>(params);
    }

    public expandGroupsToPrincipals(inputs: string[], maxCount = 30): Promise<IPrincipalInfo[]> {
        const params = {
            inputs: inputs,
            maxCount: maxCount,
        };

        const clone = this.clone(UtilitiesCloneFactory, "ExpandGroupsToPrincipals", true);
        return clientTagMethod.configure(clone, "u.ExpandGroupsToPrincipals").excute<IPrincipalInfo[]>(params);
    }

    public async createWikiPage(info: IWikiPageCreationInfo): Promise<ICreateWikiPageResult> {

        const clone = this.clone(UtilitiesCloneFactory, "CreateWikiPageInContextWeb", true);
        const newPage = await clientTagMethod.configure(clone, "u.CreateWikiPageInContextWeb").excute<ICreateWikiPageResult>({ parameters: info });

        return {
            data: newPage,
            file: File(odataUrlFrom(newPage)),
        } as ICreateWikiPageResult;
    }
}

export interface IUtilities {
    /*
     * Gives you the ability to cache returned data in an easy way.
     */
    usingCaching(options?: ICachingOptions): this;

    /*
     * Gives you the ability to batch multiple requests into a single request to SharePoint.
     */
    inBatch(batch: SPBatch): this;

    /*
     * This methods will send an e-mail based on the incoming properties of the IEmailProperties parameter.
     */
    sendEmail(props: IEmailProperties): Promise<void>;

    /*
     * This method returns the current user's email addresses known to SharePoint.
     */
    getCurrentUserEmailAddresses(): Promise<string>;

    /*
     * Gets information about a principal that matches the specified Search criteria.
     */
    resolvePrincipal(email: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        inputIsEmailOnly: boolean,
        addToUserInfoList: boolean,
        matchUserInfoList?: boolean): Promise<IPrincipalInfo>;

    /*
     * Gets information about the principals that match the specified Search criteria.
     */
    searchPrincipals(input: string, scopes: PrincipalType, sources: PrincipalSource, groupName: string, maxCount: number): Promise<IPrincipalInfo[]>;

    /*
     * Gets the external (outside the firewall) URL to a document or resource in a site.
     */
    createEmailBodyForInvitation(pageAddress: string): Promise<string>;

    /*
     * Resolves the principals contained within the supplied groups.
     */
    expandGroupsToPrincipals(inputs: string[], maxCount?: number): Promise<IPrincipalInfo[]>;

    /*
     * Creates a new Wiki page.
     */
    createWikiPage(info: IWikiPageCreationInfo): Promise<ICreateWikiPageResult>;
}

export const Utilities = spInvokableFactory<IUtilities>(_Utilities);

type UtilitiesCloneType = IUtilities & ISharePointQueryable & { excute<T>(props: any): Promise<T> };
const UtilitiesCloneFactory = (baseUrl: string | ISharePointQueryable, path?: string): UtilitiesCloneType => <any>Utilities(baseUrl, path);

export interface ICreateWikiPageResult {
    /*
     * The returned Wiki page represented by raw data.
     */
    data: any;

    /*
     * The returned Wiki page represented as a file which can be further updated.
     */
    file: IFile;
}

export interface IEmailProperties {
    /*
     * The list of receivers represented by a string array.
     */
    To: string[];

    /*
     * The list of receivers as CC (carbon copy) represented by a string array.
     * This is optional.
     */
    CC?: string[];

    /*
     * The list of receivers as BCC (blind carbon copy) represented by a string array.
     * This is optional.
     */
    BCC?: string[];

    /*
     * The subject of the email.
     */
    Subject: string;

    /*
     * The body of the email.
     */
    Body: string;

    /*
     * The additional headers appened to the request in key/value pairs.
     */
    AdditionalHeaders?: TypedHash<string>;

    /*
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
