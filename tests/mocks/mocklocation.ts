export default class MockLocation implements Location {
    public hash: string;
    public host: string;
    public hostname: string;
    public href: string;
    public origin: string;
    public pathname: string;
    public port: string;
    public protocol: string;
    public search: string;

    private _url: string;

    public assign(url: string): void {
        this._url = url;
    }

    public reload(forcedReload?: boolean): void {
        if (forcedReload) {
            this._url = "";
        }
    }

    public replace(url: string): void {
        this._url = url;
    }
    public toString(): string {
        return "MockLocation.toString";
    }
}
