import {
    MailboxSettings as IMailboxSettingsType,
    AutomaticRepliesSetting as IAutomaticRepliesSetting,
    LocaleInfo as ILocaleInfo,
    WorkingHours as IWorkingHours,
    UserPurpose as IUserPurpose,
    InferenceClassificationOverride as IInterfaceClassificationOverride,
} from "@microsoft/microsoft-graph-types";
import { _GraphInstance, _GraphCollection, graphInvokableFactory, graphGet, GraphQueryable } from "../graphqueryable.js";
import { defaultPath, getById, IGetById, addable, IAddable, updateable, IUpdateable, IDeleteable, deleteable } from "../decorators.js";

/**
 * MailboxSettings
 */
@defaultPath("mailboxSettings")
@updateable()
export class _MailboxSettings extends _GraphInstance<IMailboxSettingsType> {
    /**
     * Get the automatic replies setting
     *
     */
    public async automaticRepliesSetting(): Promise<IAutomaticRepliesSetting> {
        return graphGet(GraphQueryable(this, "automaticRepliesSetting"));
    }

    /**
     * Get the mailbox settings date format
     *
     */
    public async dateFormat(): Promise<string> {
        return graphGet(GraphQueryable(this, "dateFormat"));
    }

    /**
     * Get the delegateMeetingMessageDeliveryOptions settings
     *
     */
    // DOCUMENTED BUT NOT IMPLEMENTED
    // public async delegateMeetingMessageDeliveryOptions(): Promise<string> {
    //     return graphGet(GraphQueryable(this, "delegateMeetingMessageDeliveryOptions"));
    // }

    /**
     * Get the delegateMeetingMessageDeliveryOptions settings
     *
     */
    public async language(): Promise<ILocaleInfo> {
        return graphGet(GraphQueryable(this, "language"));
    }

    /**
     * Get the mailbox settings time format
     *
     */
    public async timeFormat(): Promise<string> {
        return graphGet(GraphQueryable(this, "timeFormat"));
    }

    /**
     * Get the mailbox settings time format
     *
     */
    public async timeZone(): Promise<string> {
        return graphGet(GraphQueryable(this, "timeZone"));
    }

    /**
     * Get the mailbox settings working hours
     *
     */
    public async workingHours(): Promise<IWorkingHours> {
        return graphGet(GraphQueryable(this, "workingHours"));
    }

    /**
     * Get the mailbox settings user purpose
     *
     */
    public async userPurpose(): Promise<IUserPurpose> {
        return graphGet(GraphQueryable(this, "userPurpose"));
    }
}
export interface IMailboxSettings extends _MailboxSettings, IUpdateable<IMailboxSettingsType> { }
export const MailboxSettings = graphInvokableFactory<IMailboxSettings>(_MailboxSettings);

/**
 * Focused Inbox Override
 */
@defaultPath("inferenceClassification/overrides")
@updateable()
@deleteable()
export class _FocusedInboxOverride extends _GraphInstance<IInterfaceClassificationOverride> {}
export interface IFocusedInboxOverride extends _FocusedInboxOverride, IUpdateable<IInterfaceClassificationOverride>, IDeleteable { }
export const FocusedInboxOverride = graphInvokableFactory<IFocusedInboxOverride>(_FocusedInboxOverride);

/**
 * Focused Inbox Overrides
 */
@defaultPath("inferenceClassification/overrides")
@getById(FocusedInboxOverride)
@addable()
export class _FocusedInboxOverrides extends _GraphCollection<IInterfaceClassificationOverride[]> {}
export interface IFocusedInboxOverrides extends _FocusedInboxOverrides, IGetById<IFocusedInboxOverride>, IAddable<IInterfaceClassificationOverride> { }
export const FocusedInboxOverrides = graphInvokableFactory<IFocusedInboxOverrides>(_FocusedInboxOverrides);
