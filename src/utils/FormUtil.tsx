import { IDisplayProps, IField, IFormatterType, IMeta, IOption, ITheme, TParam } from "./../constants/model-interfaces";

const cssClassMap = {
    'md': 'col-md-',
    'lg': 'col-lg-',
    'sm': 'col-sm-',
    'xs': 'col-',
    'offset':'offset-',
    'default': 'col-md'
}

export default class FormUtils {
    static getCssClassName(prop: IDisplayProps|undefined) {
        if (!prop) {
            return '';
        }
        const md = prop.md ? cssClassMap['md'] + prop.md : '';
        const lg = prop.lg ? cssClassMap['lg'] + prop.lg : '';
        const sm = prop.sm ? cssClassMap['sm'] + prop.sm : '';
        const xs = prop.xs ? cssClassMap['xs'] + prop.xs : '';
        const offset = prop.offset ? cssClassMap['offset'] + prop.offset : ''; 
        return `${offset} ${xs} ${sm} ${md} ${lg}`.trim();
    }

    static isFormControl(prop: IMeta) {
        if (prop.type === 'section' || prop.type === 'group') {
            return false;
        }
        return true;
    }

    static getVerticalSpacing(theme: string) {
        if (theme) {
            switch(theme) {
                case 'mui':
                    return 'my-2 my-md-3';
            }
        }
        return '';
    }

    static getAlignment(align: string) {
        return align ? 'wrow-'+align: '';
    }

    static getPadding(theme: string) {
        if (theme) {
            switch (theme) {
                case 'bootstrap':
                    return 'py-md-3';
                case 'mui':
                    return 'py-md-3';
            }
        }
        return '';
    }

    static getUUID(prefix: string='') {
        const randomNum = Math.floor(Math.random()*100+Date.now());
        return `${prefix}_${randomNum}`;
    }

    static hasSections(fields: Array<IField>) {
        return fields.find((field: IField)=>field.meta.type === 'section')? true : false;
    }

    static getFormDefaultButtons(): Array<IField> {
        return [{
            name: 'submit',
            meta: {
                type: 'submit',
                displayName: 'Save',
                displayType: 'button',
                url: '',
                displayProps: {
                    xs: 12,
                    md: 2
                },
                className: 'btn-primary my-4 d-block w-100',
            }
        }];
    }

    static getThemeProp(themeName: string, theme: ITheme, prop: string) {
        if (theme.mui?.tabs && theme.mui?.tabs[prop]) {
            return theme.mui.tabs[prop];
        }
        return '';
    }

    static getNormalizedFormData(formData: any) {
        const newFormData = {};
        Object.keys(formData).forEach(key => {
            newFormData[key] = {};
            Object.keys(formData[key]).forEach(key2 => {
                newFormData[key][key2] = formData[key][key2].value;
            });
        });
        return newFormData;
    }

    static updateFormData(formData: any, newFormData: any, formatter: IFormatterType) {
        Object.keys(formData).forEach(key => {
            Object.keys(formData[key]).forEach(key2 => {
                const prop = formData[key][key2].prop;
                if (prop) {
                    if (!newFormData[prop]) {
                        newFormData[prop] = {};
                    }
                    if (formatter[key2]) {
                        newFormData[prop][key2] = formatter[key2](formData[key][key2].value);
                    } else {
                        newFormData[prop][key2] = formData[key][key2].value;
                    }
                } else {
                    // null prop is ignored
                    if (prop !== null) {
                        if (formatter[key2]) {
                            newFormData[key2] = formatter[key2](formData[key][key2].value);
                        } else {
                            newFormData[key2] = formData[key][key2].value;
                        }
                    }
                }
            });           
        });
        this.updateNestedFormData(newFormData);
        return newFormData;
    }

    static updateNestedFormData(formData: any) {
        Object.keys(formData).forEach((key: string) => {
            if (typeof formData[key] === 'object') {
                const props = key.split('#');
                if (props.length > 1) {
                    // is nested prop
                    if (!formData[props[0]]) {
                        formData[props[0]] = {};
                    }
                    this.updateNestedProp(formData[props[0]], props.slice(1), formData[key]);
                    delete formData[key];
                }
            }
        });
    }

    static updateNestedProp(formData: any, props: Array<string>, value: any) {
        if (props.length > 0) {
            if (props.length === 1) {
                formData[props[0]] = value;
            } else {
                if (!formData[props[0]]) {
                    formData[props[0]] = {};
                }
                this.updateNestedProp(formData[props[0]],props.slice(1), value);
            }
        }
    }

    static getSearchValue(options: Array<IOption>, value: any) {
        if (value !== undefined && options && options.length > 0) {
            return options.find(option => option.value === value);
        }
        return value;
    }

    static getDataFromValueKey(data: any, props: string) {
        const values = props.split('#');
        let nestedData = data;
        if (values) {
            values.forEach(val => {
                nestedData = nestedData[val];
            });
            return nestedData;
        }
        return data;
    }

    static updateParams(queryParams: Array<TParam>|undefined, eventType: string|undefined, currentValue: any) {
        if (queryParams && eventType) {
            const updatedQueryParams: Array<TParam> = [];
            queryParams.forEach((param) => {
                const [key,val] = param;
                let actualVal = val;
                if (val) {
                    switch (val) {
                        case '$input':
                        case '$initial':
                            actualVal = val === eventType ? currentValue : '';
                            break;
                        default:
                            // nothing to do
                    }
                }
                updatedQueryParams.push([key,actualVal]);
            });
            return updatedQueryParams;
        }
        return queryParams;
    }

    static updateFieldProp(field: IField, prop: string, value: any) {
        const props = prop.split('#');
        if (props.length > 1) {
            // nested prop
            const newProp = props.reduce((acc, item, index) => {
                if (index === props.length - 1) {
                    // last item
                    acc[item] = value;
                } else {
                    if (!acc[item]) {
                        acc[item] = {};
                    }
                }
                return acc[item];
            },field);
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
}