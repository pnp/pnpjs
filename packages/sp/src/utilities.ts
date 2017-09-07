import { SharePointQueryable } from "./sharepointqueryable";
import { Util } from "../utils/util";
import { EmailProperties } from "./types";
import { ODataBatch } from "./batch";
import { ICachingOptions } from "../odata/caching";
import { File } from "./files";
import { spExtractODataId } from "./odata";
import { PrincipalInfo, PrincipalType, PrincipalSource, WikiPageCreationInformation } from "./types";

/**
 * Public interface for the utility methods to limit SharePointQueryable method exposure
 */
export interface UtilityMethods {
    usingCaching(options?: ICachingOptions): this;
    inBatch(batch: ODataBatch): this;
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
}

/**
 * Allows for calling of the static SP.Utilities.Utility methods by supplying the method name
 */
export class UtilityMethod extends SharePointQueryable implements UtilityMethods {

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

    /**
     * Creates a new instance of the Utility method class
     *
     * @param baseUrl The parent url provider
     * @param methodName The static method name to call on the utility class
     */
    constructor(baseUrl: string | SharePointQueryable, methodName: string) {

        super(UtilityMethod.getBaseUrl(baseUrl), `_api/SP.Utilities.Utility.${methodName}`);
    }

    public excute<T>(props: any): Promise<T> {

        return this.postAsCore<T>({
            body: JSON.stringify(props),
        });
    }

    /**
     * Clones this SharePointQueryable into a new SharePointQueryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     */
    protected create(methodName: string, includeBatch: boolean): UtilityMethod {
        let clone = new UtilityMethod(this.parentUrl, methodName);
        const target = this.query.get("@target");
        if (target !== null) {
            clone.query.add("@target", target);
        }
        if (includeBatch && this.hasBatch) {
            clone = clone.inBatch(this.batch);
        }
        return clone;
    }

    /**
     * Sends an email based on the supplied properties
     *
     * @param props The properties of the email to send
     */
    public sendEmail(props: EmailProperties): Promise<void> {

        const params = {
            properties: {
                Body: props.Body,
                From: props.From,
                Subject: props.Subject,
                "__metadata": { "type": "SP.Utilities.EmailProperties" },
            },
        };

        if (props.To && props.To.length > 0) {

            params.properties = Util.extend(params.properties, {
                To: { results: props.To },
            });
        }

        if (props.CC && props.CC.length > 0) {

            params.properties = Util.extend(params.properties, {
                CC: { results: props.CC },
            });
        }

        if (props.BCC && props.BCC.length > 0) {

            params.properties = Util.extend(params.properties, {
                BCC: { results: props.BCC },
            });
        }

        if (props.AdditionalHeaders) {
            params.properties = Util.extend(params.properties, {
                AdditionalHeaders: props.AdditionalHeaders,
            });
        }

        return this.create("SendEmail", true).excute<void>(params);
    }

    public getCurrentUserEmailAddresses(): Promise<string> {

        return this.create("GetCurrentUserEmailAddresses", true).excute<string>({});
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

        return this.create("ResolvePrincipalInCurrentContext", true).excute<PrincipalInfo>(params);
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

        return this.create("SearchPrincipalsUsingContextWeb", true).excute<PrincipalInfo[]>(params);
    }

    public createEmailBodyForInvitation(pageAddress: string): Promise<string> {

        const params = {
            pageAddress: pageAddress,
        };

        return this.create("CreateEmailBodyForInvitation", true).excute<string>(params);
    }

    public expandGroupsToPrincipals(inputs: string[], maxCount = 30): Promise<PrincipalInfo[]> {

        const params = {
            inputs: inputs,
            maxCount: maxCount,
        };

        return this.create("ExpandGroupsToPrincipals", true).excute<PrincipalInfo[]>(params);
    }

    public createWikiPage(info: WikiPageCreationInformation): Promise<CreateWikiPageResult> {

        return this.create("CreateWikiPageInContextWeb", true).excute<CreateWikiPageResult>({
            parameters: info,
        }).then(r => {
            return {
                data: r,
                file: new File(spExtractODataId(r)),
            };
        });
    }
}

export interface CreateWikiPageResult {
    data: any;
    file: File;
}
