import { _SPCollection } from "../spqueryable.js";
import { _Where, Clause } from "./types.js";

declare module "../spqueryable" {
    interface _SPCollection<GetType> {
        where<U = any>(cb: (builder: _Where<U>) => Clause<U>): _SPCollection<GetType>;
    }
}

_SPCollection.prototype.where = function <U = any>(this: _SPCollection<any>, cb: (builder: _Where<U>) => Clause<U>) {
    const builder = new _Where<U>(this as any);
    cb(builder);
    return this.filter(builder.toString());
};

export { _Where, OpenClause, Clause, TextFieldOptions } from "./types.js";
