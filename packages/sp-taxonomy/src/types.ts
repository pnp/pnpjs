export enum StringMatchOption {
    StartsWith = 0,
    ExactMatch = 1,
}

export interface TimeSpan {
    Days: number;
    Hours: number;
    Milliseconds: number;
    Minutes: number;
    Seconds: number;
    Ticks: number;
    TotalDays: number;
    TotalHours: number;
    TotalMilliseconds: number;
    TotalMinutes: number;
    TotalSeconds: number;
}

export interface ILabelMatchInfo {
    DefaultLabelOnly?: boolean;
    ExcludeKeyword?: boolean;
    Lcid?: number;
    ResultCollectionSize?: number;
    StringMatchOption?: StringMatchOption;
    TermLabel: string;
    TrimDeprecated?: boolean;
    TrimUnavailable?: boolean;
}

export enum ChangedItemType {
    Unknown,
    Term,
    TermSet,
    Group,
    TermStore,
    Site,
}

export enum ChangedOperationType {
    Unknown,
    Add,
    Edit,
    DeleteObject,
    Move,
    Copy,
    PathChange,
    Merge,
    ImportObject,
    Restore,
}

export interface ChangedItem {
    ChangedBy: string;
    ChangedTime: string;
    Id: string;
    ItemType: ChangedItemType;
    Operation: ChangedOperationType;

    // Changed Site
    SiteId?: string;
    TermId?: string;

    // Changed Term
    ChangedCustomProperties?: string[];
    ChangedLocalCustomProperties?: string[];
    LcidsForChangedDescriptions?: number[];
    LcidsForChangedLabels?: number[];

    // Changed Term & Site
    TermSetId?: string;

    // Changed Termset
    FromGroupId?: string;

    // Changed Termset and Term
    GroupId?: string;

    // Changed TermStore
    ChangedLanguage?: number;
    IsDefaultLanguageChanged?: boolean;
    IsFullFarmRestore?: boolean;
}

export interface ChangeInformation {
    ItemType?: ChangedItemType;
    OperationType?: ChangedOperationType;
    StartTime?: string;
    WithinTimeSpan?: TimeSpan;
}
