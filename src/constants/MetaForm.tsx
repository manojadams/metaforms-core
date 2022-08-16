import EventEmitter from "eventemitter3";
import { FORM_CONSTANTS, MSGS, Page, Rest } from ".";
import BaseFormControl from "../core/form-controls/base-form-control";
import DummyFormControl from "../core/form-controls/DummyFormControl";
import BaseFormGroup from "../core/form-group/base-form-group";
import DummyFormGroup from "../core/form-group/DummyFormGroup";
import BaseFormStepper from "../core/form-stepper/base-form-stepper";
import DummyFormStepper from "../core/form-stepper/DummyFormStepper";
import FormUtils from "../utils/FormUtil";
import MetaformUtil from "../utils/MetaformUtil";
import ValidationUtil from "../utils/ValidationUtil";
import { IMetaForm, IForm, IFormField, IError, IRenderField, IDepdendencyItem, IElementTypes, IFnTypes } from "./common-interface";
import { IConfig, IDependency, IField, IOption, IRest, ISchema, ITheme, IURLLoaderConfig, TParam } from "./model-interfaces";
import Theme from "./Theme";

export default class MetaForm implements IMetaForm {
    theme: ITheme;
    form: IForm;
    rest: Rest;
    page: Page;
    icons: IElementTypes | undefined;
    fns: IFnTypes | undefined;
    errorHandler: Function | undefined;

    constructor(private schema: ISchema, private eventEmitter: EventEmitter) {
        this.form = {};
        this.rest = new Rest(schema.rest);
        let totalSections = 0;
        let themeType = schema?.theme?.type || 'default';
        let sectionLayout = schema?.theme?.sectionLayout || 'default';
        this.theme = new Theme({type: themeType, sectionLayout: sectionLayout, mui: schema?.theme?.mui, bootstrap: schema?.theme?.bootstrap});
        if (schema.fields) {
            const hasSections = FormUtils.hasSections(schema.fields);
            if (hasSections) {
                schema.fields.forEach(section => {
                    this.setSection(section.name);
                    section.fields && section.fields.forEach(field => {
                        this.initField(section.name, field);
                    });
                    totalSections++;
                });
                this.initDependencies('', schema.fields);
                this.applyDependencies('', schema.fields);
            } else {
                const section = 'default';
                this.setSection(section);
                schema.fields && schema.fields.forEach(field => {
                    this.initField(section, field);
                });
                this.initDependencies(section, schema.fields);
                this.applyDependencies(section, schema.fields);
            }
        }
        if (this.theme && 
            this.theme.sectionLayout === 'tabs' 
            || this.theme.sectionLayout === 'stepper' 
            || this.theme.sectionLayout === 'wizard') {
                this.page = new Page(true, totalSections);
            } else {
                this.page = new Page(false, 1);
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
        this.eventEmitter.emit('page_change');
    }
    setEndOfPage(pageNumber: number) {
        this.page.setEndOfPage(pageNumber);
        this.eventEmitter.emit('page_change');
    }
    resetEndOfPage() {
        this.page.resetEndOfPage();
        this.eventEmitter.emit('page_change');
    }

    /** event emitter functions */
    emit(eventType: string, payload: any) {
        this.eventEmitter.emit(eventType, payload);
    }
    listener(eventType: string, fn: (...args: any[]) => void) {
        this.eventEmitter.addListener(eventType, fn);
    }
    removeListener(event: string, fn?: (...args: any[]) => void) {
        this.eventEmitter.removeListener(event, fn);
    }
    destroy() {
        this.eventEmitter.removeAllListeners();
    }
    /** icons */
    getIcon(type: string) {
        return this.icons && this.icons[type] ? this.icons[type] : '';
    }
    setIcons(icons: IElementTypes) {
        this.icons = icons;
    }
    /** rest functions */
    getRestConfig() {
        return this.rest?.config;
    }
    api(type: string, url: string, params?: Array<TParam>, currentValue?: any, sectionName?: string) {
        let query = '';
        params && params.forEach((param: TParam, index: number) => {
            const [name, value] = param;
            if (typeof value === 'undefined') {
                query+= `&${name}=${currentValue}`;
            } else if (['string', 'boolean', 'number'].indexOf(typeof value)>=0) {
                query+= `&${name}=${value}`;
            } else if (typeof value === 'object') {
                const type = value['type'];
                switch (type) {
                    case 'fieldValue':
                        const ref = value.ref;
                        if (ref) {
                            const section = value.section || sectionName;
                            const field = this.getField(section||'', ref);
                            const fielfValue = field?.value;
                            query+= `&${name}=${fielfValue}`;
                        }
                        break;
                }
            }
        });
        const newUrl = query ? `${url}?${query}` : url;
        switch(type) {
            default: 
                return this.rest.get(newUrl);
        }
    }
    getData(config: IURLLoaderConfig, val: any, section: string, eventType?: string): Promise<Array<IOption>> {
        return new Promise(resolve => {
            if (config.type) {
                switch (config.type) {
                    case 'options_loader':
                    case 'url_loader':
                    default: 
                        const url = config?.url || '';
                        const qParams = FormUtils.updateParams(config.queryParams, eventType, val);
                        this.api('get', url, qParams, val, section)
                        .then(response => {
                            const responseKey = config?.responseKey;
                            const results = responseKey ? response[responseKey] : response;
                            let newResults: Array<IOption> = [];
                            if (Array.isArray(results)) {
                                const labelKey = config?.labelKey || 'label';
                                const valueKey = config?.valueKey || 'value';
                                newResults = results.map((r:any) => {
                                    const label = FormUtils.getDataFromValueKey(r, labelKey);
                                    const value = FormUtils.getDataFromValueKey(r, valueKey);
                                    return {label, value, ref: r};
                                })
                                resolve(newResults);
                            } else {
                                throw new Error('Response must be an array');
                            }
                        });
                    break;
                }
            }
        })
    }
    /** Theme functions */
    getThemeProp(themeName: string, prop: string) {
        if (this.theme[themeName]) {
            return this.theme[themeName][prop];
        }
    }
    initDependencies(section: string, fields: Array<IField>) {
        fields && fields.forEach(field => {
            if (field && field?.meta?.dependencies) {
                this.setDependencies(section, field.name, field?.meta?.dependencies);
            }
            if (field.fields && field.fields.length > 0) {
                this.initDependencies(field.name, field.fields);
            }
        });
    }
    setSection(section: string) {
        this.form[section] = {};
    }
    initField(section: string, field: IField) {
        this.form[section][field.name] = {
            prop: field.prop,
            display: true, 
            type: field.meta.type,
            value: field?.meta?.value !== undefined ? field?.meta?.value : '',
            isDisabled: field.meta.isDisabled,
            isReadonly: field.meta.isReadonly,
            displayName: field.meta.displayName,
            displayType: field.meta.displayType,
            displayProps: field.meta.displayProps,
            options: field.meta.options,
            placeholder: field.meta.placeholder,
            isArray: field.meta.isArray,
            validation: MetaformUtil.getDefaultValidation(field.meta?.displayType, field.meta.validation),
            mui: field.meta.mui,
            bootstrap: field.meta.bootstrap,
            className: field.meta.className,
            events: field.meta.events,
            labelPlacement: field.meta.labelPlacement,
            error: {hasError: false, errorMsg: ''},
            config: field.meta.config,
            icons: field.meta.icons
        };
    }
    getField(section: string, field: string): IFormField {
        return this.form[section][field];
    }
    setField(section: string, field: string,value: any) {
        this.form[section][field].value = value;
    }
    getFieldProp(section: string, field: string, prop: string) {
        return this.form[section][field][prop];
    }
    setFieldProp(section: string, field: string,prop: any, propVal: any) {
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
    setFieldOptions(section: string, field: string, options: Array<any> | undefined) {
        this.form[section][field].options = options; 
    }
    setFieldDisabled(section: string, field: string, disabled: boolean) {
        this.form[section][field].isDisabled = disabled ? true : undefined;
    }
    getDependencies(section: string, field: string) {
        return this.form[section][field]['dependencies'];
    }
    getChangeEvents(section: string, field: string) {
        return this.form[section][field]?.events?.change;
    }
    setDependencies(section: string, field: string, dependencies: IDependency) {
        if (!dependencies) return;
        Object.keys(dependencies).forEach(type => {
            if (dependencies[type] instanceof Array) {
                dependencies[type].forEach((dependency: IDepdendencyItem) => {
                    this.setDependency(dependency, section, type, field);
                });
            } else {
                this.setDependency(dependencies[type], section, type, field);
            }
        });
    }
    setDependency(dependency: IDepdendencyItem, section: string, type: string, field: string) {
        const ref = dependency.ref || '';
        const formSection = dependency?.section || section;
        const value = dependency?.value;
        // dependency key
        const D_KEY = FORM_CONSTANTS.DEPENDENCY_KEY;
        if (ref && !this.form[formSection][ref][D_KEY]) {
            this.form[formSection][ref][D_KEY] = [];
        }
        let extraParams;
        switch (type) {
            case 'pattern_match_url_loader':
                extraParams = {
                    pattern: dependency.pattern,
                    changeType: dependency.type
                };
            case 'load': {
                extraParams = extraParams || undefined;
                const url = dependency.url;
                const labelKey = dependency?.labelKey;
                const valueKey = dependency?.valueKey;
                const responseKey = dependency.responseKey;
                const queryParams = dependency.queryParams;
                const pathParams = dependency.pathParams;
                this.form[formSection][ref][D_KEY].push({section, type, field, url, valueKey, 
                    labelKey, responseKey, queryParams, pathParams, ...extraParams});
            }
            break;
            case 'load_options': {
                const valueMap = dependency.valueMap;
                this.form[formSection][ref][D_KEY].push({section, type, field, valueMap});
            }
            break;
            case 'equals': {
                this.form[formSection][ref][D_KEY].push({section, type, field, value, 
                    currentValue: dependency.currentValue, resetValue: dependency.resetValue});
            }
            break;
            case 'validation':
            case 'change': {
                const changeType = dependency.type;
                const valueMap = dependency.valueMap;
                this.form[formSection][ref][D_KEY].push({section, type, field, value, valueMap, changeType});
            }
            break;
            default:
                this.form[formSection][ref][D_KEY].push({section, type, field, value});
        }
    }
    applyDependencies(section: string, fields: Array<IField>) {
        fields && fields.forEach(field => {
            if (section) {
                const deps = this.getDependencies(section, field.name);
                const pField = this.getField(section, field.name);
                const value = pField.value;
                deps && deps.forEach((dep: {type: string, section: string, field: string, value: any, url: string, currentValue: any, resetValue: string}) => {
                    switch (dep.type) {
                        case 'exists':
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
                                            if (depValue.indexOf(value) >=0) {
                                                conditionMatch = true;
                                            }
                                        } else {
                                            switch (depValue) {
                                                case '$notempty':
                                                    conditionMatch = value !== '';
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
                        case 'enabled': {
                            const field = dep.field;
                            this.setFieldDisabled(dep.section, field, value !== dep.value);
                        }
                        break;
                        case 'equals': {
                            if (value === dep.value) {
                                this.setField(dep.section, dep.field, dep.currentValue);
                            } else if (dep.resetValue !== undefined) {
                                this.setField(dep.section, dep.field, dep.resetValue);
                            }
                        }
                        break;
                        case 'load': {
                            if (value && dep.url) {
                                const url = dep.url.replace('{0}', value);
                                const field = dep.field;
                                fetch(url).then(res => res.json()).then(result => {
                                    this.setFieldOptions(dep.section, field, result);
                                });
                            }
                        }
                        break;
                        case 'set': {
                            if (value) {
                                // to do
                            }
                        }
                    }
                });
            }
            if (field.fields && field.fields.length > 0) {
                this.applyDependencies(field.name, field.fields);
            }
        });
    }

    handleDependencies(section: string, fieldName: string, value: any, fieldDisplayed: boolean) {
        return new Promise((sucessCallback: Function) => {
            const deps = this.getDependencies(section, fieldName);
            const totalDeps = deps && deps.length > 0 ? deps.length : 0;
            if (totalDeps === 0) {
                sucessCallback(true);
                return;
            }
            let resolvedDepCount = 0;
            const resolved = {
                next: () => {
                    resolvedDepCount++;
                    if (resolvedDepCount === totalDeps) {
                        sucessCallback();
                    }
                }
            }
            deps && deps.forEach((dep: IDepdendencyItem)=>{
                const type = dep.type;
                switch(type) {
                    case 'exists': {
                        const depValue = dep.value;
                        const field = dep.field;
                        if (fieldDisplayed) {
                            if (value != undefined) {
                                let fieldDisplayed;
                                if (depValue === undefined) {
                                    // only field dependency
                                    fieldDisplayed = true;
                                    this.setFieldDisplay(dep.section, field, fieldDisplayed);
                                } else {
                                    // condition dependency
                                    let conditionMatch = false;
                                    if (Array.isArray(depValue)) {
                                        if (depValue.indexOf(value) >=0) {
                                            conditionMatch = true;
                                        }
                                    } else {
                                        switch (depValue) {
                                            case '$notempty':
                                                conditionMatch = value !== '';
                                                break;
                                            default:
                                                conditionMatch = value === depValue;
                                        }
                                    }
                                    fieldDisplayed = conditionMatch;
                                    this.setFieldDisplay(dep.section, field, conditionMatch);
                                }
                                const subfield = this.getField(dep.section, field);
                                // cascade
                                this.handleDependencies(dep.section, field, subfield.value, fieldDisplayed).then(() => resolved.next())
                            } else {
                                resolved.next();
                            }
                        } else {
                            this.setFieldDisplay(dep.section, field, false);
                            const subfield = this.getField(dep.section, field);
                            // cascade
                            this.handleDependencies(dep.section, field, subfield.value, false).then(() => resolved.next());
                        }
                    }
                    break;
                    case 'load': {
                        const field = dep.field;
                        // const url = dep.url.replace('{0}', value);
                        if (value && dep.url) {
                            const field = dep.field;
                            const queryParams = dep.queryParams || [];
                            this.api('get', dep.url, queryParams, value, section).then((response) => {
                                const results = dep.responseKey ? response[dep.responseKey] : response;
                                let newResults = [];
                                if (dep.labelKey && dep.valueKey) {
                                    newResults = results.map((r:any) => {
                                        return {label:r[dep.labelKey!],value:r[dep.valueKey!],ref:r};
                                    })
                                } else {
                                    newResults = results;
                                }
                                this.setFieldOptions(dep.section, field, newResults);
                                resolved.next();
                            }).catch((error) => {
                                resolved.next();
                            });
                        } else {
                            resolved.next();
                        }
                    }
                    break;
                    case 'load_options':{
                        const field = dep.field;
                        const val = dep.value;
                        const valueMap = dep.valueMap;
                        if (valueMap !== undefined) {
                            if (valueMap[value]) {
                                this.setFieldOptions(dep.section, field, valueMap[value]);
                            }
                        } else {
                            if (value) {
                                // to do
                            }
                        }
                        resolved.next();
                    }
                    break;
                    case 'enabled': {
                        const field = dep.field;
                        this.setFieldDisabled(dep.section, field, value !== dep.value);
                        resolved.next();
                    }
                    break;
                    case 'equals': {
                        const field = dep.field;
                        if (value === dep.value) {
                            this.setField(dep.section, field, dep.currentValue);
                        } else if (dep.resetValue !== undefined) {
                            this.setField(dep.section, field, dep.resetValue);
                        }
                        resolved.next();
                    }
                    break;
                    case 'change': {
                        const changeType = dep.changeType;
                        if (changeType) {
                            switch(changeType) {
                                case 'setter':
                                    if (dep.valueMap !== undefined && dep.valueMap[value] !== undefined) {
                                        this.setField(dep.section, dep.field, dep.valueMap[value]);
                                        const field = this.getField(dep.section, dep.field);
                                        this.handleDependencies(dep.section, dep.field, dep.valueMap[value], field.display).then(() => resolved.next());
                                    } else {
                                        resolved.next();
                                    }
                                break;
                                default:
                                    resolved.next();
                            }
                        } else {
                            resolved.next();
                        }
                    }
                    break;
                    case 'validation': {
                        const fieldProp = this.getFieldProp(dep.section, dep.field, dep.type);
                        fieldProp[dep.changeType] = dep.valueMap[value];
                        this.setFieldProp(dep.section, dep.field, dep.type, fieldProp);
                        resolved.next();
                    }
                    break;
                    case 'pattern_match_url_loader': {
                        const changeType = dep.changeType;
                        if (dep.pattern) {
                            const pattern = new RegExp(dep.pattern);
                            // test pattern and proceed
                            if (pattern.test(value)) {
                                if (changeType) {
                                    switch(changeType) {
                                        case 'url_loader':
                                            const itemConfig: IURLLoaderConfig = {
                                                type: 'url_loader',
                                                url: dep.url,
                                                labelKey: dep.labelKey,
                                                valueKey: dep.valueKey,
                                                queryParams: dep.queryParams,
                                                pathParams: dep.pathParams
                                            }
                                            this.getData(itemConfig, value, dep.section, '$input').then(results => {
                                                this.setFieldOptions(dep.section, dep.field, results);
                                                resolved.next();
                                            }).catch(err=>{
                                                this.handleError(err, dep.section, dep.field);
                                                resolved.next();
                                            })
                                            break;
                                        default:
                                            resolved.next();
                                    }
                                } else {
                                    resolved.next();
                                }
                            } else {
                                resolved.next();
                            }
                        } else {
                            resolved.next();
                        }
                    }
                    break;
                    default:
                        resolved.next();
                }
            });
        })
    }

    /** validation functions */
    setError(section: string, field: string, error: IError) {
        this.setFieldProp(section, field, 'error', error);
    }

    validate() {
        let hasErrors = false;
        if (this.page.isGrouped) {
            // validate page
            const section = this.schema.fields.find((section, index) => index + 1=== this.page.pageNumber);
            if (section) {
                hasErrors = this.validateFormSection(section.name);
            }
        } else {
            hasErrors = this.validateFormSection('default');
        }
        return !hasErrors;
    }

    validateFormSection(sectionName: string) {
        let hasErrors = false;
        if (this.form && this.form[sectionName]) {
            Object.keys(this.form[sectionName]).forEach(field => {
                const formField: IFormField = this.form[sectionName][field];
                if (formField.display) {    // for displayed fields only
                    if (formField.value !== false && formField.value !== 0) {
                        // for required field
                        if (formField.validation?.required && !formField.value) {
                            formField.error.hasError = true;
                            formField.error.errorMsg = formField.validation?.required_detail?.errorMsg || MSGS.ERROR_MSG.REQUIRED;
                            hasErrors = true;
                        }

                        // for pattern validation - string only
                        if (formField.value && formField.validation?.pattern) {
                            const regexp = new RegExp(formField.validation.pattern);
                            if (!regexp.test(formField.value)) {
                                formField.error.hasError = true;
                                formField.error.errorMsg = formField.validation.pattern_detail?.errorMsg || MSGS.ERROR_MSG.PATTERN;
                                hasErrors = true;
                            }
                        }

                        // for min/max validation
                        if (formField.value !== undefined) {
                            // min validation
                            if (formField.validation?.min !== undefined) {
                                ValidationUtil.updateMinError(formField, formField.value, (hasError: boolean, errorMsg: string) => {
                                    formField.error.hasError = hasError;
                                    formField.error.errorMsg = errorMsg;
                                    hasErrors = true;
                                });
                            }
                            // max validation
                            if (formField.validation?.max !== undefined) {
                                ValidationUtil.updateMaxError(formField, formField.value, (hasError: boolean, errorMsg: string) => {
                                    formField.error.hasError = hasError;
                                    formField.error.errorMsg = errorMsg;
                                    hasErrors = true;
                                })
                            }
                        }
                    }
                    
                }
            });
        }
        return hasErrors;
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

    /**Error handler */
    handleError(error: any, section: string, field: string) {
        this.setError(section, field, {
            errorMsg: error.message,
            hasError: true
        });
        if (this.errorHandler) {
            this.errorHandler(error, section, field);
        }
    }

    setErrorHandler(errorHandler: Function) {
        this.errorHandler = errorHandler;
    }
}