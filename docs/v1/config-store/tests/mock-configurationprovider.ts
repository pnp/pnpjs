import { IConfigurationProvider } from "../";
import { TypedHash } from "@pnp/common";

export default class MockConfigurationProvider implements IConfigurationProvider {
    public shouldThrow = false;
    public shouldReject = false;

    constructor(public mockValues?: TypedHash<string>) { }

    public getConfiguration(): Promise<TypedHash<string>> {
        if (this.shouldThrow) {
            throw Error("Mocked error");
        }

        return new Promise<TypedHash<string>>((resolve, reject) => {
            if (this.shouldReject) {
                reject("Mocked rejection");
            } else {
                resolve(this.mockValues);
            }
        });
    }
}
