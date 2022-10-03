import { statSync, existsSync, writeFile, readFile } from "fs";

export class TestProps {

    private _isDirty: boolean;
    private _path: string;
    private _settings: Map<string, any>;
    private _lastReadTime: number;
    private _isLoaded: boolean;

    constructor(resolvedPath: string) {
        this._path = resolvedPath;
        this._isDirty = false;
        this._isLoaded = false;
        this._settings = new Map<string, any>();
        this._lastReadTime = 0;
    }

    public async get<T>(key: string, defaults: T): Promise<T> {

        if (!this._isLoaded) {
            await this.load();
            this._isLoaded = true;
        }

        if (this._settings.has(key)) {
            return this._settings.get(key);
        } else {
            await this.set(key, defaults);
        }

        return defaults;
    }

    public async set<T>(key: string, value: T): Promise<void> {
        this._isDirty = true;
        this._settings.set(key, value);
    }

    public async load(path = this._path): Promise<void> {

        // check file modified time to see if we need to reload.
        if (existsSync(path)) {

            this._path = path;

            const stats = statSync(path);

            if (stats.mtimeMs > this._lastReadTime) {

                return new Promise((resolve, reject) => {

                    readFile(path, { encoding: "utf8" }, (err, data) => {

                        if (err) {
                            reject(err);
                        }

                        this._settings = new Map<string, any>(Object.entries(JSON.parse(data)));
                        this._isDirty = false;
                        this._lastReadTime = Date.now();
                        resolve();
                    });
                });
            }
        }
    }

    public async save(): Promise<void> {

        return new Promise((resolve, reject) => {

            if (!this._isDirty) {
                return resolve();
            }

            const settingsJSON = JSON.stringify(Object.fromEntries(this._settings));

            writeFile(this._path, settingsJSON, { encoding: "utf8" }, (err) => {

                if (err) {
                    reject(err);
                }

                this._isDirty = false;
                resolve();
            });
        });
    }
}
