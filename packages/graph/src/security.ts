import { jsS } from "@pnp/common";
import { GraphQueryableCollection, defaultPath, GraphQueryableInstance } from "./graphqueryable";
import { Security as ISecurity, Alert as IAlert } from "@microsoft/microsoft-graph-types";

export interface ISecurityMethods {
    alerts: Alerts;
}

@defaultPath("security")
export class Security extends GraphQueryableInstance<ISecurity> implements ISecurityMethods {

    public get alerts(): Alerts {
        return new Alerts(this);
    }
}

@defaultPath("alerts")
export class Alerts extends GraphQueryableCollection<IAlert[]> {
    public getById(id: string): Alert {
        return new Alert(this, id);
    }
}

export class Alert extends GraphQueryableInstance<IAlert> {

    /**
    * Update the properties of an Alert
    * 
    * @param properties Set of properties of this Alert to update
    */
    public update(properties: IAlert): Promise<void> {

        return this.patchCore({
            body: jsS(properties),
        });
    }
}
