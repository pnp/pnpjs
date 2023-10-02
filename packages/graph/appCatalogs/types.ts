
import { AppCatalogs as IAppCatalogsType, TeamsApp as ITeamsAppType, TeamsAppDefinition as ITeamsAppDefinitionType } from "@microsoft/microsoft-graph-types";
import { _GraphCollection, graphInvokableFactory, _GraphInstance, graphPost, graphDelete } from "../graphqueryable.js";
import { IGetById, defaultPath, getById } from "../decorators.js";
import { InjectHeaders } from "@pnp/queryable/index.js";

/**
 * AppCatalogs
 */

@defaultPath("appCatalogs")
export class _AppCatalogs extends _GraphInstance<IAppCatalogsType> { 
    /**
     * Get teams apps in appCatalog
     * 
     */
    public get teamsApps(): ITeamsApps {
        return TeamsApps(this);
    }

}
export interface IAppCatalogs extends _AppCatalogs { }
export const AppCatalogs = graphInvokableFactory<IAppCatalogs>(_AppCatalogs);


/**
 * AppDefinitions
 */
export class _AppDefinition extends _GraphInstance<ITeamsAppDefinitionType> { }
export interface IAppDefinition extends _AppDefinition { }
export const AppDefinitions = graphInvokableFactory<IAppDefinition>(_AppDefinition);


/**
 * TeamsApp
 */
export class _TeamsApp extends _GraphInstance<ITeamsAppType> { 

    /**
     * Deletes a Teams App
     * 
     */
    public async delete(appDefinitionId?: string): Promise<any> {
        
        // Un-approved apps must be deleted differently. https://learn.microsoft.com/en-us/graph/api/teamsapp-delete?view=graph-rest-1.0&tabs=http#permissions
        if(appDefinitionId){
            return graphDelete(TeamsApp(this,`/appDefinitions/${appDefinitionId}`));
        }
        return graphDelete(this);
    }

     /**
     * Updates a Teams App
     *
     * @param zip  zip file of app
     * @param requiresReview This optional query parameter triggers the app review process. Users with admin privileges can submit apps without triggering a review. 
     */
     public async update(zip: Blob, requiresReview:boolean = false): Promise<ITeamsAppType> {
        
        const q = TeamsApp(this,`appDefinitions?$requiresReview=${requiresReview}`);
        q.using(InjectHeaders({
            "Content-Type": "application/zip",
        }));
        
        return graphPost(q, { body: zip });
    }

}

export interface ITeamsApp extends _TeamsApp { }
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
     */
     public async add(zip: Blob, requiresReview:boolean = false): Promise<ITeamsAppType> {

        const q = TeamsApp(this);
        q.using(InjectHeaders({
            "Content-Type": "application/zip",
        }));
        
        return graphPost(q, { body: zip });
    }
 }
export interface ITeamsApps extends _TeamsApps, IGetById<ITeamsApp> {} { }
export const TeamsApps = graphInvokableFactory<ITeamsApps>(_TeamsApps);
