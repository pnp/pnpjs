// this is the ambient nodejs global var which may or may not exist
declare var global: any;

// all the things we expect to maybe exist on global
export interface IGlobal {
    _spPageContextInfo?: {
        webAbsoluteUrl?: string;
        webServerRelativeUrl?: string
    };

    location?: string;

    fetch(url: string, options: any): Promise<Response>;
}

// export either window or global
export const safeGlobal: IGlobal = typeof global === "undefined" ? window : global;
