import { _SharePointQueryable, ISharePointQueryable, spInvokableFactory } from "../sharepointqueryable";
import { extend, TypedHash } from "@pnp/common";
import { SPBatch } from "../batch";
import { ICachingOptions, IInvokable, body } from "@pnp/odata";
import { odataUrlFrom } from "../odata";
import { IPrincipalInfo, PrincipalType, PrincipalSource } from "../types";
import { metadata } from "../utils/metadata";
import { File, IFile } from "../files/types";
import { extractWebUrl } from "../utils/extractweburl";
import { spPost } from "../operations";

/**
 * Allows for calling of the static SP.Utilities.Utility methods by supplying the method name
 */
export class _Utilities extends _SharePointQueryable implements IUtilities {

    /**
     * Creates a new instance of the Utility method class
     *
     * @param baseUrl The parent url provider
     * @param methodName The static method name to call on the utility class
     */
    constructor(baseUrl: string | ISharePointQueryable, methodName: string) {
        const url = typeof baseUrl === "string" ? baseUrl : baseUrl.toUrl();
        super(extractWebUrl(url), `_api/SP.Utilities.Utility.${methodName}`);
    }

    public excute<T>(props: any): Promise<T> {
        return spPost(this, body(props));
    }

    /**
     * Sends an email based on the supplied properties
     *
     * @param props The properties of the email to send
     */
    public sendEmail(props: IEmailProperties): Promise<void> {

        const params = {
            properties: extend(metadata("SP.Utilities.EmailProperties"), {
                Body: props.Body,
                From: props.From,
                Subject: props.Subject,
            }),
        };

        if (props.To && props.To.length > 0) {

            params.properties = extend(params.properties, {
                To: { results: props.To },
            });
        }

        if (props.CC && props.CC.length > 0) {

            params.properties = extend(params.properties, {
                CC: { results: props.CC },
            });
        }

        if (props.BCC && props.BCC.length > 0) {

            params.properties = extend(params.properties, {
                BCC: { results: props.BCC },
            });
        }

        if (props.AdditionalHeaders) {
            params.properties = extend(params.properties, {
                AdditionalHeaders: props.AdditionalHeaders,
            });
        }

        return this.clone(UtilitiesCloneFactory, "SendEmail", true).excute<void>(params);
    }

    public getCurrentUserEmailAddresses(): Promise<string> {

        return this.clone(UtilitiesCloneFactory, "GetCurrentUserEmailAddresses", true).excute<string>({});
    }

    public resolvePrincipal(input: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        inputIsEmailOnly: boolean,
        addToUserInfoList: boolean,
        matchUserInfoList = false): Promise<IPrincipalInfo> {

        const params = {
            addToUserInfoList: addToUserInfoList,
            input: input,
            inputIsEmailOnly: inputIsEmailOnly,
            matchUserInfoList: matchUserInfoList,
            scopes: scopes,
            sources: sources,
        };

        return this.clone(UtilitiesCloneFactory, "ResolvePrincipalInCurrentContext", true).excute<IPrincipalInfo>(params);
    }

    public searchPrincipals(input: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        groupName: string,
        maxCount: number): Promise<IPrincipalInfo[]> {

        const params = {
            groupName: groupName,
            input: input,
            maxCount: maxCount,
            scopes: scopes,
            sources: sources,
        };

        return this.clone(UtilitiesCloneFactory, "SearchPrincipalsUsingContextWeb", true).excute<IPrincipalInfo[]>(params);
    }

    public createEmailBodyForInvitation(pageAddress: string): Promise<string> {

        const params = {
            pageAddress: pageAddress,
        };

        return this.clone(UtilitiesCloneFactory, "CreateEmailBodyForInvitation", true).excute<string>(params);
    }

    public expandGroupsToPrincipals(inputs: string[], maxCount = 30): Promise<IPrincipalInfo[]> {

        const params = {
            inputs: inputs,
            maxCount: maxCount,
        };

        return this.clone(UtilitiesCloneFactory, "ExpandGroupsToPrincipals", true).excute<IPrincipalInfo[]>(params);
    }

    public createWikiPage(info: IWikiPageCreationInfo): Promise<ICreateWikiPageResult> {

        return this.clone(UtilitiesCloneFactory, "CreateWikiPageInContextWeb", true).excute<ICreateWikiPageResult>({
            parameters: info,
        }).then(r => {
            return {
                data: r,
                file: File(odataUrlFrom(r)),
            };
        });
    }
}

export interface IUtilities {
    usingCaching(options?: ICachingOptions): this;
    inBatch(batch: SPBatch): this;
    sendEmail(props: IEmailProperties): Promise<void>;
    getCurrentUserEmailAddresses(): Promise<string>;
    resolvePrincipal(email: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        inputIsEmailOnly: boolean,
        addToUserInfoList: boolean,
        matchUserInfoList?: boolean): Promise<IPrincipalInfo>;
    searchPrincipals(input: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        groupName: string,
        maxCount: number): Promise<IPrincipalInfo[]>;
    createEmailBodyForInvitation(pageAddress: string): Promise<string>;
    expandGroupsToPrincipals(inputs: string[], maxCount?: number): Promise<IPrincipalInfo[]>;
    createWikiPage(info: IWikiPageCreationInfo): Promise<ICreateWikiPageResult>;
}
export interface _Utilities extends IInvokable { }
export const Utilities = spInvokableFactory<IUtilities>(_Utilities);

type UtilitiesCloneType = IUtilities & ISharePointQueryable & { excute<T>(props: any): Promise<T> };
const UtilitiesCloneFactory = (baseUrl: string | ISharePointQueryable, path?: string): UtilitiesCloneType => <any>Utilities(baseUrl, path);

export interface ICreateWikiPageResult {
    data: any;
    file: IFile;
}

export interface IEmailProperties {

    To: string[];
    CC?: string[];
    BCC?: string[];
    Subject: string;
    Body: string;
    AdditionalHeaders?: TypedHash<string>;
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
