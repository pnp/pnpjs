import {  DocumentSetVersion as IDocumentSetVersionEntity } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, graphPost, GraphInstance, GraphQueryable } from "../graphqueryable.js";
import { defaultPath, deleteable, IDeleteable, getById, IGetById } from "../decorators.js";
import { body } from "@pnp/queryable";

/**
 * Represents a document set version
 */
@deleteable()
export class _DocumentSetVersion extends _GraphInstance<IDocumentSetVersionEntity> { 
    /**
     * Restore a document set version
     * 
     */
    public async restore(): Promise<void> {
        return graphPost(DocumentSetVersion(this, "restore"));
    }
}
export interface IDocumentSetVersion extends _DocumentSetVersion, IDeleteable { }
export const DocumentSetVersion = graphInvokableFactory<IDocumentSetVersion>(_DocumentSetVersion);

/**
 * Describes a collection of document set versions
 *
 */
@defaultPath("documentSetVersions")
@getById(DocumentSetVersion)
export class _DocumentSetVersions extends _GraphCollection<IDocumentSetVersionEntity[]>{
     /**
     * Create a new document set version as specified in the request body.
     *
     * @param comment a comment about the captured version
     * @param shouldCaptureMinorVersion If true, minor versions of items are also captured; otherwise, only major versions will be captured.
     * 
     */
     public async add(comment: string, shouldCaptureMinorVersion:boolean = false): Promise<IDocumentSetVersionAddResult> {

        const postBody = {
            comment: comment,
            shouldCaptureMinorVersion: shouldCaptureMinorVersion
        }
        const data = await graphPost(this, body(postBody));
        
        return {
            data,
            item: (<any>this).getById(data.id),
        };
     }
}

export interface IDocumentSetVersions extends _DocumentSetVersions, IGetById<IDocumentSetVersion> {}
export const DocumentSetVersions = graphInvokableFactory<IDocumentSetVersions>(_DocumentSetVersions);

/**
 * IListAddResult
 */
export interface IDocumentSetVersionAddResult {
    item: IDocumentSetVersion;
    data: IDocumentSetVersionEntity;
}