import {
    AppCatalogs as IAppCatalogsType,
    TeamsApp as ITeamsAppType,
    TeamsAppDefinition as ITeamsAppDefinitionType,
    TeamworkBot as ITeamworkBot } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, graphPost, graphDelete, graphGet } from "../graphqueryable.js";
import {  IGetById, defaultPath, getById } from "../decorators.js";
import { InjectHeaders } from "@pnp/queryable/index.js";

/**
 * AppCatalogs
 */

@defaultPath("appCatalogs")
export class _AppCatalog extends _GraphInstance<IAppCatalogsType> {
    /**
     * Get teams apps in appCatalog
     *
     */
    public get teamsApps(): ITeamsApps {
        return TeamsApps(this);
    }

}
export interface IAppCatalog extends _AppCatalog {}
export const AppCatalog = graphInvokableFactory<IAppCatalog>(_AppCatalog);

/**
 * AppDefinition
 */
export class _AppDefinition extends _GraphInstance<ITeamsAppDefinitionType> {
    /**
     * Gets bot associated with app
     *
     */
    public async bot(): Promise<ITeamworkBot>{
        return graphGet(AppDefinitions(this, "/bot"));
    }
}
export interface IAppDefinition extends _AppDefinition { }
export const AppDefinition = graphInvokableFactory<IAppDefinition>(_AppDefinition);

/**
 * AppDefinitions
 */

@defaultPath("appDefinitions")
@getById(AppDefinition)
export class _AppDefinitions extends _GraphCollection<ITeamsAppDefinitionType[]> {}
export interface IAppDefinitions extends _AppDefinitions, IGetById<IAppDefinition> {}
export const AppDefinitions = graphInvokableFactory<IAppDefinitions>(_AppDefinitions);


/**
 * TeamsApp
 */
export class _TeamsApp extends _GraphInstance<ITeamsAppType> {
    /**
     * Get app definitions
     *
     */
    public get appDefinitions(): IAppDefinitions {
        return AppDefinitions(this);
    }

    /**
     * Deletes a Teams App
     *
     */
    public async delete(appDefinitionId?: string): Promise<any> {
        // Un-approved apps must be deleted differently. https://learn.microsoft.com/en-us/graph/api/teamsapp-delete?view=graph-rest-1.0&tabs=http#permissions
        if(appDefinitionId){
            return graphDelete(AppDefinitions(this,`/${appDefinitionId}`));
        }
        return graphDelete(this);
    }

    /**
     * Updates a Teams App
     *
     * @param zip  zip file of app
     * @param requiresReview This optional query parameter triggers the app review process. Users with admin privileges can submit apps without triggering a review.
     */
    public async update(zip: Blob, requiresReview = false): Promise<ITeamsAppType> {
        const q = AppDefinitions(this,`?$requiresReview=${requiresReview}`);
        q.using(InjectHeaders({
            "Content-Type": "application/zip",
        }));

        return graphPost(q, { body: zip });
    }
}

export interface ITeamsApp extends _TeamsApp{}
export const TeamsApp = graphInvokableFactory<ITeamsApp>(_TeamsApp);


/**
 * TeamsApps
 */

@defaultPath("teamsApps")
@getById(TeamsApp)
export class _TeamsApps extends _GraphCollection<ITeamsAppType[]> {
    /**
     * Adds a Teams App
     *
     * @param zip  zip file of app
     * @param requiresReview This optional query parameter triggers the app review process. Users with admin privileges can submit apps without triggering a review.
     *
     */
    public async add(zip: Blob, requiresReview = false): Promise<ITeamsAppType> {
        const q = TeamsApp(this, `?requiresReview=${requiresReview}`);
        q.using(InjectHeaders({
            "Content-Type": "application/zip",
        }));

        return graphPost(q, { body: zip });
    }
}
export interface ITeamsApps extends _TeamsApps, IGetById<ITeamsApp>{}
export const TeamsApps = graphInvokableFactory<ITeamsApps>(_TeamsApps);
