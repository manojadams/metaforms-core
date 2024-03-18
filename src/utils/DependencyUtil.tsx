import {
    IDepdendencyItem,
    IFieldConfig,
    IForm,
    IValueMapRef,
    TVALUE_MAP_TYPE_REF
} from "../constants/common-interface";
import {
    API_METHOD,
    CHANGE_TYPE,
    DEP_TYPE,
    DEP_TYPE_OLD,
    FORM_CONSTANTS,
    _INTERNAL_VALUES
} from "../constants/constants";
import { IDependency, IField, IOption } from "../constants/model-interfaces";
import { TValue } from "../constants/types";
import MetaForm from "../core/MetaForm";
import ValidationUtil from "./ValidationUtil";

class DependencyUtil {
    static initDependencies(form: IForm, section: string, fields: Array<IField>) {
        fields &&
            fields.forEach((field) => {
                if (field && field?.meta?.dependencies) {
                    this.setDependencies(form, section, field.name, field?.meta?.dependencies);
                }
                if (field.fields && field.fields.length > 0) {
                    this.initDependencies(form, field.name, field.fields);
                }
            });
    }

    static getDependencies(form: IForm, section: string, field: string) {
        // eslint-disable-next-line dot-notation
        return form[section][field]["dependencies"];
    }

    static setDependencies(form: IForm, section: string, field: string, dependencies: IDependency) {
        if (!dependencies) return;
        Object.keys(dependencies).forEach((type) => {
            if (dependencies[type] instanceof Array) {
                dependencies[type].forEach((dependency: IDepdendencyItem) => {
                    this.setDependency(form, dependency, section, type, field);
                });
            } else {
                this.setDependency(form, dependencies[type], section, type, field);
            }
        });
    }

    static setDependency(form: IForm, dependency: IDepdendencyItem, section: string, type: string, field: string) {
        const ref = dependency.ref || "";
        const formSection = dependency?.section || section;
        const value = dependency?.value;
        const valueFn = dependency?.valueFn;
        // dependency key
        const D_KEY = FORM_CONSTANTS.DEPENDENCY_KEY;
        if (ref && !form[formSection][ref][D_KEY]) {
            form[formSection][ref][D_KEY] = [];
        }
        let extraParams = {};
        switch (type) {
            case DEP_TYPE_OLD.PATTERN_MATCH_URL_LOADER:
            case DEP_TYPE.PATTERN_MATCH_URL_LOADER:
                extraParams = {
                    pattern: dependency.pattern,
                    changeType: dependency.type,
                    urlType: dependency.urlType,
                    defaultValue: dependency.defaultValue
                };
            // eslint-disable-next-line no-fallthrough
            case DEP_TYPE.LOAD:
                {
                    const url = dependency.url;
                    const labelKey = dependency?.labelKey;
                    const valueKey = dependency?.valueKey;
                    const responseKey = dependency.responseKey;
                    const queryParams = dependency.queryParams;
                    const pathParams = dependency.pathParams;
                    form[formSection][ref][D_KEY].push({
                        section,
                        type,
                        field,
                        url,
                        valueKey,
                        labelKey,
                        responseKey,
                        queryParams,
                        pathParams,
                        ...extraParams
                    });
                }
                break;
            case DEP_TYPE_OLD.LOAD_OPTIONS:
            case DEP_TYPE.LOAD_OPTIONS:
                {
                    const valueMap = dependency.valueMap;
                    form[formSection][ref][D_KEY].push({
                        section,
                        type,
                        field,
                        valueMap
                    });
                }
                break;
            case DEP_TYPE.EQUALS:
                // eslint-disable-next-line no-lone-blocks
                {
                    form[formSection][ref][D_KEY].push({
                        section,
                        type,
                        field,
                        value,
                        currentValue: dependency.currentValue,
                        resetValue: dependency.resetValue
                    });
                }
                break;
            case DEP_TYPE.VALIDATION:
            case DEP_TYPE.CHANGE:
                {
                    const changeType = dependency.type;
                    const valueMap = dependency.valueMap;
                    form[formSection][ref][D_KEY].push({
                        section,
                        type,
                        field,
                        value,
                        valueMap,
                        changeType
                    });
                }
                break;
            case DEP_TYPE_OLD.PROP_UPDATE:
            case DEP_TYPE.PROP_UPDATE:
                {
                    const propValue = dependency.propValue;
                    const propName = dependency.propName;
                    const valueMap = dependency.valueMap;
                    form[formSection][ref][D_KEY].push({
                        section,
                        type,
                        field,
                        value,
                        valueMap,
                        propName,
                        propValue
                    });
                }
                break;
            case DEP_TYPE.EXISTS:
                extraParams = {
                    condition: dependency.condition
                };
                form[formSection][ref][D_KEY].push({
                    section,
                    type,
                    field,
                    value,
                    valueFn,
                    ...extraParams
                });
                break;
            default:
                form[formSection][ref][D_KEY].push({
                    section,
                    type,
                    field,
                    value,
                    valueFn
                });
        }
    }

    static handleDependencies(
        metaform: MetaForm,
        section: string,
        fieldName: string,
        value: TValue,
        fieldDisplayed: boolean
    ) {
        // eslint-disable-next-line promise/param-names
        return new Promise((sucessCallback: (arg?: boolean) => void) => {
            const deps = this.getDependencies(metaform.form, section, fieldName);
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
            };
            deps &&
                deps.forEach((dep: IDepdendencyItem) => {
                    const type = dep.type;
                    switch (type) {
                        case DEP_TYPE.EXISTS:
                            {
                                const depValue = dep.value;
                                const field = dep.field;
                                if (fieldDisplayed) {
                                    if (value !== undefined) {
                                        let fieldDisplayed;
                                        if (depValue === undefined) {
                                            // only field dependency
                                            fieldDisplayed = true;
                                            metaform.setFieldDisplay(dep.section, field, fieldDisplayed);
                                        } else {
                                            // condition dependency
                                            let conditionMatch = false;
                                            if (Array.isArray(depValue)) {
                                                if (depValue.indexOf(value) >= 0) {
                                                    conditionMatch = true;
                                                }
                                            } else {
                                                switch (depValue) {
                                                    case _INTERNAL_VALUES.NOT_EMPTY:
                                                        conditionMatch = value !== "";
                                                        break;
                                                    case _INTERNAL_VALUES.VALUE_FN:
                                                        {
                                                            const valueFn = dep.valueFn;
                                                            if (valueFn) {
                                                                const fn = metaform.getFn(valueFn);
                                                                if (fn) {
                                                                    conditionMatch = fn(value) as boolean;
                                                                }
                                                            }
                                                        }
                                                        break;
                                                    case _INTERNAL_VALUES.CONDITION:
                                                        if (dep.condition) {
                                                            conditionMatch = ValidationUtil.parseCondition(
                                                                metaform.form,
                                                                dep.condition,
                                                                dep.section || section
                                                            );
                                                        }
                                                        break;
                                                    default:
                                                        conditionMatch = value === depValue;
                                                }
                                            }
                                            fieldDisplayed = conditionMatch;
                                            metaform.setFieldDisplay(dep.section, field, conditionMatch);
                                        }
                                        const subfield = metaform.getField(dep.section, field);
                                        // cascade
                                        this.handleDependencies(
                                            metaform,
                                            dep.section,
                                            field,
                                            subfield.value,
                                            fieldDisplayed
                                        ).then(() => resolved.next());
                                    } else {
                                        resolved.next();
                                    }
                                } else {
                                    metaform.setFieldDisplay(dep.section, field, false);
                                    const subfield = metaform.getField(dep.section, field);
                                    // cascade
                                    this.handleDependencies(metaform, dep.section, field, subfield.value, false).then(
                                        () => resolved.next()
                                    );
                                }
                            }
                            break;
                        case DEP_TYPE.LOAD:
                            if (value && dep.url) {
                                const field = dep.field;
                                // reset options
                                metaform.setFieldOptions(dep.section, field, []);
                                metaform
                                    .getData(
                                        {
                                            requestType: dep.requestType ?? API_METHOD.GET,
                                            requestBody: dep.requestBody,
                                            requestBodyParams: dep.requestBodyParams,
                                            queryParams: dep.queryParams
                                        },
                                        value,
                                        section
                                    )
                                    .then((results: IOption[]) => {
                                        metaform.setFieldOptions(dep.section, field, results);
                                        resolved.next();
                                    })
                                    .catch(() => {
                                        resolved.next();
                                    });
                            } else {
                                resolved.next();
                            }
                            break;
                        case DEP_TYPE.LOAD_OPTIONS:
                            {
                                const field = dep.field;
                                // const val = dep.value;
                                const valueMap = dep.valueMap;
                                if (valueMap !== undefined) {
                                    if (valueMap[value as string]) {
                                        metaform.setFieldOptions(
                                            dep.section,
                                            field,
                                            valueMap[value as string] as IOption[]
                                        );
                                    }
                                } else {
                                    if (value) {
                                        // to do
                                    }
                                }
                                resolved.next();
                            }
                            break;
                        case DEP_TYPE.ENABLED:
                            {
                                const field = dep.field;
                                metaform.setFieldDisabled(dep.section, field, value !== dep.value);
                                resolved.next();
                            }
                            break;
                        case DEP_TYPE.EQUALS:
                            {
                                const field = dep.field;
                                if (value === dep.value) {
                                    metaform.setField(dep.section, field, dep.currentValue);
                                } else if (dep.resetValue !== undefined) {
                                    metaform.setField(dep.section, field, dep.resetValue);
                                }
                                resolved.next();
                            }
                            break;
                        case DEP_TYPE.CHANGE:
                            {
                                const changeType = dep.changeType;
                                if (changeType) {
                                    switch (changeType) {
                                        case "setter":
                                            if (
                                                dep.valueMap !== undefined &&
                                                dep.valueMap[value as string] !== undefined
                                            ) {
                                                metaform.setField(
                                                    dep.section,
                                                    dep.field,
                                                    dep.valueMap[value as string] as TValue
                                                );
                                                const field = metaform.getField(dep.section, dep.field);
                                                this.handleDependencies(
                                                    metaform,
                                                    dep.section,
                                                    dep.field,
                                                    dep.valueMap[value as string] as TValue,
                                                    field.display
                                                ).then(() => resolved.next());
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
                        case DEP_TYPE.VALIDATION:
                            {
                                const fieldProp = metaform.getFieldProp(dep.section, dep.field, dep.type);
                                fieldProp[dep.changeType] = dep.valueMap[value as string];
                                metaform.setFieldProp(dep.section, dep.field, dep.type, fieldProp);
                                resolved.next();
                            }
                            break;
                        case DEP_TYPE_OLD.PATTERN_MATCH_URL_LOADER:
                        case DEP_TYPE.PATTERN_MATCH_URL_LOADER:
                            {
                                const changeType = dep.changeType;
                                if (dep.pattern) {
                                    const pattern = new RegExp(dep.pattern);
                                    // test pattern and proceed
                                    if (pattern.test(value as string)) {
                                        if (changeType) {
                                            switch (changeType) {
                                                case CHANGE_TYPE.URL_LOADER:
                                                    {
                                                        const itemConfig: IFieldConfig = {
                                                            type: CHANGE_TYPE.URL_LOADER,
                                                            url: dep.url,
                                                            urlType: dep.urlType,
                                                            labelKey: dep.labelKey,
                                                            valueKey: dep.valueKey,
                                                            queryParams: dep.queryParams
                                                            // pathParams: dep.pathParams
                                                        };
                                                        metaform
                                                            .getData(
                                                                itemConfig,
                                                                value,
                                                                dep.section,
                                                                _INTERNAL_VALUES.INPUT
                                                            )
                                                            .then((results) => {
                                                                const fieldDisplayType = metaform.getFieldProp(
                                                                    dep.section,
                                                                    dep.field,
                                                                    "displayType"
                                                                );
                                                                metaform.setDisplayTypeFieldProp(
                                                                    fieldDisplayType,
                                                                    dep.section,
                                                                    dep.field,
                                                                    results,
                                                                    dep
                                                                );
                                                                resolved.next();
                                                            })
                                                            .catch((err) => {
                                                                metaform.handleError(err, dep.section, dep.field);
                                                                resolved.next();
                                                            });
                                                    }
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
                        case DEP_TYPE.PROP_UPDATE:
                        case DEP_TYPE_OLD.PROP_UPDATE:
                            // condition match
                            if (dep.value !== undefined) {
                                if (value === dep.value) {
                                    metaform.setFieldProp(dep.section, dep.field, dep.propName, dep.propValue);
                                    resolved.next();
                                } else {
                                    resolved.next();
                                }
                            } else if (dep.valueMap !== undefined) {
                                const mappedValue = dep.valueMap[value as string] as IValueMapRef;
                                if (mappedValue !== undefined) {
                                    if (typeof mappedValue !== "object") {
                                        metaform.setFieldProp(dep.section, dep.field, dep.propName, mappedValue);
                                        resolved.next();
                                    } else {
                                        // parse object
                                        const type = mappedValue.type;
                                        if (type !== undefined) {
                                            switch (type) {
                                                case TVALUE_MAP_TYPE_REF.fieldValue:
                                                    {
                                                        const ref = mappedValue.ref;
                                                        const fieldValue = metaform.getFieldProp(
                                                            mappedValue.section || dep.section,
                                                            ref,
                                                            "value"
                                                        );
                                                        metaform.setFieldProp(
                                                            dep.section,
                                                            dep.field,
                                                            dep.propName,
                                                            fieldValue
                                                        );
                                                        resolved.next();
                                                    }
                                                    break;
                                                case TVALUE_MAP_TYPE_REF.fieldProp:
                                                    {
                                                        const ref = mappedValue.ref;
                                                        const prop = mappedValue.propName;
                                                        const fieldValue = metaform.getFieldProp(
                                                            mappedValue.section || dep.section,
                                                            ref,
                                                            prop || ""
                                                        );
                                                        metaform.setFieldProp(
                                                            dep.section,
                                                            dep.field,
                                                            dep.propName,
                                                            fieldValue
                                                        );
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
                                } else {
                                    resolved.next();
                                }
                            }
                            break;
                        default:
                            resolved.next();
                    }
                });
        });
    }
}

export default DependencyUtil;
