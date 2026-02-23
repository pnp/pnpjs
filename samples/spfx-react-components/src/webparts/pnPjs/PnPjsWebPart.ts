import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import pnpjs, { IpnpjsProps } from './components/PnPjs';
import { getSP } from './pnpjsConfig';

export interface IpnpjsWebPartProps {
  description: string;
}

export default class pnpjsWebPart extends BaseClientSideWebPart<IpnpjsWebPartProps> {

  protected async onInit(): Promise<void> {
    //Initialize our _sp object that we can then use in other packages without having to pass around the context.
    //  Check out pnpjsConfig.ts for an example of a project setup file.
    getSP(this.context);
    
  }

  public render(): void {
    const element: React.ReactElement<IpnpjsProps> = React.createElement(
      pnpjs, {}
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

}
