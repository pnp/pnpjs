import { SharePointQueryable, SharePointQueryableCollection, SharePointQueryableInstance } from "./sharepointqueryable";
import { extend, TypedHash } from "@pnp/common";
import {
    XmlSchemaFieldCreationInformation,
    DateTimeFieldFormatType,
    FieldTypes,
    CalendarType,
    UrlFieldFormatType,
    FieldUserSelectionMode,
    FieldCreationProperties,
    ChoiceFieldFormatType,
} from "./types";

/**
 * Describes a collection of Field objects
 *
 */
export class Fields extends SharePointQueryableCollection {

    /**
     * Creates a new instance of the Fields class
     *
     * @param baseUrl The url or SharePointQueryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | SharePointQueryable, path = "fields") {
        super(baseUrl, path);
    }

    /**
     * Gets a field from the collection by title
     *
     * @param title The case-sensitive title of the field
     */
    public getByTitle(title: string): Field {
        return new Field(this, `getByTitle('${title}')`);
    }

    /**
     * Gets a field from the collection by using internal name or title
     *
     * @param name The case-sensitive internal name or title of the field
     */
    public getByInternalNameOrTitle(name: string): Field {
        return new Field(this, `getByInternalNameOrTitle('${name}')`);
    }

    /**
     * Gets a list from the collection by guid id
     *
     * @param title The Id of the list
     */
    public getById(id: string): Field {
        const f: Field = new Field(this);
        f.concat(`('${id}')`);
        return f;
    }

    /**
     * Creates a field based on the specified schema
     */
    public createFieldAsXml(xml: string | XmlSchemaFieldCreationInformation): Promise<FieldAddResult> {

        let info: XmlSchemaFieldCreationInformation;
        if (typeof xml === "string") {
            info = { SchemaXml: xml };
        } else {
            info = xml as XmlSchemaFieldCreationInformation;
        }

        const postBody: string = JSON.stringify({
            "parameters":
                extend({
                    "__metadata":
                        {
                            "type": "SP.XmlSchemaFieldCreationInformation",
                        },
                }, info),
        });

        return this.clone(Fields, "createfieldasxml").postCore<{ Id: string }>({ body: postBody }).then((data) => {
            return {
                data: data,
                field: this.getById(data.Id),
            };
        });
    }

    /**
     * Adds a new field to the collection
     *
     * @param title The new field's title
     * @param fieldType The new field's type (ex: SP.FieldText)
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public add(title: string, fieldType: string, properties: FieldCreationProperties & { FieldTypeKind: number }): Promise<FieldAddResult> {

        const postBody: string = JSON.stringify(extend({
            "Title": title,
            "__metadata": { "type": fieldType },
        }, properties));

        return this.clone(Fields, null).postCore<{ Id: string }>({ body: postBody }).then((data) => {
            return {
                data: data,
                field: this.getById(data.Id),
            };
        });
    }

    /**
     * Adds a new SP.FieldText to the collection
     *
     * @param title The field title
     * @param maxLength The maximum number of characters allowed in the value of the field.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addText(title: string, maxLength = 255, properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const props: { FieldTypeKind: number, MaxLength: number } = {
            FieldTypeKind: 2,
            MaxLength: maxLength,
        };

        return this.add(title, "SP.FieldText", extend(props, properties));
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
    public addCalculated(
        title: string,
        formula: string,
        dateFormat: DateTimeFieldFormatType,
        outputType: FieldTypes = FieldTypes.Text,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

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

        return this.add(title, "SP.FieldCalculated", extend(props, properties));
    }

    /**
     * Adds a new SP.FieldDateTime to the collection
     *
     * @param title The field title
     * @param displayFormat The format of the date and time that is displayed in the field.
     * @param calendarType Specifies the calendar type of the field.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addDateTime(
        title: string,
        displayFormat: DateTimeFieldFormatType = DateTimeFieldFormatType.DateOnly,
        calendarType: CalendarType = CalendarType.Gregorian,
        friendlyDisplayFormat = 0,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const props = {
            DateTimeCalendarType: calendarType,
            DisplayFormat: displayFormat,
            FieldTypeKind: 4,
            FriendlyDisplayFormat: friendlyDisplayFormat,
        };

        return this.add(title, "SP.FieldDateTime", extend(props, properties));
    }

    /**
     * Adds a new SP.FieldNumber to the collection
     *
     * @param title The field title
     * @param minValue The field's minimum value
     * @param maxValue The field's maximum value
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addNumber(
        title: string,
        minValue?: number,
        maxValue?: number,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        let props: { FieldTypeKind: number } = { FieldTypeKind: 9 };

        if (typeof minValue !== "undefined") {
            props = extend({ MinimumValue: minValue }, props);
        }

        if (typeof maxValue !== "undefined") {
            props = extend({ MaximumValue: maxValue }, props);
        }

        return this.add(title, "SP.FieldNumber", extend(props, properties));
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
    public addCurrency(
        title: string,
        minValue?: number,
        maxValue?: number,
        currencyLocalId = 1033,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        let props: { CurrencyLocaleId: number; FieldTypeKind: number; } = {
            CurrencyLocaleId: currencyLocalId,
            FieldTypeKind: 10,
        };

        if (typeof minValue !== "undefined") {
            props = extend({ MinimumValue: minValue }, props);
        }

        if (typeof maxValue !== "undefined") {
            props = extend({ MaximumValue: maxValue }, props);
        }

        return this.add(title, "SP.FieldCurrency", extend(props, properties));
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
    public addMultilineText(
        title: string,
        numberOfLines = 6,
        richText = true,
        restrictedMode = false,
        appendOnly = false,
        allowHyperlink = true,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const props = {
            AllowHyperlink: allowHyperlink,
            AppendOnly: appendOnly,
            FieldTypeKind: 3,
            NumberOfLines: numberOfLines,
            RestrictedMode: restrictedMode,
            RichText: richText,
        };

        return this.add(title, "SP.FieldMultiLineText", extend(props, properties));
    }

    /**
     * Adds a new SP.FieldUrl to the collection
     *
     * @param title The field title
     */
    public addUrl(
        title: string,
        displayFormat: UrlFieldFormatType = UrlFieldFormatType.Hyperlink,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const props = {
            DisplayFormat: displayFormat,
            FieldTypeKind: 11,
        };

        return this.add(title, "SP.FieldUrl", extend(props, properties));
    }

    /** Adds a user field to the colleciton
    * 
    * @param title The new field's title
    * @param selectionMode The selection mode of the field
    * @param selectionGroup Value that specifies the identifier of the SharePoint group whose members can be selected as values of the field
    * @param properties
    */
    public addUser(title: string,
        selectionMode: FieldUserSelectionMode,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const props = {
            FieldTypeKind: 20,
            SelectionMode: selectionMode,
        };

        return this.add(title, "SP.FieldUser", extend(props, properties));
    }

    /**
     * Adds a SP.FieldLookup to the collection
     *
     * @param title The new field's title
     * @param lookupListId The guid id of the list where the source of the lookup is found
     * @param lookupFieldName The internal name of the field in the source list
     * @param properties Set of additional properties to set on the new field
     */
    public addLookup(
        title: string,
        lookupListId: string,
        lookupFieldName: string,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const postBody: string = JSON.stringify({
            parameters: extend({
                FieldTypeKind: 7,
                LookupFieldName: lookupFieldName,
                LookupListId: lookupListId,
                Title: title,
                "__metadata": { "type": "SP.FieldCreationInformation" },
            }, properties),
        });

        return this.clone(Fields, "addfield").postCore<{ Id: string }>({ body: postBody }).then((data) => {
            return {
                data: data,
                field: this.getById(data.Id),
            };
        });
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
    public addChoice(
        title: string,
        choices: string[],
        format: ChoiceFieldFormatType = ChoiceFieldFormatType.Dropdown,
        fillIn?: boolean,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const props = {
            Choices: {
                results: choices,
            },
            EditFormat: format,
            FieldTypeKind: 6,
            FillInChoice: fillIn,
        };

        return this.add(title, "SP.FieldChoice", extend(props, properties));
    }

    /**
     * Adds a new SP.FieldMultiChoice to the collection
     *
     * @param title The field title.
     * @param choices The choices for the field.
     * @param fillIn Specifies whether the field allows fill-in values.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addMultiChoice(
        title: string,
        choices: string[],
        fillIn?: boolean,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const props = {
            Choices: {
                results: choices,
            },
            FieldTypeKind: 15,
            FillInChoice: fillIn,
        };

        return this.add(title, "SP.FieldMultiChoice", extend(props, properties));
    }

    /**
     * Adds a new SP.FieldBoolean to the collection
     *
     * @param title The field title.
     * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
     */
    public addBoolean(
        title: string,
        properties?: FieldCreationProperties): Promise<FieldAddResult> {

        const props = {
            FieldTypeKind: 8,
        };

        return this.add(title, "SP.Field", extend(props, properties));
    }
}

/**
 * Describes a single of Field instance
 *
 */
export class Field extends SharePointQueryableInstance {

    /**
     * Updates this field intance with the supplied properties
     *
     * @param properties A plain object hash of values to update for the list
     * @param fieldType The type value, required to update child field type properties
     */
    public update(properties: TypedHash<string | number | boolean>, fieldType = "SP.Field"): Promise<FieldUpdateResult> {

        const postBody: string = JSON.stringify(extend({
            "__metadata": { "type": fieldType },
        }, properties));

        return this.postCore({
            body: postBody,
            headers: {
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                field: this,
            };
        });
    }

    /**
     * Delete this fields
     *
     */
    public delete(): Promise<void> {
        return this.postCore({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Sets the value of the ShowInDisplayForm property for this field.
     */
    public setShowInDisplayForm(show: boolean): Promise<void> {
        return this.clone(Field, `setshowindisplayform(${show})`).postCore();
    }

    /**
     * Sets the value of the ShowInEditForm property for this field.
     */
    public setShowInEditForm(show: boolean): Promise<void> {
        return this.clone(Field, `setshowineditform(${show})`).postCore();
    }

    /**
     * Sets the value of the ShowInNewForm property for this field.
     */
    public setShowInNewForm(show: boolean): Promise<void> {
        return this.clone(Field, `setshowinnewform(${show})`).postCore();
    }
}

/**
 * This interface defines the result of adding a field
 */
export interface FieldAddResult {
    data: any;
    field: Field;
}

export interface FieldUpdateResult {
    data: any;
    field: Field;
}
