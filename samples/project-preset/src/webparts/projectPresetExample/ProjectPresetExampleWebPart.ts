import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ProjectPresetExampleWebPart.module.scss';
import * as strings from 'ProjectPresetExampleWebPartStrings';

// import our preset sp with all the functionality we need
// we don't in this case import directly from @pnp/sp or other sources
import { sp } from "../../pnp-preset";

export interface IProjectPresetExampleWebPartProps {
  description: string;
}

export default class ProjectPresetExampleWebPart extends BaseClientSideWebPart<IProjectPresetExampleWebPartProps> {

  protected async onInit(): Promise<void> {
    await super.onInit();

    // we always setup using the current context
    sp.setup(this.context);
  }

  public render(): void {

    // create a button
    const button = document.createElement("button");
    button.innerHTML = "Ensure List";
    button.addEventListener("click", async (e: MouseEvent) => {

      // call our extension method for cleaner code within our components
      await sp.web.ensureSpecialList("My Title", "A description");

      // and provide some feedback that stuff happened, again just using appendChild
      this.domElement.appendChild(new Text("List should now be there"));
    });

    // old school appendChild!
    this.domElement.appendChild(button);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
