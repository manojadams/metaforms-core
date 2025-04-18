import { IForm, IFormData, IFormField, IFormSection, IRequestBody } from "../constants/common-interface";
import { DEFAULT_DATE_FORMAT, FORM_ACTION, _INTERNAL_VALUES } from "../constants/constants";
import { CONTROLS } from "../constants/controls";
import { TiconPositionType, TValue } from "../constants/types";
import { Page } from "../core/Page";
import {
    IDependency,
    IDisplayProps,
    IField,
    IFormatterType,
    IIconConfig,
    IMeta,
    IOption,
    ISchema,
    TParam
} from "./../constants/model-interfaces";

const cssClassMap = {
    md: "mcol-md-",
    lg: "mcol-lg-",
    sm: "mcol-sm-",
    xs: "mcol-",
    offset: "moffset-",
    default: "mcol-md"
};

/**
 * @ignore
 */
export default class FormUtils {
    static getCssClassName(prop: IDisplayProps | undefined) {
        if (!prop) {
            return "";
        }
        const md = prop.md ? cssClassMap.md + prop.md : "";
        const lg = prop.lg ? cssClassMap.lg + prop.lg : "";
        const sm = prop.sm ? cssClassMap.sm + prop.sm : "";
        const xs = prop.xs ? cssClassMap.xs + prop.xs : "";
        const offset = prop.offset ? cssClassMap.offset + prop.offset : "";
        return `${offset} ${xs} ${sm} ${md} ${lg}`.trim();
    }

    static isFormControl(prop: IMeta) {
        if (prop.type === "section" || prop.type === "group") {
            return false;
        }
        return true;
    }

    static getVerticalSpacing(theme: string) {
        if (theme) {
            switch (theme) {
                case "mui":
                default:
                    return "my-2 my-md-3";
            }
        }
        return "";
    }

    static getAlignment(align: string) {
        return align ? "wrow-" + align : "";
    }

    static getPadding(theme: string) {
        if (theme) {
            switch (theme) {
                case "bootstrap":
                    return "py-md-3";
                case "mui":
                    return "py-md-3";
            }
        }
        return "";
    }

    static getUUID(prefix = "") {
        const randomNum = Math.floor(Math.random() * 100 + Date.now());
        return `${prefix}_${randomNum}`;
    }

    static hasSections(fields: Array<IField>) {
        return fields.find((field: IField) => field.meta.type === "section") !== undefined;
    }

    static getFormDefaultButtons(): Array<IField> {
        return [
            {
                name: FORM_ACTION.SUBMIT,
                meta: {
                    type: FORM_ACTION.SUBMIT,
                    displayName: "Save",
                    displayType: "button",
                    url: "",
                    displayProps: {
                        xs: 12,
                        md: 2
                    },
                    className: "btn-primary my-4 d-block w-100"
                }
            }
        ];
    }

    static getFormGroupDefaultButtons(): Array<IField> {
        return [
            {
                name: "previous",
                meta: {
                    type: "previous",
                    displayName: "Previous"
                }
            },
            {
                name: "next",
                meta: {
                    type: "next",
                    displayName: "Next"
                }
            },
            {
                name: "submit",
                meta: {
                    type: "submit",
                    displayName: "Submit"
                }
            }
        ];
    }

    static getThemeProp(theme: any, prop: string) {
        if (theme.tabs && theme?.tabs[prop]) {
            return theme.tabs[prop];
        }
        return "";
    }

    static getNormalizedFormData(formData: IFormData) {
        const newFormData = {};
        Object.keys(formData).forEach((key) => {
            newFormData[key] = {};
            Object.keys(formData[key]).forEach((key2) => {
                newFormData[key][key2] = formData[key][key2].value;
            });
        });
        return newFormData;
    }

    static getBase64(file?: File) {
        return new Promise((resolve, reject) => {
            if (file) {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = reject;
            } else {
                resolve(null);
            }
        });
    }

    static async getFormFieldValue(formField: IFormField) {
        switch (formField.displayType) {
            case CONTROLS.FILE:
                if (formField.files) {
                    const _files = Array.from(formField.files);
                    let _filesData;
                    if (!formField.config?.blob) {
                        _filesData = await Promise.all(_files.map(async (_file) => await this.getBase64(_file)));
                    }

                    return {
                        name: formField.value,
                        [formField.config?.blob ? "files" : "filesData"]: formField.config?.blob
                            ? formField.files
                            : _filesData
                    };
                } else if (formField.file && formField.file instanceof File) {
                    return {
                        name: formField.value,
                        [formField.config?.blob ? "file" : "fileData"]: formField.config?.blob
                            ? formField.file
                            : await this.getBase64(formField.file)
                    };
                }

                return null;
            default:
                return formField.value;
        }
    }

    static updateFormData(formData: IForm, newFormData: IFormData, formatter: IFormatterType): Promise<IFormData> {
        return new Promise((resolve) => {
            const allPendingUpdates = Object.keys(formData).flatMap((key) => {
                return Object.keys(formData[key]).map((key2) => {
                    const prop = formData[key][key2].prop;
                    return this.getFormFieldValue(formData[key][key2]).then((fieldValue) => {
                        if (prop) {
                            if (!newFormData[prop]) {
                                newFormData[prop] = {};
                            }
                            if (formatter[key2]) {
                                newFormData[prop][key2] = formatter[key2](fieldValue as TValue);
                            } else {
                                newFormData[prop][key2] = fieldValue;
                            }
                        } else {
                            // null prop is ignored
                            if (prop !== null) {
                                if (formatter[key2]) {
                                    newFormData[key2] = formatter[key2](fieldValue as TValue);
                                } else {
                                    newFormData[key2] = fieldValue as string;
                                }
                            }
                        }
                    });
                });
            });
            Promise.all(allPendingUpdates)
                .then(() => this.updateNestedFormData(newFormData))
                .then(() => resolve(newFormData));
        });
    }

    static async updateSectionFormData(
        formData: IFormSection | null,
        newFormData: IFormData,
        formatter: IFormatterType
    ): Promise<IFormData> {
        return new Promise((resolve) => {
            if (!formData) {
                resolve({});
                return {};
            }
            const allPendingUpdates = Object.keys(formData).map(async (key) => {
                const prop = formData[key].prop;
                const formDataKey = formData[key];
                const fieldValue = (await this.getFormFieldValue(formDataKey)) as string;
                if (prop) {
                    if (!newFormData[prop as string]) {
                        newFormData[prop as string] = {};
                    }
                    if (formatter[key]) {
                        newFormData[prop as string][key] = formatter[key](fieldValue);
                    } else {
                        newFormData[prop as string][key] = fieldValue;
                    }
                } else {
                    // null prop is ignored
                    if (prop !== null) {
                        if (formatter[key]) {
                            newFormData[key] = formatter[key](fieldValue as string);
                        } else {
                            newFormData[key] = fieldValue;
                        }
                    }
                }
            });
            return Promise.all(allPendingUpdates)
                .then(() => this.updateNestedFormData(newFormData))
                .then(() => resolve(newFormData));
        });
    }

    static async updateNestedFormData(formData: IFormData) {
        Object.keys(formData).forEach(async (key: string) => {
            if (typeof formData[key] === "object") {
                const props = key.split("#");
                if (props.length > 1) {
                    // is nested prop
                    if (!formData[props[0]]) {
                        formData[props[0]] = {};
                    }
                    await this.updateNestedProp(
                        formData[props[0]] as IFormData,
                        props.slice(1),
                        formData[key] as TValue
                    );
                    delete formData[key];
                }
            }
        });
    }

    static async updateNestedProp(formData: IFormData, props: Array<string>, value: TValue) {
        if (props.length > 0) {
            if (props.length === 1) {
                if (formData) {
                    formData[props[0]] = value as Exclude<TValue, undefined | null | Date>;
                }
            } else {
                if (!formData[props[0]]) {
                    formData[props[0]] = {};
                }
                await this.updateNestedProp(formData[props[0]] as IFormData, props.slice(1), value);
            }
        }
    }

    static getSearchValue(options: Array<IOption>, value: TValue) {
        if (value !== undefined && options && options.length > 0) {
            return options.find((option) => option.value === value);
        }
        return value;
    }

    static getDataFromValueKey(data: string, props: string) {
        const values = props.split("#");
        let nestedData = data;
        if (values) {
            values.forEach((val) => {
                nestedData = nestedData[val];
            });
            return nestedData;
        }
        return data;
    }

    /**
     * Update parameters with special values ($input, $initial etc)
     * @param queryParams
     * @param eventType
     * @param currentValue
     * @returns
     */
    static updateParams(queryParams: Array<TParam> | undefined, eventType: string | undefined, currentValue: TValue) {
        if (queryParams && eventType) {
            const updatedQueryParams: Array<TParam> = [];
            queryParams.forEach((param) => {
                const [key, val] = param;
                let actualVal = val;
                if (val) {
                    switch (val) {
                        case _INTERNAL_VALUES.INPUT:
                        case _INTERNAL_VALUES.INITIAL:
                            actualVal = val === eventType ? currentValue : "";
                            break;
                        default:
                        // nothing to do
                    }
                }
                updatedQueryParams.push([key, actualVal]);
            });
            return updatedQueryParams;
        }
        return queryParams;
    }

    /**
     * Updates request payload body
     * @param requestBody
     * @param requestBodyParams
     * @returns
     */
    static updateBodyParams(requestBody: IRequestBody, requestBodyParams: Array<TValue>) {
        if (requestBodyParams && requestBodyParams.length > 0) {
            let stringified = JSON.stringify(requestBody);
            requestBodyParams.forEach((param, idx) => {
                if (param) {
                    stringified = stringified.replace(`$${idx}`, String(param));
                }
            });

            return JSON.parse(stringified);
        }

        return requestBody;
    }

    static updateFieldProp(field: IFormField, prop: string, value: TValue) {
        const props = prop.split("#");
        if (props.length > 1) {
            // nested prop
            props.reduce((acc, item, index) => {
                if (index === props.length - 1) {
                    // last item
                    acc[item] = value;
                } else {
                    if (!acc[item]) {
                        acc[item] = {};
                    }
                }
                return acc[item];
            }, field);
        } else {
            if (!field[prop]) {
                // init
                field[prop] = {};
            }
            // update
            field[prop] = value;
        }
    }

    static getDateString(date: Date): string {
        const offset = date.getTimezoneOffset() * 60000;
        const dateWithOffset = new Date(date.getTime() - offset);
        return dateWithOffset.toISOString().substring(0, 10);
    }

    static getLocalDateStringFormat(inputDateString: string, inputFormat: string) {
        if (inputDateString && inputFormat === DEFAULT_DATE_FORMAT) {
            try {
                const parts = inputDateString.split("/");
                const mm = parts[0];
                const dd = parts[1];
                const yy = parts[2];
                return `${dd}/${mm}/${yy}`;
            } catch (error) {
                return inputDateString;
            }
        }
        return inputDateString;
    }

    static cleanupSchema(schema: ISchema) {
        const newFields: Array<IField> = [];
        schema.fields &&
            schema.fields.forEach((field) => {
                if (field) {
                    newFields.push(field);
                }
            });
        schema.fields = newFields;
        return schema;
    }

    static createFileInput(
        fileWidthClass: string,
        fieldName: string,
        accept: string | undefined,
        displayLabel: string | undefined,
        onChangeCallback: EventListener
    ) {
        const ele = document.createElement("input");
        ele.setAttribute("type", "file");
        ele.className = `position-absolute opacity-0 ${fileWidthClass} h-100`;
        ele.setAttribute("name", fieldName);
        ele.setAttribute("accept", accept || "");
        ele.setAttribute("title", displayLabel || "");
        ele.addEventListener("change", onChangeCallback);
        return ele;
    }

    static resolveButtonDependencies(deps: IDependency | undefined, page: Page) {
        if (deps && deps.exists) {
            const ref = deps.exists.ref;
            if (!ref) {
                return true;
            }
            switch (ref) {
                case "page_number": {
                    const pageNumber = page.pageNumber;
                    const pageNumberFromDependency = parseInt(deps.exists.value as string);
                    if (pageNumberFromDependency === pageNumber) {
                        return true;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    static getIconNameByPosition(positionType: TiconPositionType, allIcons: IIconConfig) {
        if (allIcons) {
            const allIconKeys = Object.keys(allIcons);
            const iconMatch = allIconKeys.find((name: string) => allIcons[name].type === positionType);
            return iconMatch;
        }
        return "";
    }
}
