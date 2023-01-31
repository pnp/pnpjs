import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './HelloWorldWebPart.module.scss';

import { getGUID } from "@pnp/core";
import "@pnp/sp/webs";
import { SPFI, SPFx, spfi } from '@pnp/sp';

export interface IHelloWorldWebPartProps {
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  private sp: SPFI;

  public render(): void {

    this.domElement.innerHTML = `<div class="${styles.helloWorld}">${getGUID()}</div>`;

    setTimeout(() => {

      const button = document.createElement("button");

      button.textContent = "Testing";

      button.addEventListener("click", async (event) => {
        event.preventDefault();

        await this.sp.web.update({
          Title: `Testing Web`,
        });
      });

      this.domElement.append(button);

    }, 1000);
  }

  protected onInit(): Promise<void> {

    this.sp = spfi().using(SPFx(this.context));

    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
