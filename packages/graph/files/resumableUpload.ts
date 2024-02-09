import { AssignFrom, CopyFrom } from "@pnp/core";
import { UploadSession as IUploadSessionType } from "@microsoft/microsoft-graph-types";
import {
    _GraphInstance,
    graphInvokableFactory,
    GraphQueryable,
    graphPost,
    graphPut,
    IGraphQueryable,
    graphDelete,
} from "../graphqueryable.js";
import { InjectHeaders, body } from "@pnp/queryable";

/**
 * Describes a resumable upload session
 *
 */
export class _ResumableUpload extends _GraphInstance<IUploadSessionType> {
    /** Get the status of teh Resumable Upload URL */
    public get status(): IGraphQueryable<IUploadSessionType> {
        return GraphQueryable(this);
    }

    /** Upload a chunk of the file
    * @param byteLength - number - the length of the byte array
    * @param buffer - any - the buffer to upload
    * @param contentRange - string (Optional) - the content range to upload e.g. `bytes 0-311/312`
    */
    public async upload(byteLength: number, buffer: any, contentRange?: string): Promise<IUploadSessionType> {
        const range = contentRange || `bytes 0-${byteLength - 1}/${byteLength}`;
        return graphPut(this, { body: buffer, headers: { "Content-Length": byteLength.toString(), "Content-Range": range } });
    }

    /** Cancel the Resumable Upload */
    public async cancel(): Promise<void> {
        return graphDelete(this, body(null));
    }
}
export interface IResumableUpload extends _ResumableUpload { }
export const ResumableUpload = graphInvokableFactory<IResumableUpload>(_ResumableUpload);


export async function getUploadSession(resuableUploadOptions: any): Promise<{session: IUploadSessionType; resumableUpload: IResumableUpload}> {
    const create = resuableUploadOptions.create != null ? resuableUploadOptions.create : true;
    const url = this.toRequestUrl();
    const q = GraphQueryable(`${url}${(create)?`:/${resuableUploadOptions.item.name}:/`:""}createUploadSession`).using(AssignFrom(this));

    if(resuableUploadOptions.eTag) {
        const header = {};
        header[resuableUploadOptions.eTagMatch || "If-Match"] = resuableUploadOptions.eTag;
        q.using(InjectHeaders(header));
    }
    const postBody: any = {};
    if(resuableUploadOptions.conflictBehavior || resuableUploadOptions.item) {
        Object.defineProperty(postBody, "item", {value: {}, writable: true});
        if(resuableUploadOptions.item){
            postBody.item = resuableUploadOptions.item;
        }
        postBody.item["@microsoft.graph.conflictBehavior"] = resuableUploadOptions.conflictBehavior || "rename";
    }
    if(resuableUploadOptions.deferCommit){
        Object.defineProperty(postBody, "deferCommit", { value: resuableUploadOptions.deferCommit });
    }
    // Create the upload session
    const session = await graphPost(q, body(postBody));

    // Create a new queryable for the upload session
    const uploadQueryable = GraphQueryable(session.uploadUrl).using(CopyFrom(this, "replace", (k) => /(pre|init|send|parse|post|data)/i.test(k)));

    const resumableUpload = ResumableUpload(uploadQueryable);

    return {session, resumableUpload};
}

/**
 * IResumableUploadOptions for creating a resumable upload for uploading a file.
 * @param item - Microsoft Graph - IDriveItemUploadablePropertiesType (Optional), must specify the name property.
 * @param create - boolean (Optional) - default true for new files; false for updates
 * @param deferCommit - boolean (Optional)
 * @param eTag - string (Optional)
 * @param eTagMatch - string (Optional) - eTag header "If-Match" or "If-None-Match"
 * @param conflictBehavior - string (Optional) - "rename" | "replace" | "fail" rename is default
 */
export interface IResumableUploadOptions<T> {
    item?: T;
    create?: boolean;
    deferCommit?: boolean;
    eTag?: string;
    eTagMatch?: "If-Match" | "If-None-Match";
    conflictBehavior?: "rename" | "replace" | "fail";
}
