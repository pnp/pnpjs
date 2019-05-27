import { SharePointQueryable } from "./sharepointqueryable";
import { extend, jsS, hOP } from "@pnp/common";
import { EmailProperties } from "./types";
import { SPBatch } from "./batch";
import { ICachingOptions } from "@pnp/odata";
import { File } from "./files";
import { odataUrlFrom } from "./odata";
import { PrincipalInfo, PrincipalType, PrincipalSource, WikiPageCreationInformation } from "./types";
import { metadata } from "./utils/metadata";

/**
 * Public interface for the utility methods to limit SharePointQueryable method exposure
 */
export interface UtilityMethods {
    usingCaching(options?: ICachingOptions): this;
    inBatch(batch: SPBatch): this;
    sendEmail(props: EmailProperties): Promise<void>;
    getCurrentUserEmailAddresses(): Promise<string>;
    resolvePrincipal(email: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        inputIsEmailOnly: boolean,
        addToUserInfoList: boolean,
        matchUserInfoList?: boolean): Promise<PrincipalInfo>;
    searchPrincipals(input: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        groupName: string,
        maxCount: number): Promise<PrincipalInfo[]>;
    createEmailBodyForInvitation(pageAddress: string): Promise<string>;
    expandGroupsToPrincipals(inputs: string[], maxCount?: number): Promise<PrincipalInfo[]>;
    createWikiPage(info: WikiPageCreationInformation): Promise<CreateWikiPageResult>;
    containsInvalidFileFolderChars(input: string, onPremise?: boolean): boolean;
    stripInvalidFileFolderChars(input: string, replacer?: string, onPremise?: boolean): string;
}

/**
 * Allows for calling of the static SP.Utilities.Utility methods by supplying the method name
 */
export class UtilityMethod extends SharePointQueryable implements UtilityMethods {
    private static readonly InvalidFileFolderNameCharsOnlineRegex = /["*:<>?/\\|\x00-\x1f\x7f-\x9f]/g;
    private static readonly InvalidFileFolderNameCharsOnPremiseRegex = /["#%*:<>?/\\|\x00-\x1f\x7f-\x9f]/g;

    /**
     * Creates a new instance of the Utility method class
     *
     * @param baseUrl The parent url provider
     * @param methodName The static method name to call on the utility class
     */
    constructor(baseUrl: string | SharePointQueryable, methodName: string) {

        super(UtilityMethod.getBaseUrl(baseUrl), `_api/SP.Utilities.Utility.${methodName}`);
    }

    private static getBaseUrl(candidate: string | SharePointQueryable) {

        if (typeof candidate === "string") {
            return candidate;
        }

        const c = candidate as SharePointQueryable;
        const url = c.toUrl();
        const index = url.indexOf("_api/");
        if (index < 0) {
            return url;
        }

        return url.substr(0, index);
    }

    public excute<T>(props: any): Promise<T> {

        return this.postCore<T>({
            body: jsS(props),
        });
    }

    /**
     * Sends an email based on the supplied properties
     *
     * @param props The properties of the email to send
     */
    public sendEmail(props: EmailProperties): Promise<void> {

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

        return this.clone(UtilityMethod, "SendEmail", true).excute<void>(params);
    }

    public getCurrentUserEmailAddresses(): Promise<string> {

        return this.clone(UtilityMethod, "GetCurrentUserEmailAddresses", true).excute<string>({}).then(r => {
            return hOP(r, "GetCurrentUserEmailAddresses") ? (<any>r).GetCurrentUserEmailAddresses : r;
        });
    }

    public resolvePrincipal(input: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        inputIsEmailOnly: boolean,
        addToUserInfoList: boolean,
        matchUserInfoList = false): Promise<PrincipalInfo> {

        const params = {
            addToUserInfoList: addToUserInfoList,
            input: input,
            inputIsEmailOnly: inputIsEmailOnly,
            matchUserInfoList: matchUserInfoList,
            scopes: scopes,
            sources: sources,
        };

        return this.clone(UtilityMethod, "ResolvePrincipalInCurrentContext", true).excute<PrincipalInfo>(params).then(r => {
            return hOP(r, "ResolvePrincipalInCurrentContext") ? (<any>r).ResolvePrincipalInCurrentContext : r;
        });
    }

    public searchPrincipals(input: string,
        scopes: PrincipalType,
        sources: PrincipalSource,
        groupName: string,
        maxCount: number): Promise<PrincipalInfo[]> {

        const params = {
            groupName: groupName,
            input: input,
            maxCount: maxCount,
            scopes: scopes,
            sources: sources,
        };

        return this.clone(UtilityMethod, "SearchPrincipalsUsingContextWeb", true).excute<PrincipalInfo[] | { SearchPrincipalsUsingContextWeb: PrincipalInfo[] }>(params).then(r => {
            return hOP(r, "SearchPrincipalsUsingContextWeb") ? (<any>r).SearchPrincipalsUsingContextWeb : r;
        });
    }

    public createEmailBodyForInvitation(pageAddress: string): Promise<string> {

        const params = {
            pageAddress: pageAddress,
        };

        return this.clone(UtilityMethod, "CreateEmailBodyForInvitation", true).excute<string>(params).then(r => {
            return hOP(r, "CreateEmailBodyForInvitation") ? (<any>r).CreateEmailBodyForInvitation : r;
        });
    }

    public expandGroupsToPrincipals(inputs: string[], maxCount = 30): Promise<PrincipalInfo[]> {

        const params = {
            inputs: inputs,
            maxCount: maxCount,
        };

        return this.clone(UtilityMethod, "ExpandGroupsToPrincipals", true).excute<PrincipalInfo[]>(params).then(r => {
            return hOP(r, "ExpandGroupsToPrincipals") ? (<any>r).ExpandGroupsToPrincipals : r;
        });
    }

    public createWikiPage(info: WikiPageCreationInformation): Promise<CreateWikiPageResult> {

        return this.clone(UtilityMethod, "CreateWikiPageInContextWeb", true).excute<CreateWikiPageResult>({
            parameters: info,
        }).then(r => {
            return {
                data: hOP(r, "CreateWikiPageInContextWeb") ? (<any>r).CreateWikiPageInContextWeb : r,
                file: new File(odataUrlFrom(r)),
            };
        });
    }

    /**
     * Checks if file or folder name contains invalid characters
     *
     * @param input File or folder name to check
     * @param onPremise Set to true for SharePoint On-Premise
     * @returns True if contains invalid chars, false otherwise
     */
    public containsInvalidFileFolderChars(input: string, onPremise = false): boolean {
        if (onPremise) {
            return UtilityMethod.InvalidFileFolderNameCharsOnPremiseRegex.test(input);
        } else {
            return UtilityMethod.InvalidFileFolderNameCharsOnlineRegex.test(input);
        }
    }

    /**
     * Removes invalid characters from file or folder name
     *
     * @param input File or folder name
     * @param replacer Value that will replace invalid characters
     * @param onPremise Set to true for SharePoint On-Premise
     * @returns File or folder name with replaced invalid characters
     */
    public stripInvalidFileFolderChars(input: string, replacer = "", onPremise = false): string {
        if (onPremise) {
            return input.replace(UtilityMethod.InvalidFileFolderNameCharsOnPremiseRegex, replacer);
        } else {
            return input.replace(UtilityMethod.InvalidFileFolderNameCharsOnlineRegex, replacer);
        }
    }
}

export interface CreateWikiPageResult {
    data: any;
    file: File;
}
