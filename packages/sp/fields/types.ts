import {
  _SharePointQueryableInstance,
  _SharePointQueryableCollection,
  spInvokableFactory,
  deleteable,
  IDeleteable,
} from "../sharepointqueryable";
import { assign, ITypedHash } from "@pnp/common";
import { metadata } from "../utils/metadata";
import { body, headers } from "@pnp/odata";
import { defaultPath } from "../decorators";
import { spPost } from "../operations";
import { tag } from "../telemetry";

@defaultPath("fields")
export class _Fields extends _SharePointQueryableCollection<IFieldInfo[]> {

  /**
   * Gets a field from the collection by id
   *
   * @param id The Id of the list
   */
  public getById(id: string): IField {
    return tag.configure(Field(this).concat(`('${id}')`), "fs.getById");
  }

  /**
   * Gets a field from the collection by title
   *
   * @param title The case-sensitive title of the field
   */
  public getByTitle(title: string): IField {
    return tag.configure(Field(this, `getByTitle('${title}')`), "fs.getByTitle");
  }

  /**
   * Gets a field from the collection by using internal name or title
   *
   * @param name The case-sensitive internal name or title of the field
   */
  public getByInternalNameOrTitle(name: string): IField {
    return tag.configure(Field(this, `getByInternalNameOrTitle('${name}')`), "fs.getByInternalNameOrTitle");
  }

  /**
   * Creates a field based on the specified schema
   *
   * @param xml A string or XmlSchemaFieldCreationInformation instance descrbing the field to create
   */
  @tag("fs.createFieldAsXml")
  public async createFieldAsXml(xml: string | IXmlSchemaFieldCreationInformation): Promise<IFieldAddResult> {

    if (typeof xml === "string") {
      xml = { SchemaXml: xml };
    }

    const postBody = body({
      "parameters":
        assign(metadata("SP.XmlSchemaFieldCreationInformation"), xml),
    });

    const data = await spPost<{ Id: string; }>(this.clone(Fields, "createfieldasxml"), postBody);

    return {
      data,
      field: this.getById(data.Id),
    };
  }

  /**
   * Adds a new field to the collection
   *
   * @param title The new field's title
   * @param fieldType The new field's type (ex: SP.FieldText)
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  public async add(title: string, fieldType: string, properties: IFieldCreationProperties & { FieldTypeKind: number }): Promise<IFieldAddResult> {

    const postBody = body(Object.assign(metadata(fieldType), {
      "Title": title,
    }, properties));

    if (!tag.isTagged(this)) {
      tag.configure(this, "fs.add");
    }

    const data = await spPost<{ Id: string; }>(this.clone(Fields, null), postBody);

    return {
      data,
      field: this.getById(data.Id),
    };
  }

  /**
   * Adds a new SP.FieldText to the collection
   *
   * @param title The field title
   * @param maxLength The maximum number of characters allowed in the value of the field.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addText")
  public addText(title: string, maxLength = 255, properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props: { FieldTypeKind: number, MaxLength: number } = {
      FieldTypeKind: 2,
      MaxLength: maxLength,
    };

    return this.add(title, "SP.FieldText", assign(props, properties));
  }

  /**
   * Adds a new SP.FieldCalculated to the collection
   *
   * @param title The field title.
   * @param formula The formula for the field.
   * @param dateFormat The date and time format that is displayed in the field.
   * @param outputType Specifies the output format for the field. Represents a FieldType value.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addCalculated")
  public addCalculated(
    title: string,
    formula: string,
    dateFormat: DateTimeFieldFormatType,
    outputType: FieldTypes = FieldTypes.Text,
    properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props: {
      DateFormat: DateTimeFieldFormatType;
      FieldTypeKind: number;
      Formula: string;
      OutputType: FieldTypes;
    } = {
      DateFormat: dateFormat,
      FieldTypeKind: 17,
      Formula: formula,
      OutputType: outputType,
    };

    return this.add(title, "SP.FieldCalculated", assign(props, properties));
  }

  /**
   * Adds a new SP.FieldDateTime to the collection
   *
   * @param title The field title
   * @param displayFormat The format of the date and time that is displayed in the field.
   * @param calendarType Specifies the calendar type of the field.
   * @param friendlyDisplayFormat The type of friendly display format that is used in the field.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addDateTime")
  public addDateTime(
    title: string,
    displayFormat: DateTimeFieldFormatType = DateTimeFieldFormatType.DateOnly,
    calendarType: CalendarType = CalendarType.Gregorian,
    friendlyDisplayFormat: DateTimeFieldFriendlyFormatType = DateTimeFieldFriendlyFormatType.Unspecified,
    properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = {
      DateTimeCalendarType: calendarType,
      DisplayFormat: displayFormat,
      FieldTypeKind: 4,
      FriendlyDisplayFormat: friendlyDisplayFormat,
    };

    return this.add(title, "SP.FieldDateTime", assign(props, properties));
  }

  /**
   * Adds a new SP.FieldNumber to the collection
   *
   * @param title The field title
   * @param minValue The field's minimum value
   * @param maxValue The field's maximum value
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addNumber")
  public addNumber(
    title: string,
    minValue?: number,
    maxValue?: number,
    properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    let props: { FieldTypeKind: number } = { FieldTypeKind: 9 };

    if (minValue !== undefined) {
      props = assign({ MinimumValue: minValue }, props);
    }

    if (maxValue !== undefined) {
      props = assign({ MaximumValue: maxValue }, props);
    }

    return this.add(title, "SP.FieldNumber", assign(props, properties));
  }

  /**
   * Adds a new SP.FieldCurrency to the collection
   *
   * @param title The field title
   * @param minValue The field's minimum value
   * @param maxValue The field's maximum value
   * @param currencyLocalId Specifies the language code identifier (LCID) used to format the value of the field
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addCurrency")
  public addCurrency(
    title: string,
    minValue?: number,
    maxValue?: number,
    currencyLocalId = 1033,
    properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    let props: { CurrencyLocaleId: number; FieldTypeKind: number; } = {
      CurrencyLocaleId: currencyLocalId,
      FieldTypeKind: 10,
    };

    if (minValue !== undefined) {
      props = assign({ MinimumValue: minValue }, props);
    }

    if (maxValue !== undefined) {
      props = assign({ MaximumValue: maxValue }, props);
    }

    return this.add(title, "SP.FieldCurrency", assign(props, properties));
  }

  /**
   * Adds a new SP.FieldMultiLineText to the collection
   *
   * @param title The field title
   * @param numberOfLines Specifies the number of lines of text to display for the field.
   * @param richText Specifies whether the field supports rich formatting.
   * @param restrictedMode Specifies whether the field supports a subset of rich formatting.
   * @param appendOnly Specifies whether all changes to the value of the field are displayed in list forms.
   * @param allowHyperlink Specifies whether a hyperlink is allowed as a value of the field.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   *
   */
  @tag("fs.addMultilineText")
  public addMultilineText(
    title: string,
    numberOfLines = 6,
    richText = true,
    restrictedMode = false,
    appendOnly = false,
    allowHyperlink = true,
    properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = {
      AllowHyperlink: allowHyperlink,
      AppendOnly: appendOnly,
      FieldTypeKind: 3,
      NumberOfLines: numberOfLines,
      RestrictedMode: restrictedMode,
      RichText: richText,
    };

    return this.add(title, "SP.FieldMultiLineText", assign(props, properties));
  }

  /**
   * Adds a new SP.FieldUrl to the collection
   *
   * @param title The field title
   */
  @tag("fs.addUrl")
  public addUrl(title: string, displayFormat: UrlFieldFormatType = UrlFieldFormatType.Hyperlink, properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = {
      DisplayFormat: displayFormat,
      FieldTypeKind: 11,
    };

    return this.add(title, "SP.FieldUrl", assign(props, properties));
  }

  /** Adds a user field to the colleciton
  *
  * @param title The new field's title
  * @param selectionMode The selection mode of the field
  * @param selectionGroup Value that specifies the identifier of the SharePoint group whose members can be selected as values of the field
  * @param properties
  */
  @tag("fs.addUser")
  public addUser(title: string, selectionMode: FieldUserSelectionMode, properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = {
      FieldTypeKind: 20,
      SelectionMode: selectionMode,
    };

    return this.add(title, "SP.FieldUser", assign(props, properties));
  }

  /**
   * Adds a SP.FieldLookup to the collection
   *
   * @param title The new field's title
   * @param lookupListId The guid id of the list where the source of the lookup is found
   * @param lookupFieldName The internal name of the field in the source list
   * @param properties Set of additional properties to set on the new field
   */
  @tag("fs.addLookup")
  public async addLookup(
    title: string,
    lookupListId: string,
    lookupFieldName: string,
    properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = assign({
      FieldTypeKind: 7,
      LookupFieldName: lookupFieldName,
      LookupListId: lookupListId,
      Title: title,
    }, properties);

    const postBody = body({
      "parameters":
        assign(metadata("SP.FieldCreationInformation"), props),
    });

    const data = await spPost<{ Id: string; }>(this.clone(Fields, "addfield"), postBody);

    return {
      data,
      field: this.getById(data.Id),
    };
  }

  /**
   * Adds a new SP.FieldChoice to the collection
   *
   * @param title The field title.
   * @param choices The choices for the field.
   * @param format The display format of the available options for the field.
   * @param fillIn Specifies whether the field allows fill-in values.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addChoice")
  public addChoice(
    title: string,
    choices: string[],
    format: ChoiceFieldFormatType = ChoiceFieldFormatType.Dropdown,
    fillIn?: boolean,
    properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = {
      Choices: {
        results: choices,
      },
      EditFormat: format,
      FieldTypeKind: 6,
      FillInChoice: fillIn,
    };

    return this.add(title, "SP.FieldChoice", assign(props, properties));
  }

  /**
   * Adds a new SP.FieldMultiChoice to the collection
   *
   * @param title The field title.
   * @param choices The choices for the field.
   * @param fillIn Specifies whether the field allows fill-in values.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addMultiChoice")
  public addMultiChoice(title: string, choices: string[], fillIn?: boolean, properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = {
      Choices: {
        results: choices,
      },
      FieldTypeKind: 15,
      FillInChoice: fillIn,
    };

    return this.add(title, "SP.FieldMultiChoice", assign(props, properties));
  }

  /**
   * Adds a new SP.FieldBoolean to the collection
   *
   * @param title The field title.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addBoolean")
  public addBoolean(title: string, properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = {
      FieldTypeKind: 8,
    };

    return this.add(title, "SP.Field", assign(props, properties));
  }

  /**
  * Creates a secondary (dependent) lookup field, based on the Id of the primary lookup field.
  *
  * @param displayName The display name of the new field.
  * @param primaryLookupFieldId The guid of the primary Lookup Field.
  * @param showField Which field to show from the lookup list.
  */
  @tag("fs.addDependentLookupField")
  public async addDependentLookupField(displayName: string, primaryLookupFieldId: string, showField: string): Promise<IFieldAddResult> {

    const path = `adddependentlookupfield(displayName='${displayName}', primarylookupfieldid='${primaryLookupFieldId}', showfield='${showField}')`;

    const data = await spPost(this.clone(Fields, path));

    return {
      data,
      field: this.getById(data.Id),
    };
  }

  /**
   * Adds a new SP.FieldLocation to the collection
   *
   * @param title The field title.
   * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
   */
  @tag("fs.addLocation")
  public addLocation(title: string, properties?: IFieldCreationProperties): Promise<IFieldAddResult> {

    const props = { FieldTypeKind: 33 };

    return this.add(title, "SP.FieldLocation", assign(props, properties));
  }
}
export interface IFields extends _Fields { }
export const Fields = spInvokableFactory<IFields>(_Fields);

export class _Field extends _SharePointQueryableInstance<IFieldInfo> {

  public delete = deleteable("f");

  /**
   * Updates this field instance with the supplied properties
   *
   * @param properties A plain object hash of values to update for the list
   * @param fieldType The type value such as SP.FieldLookup. Optional, looked up from the field if not provided
   */
  @tag("f.update")
  public async update(properties: any, fieldType?: string): Promise<IFieldUpdateResult> {

    if (typeof fieldType === "undefined" || fieldType === null) {
      const info = await Field(this).select("FieldTypeKind").configure({
        headers: {
          "Accept": "application/json",
        },
      })();
      fieldType = info["odata.type"];
    }

    const req = body(assign(metadata(fieldType), properties), headers({ "X-HTTP-Method": "MERGE" }));

    const data = await spPost(this, req);

    return {
      data,
      field: <any>this,
    };
  }

  /**
   * Sets the value of the ShowInDisplayForm property for this field.
   */
  @tag("f.setShowInDisplayForm")
  public setShowInDisplayForm(show: boolean): Promise<void> {
    return spPost(this.clone(Field, `setshowindisplayform(${show})`));
  }

  /**
   * Sets the value of the ShowInEditForm property for this field.
   */
  @tag("f.setShowInEditForm")
  public setShowInEditForm(show: boolean): Promise<void> {
    return spPost(this.clone(Field, `setshowineditform(${show})`));
  }

  /**
   * Sets the value of the ShowInNewForm property for this field.
   */
  @tag("f.setShowInNewForm")
  public setShowInNewForm(show: boolean): Promise<void> {
    return spPost(this.clone(Field, `setshowinnewform(${show})`));
  }
}
export interface IField extends _Field, IDeleteable { }
export const Field = spInvokableFactory<IField>(_Field);

/**
 * This interface defines the result of adding a field
 */
export interface IFieldAddResult {
  data: Partial<IFieldInfo>;
  field: IField;
}

/**
 * This interface defines the result of updating a field
 */
export interface IFieldUpdateResult {
  data: Partial<IFieldInfo>;
  field: IField;
}

/**
 * Specifies the type of the field.
 */
export enum FieldTypes {
  Invalid = 0,
  Integer = 1,
  Text = 2,
  Note = 3,
  DateTime = 4,
  Counter = 5,
  Choice = 6,
  Lookup = 7,
  Boolean = 8,
  Number = 9,
  Currency = 10,
  URL = 11,
  Computed = 12,
  Threading = 13,
  Guid = 14,
  MultiChoice = 15,
  GridChoice = 16,
  Calculated = 17,
  File = 18,
  Attachments = 19,
  User = 20,
  Recurrence = 21,
  CrossProjectLink = 22,
  ModStat = 23,
  Error = 24,
  ContentTypeId = 25,
  PageSeparator = 26,
  ThreadIndex = 27,
  WorkflowStatus = 28,
  AllDayEvent = 29,
  WorkflowEventType = 30,
}

export enum DateTimeFieldFormatType {
  DateOnly = 0,
  DateTime = 1,
}

export enum DateTimeFieldFriendlyFormatType {
  Unspecified = 0,
  Disabled = 1,
  Relative = 2,
}

/**
 * Specifies the control settings while adding a field.
 */
export enum AddFieldOptions {
  /**
   *  Specify that a new field added to the list must also be added to the default content type in the site collection
   */
  DefaultValue = 0,
  /**
   * Specify that a new field added to the list must also be added to the default content type in the site collection.
   */
  AddToDefaultContentType = 1,
  /**
   * Specify that a new field must not be added to any other content type
   */
  AddToNoContentType = 2,
  /**
   *  Specify that a new field that is added to the specified list must also be added to all content types in the site collection
   */
  AddToAllContentTypes = 4,
  /**
   * Specify adding an internal field name hint for the purpose of avoiding possible database locking or field renaming operations
   */
  AddFieldInternalNameHint = 8,
  /**
   * Specify that a new field that is added to the specified list must also be added to the default list view
   */
  AddFieldToDefaultView = 16,
  /**
   * Specify to confirm that no other field has the same display name
   */
  AddFieldCheckDisplayName = 32,
}

export interface IXmlSchemaFieldCreationInformation {
  Options?: AddFieldOptions;
  SchemaXml: string;
}

export enum CalendarType {
  Gregorian = 1,
  Japan = 3,
  Taiwan = 4,
  Korea = 5,
  Hijri = 6,
  Thai = 7,
  Hebrew = 8,
  GregorianMEFrench = 9,
  GregorianArabic = 10,
  GregorianXLITEnglish = 11,
  GregorianXLITFrench = 12,
  KoreaJapanLunar = 14,
  ChineseLunar = 15,
  SakaEra = 16,
  UmAlQura = 23,
}

export enum UrlFieldFormatType {
  Hyperlink = 0,
  Image = 1,
}

export enum FieldUserSelectionMode {
  PeopleAndGroups = 1,
  PeopleOnly = 0,
}

export interface IFieldCreationProperties extends ITypedHash<string | number | boolean> {
  DefaultFormula?: string;
  Description?: string;
  EnforceUniqueValues?: boolean;
  FieldTypeKind?: number;
  Group?: string;
  Hidden?: boolean;
  Indexed?: boolean;
  Required?: boolean;
  Title?: string;
  ValidationFormula?: string;
  ValidationMessage?: string;
}

export enum ChoiceFieldFormatType {
  Dropdown,
  RadioButtons,
}

export interface IFieldInfo {
  DefaultFormula: string | null;
  DefaultValue: string | null;
  Description: string;
  Direction: string;
  EnforceUniqueValues: boolean;
  EntityPropertyName: string;
  FieldTypeKind: FieldTypes;
  Filterable: boolean;
  FromBaseType: boolean;
  Group: string;
  Hidden: boolean;
  Id: string;
  Indexed: boolean;
  IndexStatus: number;
  InternalName: string;
  JSLink: string;
  PinnedToFiltersPane: boolean;
  ReadOnlyField: boolean;
  Required: boolean;
  SchemaXml: string;
  Scope: string;
  Sealed: boolean;
  ShowInFiltersPane: number;
  Sortable: boolean;
  StaticName: string;
  Title: string;
  TypeAsString: string;
  TypeDisplayName: string;
  TypeShortDescription: string;
  ValidationFormula: string | null;
  ValidationMessage: string | null;
}
