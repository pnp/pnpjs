import { getAttrValueFromString, jsS, hOP } from "@pnp/common";
import { IObjectPath } from "./objectpath";

/**
 * Used within the request pipeline to parse ProcessQuery results
 */
export class ProcessQueryParser<T = any> {

    constructor(protected op: IObjectPath) { }

    /**
     * Parses the response checking for errors
     * 
     * @param r Response object
     */
    public parse(r: Response): Promise<T> {

        return r.text().then(t => {

            if (!r.ok) {
                throw Error(t);
            }

            try {
                return JSON.parse(t);
            } catch (e) {
                // special case in ProcessQuery where we got an error back, but it is not in json format
                throw Error(t);
            }

        }).then((parsed: any[]) => {

            // here we need to check for an error body
            if (parsed.length > 0 && hOP(parsed[0], "ErrorInfo") && parsed[0].ErrorInfo !== null) {
                throw Error(jsS(parsed[0].ErrorInfo));
            }

            return this.findResult(parsed);
        });
    }

    public findResult(json: any): Promise<T | null> {

        for (let i = 0; i < this.op.actions.length; i++) {

            const a = this.op.actions[i];

            // let's see if the result is null based on the ObjectPath action, if it exists
            // <ObjectPath Id="8" ObjectPathId="7" />
            if (/^<ObjectPath /i.test(a)) {
                const result = this.getParsedResultById<{ IsNull: boolean }>(json, parseInt(getAttrValueFromString(a, "Id"), 10));
                if (!result || (result && result.IsNull)) {
                    return Promise.resolve(null);
                }
            }

            // let's see if we have a query result
            // <Query Id="5" ObjectPathId = "3" >
            if (/^<Query /i.test(a)) {
                const result = this.getParsedResultById(json, parseInt(getAttrValueFromString(a, "Id"), 10));

                if (result && hOP(result, "_Child_Items_")) {
                    // this is a collection result
                    /* tslint:disable:no-string-literal */
                    return Promise.resolve(result["_Child_Items_"]);
                    /* tslint:enable:no-string-literal */
                } else {
                    // this is an instance result
                    return Promise.resolve(result);
                }
            }

            // this is an invokeMethodAction so the last method action corresponds to our result
            if (i === (this.op.actions.length - 1) && /^<Method /i.test(a)) {
                return Promise.resolve(this.getParsedResultById(json, parseInt(getAttrValueFromString(a, "Id"), 10)));
            }
        }

        // no result could be found so we are effectively returning void
        // issue is we really don't know if we should be returning void (a method invocation with a void return) or
        // if we just didn't find something above. We will let downstream things worry about that
    }

    /**
     * Locates a result by ObjectPath id
     * 
     * @param parsed the parsed JSON body from the response
     * @param id The ObjectPath id whose result we want
     */
    protected getParsedResultById<R = any>(parsed: any[], id: number): R {

        for (let i = 0; i < parsed.length; i++) {

            if (parsed[i] === id) {
                return parsed[i + 1];
            }
        }

        return null;
    }
}
