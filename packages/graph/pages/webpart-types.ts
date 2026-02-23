// We welcome contributions to filling out the available webpart types in the service. Do not add non-Microsoft webparts
// 1. Add an interface for the webpart definition
// 2. Add the interface to the ValidWebpart type at the top of the file
// 2. Add the interface to the ValidWebpartNoAny type at the top of the file

/**
 * Defines the schemas for valid webparts provided by Microsoft. Includes 'any' to avoid typing errors for undefined webparts
 */
export type ValidWebpart = MSTextWebPart | any;

/**
 * Defines the schemas for valid webparts provided by Microsoft. Does not allow 'any'
 */
export type ValidWebpartNoAny = MSTextWebPart;

export interface MSTextWebPart {
    "@odata.type": "#microsoft.graph.textWebPart";
    id: string;
    innerHtml: string;
}
