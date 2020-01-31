export interface IResourcePath {
    DecodedUrl: string;
    __metadata: { type: "SP.ResourcePath" };
}

export function toResourcePath(url: string): IResourcePath {
    return {
        DecodedUrl: url,
        __metadata: { type: "SP.ResourcePath" },
    };
}
