import { IConfigurationProvider } from "../../packages/config-store";
import { ITypedHash } from "@pnp/common";

export default class MockConfigurationProvider implements IConfigurationProvider {
    public shouldThrow = false;
    public shouldReject = false;

    constructor(public mockValues?: ITypedHash<string>) { }

    public getConfiguration(): Promise<ITypedHash<string>> {
        if (this.shouldThrow) {
            throw Error("Mocked error");
        }

        return new Promise<ITypedHash<string>>((resolve, reject) => {
            if (this.shouldReject) {
                reject("Mocked rejection");
            } else {
                resolve(this.mockValues);
            }
        });
    }
}
