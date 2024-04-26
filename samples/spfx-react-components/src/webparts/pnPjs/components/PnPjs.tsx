import * as React from "react";

import { Logger, LogLevel } from "@pnp/logging";
import { Caching } from "@pnp/queryable";

import styles from "./PnPjs.module.scss";
import { getSP } from "../pnpjsConfig";
import { spfi, SPFI } from "@pnp/sp";
import { Label, PrimaryButton } from "@fluentui/react";
import { Web } from "@pnp/sp/webs";

export interface IFile {
  Id: number;
  Title: string;
  Name: string;
  Size: number;
}

export interface IResponseFile {
  Length: number;
}

export interface IResponseItem {
  Id: number;
  File: IResponseFile;
  FileLeafRef: string;
  Title: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IpnpjsProps {
}

export interface IpnpjsState {
  items: IFile[];
}

export class pnpjsState implements IpnpjsState {
  constructor(
    public items: IFile[] = []
  ) { }
}

export default class pnpjs extends React.PureComponent<IpnpjsProps, IpnpjsState> {
  private LOG_SOURCE = "🔶pnpjs";
  private LIBRARY_NAME = "Documents";
  private _sp: SPFI;

  constructor(props: IpnpjsProps) {
    super(props);
    this.state = new pnpjsState();
    this._sp = getSP();
  }

  public componentDidMount(): void {
    this._readAllFilesSize();
  }

  private _readAllFilesSize = async (): Promise<void> => {
    try {
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseItem[] = await spCache.web.lists
        .getByTitle(this.LIBRARY_NAME)
        .items
        .select("Id", "Title", "FileLeafRef", "File/Length")
        .expand("File")();

      const items: IFile[] = response.map((item: IResponseItem) => {
        return {
          Id: item.Id,
          Title: item.Title || "Unknown",
          Size: item.File?.Length || 0,
          Name: item.FileLeafRef
        };
      });

      this.setState({ items });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_readAllFilesSize) - ${JSON.stringify(err)}`, LogLevel.Error);
    }
  }

  private _updateTitles = async (): Promise<void> => {
    try {
      const [batchedSP, execute] = this._sp.batched();

      const items: IFile[] = JSON.parse(JSON.stringify(this.state.items));

      const res: { Id: number, Title: string }[] = [];
      for (let i = 0; i < items.length; i++) {
        batchedSP.web.lists
          .getByTitle(this.LIBRARY_NAME)
          .items
          .getById(items[i].Id)
          .update({ Title: `${items[i].Name}-Updated` })
          .then(r => res.push(r));
      }

      await execute();

      // res object only contains eTag of changed item.
      // Dirty update of UI
      for (let i = 0; i < res.length; i++) {
        items[i].Title = `${items[i].Name}-Updated`;
      }
      this.setState({ items });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_updateTitles) - ${JSON.stringify(err)}`, LogLevel.Error);
    }
  }

  private _getDemoItems = async(): Promise<void> => {
    try {
      const oldItems = this.state.items;
      const webUrl = `${window.location.origin}/sites/Demos`;
      // Optionally
      // const webSP = spfi(webUrl).using(SPFx({ pageContext: this._pageContext }));
      // const web = webSP.web;
      const web = Web([this._sp.web, webUrl]);
      let newItems: IFile[] = [];
      if(web){
        const response: IResponseItem[] = await web.lists
        .getByTitle(this.LIBRARY_NAME)
        .items
        .select("Id", "Title", "FileLeafRef", "File/Length")
        .expand("File")();

        newItems = response.map((item: IResponseItem) => {
          return {
            Id: item.Id,
            Title: item.Title || "Unknown",
            Size: item.File?.Length || 0,
            Name: item.FileLeafRef
          };
        });
      }
      const items = oldItems.concat(newItems);
      this.setState({ items });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (_getDemoItems) - ${JSON.stringify(err)}`, LogLevel.Error);
    }
  }

  public render(): React.ReactElement<IpnpjsProps> {
    try {
      return (
        <div data-component={this.LOG_SOURCE} className={styles.pnpjs}>
          <Label>Welcome to PnP JS Demo!</Label>
          <PrimaryButton onClick={this._updateTitles}>Update Item Titles</PrimaryButton>
          <br/><br/>
          <PrimaryButton onClick={this._getDemoItems}>Get Items from Demo Site</PrimaryButton>
          <Label>List of documents:</Label>
          <table width="100%">
            <tr>
              <td><strong>Title</strong></td>
              <td><strong>Name</strong></td>
              <td><strong>Size (KB)</strong></td>
            </tr>
            {this.state.items && this.state.items.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{item.Title}</td>
                  <td>{item.Name}</td>
                  <td>{(item.Size / 1024).toFixed(2)}</td>
                </tr>
              );
            })}
          </table>
        </div>
      );
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (render) - ${JSON.stringify(err)}`, LogLevel.Error);
      return null;
    }
  }
}