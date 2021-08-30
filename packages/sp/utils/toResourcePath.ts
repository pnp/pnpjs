export interface IResourcePath {
    DecodedUrl: string;
}

export function toResourcePath(url: string): IResourcePath {
    return {
        DecodedUrl: url,
    };
}
