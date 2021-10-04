import { dateAdd, hOP } from "@pnp/core";
import {
    _SPInstance,
    SPCollection,
    spInvokableFactory,
    _SPCollection,
} from "../spqueryable.js";
import { defaultPath } from "../decorators.js";
import { spPost } from "../operations.js";

@defaultPath("regionalsettings")
export class _RegionalSettings extends _SPInstance<IRegionalSettingsInfo> {

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

    /**
     * Gets the collection of languages used in a server farm.
     */
    public async getInstalledLanguages(): Promise<IInstalledLanguageInfo[]> {
        const results: { Items: IInstalledLanguageInfo[] } = await SPCollection(this, "installedlanguages")();
        return results.Items;
    }
}
export interface IRegionalSettings extends _RegionalSettings {}
export const RegionalSettings = spInvokableFactory<IRegionalSettings>(_RegionalSettings);

@defaultPath("timezone")
export class _TimeZone extends _SPInstance<ITimeZoneInfo> {

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

        const res = await spPost(TimeZone(this, `utctolocaltime('${dateIsoString}')`));
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

        const res = await spPost(TimeZone(this, `localtimetoutc('${dateIsoString}')`));

        return hOP(res, "LocalTimeToUTC") ? res.LocalTimeToUTC : res;
    }
}
export interface ITimeZone extends _TimeZone {}
export const TimeZone = spInvokableFactory<ITimeZone>(_TimeZone);

@defaultPath("timezones")
export class _TimeZones extends _SPCollection<ITimeZoneInfo[]> {

    /**
     * Gets an TimeZone by id (see: https://msdn.microsoft.com/en-us/library/office/jj247008.aspx)
     *
     * @param id The integer id of the timezone to retrieve
     */
    public getById(id: number): Promise<ITimeZoneInfo> {
        return spPost(TimeZones(this, `GetById(${id})`));
    }
}
export interface ITimeZones extends _TimeZones {}
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

export interface IUserResources {
    /**
     * Gets the resource string for the title
     */
    titleResource(cultureName: string): Promise<string>;
    /**
     * Gets the resource string for the title description
     */
    descriptionResource(cultureName: string): Promise<string>;
}
