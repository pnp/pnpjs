import { IInvokable } from "@pnp/queryable";
import { expect } from "chai";

// eslint-disable-next-line max-len
function testInvokableProps<TargetType extends IInvokable, Keys extends string & keyof TargetType>(targetF: () => TargetType, ...keys: (Keys | [string, () => IInvokable])[]): () => void {

    return () => {

        let target = null;

        before(function () {
            if (typeof targetF === "function") {
                target = targetF();
            }
        });

        for (let i = 0; i < keys.length; i++) {

            if (typeof keys[i] === "string") {

                it(<string>keys[i], function () {
                    return expect((<any>target)[keys[i]]()).to.eventually.be.fulfilled;
                });

            } else {

                it(keys[i][0], function () {
                    return expect((<any>keys)[i][1]()()).to.eventually.be.fulfilled;
                });
            }
        }
    };
}

export default testInvokableProps;
