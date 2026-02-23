import AppInsights from 'applicationinsights';
import { DefaultAzureCredential } from "@azure/identity";
import { MyItem } from './models.js';

import { spfi, SPFI } from "@pnp/sp";
import { AzureIdentity } from "@pnp/azidjsclient";
import { GraphDefault, SPDefault } from "@pnp/nodejs";
import "@pnp/sp/webs/index.js";
import "@pnp/sp/lists/index.js";
import "@pnp/sp/items/index.js";
import { graphfi, GraphFI } from '@pnp/graph';

export interface IPnpjsService {
  Init: () => Promise<boolean>;
  GetListItem: (id: string) => Promise<MyItem>;
}

export class PnpjsService implements IPnpjsService {
  private LOG_SOURCE = "PnpjsService";
  private _ready: boolean = false;

  private _sp: SPFI = null;
  private _graph: GraphFI = null;

  public constructor() { }

  public async Init(): Promise<boolean> {
    let retVal = false;
    try {

      const credential = new DefaultAzureCredential();

      this._sp = spfi(process.env.SiteUrl).using(SPDefault({}),
        AzureIdentity(credential, [`https://${process.env.Tenant}.sharepoint.com/.default`], null));

      this._graph = graphfi().using(GraphDefault({}), AzureIdentity(credential, [`https://graph.microsoft.com/.default`], null));

      this._ready = true;
      retVal = true;
      AppInsights.defaultClient.trackTrace({
        message: 'Init success',
        properties: {
          source: this.LOG_SOURCE,
          method: "Init"
        },
        severity: AppInsights.Contracts.SeverityLevel.Verbose
      });
    } catch (err) {
      AppInsights.defaultClient.trackException({
        exception: err,
        severity: AppInsights.Contracts.SeverityLevel.Critical,
        properties: { source: this.LOG_SOURCE, method: "Init" }
      });
    }
    return retVal;
  }

  public get ready(): boolean {
    return this._ready;
  }

  public async GetListItem(id: string): Promise<MyItem> {
    let retVal: MyItem = null;
    try {
      const item = await this._sp.web.lists.getById(process.env.ListGUID).items.getById(+id)();
      retVal = { Id: item.Id, Title: item.Title, Description: item.Description };
      AppInsights.defaultClient.trackTrace({
        message: 'GetListItem success',
        properties: {
          source: this.LOG_SOURCE,
          method: "GetListItem"
        },
        severity: AppInsights.Contracts.SeverityLevel.Verbose
      });
    } catch (err) {
      AppInsights.defaultClient.trackException({
        exception: err,
        severity: AppInsights.Contracts.SeverityLevel.Critical,
        properties: { source: this.LOG_SOURCE, method: "GetListItem" }
      });
    }
    return retVal;
  }
}

export const pnpjs: IPnpjsService = new PnpjsService();
