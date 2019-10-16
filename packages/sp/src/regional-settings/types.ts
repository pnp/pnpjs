import { dateAdd, hOP } from "@pnp/common";
import { IInvokable } from "@pnp/odata";
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
import { spPost } from "../operations";

@defaultPath("regionalsettings")
export class _RegionalSettings extends _SharePointQueryableInstance<IRegionalSettingsInfo> implements _IRegionalSettings {

    public get installedLanguages(): ISharePointQueryableCollection<IInstalledLanguageInfo[]> {
        return SharePointQueryableCollection(this, "installedlanguages");
    }

    public get timeZone(): ITimeZone {
        return TimeZone(this);
    }

    public get timeZones(): ITimeZones {
        return TimeZones(this);
    }
}

/**
 * Describes regional settings ODada object
 */
export interface _IRegionalSettings {
    /**
     * Gets the collection of languages used in a server farm.
     */
    readonly installedLanguages: ISharePointQueryableCollection<IInstalledLanguageInfo[]>;

    /**
     * Gets time zone
     */
    readonly timeZone: ITimeZone;

    /**
     * Gets time zones
     */
    readonly timeZones: ITimeZones;
}

export interface IRegionalSettings extends _IRegionalSettings, IInvokable<IRegionalSettingsInfo>, ISharePointQueryableInstance<IRegionalSettingsInfo> { }

export const RegionalSettings = spInvokableFactory<IRegionalSettings>(_RegionalSettings);

@defaultPath("timezone")
export class _TimeZone extends _SharePointQueryableInstance<ITimeZoneInfo> implements _ITimeZone {

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

/**
 * Describes TimeZone ODada object
 */
export interface _ITimeZone {

    /**
     * Gets an Local Time by UTC Time
     *
     * @param utcTime UTC Time as Date or ISO String
     */
    utcToLocalTime(utcTime: string | Date): Promise<string>;

    /**
     * Gets an UTC Time by Local Time
     *
     * @param localTime Local Time as Date or ISO String
     */
    localTimeToUTC(localTime: string | Date): Promise<string>;
}

export interface ITimeZone extends _ITimeZone, IInvokable<ITimeZoneInfo>, ISharePointQueryableInstance { }

export const TimeZone = spInvokableFactory<ITimeZone>(_TimeZone);

@defaultPath("timezones")
export class _TimeZones extends _SharePointQueryableCollection<ITimeZoneInfo[]> implements _ITimeZones {

    public getById(id: number): Promise<ITimeZone & ITimeZoneInfo> {
        // do the post and merge the result into a TimeZone instance so the data and methods are available
        return spPost(this.clone(TimeZones, `GetById(${id})`).usingParser(spODataEntity(TimeZone)));
    }
}

/**
 * Describes time zones queriable collection
 */
export interface _ITimeZones {
    /**
     * Gets an TimeZone by id (see: https://msdn.microsoft.com/en-us/library/office/jj247008.aspx)
     *
     * @param id The integer id of the timezone to retrieve
     */
    getById(id: number): Promise<ITimeZone & ITimeZoneInfo>;
}

export interface ITimeZones extends _ITimeZones, IInvokable<ITimeZoneInfo[]>, ISharePointQueryableInstance { }

export const TimeZones = spInvokableFactory<ITimeZones>(_TimeZones);

/**
 * This is the data for Regional Settings
 */
export interface IRegionalSettingsInfo {
    AdjustHijriDays: number;
    AlternateCalendarType: number;
    AM: string;
    CalendarType: number;
    Collation: number;
    CollationLCID: number;
    DateFormat: number;
    DateSeparator: string;
    DecimalSeparator: string;
    DigitGrouping: string;
    FirstDayOfWeek: number;
    FirstWeekOfYear: number;
    IsEastAsia: boolean;
    IsRightToLeft: boolean;
    IsUIRightToLeft: boolean;
    ListSeparator: string;
    LocaleId: number;
    NegativeSign: string;
    NegNumberMode: number;
    PM: string;
    PositiveSign: string;
    ShowWeeks: boolean;
    ThousandSeparator: string;
    Time24: boolean;
    TimeMarkerPosition: number;
    TimeSeparator: string;
    WorkDayEndHour: number;
    WorkDays: number;
    WorkDayStartHour: number;
}

export interface IInstalledLanguageInfo {
    DisplayName: string;
    LanguageTag: string;
    Lcid: number;
}

export interface ITimeZoneInfo {
    Description: string;
    Id: number;
    Information: {
        Bias: number;
        DaylightBias: number;
        StandardBias: number;
    };
}
