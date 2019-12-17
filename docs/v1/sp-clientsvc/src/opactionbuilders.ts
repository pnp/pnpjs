import { PropertyType } from "./types";
import { IMethodParamsBuilder } from "./opbuilders";

export function objectPath(): string {
    return `<ObjectPath Id="$$ID$$" ObjectPathId="$$PATH_ID$$" />`;
}

export function identityQuery(): string {
    return `<ObjectIdentityQuery Id="$$ID$$" ObjectPathId="$$PATH_ID$$" />`;
}

export function opQuery(selectProperties: string[] = null, childSelectProperties: string[] | null = null): string {

    // this is fairly opaque behavior, but is the simplest way to convey the required information.
    // if selectProperties.length === 0 or null then select all
    // else select indicated properties

    // if childSelectProperties === null do not include that block
    // if childSelectProperties.length === 0 then select all
    // else select indicated properties

    const builder = [];
    builder.push(`<Query Id="$$ID$$" ObjectPathId="$$PATH_ID$$">`);
    if (selectProperties === null || selectProperties.length < 1) {
        builder.push(`<Query SelectAllProperties="true" >`);
        builder.push(`<Properties />`);
        builder.push(`</Query >`);
    } else {
        builder.push(`<Query SelectAllProperties="false" >`);
        builder.push(`<Properties>`);
        [].push.apply(builder, <any>selectProperties.map(p => `<Property Name="${p}" SelectAll="true" />`));
        builder.push(`</Properties>`);
        builder.push(`</Query >`);
    }

    if (childSelectProperties !== null) {
        if (childSelectProperties.length < 1) {
            builder.push(`<ChildItemQuery SelectAllProperties="true" >`);
            builder.push(`<Properties />`);
            builder.push(`</ChildItemQuery >`);
        } else {
            builder.push(`<ChildItemQuery SelectAllProperties="false" >`);
            builder.push(`<Properties>`);
            [].push.apply(builder, <any>childSelectProperties.map(p => `<Property Name="${p}" SelectAll="true" />`));
            builder.push(`</Properties>`);
            builder.push(`</ChildItemQuery >`);
        }
    }

    builder.push(`</Query >`);

    return builder.join("");
}

export function setProperty(name: string, type: PropertyType, value: string): string {
    const builder = [];
    builder.push(`<SetProperty Id="$$ID$$" ObjectPathId="$$PATH_ID$$" Name="${name}">`);
    builder.push(`<Parameter Type="${type}">${value}</Parameter>`);
    builder.push(`</SetProperty>`);
    return builder.join("");
}

export function methodAction(name: string, params: IMethodParamsBuilder | null): string {

    const builder = [];
    builder.push(`<Method Id="$$ID$$" ObjectPathId="$$PATH_ID$$" Name="${name}">`);

    if (params !== null) {
        const arrParams = params.toArray();
        if (arrParams.length < 1) {
            builder.push(`<Parameters />`);
        } else {
            builder.push(`<Parameters>`);
            [].push.apply(builder, <any>arrParams.map(p => `<Parameter Type="${p.type}">${p.value}</Parameter>`));
            builder.push(`</Parameters>`);
        }
    }

    builder.push("</Method>");

    return builder.join("");
}

export function objectProperties(o: any): string[] {

    return Object.getOwnPropertyNames(o).map((name) => {

        const value = o[name];
        if (typeof value === "boolean") {
            return setProperty(name, "Boolean", `${value}`);
        } else if (typeof value === "number") {
            return setProperty(name, "Number", `${value}`);
        } else if (typeof value === "string") {
            return setProperty(name, "String", `${value}`);
        }

        return "";
    }, []);
}
