import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./ProjectPresetWebPart.module.scss";
import * as strings from "ProjectPresetWebPartStrings";

import { mySPFi } from "../../pnpjs-preset";

export interface IProjectPresetWebPartProps {
  description: string;
}

export default class ProjectPresetWebPart extends BaseClientSideWebPart<IProjectPresetWebPartProps> {

  public render(): void {

    const sp = mySPFi(this.context);

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
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
