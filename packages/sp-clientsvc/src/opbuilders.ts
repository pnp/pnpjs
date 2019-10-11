import { ObjectPath, IObjectPath } from "./objectpath";
import { PropertyType } from "./types";

export function property(name: string, ...actions: string[]): IObjectPath {
    return new ObjectPath(`<Property Id="$$ID$$" ParentId="$$PARENT_ID$$" Name="${name}" />`, actions);
}

export function staticMethod(name: string, typeId: string, ...actions: string[]): IObjectPath {
    return new ObjectPath(`<StaticMethod Id="$$ID$$" Name="${name}" TypeId="${typeId}" />`, actions);
}

export function staticProperty(name: string, typeId: string, ...actions: string[]): IObjectPath {
    return new ObjectPath(`<StaticProperty Id="$$ID$$" Name="${name}" TypeId="${typeId}" />`, actions);
}

export function objConstructor(typeId: string, ...actions: string[]): IObjectPath {
    return new ObjectPath(`<Constructor Id="$$ID$$" TypeId="${typeId}" />`, actions);
}

export interface IMethodParamsBuilder {
    string(value: string): this;
    number(value: number): this;
    boolean(value: boolean): this;
    strArray(values: string[]): this;
    objectPath(inputIndex: number): this;
    toArray(): { type: PropertyType, value: string }[];
}

/**
 * Used to build parameters when calling methods
 */
export class MethodParams implements IMethodParamsBuilder {

    constructor(private _p: { type: PropertyType, value: string }[] = []) { }

    public static build(initValues: { type: PropertyType, value: string }[] = []): IMethodParamsBuilder {
        const params = new MethodParams();
        [].push.apply(params._p, <any>initValues);
        return params;
    }

    public string(value: string): this {
        return this.a("String", value);
    }

    public number(value: number): this {
        return this.a("Number", value.toString());
    }

    public boolean(value: boolean): this {
        return this.a("Boolean", value.toString());
    }

    public strArray(values: string[]): this {
        return this.a("Array", values.map(v => `<Object Type="String">${v}</Object>`).join(""));
    }

    public objectPath(inputIndex: number): this {
        return this.a("ObjectPath", inputIndex.toString());
    }

    public toArray(): { type: PropertyType, value: string }[] {
        return this._p;
    }

    private a(type: PropertyType, value: string): this {
        value = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
        this._p.push({ type, value });
        return this;
    }
}

export function method(name: string, params: IMethodParamsBuilder, ...actions: string[]): IObjectPath {
    const builder = [];
    builder.push(`<Method Id="$$ID$$" ParentId="$$PARENT_ID$$" Name="${name}">`);

    if (params !== null) {
        const arrParams = params.toArray();
        if (arrParams.length < 1) {
            builder.push(`<Parameters />`);
        } else {
            builder.push(`<Parameters>`);
            [].push.apply(builder, <any>arrParams.map(p => {

                if (p.type === "ObjectPath") {
                    return `<Parameter ObjectPathId="$$OP_PARAM_ID_${p.value}$$" />`;
                }

                return `<Parameter Type="${p.type}">${p.value}</Parameter>`;
            }));
            builder.push(`</Parameters>`);
        }
    }

    builder.push("</Method>");

    return new ObjectPath(builder.join(""), actions);
}
