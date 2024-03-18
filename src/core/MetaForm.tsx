import EventEmitter from "eventemitter3";
import React, { Fragment } from "react";
import DependencyUtil from "../utils/DependencyUtil";
import FormUtils from "../utils/FormUtil";
import MetaformUtil from "../utils/MetaformUtil";
import ValidationUtil from "../utils/ValidationUtil";
import {
    IMetaForm,
    IForm,
    IFormField,
    IError,
    IDepdendencyItem,
    IElementTypes,
    IFnTypes,
    TCondition,
    TErrorCallback,
    IFieldRef,
    TFieldRef,
    IFieldConfig,
    IEventPayload,
    IControlProps
} from "../constants/common-interface";
import MetaformError from "./MetaformError";
import { IField, IFormConfig, IOption, IParamType, IRest, ISchema, TParam } from "../constants/model-interfaces";
import { Rest } from "./Rest";
import { Page } from "./Page";
import {
    CHANGE_TYPE,
    DATA_LOADER,
    DEP_TYPE,
    EVENTS,
    FIELD_DISPLAY_TYPES,
    SECTION_LAYOUT,
    URL_TYPE
} from "../constants/constants";
import { TValue } from "../constants/types";

/**
 * This class is responsible for handling all the heavy lifting work in the forms
 * @category Form handler
 */
export default class MetaForm implements IMetaForm {
    formConfig: IFormConfig;
    form: IForm;
    rest: Rest;
    page: Page;
    icons?: IElementTypes;
    fns?: IFnTypes;
    controls: IElementTypes;
    controlElements: Record<string, React.FunctionComponent<IControlProps>> | undefined;
    errorHandler?: TErrorCallback;

    constructor(
        private schema: ISchema,
        private eventEmitter: EventEmitter,
        formConfig: IFormConfig,
        restConfig?: IRest
    ) {
        this.form = {};
        this.formConfig = formConfig;
        if (restConfig) {
            // priority 1
            this.rest = new Rest(restConfig);
        } else if (schema.rest) {
            // priority 2
            this.rest = new Rest(schema.rest);
        } else {
            // default
            this.rest = new Rest(restConfig);
        }
        this.page = new Page(false, 1);
    }

    init() {
        const schema = this.schema;
        let totalSections = 0;
        let hasSections = false;
        if (schema.fields) {
            hasSections = FormUtils.hasSections(schema.fields);
            if (hasSections) {
                schema.fields.forEach((section) => {
                    this.setSection(section.name);
                    section.fields &&
                        section.fields.forEach((field) => {
                            this.initField(section.name, field);
                        });
                    totalSections++;
                });
                DependencyUtil.initDependencies(this.form, "", schema.fields);
                this.applyDependencies("", schema.fields);
                if (this.formConfig.sectionLayout === SECTION_LAYOUT.DEFAULT) {
                    this.page = new Page(false, 1);
                } else {
                    // use default layout as section if not specified
                    this.page = new Page(true, totalSections);
                }
            } else {
                const section = SECTION_LAYOUT.DEFAULT;
                this.setSection(section);
                schema.fields &&
                    schema.fields.forEach((field) => {
                        this.initField(section, field);
                    });
                DependencyUtil.initDependencies(this.form, section, schema.fields);
                this.applyDependencies(section, schema.fields);
                this.page = new Page(false, 1);
            }
        }
    }

    /** page functions */
    getPage() {
        return this.page;
    }

    setPage(page: Page) {
        this.page = page;
    }

    updatePage(pageNumber: number) {
        this.page.update(pageNumber);
        this.eventEmitter.emit(EVENTS.PAGE_CHANGE);
    }

    setEndOfPage(pageNumber: number | undefined) {
        this.page.setEndOfPage(pageNumber);
        this.eventEmitter.emit(EVENTS.PAGE_CHANGE);
    }

    resetEndOfPage() {
        this.page.resetEndOfPage();
        this.eventEmitter.emit(EVENTS.PAGE_CHANGE);
    }

    /** event emitter functions */
    emit(eventType: string, payload?: IEventPayload) {
        this.eventEmitter.emit(eventType, payload);
    }

    listener(eventType: string, fn: (data: IEventPayload) => void) {
        this.eventEmitter.addListener(eventType, fn);
    }

    removeListener(event: string, fn?: (data: IEventPayload) => void) {
        this.eventEmitter.removeListener(event, fn);
    }

    destroy() {
        this.eventEmitter.removeAllListeners();
    }

    /** icons */
    getIcon(type: string) {
        return this.icons && this.icons[type] ? this.icons[type] : "";
    }

    setIcons(icons: IElementTypes) {
        this.icons = icons;
    }

    /** rest functions */
    getRestConfig() {
        return this.rest?.config;
    }

    api(
        type: string,
        url: string,
        params?: Array<TParam>,
        currentValue?: TValue,
        sectionName?: string,
        isRemote?: boolean
    ) {
        let query = "";
        params &&
            params.forEach((param: TParam) => {
                const [name, value] = param;
                if (typeof value === "undefined") {
                    query += `&${name}=${currentValue}`;
                } else if (["string", "boolean", "number"].indexOf(typeof value) >= 0) {
                    query += `&${name}=${value}`;
                } else if (value && typeof value === "object") {
                    const type = (value as IParamType).type;
                    switch (type) {
                        case "fieldValue":
                            // eslint-disable-next-line no-case-declarations
                            const ref = (value as IParamType).ref;
                            if (ref) {
                                const section = (value as IParamType).section ?? sectionName;
                                const field = this.getField(section ?? "", ref);
                                const fielfValue = field?.value;
                                query += `&${name}=${fielfValue}`;
                            }
                            break;
                    }
                }
            });
        const newUrl = query ? `${url}?${query}` : url;
        switch (type) {
            default:
                return this.rest.get(newUrl, params, isRemote);
        }
    }

    getData(config: IFieldConfig, val: TValue, section: string, eventType?: string): Promise<Array<IOption>> {
        return new Promise((resolve, reject) => {
            const configUrl = config.url;
            const configType = config.type ?? (configUrl ? DATA_LOADER.URL : null);
            if (configType) {
                switch (configType) {
                    case "options_loader":
                    case "url_loader":
                    default:
                        // eslint-disable-next-line no-case-declarations
                        const url = config?.url ?? "";
                        // eslint-disable-next-line no-case-declarations
                        const qParams = FormUtils.updateParams(config.queryParams, eventType, val);
                        this.api(
                            "get",
                            url,
                            qParams,
                            val,
                            section,
                            // eslint-disable-next-line camelcase
                            config?.urlType === URL_TYPE.REMOTE
                        ).then((response: object) => {
                            const responseKey = config?.responseKey;
                            const results = responseKey ? response[responseKey] : response;
                            let newResults: Array<IOption> = [];
                            if (Array.isArray(results)) {
                                const labelKey = config?.labelKey ?? "label";
                                const valueKey = config?.valueKey ?? "value";
                                newResults = results.map((r: string) => {
                                    const label = FormUtils.getDataFromValueKey(r, labelKey);
                                    const value = FormUtils.getDataFromValueKey(r, valueKey);
                                    return { label, value, ref: r };
                                });
                                resolve(newResults);
                            } else {
                                reject(new MetaformError("Response must be an array", response));
                            }
                        });
                        break;
                }
            }
        });
    }

    /** Theme functions */

    getSection(pageNumber: number) {
        if (this.schema.fields) {
            const hasSections = FormUtils.hasSections(this.schema.fields);
            if (hasSections && this.schema.fields[pageNumber - 1]) {
                const sectionName = this.schema.fields[pageNumber - 1];
                return this.form[sectionName.name];
            }
        }
        return null;
    }

    setSection(section: string) {
        this.form[section] = {};
    }

    initField(section: string, field: IField) {
        const formField: IFormField = {
            prop: field.prop,
            display: true,
            type: field.meta.type,
            value: field?.meta?.value !== undefined ? field?.meta?.value : "",
            isDisabled: field.meta.isDisabled,
            isReadonly: field.meta.isReadonly,
            displayName: field.meta.displayName,
            displayType: field.meta.displayType,
            displayProps: field.meta.displayProps,
            options: field.meta.options,
            placeholder: field.meta.placeholder,
            isArray: field.meta.isArray,
            validation: MetaformUtil.getDefaultValidation(field.meta?.displayType, field.meta.validation),
            className: field.meta.className,
            events: field.meta.events,
            error: { hasError: false, errorMsg: "" },
            config: field.meta.config,
            icons: field.meta.icons,
            iconName: field.meta.iconName,
            icon: field.meta.icon
        };
        this.form[section][field.name] = formField;
    }

    getField(section: string, field: string): IFormField {
        return this.form[section][field];
    }

    setField(section: string, field: string, value: TValue) {
        this.form[section][field].value = value as Exclude<TValue, Date>;
    }

    updateField(section: string, field: string, value: TValue) {
        this.setField(section, field, value);
        this.handleChangeEvents(section, field, value);
        const fieldDisplayed = this.getFieldDisplay(section, field);
        this.handleDependencies(section, field, value, fieldDisplayed);
    }

    getFieldProp(section: string, field: string, prop: string) {
        return this.form[section][field][prop];
    }

    setFieldProp(section: string, field: string, prop: string, propVal: TValue | Array<TFieldRef> | IError | FileList) {
        this.form[section][field][prop] = propVal;
    }

    getFieldDisplay(section: string, field: string) {
        return this.form[section][field].display;
    }

    setFieldDisplay(section: string, field: string, display: boolean) {
        this.form[section][field].display = display;
    }

    getFieldOptions(section: string, field: string) {
        return this.form[section][field].options || [];
    }

    setFieldOptions(section: string, field: string, options: Array<IOption> | undefined) {
        this.form[section][field].options = options;
    }

    setFieldDisabled(section: string, field: string, disabled: boolean) {
        this.form[section][field].isDisabled = disabled ? true : undefined;
    }

    getDependencies(section: string, field: string) {
        // eslint-disable-next-line dot-notation
        return this.form[section][field]["dependencies"];
    }

    getChangeEvents(section: string, field: string) {
        return this.form[section][field]?.events?.change;
    }

    applyDependencies(section: string, fields: Array<IField>) {
        fields &&
            fields.forEach((field) => {
                if (section) {
                    const deps = this.getDependencies(section, field.name);
                    const pField = this.getField(section, field.name);
                    const value = pField.value;
                    deps &&
                        deps.forEach(
                            (dep: {
                                type: string;
                                section: string;
                                field: string;
                                value: TValue;
                                valueFn?: string;
                                url: string;
                                currentValue: TValue;
                                resetValue: string;
                            }) => {
                                switch (dep.type) {
                                    case DEP_TYPE.EXISTS:
                                        {
                                            const depValue = dep.value;
                                            const field = dep.field;
                                            if (depValue === undefined) {
                                                // field dependency
                                            } else {
                                                // condition dependency
                                                if (value !== undefined) {
                                                    let conditionMatch = false;
                                                    if (Array.isArray(depValue)) {
                                                        if (depValue.indexOf(value) >= 0) {
                                                            conditionMatch = true;
                                                        }
                                                    } else {
                                                        switch (depValue) {
                                                            case "$notempty":
                                                                conditionMatch = value !== "";
                                                                break;
                                                            case "$valueFn":
                                                                {
                                                                    const valueFn = dep.valueFn;
                                                                    if (valueFn) {
                                                                        const fn = this.getFn(valueFn);
                                                                        if (fn) {
                                                                            conditionMatch = fn(value) as boolean;
                                                                        }
                                                                    }
                                                                }
                                                                break;
                                                            default:
                                                                conditionMatch = value === depValue;
                                                        }
                                                    }
                                                    this.setFieldDisplay(dep.section, field, conditionMatch);
                                                }
                                            }
                                        }
                                        break;
                                    case DEP_TYPE.ENABLED:
                                        {
                                            const field = dep.field;
                                            this.setFieldDisabled(dep.section, field, value !== dep.value);
                                        }
                                        break;
                                    case DEP_TYPE.EQUALS:
                                        if (value === dep.value) {
                                            this.setField(dep.section, dep.field, dep.currentValue);
                                        } else if (dep.resetValue !== undefined) {
                                            this.setField(dep.section, dep.field, dep.resetValue);
                                        }
                                        break;
                                    case DEP_TYPE.LOAD:
                                        if (value && dep.url) {
                                            const url = dep.url.replace("{0}", value as string);
                                            const field = dep.field;
                                            fetch(url)
                                                .then((res) => res.json())
                                                .then((result) => {
                                                    this.setFieldOptions(dep.section, field, result);
                                                });
                                        }
                                        break;
                                }
                            }
                        );
                }
                if (field.fields && field.fields.length > 0) {
                    this.applyDependencies(field.name, field.fields);
                }
            });
    }

    handleDependencies(section: string, fieldName: string, value: TValue, fieldDisplayed: boolean) {
        return DependencyUtil.handleDependencies(this, section, fieldName, value, fieldDisplayed);
    }

    handleChangeEvents(gSection: string, gField: string, fieldValue?: TValue, fieldRef?: IOption) {
        const changes = this.getChangeEvents(gSection, gField);
        let actualChanges = [];
        if (changes) {
            actualChanges = Array.isArray(changes) ? changes : [changes];
            actualChanges.forEach((changes) => {
                switch (changes.type) {
                    case CHANGE_TYPE.PROP_SETTER:
                    case CHANGE_TYPE.SETTER:
                        {
                            const { ref, value, valueKey, valueMap } = changes;
                            const section = changes.section ? changes.section : gSection;
                            let actualValue = value;
                            if (valueMap) {
                                let matchValue;
                                if (valueKey) {
                                    const ref = (fieldRef as IOption)?.ref;
                                    matchValue = ref ? FormUtils.getDataFromValueKey(ref as string, valueKey) : value;
                                } else {
                                    matchValue = valueMap[fieldValue as string];
                                }
                                if (matchValue !== undefined) {
                                    actualValue = matchValue as TValue;
                                }
                            } else {
                                if (valueKey) {
                                    const ref = (fieldRef as IFieldRef)?.ref;
                                    actualValue = ref ? FormUtils.getDataFromValueKey(ref, valueKey) : value;
                                } else if (changes.valueFn) {
                                    const fn = this.getFn(changes.valueFn);
                                    actualValue = fn ? (fn(fieldValue, fieldRef) as TValue) : "";
                                } else {
                                    if (value === undefined) {
                                        actualValue = fieldValue;
                                    }
                                }
                            }
                            if (changes.type === CHANGE_TYPE.SETTER) {
                                this.setField(section, ref ?? "", actualValue);
                            } else if (changes.type === CHANGE_TYPE.PROP_SETTER) {
                                if (actualValue !== undefined) {
                                    const actualRef = ref || gField;
                                    const field = this.getField(section, actualRef);
                                    FormUtils.updateFieldProp(field, changes.name as string, actualValue);
                                }
                            }
                        }
                        break;
                    case CHANGE_TYPE.EVENT_EMITTER:
                        {
                            const value = changes.value;
                            const { eventType, payload } = changes;
                            if (value !== undefined) {
                                if (value === fieldValue) {
                                    this.emit(eventType as string, { payload });
                                }
                            } else {
                                this.emit(eventType as string, { payload });
                            }
                        }
                        break;
                    case CHANGE_TYPE.SETTER_CONDITION:
                        {
                            const { ref, value, valueKey, condition } = changes;
                            const section = changes.section ? changes.section : gSection;
                            let actualValue;
                            const evalConditionResult = this.parseCondition(condition as TCondition[], section);
                            if (evalConditionResult) {
                                // value map
                                if (changes.valueMap) {
                                    // to do
                                } else if (changes.valueKey) {
                                    const ref = (fieldRef as IFieldRef)?.ref;
                                    actualValue = ref ? FormUtils.getDataFromValueKey(ref, valueKey as string) : value;
                                } else {
                                    actualValue = value !== undefined ? value : fieldValue;
                                }
                                // value key
                                // default
                                this.setField(section, ref as string, actualValue);
                                const field = this.getField(section, ref as string);
                                if (field && field.displayType === "select") {
                                    this.setFieldProp(section, ref as string, "options", [fieldRef as TFieldRef]);
                                }
                            }
                        }
                        break;
                }
            });
        }
    }

    setDisplayTypeFieldProp(
        displayType: string,
        section: string,
        field: string,
        resultOptions: Array<IOption>,
        dependency: IDepdendencyItem
    ) {
        switch (displayType) {
            case FIELD_DISPLAY_TYPES.TEXT:
                if (dependency.defaultValue === "0") {
                    const firstOption = resultOptions && resultOptions[0] ? resultOptions[0] : "";
                    if (firstOption) {
                        this.setFieldProp(section, field, "value", firstOption.value);
                        this.performDeepUpdate(section, field, firstOption.value, firstOption);
                    }
                } else {
                    this.setFieldProp(section, field, "value", "");
                }
                break;
            case FIELD_DISPLAY_TYPES.SELECT:
                this.setFieldProp(section, field, "value", "");
                this.setFieldOptions(section, field, resultOptions);
                if (dependency.defaultValue === "0") {
                    const firstOption = resultOptions && resultOptions[0] ? resultOptions[0] : "";
                    if (firstOption) {
                        this.setFieldProp(section, field, "value", firstOption.value);
                        this.performDeepUpdate(section, field, firstOption.value, firstOption);
                    }
                }
                break;
        }
    }

    performDeepUpdate(section: string, field: string, value: TValue, ref: IOption) {
        this.setFieldProp(section, field, "value", value);
        this.handleChangeEvents(section, field, value, ref);
    }

    /** validation functions */
    setError(section: string, field: string, error: IError) {
        this.setFieldProp(section, field, "error", error);
    }

    validate() {
        let hasErrors = false;
        if (this.page.isGrouped) {
            // validate page
            const section = this.schema.fields.find((section, index) => index + 1 === this.page.pageNumber);
            if (section) {
                hasErrors = ValidationUtil.validateFormSection(this.form, section.name);
            }
        } else {
            hasErrors = ValidationUtil.validateFormSection(this.form, SECTION_LAYOUT.DEFAULT);
        }
        return !hasErrors;
    }

    parseCondition(condition: Array<TCondition>, section: string) {
        return ValidationUtil.parseCondition(this.form, condition, section);
    }

    /** Function mapper */
    getFn(fn: string) {
        if (this.fns) {
            return this.fns[fn];
        }
        return null;
    }

    setFns(fns: IFnTypes) {
        this.fns = fns;
    }

    /** Error handler */
    handleError(error: Error, section: string, field: string) {
        this.setError(section, field, {
            errorMsg: error.message,
            hasError: true
        });
        if (this.errorHandler) {
            this.errorHandler(error, section, field);
        }
    }

    setErrorHandler(errorHandler: TErrorCallback) {
        this.errorHandler = errorHandler;
    }

    getControl(displayType: string) {
        if (this.controls && this.controls[displayType]) {
            return this.controls[displayType];
        }
        return <Fragment />;
    }

    setControls(controls: IElementTypes) {
        this.controls = controls;
    }

    getControlElements(displayType: string): React.FunctionComponent<IControlProps> | null {
        if (this.controlElements && this.controlElements[displayType]) {
            return this.controlElements[displayType];
        }
        return null;
    }

    setControlElements(controlElements: Record<string, React.FunctionComponent>) {
        this.controlElements = controlElements;
    }
}
