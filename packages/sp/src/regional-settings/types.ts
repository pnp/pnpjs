import {
    _SharePointQueryableInstance,
    SharePointQueryableCollection,
    ISharePointQueryableCollection,
    ISharePointQueryableInstance,
    _SharePointQueryableCollection,
    spInvokableFactory,
} from "../sharepointqueryable";
import { defaultPath } from "../decorators";
import { spODataEntity } from "../odata";
import { dateAdd, hOP } from "@pnp/common";
import { IInvokable } from "@pnp/odata";
import { spPost } from "../operations";

/**
 * Describes regional settings ODada object
 */
@defaultPath("regionalsettings")
export class _RegionalSettings extends _SharePointQueryableInstance implements IRegionalSettings {
    /**
     * Gets the collection of languages used in a server farm.
     */
    public get installedLanguages(): ISharePointQueryableCollection {
        return SharePointQueryableCollection(this, "installedlanguages");
    }

    /**
     * Gets the collection of language packs that are installed on the server.
     */
    public get globalInstalledLanguages(): ISharePointQueryableCollection {
        return SharePointQueryableCollection(this, "globalinstalledlanguages");
    }

    /**
     * Gets time zone
     */
    public get timeZone(): ITimeZone {
        return TimeZone(this);
    }

    /**
     * Gets time zones
     */
    public get timeZones(): ITimeZones {
        return TimeZones(this);
    }
}

export interface IRegionalSettings extends IInvokable, ISharePointQueryableInstance {
    readonly installedLanguages: ISharePointQueryableCollection;
    readonly globalInstalledLanguages: ISharePointQueryableCollection;
    readonly timeZone: ITimeZone;
    readonly timeZones: ITimeZones;
}
export interface _RegionalSettings extends IInvokable { }
export const RegionalSettings = spInvokableFactory<IRegionalSettings>(_RegionalSettings);

/**
 * Describes TimeZone ODada object
 */
@defaultPath("timezone")
export class _TimeZone extends _SharePointQueryableInstance {
    /**
     * Gets an Local Time by UTC Time
     *
     * @param utcTime UTC Time as Date or ISO String
     */
    public async utcToLocalTime(utcTime: string | Date): Promise<string> {

        let dateIsoString: string;

        if (typeof utcTime === "string") {
            dateIsoString = utcTime;
        } else {
            dateIsoString = utcTime.toISOString();
        }

        const res = await spPost(this.clone(TimeZone, `utctolocaltime('${dateIsoString}')`));
        return hOP(res, "UTCToLocalTime") ? res.UTCToLocalTime : res;
    }

    /**
     * Gets an UTC Time by Local Time
     *
     * @param localTime Local Time as Date or ISO String
     */
    public async localTimeToUTC(localTime: string | Date): Promise<string> {

        let dateIsoString: string;

        if (typeof localTime === "string") {
            dateIsoString = localTime;
        } else {
            dateIsoString = dateAdd(localTime, "minute", localTime.getTimezoneOffset() * -1).toISOString();
        }

        const res = await spPost(this.clone(TimeZone, `localtimetoutc('${dateIsoString}')`));

        return hOP(res, "LocalTimeToUTC") ? res.LocalTimeToUTC : res;
    }
}

export interface ITimeZone extends IInvokable, ISharePointQueryableInstance {
    utcToLocalTime(utcTime: string | Date): Promise<string>;
    localTimeToUTC(localTime: string | Date): Promise<string>;
}
export interface _TimeZone extends IInvokable { }
export const TimeZone = spInvokableFactory<ITimeZone>(_TimeZone);

/**
 * Describes time zones queriable collection
 */
@defaultPath("timezones")
export class _TimeZones extends _SharePointQueryableCollection implements ITimeZones {
    // https://msdn.microsoft.com/en-us/library/office/jj247008.aspx - timezones ids
    /**
     * Gets an TimeZone by id
     *
     * @param id The integer id of the timezone to retrieve
     */
    public getById(id: number): Promise<ITimeZone> {
        // do the post and merge the result into a TimeZone instance so the data and methods are available
        return spPost(this.clone(TimeZones, `GetById(${id})`).usingParser(spODataEntity(_TimeZone)));
    }
}

export interface ITimeZones extends IInvokable, ISharePointQueryableInstance {
    getById(id: number): Promise<ITimeZone>;
}
export interface _TimeZones extends IInvokable { }
export const TimeZones = spInvokableFactory<ITimeZones>(_TimeZones);
