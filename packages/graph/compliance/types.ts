import {
    Privacy as IPrivacyType,
    SubjectRightsRequest as ISubjectRightsRequestType,
    AuthoredNote as IAuthoredNoteType,
    ItemBody as ItemBodyType } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, graphGet, _GraphQueryable, GraphQueryable } from "../graphqueryable.js";
import {  IAddable, IGetById, IUpdateable, addable, defaultPath, getById, updateable } from "../decorators.js";
import { BlobParse } from "@pnp/queryable/index.js";

/**
 * Compliance
 */
@defaultPath("security")
export class _Compliance extends _GraphQueryable<IPrivacyType> {
    /**
     * Get subject rights requests
     *
     */
    public get subjectRightsRequests(): ISubjectRightsRequests {
        return SubjectRightsRequests(this);
    }

}
export interface ICompliance extends _Compliance {}
export const Compliance = graphInvokableFactory<ICompliance>(_Compliance);

/**
 * SubjectRightsRequest
 */
@defaultPath("/")
@updateable()
export class _SubjectRightsRequest extends _GraphInstance<ISubjectRightsRequestType> {
    /**
    * Get the final report for a subject rights request as a Blob
    */
    public async finalReport(): Promise<Blob>{
        return graphGet(GraphQueryable(this, "getFinalReport").using(BlobParse()));
    }

    /**
    * Get the final attachment for a subject rights request as a Blob
    */
    public async finalAttachment(): Promise<Blob>{
        return graphGet(GraphQueryable(this, "getFinalAttachment").using(BlobParse()));
    }

    /**
    * Get the list of authored notes assoicated with a subject rights request.
    */
    public get notes(): INotes {
        return Notes(this);
    }
}
export interface ISubjectRightsRequest extends _SubjectRightsRequest, IUpdateable<ISubjectRightsRequestType> { }
export const SubjectRightsRequest = graphInvokableFactory<ISubjectRightsRequest>(_SubjectRightsRequest);

/**
 * SubjectRightsRequests
 */
@defaultPath("subjectRightsRequests")
@getById(SubjectRightsRequest)
@addable()
export class _SubjectRightsRequests extends _GraphCollection<ISubjectRightsRequestType[]> {}
export interface ISubjectRightsRequests extends _SubjectRightsRequests, IGetById<ISubjectRightsRequest>, IAddable<ISubjectRightsRequestType, ISubjectRightsRequestType> {}
export const SubjectRightsRequests = graphInvokableFactory<ISubjectRightsRequests>(_SubjectRightsRequests);

/**
 * Notes
 */
@defaultPath("notes")
@addable()
export class _Notes extends _GraphCollection<IAuthoredNoteType[]> {}
export interface INotes extends _Notes, IAddable<ItemBodyType, IAuthoredNoteType> {}
export const Notes = graphInvokableFactory<INotes>(_Notes);
