import { graphInvokableFactory, _GraphInstance, _GraphCollection } from "../graphqueryable.js";
import { defaultPath, updateable, IUpdateable, addable, getById, IAddable, deleteable, IDeleteable, IGetById } from "../decorators.js";
import { ProfileCardProperty  as IProfileCardPropertyType, PeopleAdminSettings as IPeopleAdminSettingsType } from "@microsoft/microsoft-graph-types";

@defaultPath("people")
export class _PeopleAdmin extends _GraphInstance<IPeopleAdminSettingsType> {
    public get profileCardProperties(): IProfileCardProperties {
        return ProfileCardProperties(this);
    }
    public get pronounSettings(): IPronounSettings {
        return PronounSettings(this);
    }
}

export interface IPeopleAdmin extends _PeopleAdmin { }
export const PeopleAdmin = graphInvokableFactory<IPeopleAdmin>(_PeopleAdmin);

/**
* People Pronoun Settings
*/
@defaultPath("pronouns")
@updateable()
export class _PronounSettings extends _GraphInstance<IPronounSettingsType> { }
export interface IPronounSettings extends _PronounSettings, IUpdateable<IPronounSettingsType> { }
export const PronounSettings = graphInvokableFactory<IPronounSettings>(_PronounSettings);

/**
* Profilecard Property
*/
@defaultPath("profileCardProperty")
@deleteable()
@updateable()
export class _ProfileCardProperty extends _GraphInstance<IProfileCardPropertyType> { }
export interface IProfileCardProperty extends _ProfileCardProperty, IDeleteable, IUpdateable<IProfileCardPropertyType> { }
export const ProfileCardProperty = graphInvokableFactory<IProfileCardProperty>(_ProfileCardProperty);

/**
* Profilecard properties
*/
@defaultPath("profileCardProperties")
@getById(ProfileCardProperty)
@addable()
export class _ProfileCardProperties extends _GraphCollection<IProfileCardPropertyType[]> { }
export interface IProfileCardProperties extends _ProfileCardProperties, IAddable<IProfileCardPropertyType>, IGetById<IProfileCardProperty> { }
export const ProfileCardProperties = graphInvokableFactory<IProfileCardProperties>(_ProfileCardProperties);

export interface IPronounSettingsType{
    isEnabledInOrganization: boolean;
}
