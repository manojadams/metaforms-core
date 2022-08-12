import React, { Fragment, useEffect } from 'react';
import FormUtils from '../../utils/FormUtil';
import { IField, IFieldChange, IMeta, IOption } from '../../constants/model-interfaces';
import FormContext from '../form-context';
import { IError, IRenderField } from '../../constants/common-interface';
import { MSGS } from '../../constants';
import ValidationUtil from '../../utils/ValidationUtil';
export default abstract class BaseFormControl extends React.Component {
    static contextType = FormContext;
    displayType: string | undefined;
    field: IField;
    isFormControl: boolean;
    uuid: string;
    section: string;
    validation: {required: boolean|undefined, pattern: string|undefined};
    state: IState;

    constructor(public props: IRenderField) {
        super(props);
        this.field = props;
        this.displayType = props.meta.displayType;
        this.section = props.section;
        this.isFormControl = FormUtils.isFormControl(props.meta);
        this.uuid = FormUtils.getUUID();
        this.validation = {
            required: props?.meta?.validation?.required?true:undefined,
            pattern: props?.meta?.validation?.pattern?props?.meta?.validation?.pattern:undefined
        }
        this.state = {
            error: {hasError: false, errorMsg: ''},
            componentError: {hasError: false, errorMsg: ''},
            form: this.props.form,
            loading: false
        }
    }

    setLoading(loading: boolean) {
        this.setState({loading})
    }
    initConfig() {
        const configData = this.props.form?.config || null;
        let initData = this.props.form?.init || null;
        if (configData) {
            // check init mode
            const hasInitCode = configData?.loadOn && configData.loadOn.indexOf('init') >= 0 ? true : false;
            if (hasInitCode) {
                initData = configData;
            } else {
                // check edit mode
                if (this.props.form.value) {
                    // checking now for string only
                    initData = configData;
                }
            }
        }
        if (initData) {
            this.setLoading(true);
            this.context.getData(initData, this.props.form.value, this.props.section,'$initial')
            .then((options: Array<IOption>) => {
                this.setLoading(false);
                this.context.setFieldOptions(this.section, this.field.name, options);
                if (this.props.form.value !== undefined) {
                    const ref = options.find(option => option.value === this.props.form.value);
                    if (ref) {
                        this.handleChange(null, this.props.form.value, ref);
                    }
                    this.props.sync();
                }
            }).catch(() => {
                this.setLoading(false);
            });
        }
    }
    componentDidUpdate(props: any) {
        if (this.state.error.hasError !== this.props.form.error?.hasError) {
            this.setState({error: {
                hasError: this.props.form.error?.hasError,
                errorMsg: this.props.form.error?.errorMsg
            }});
        }
    }
    componentDidCatch(error: any, errorInfo: any) {
        this.setState({componentError: {hasError: true, errorMsg: error.message}});
    }
    componentDidMount() {
        this.initConfig();
    }
    render() {
        if (this.isFormControl) {
            return this.state.componentError.hasError ? (
                <div className='w-100 h-100 text-center d-flex align-items-center justify-content-center text-danger'>{this.state.componentError.errorMsg}</div>
            ) : (<Display form={this.props.form}>
                {
                    this.control()
                }              
            </Display>)
        }
        return (<Fragment></Fragment>)
    }
    control() {
        switch (this.displayType) {
            case 'header':
                return (this.header());
            case 'label':
                return (this.label());
            case 'month':
                return (this.month());
            case 'date':
                return (this.date())
            case 'select':
                return (this.select());
            case 'radio':
                return (this.radio());
            case 'radio-button':
                return (this.radioButton());
            case 'checkbox':
                return (this.checkbox());
            case 'email':
                return (this.email());
            case 'number':
                return (this.number());
            case 'password':
                return (this.password());
            case 'search':
                return (this.search());
            case 'text':
            case 'text_field':
            default:
                return (this.text());
        } 
    }
    abstract month(): JSX.Element;
    abstract date(): JSX.Element;
    abstract search(): JSX.Element;
    abstract text(): JSX.Element;
    abstract label(): JSX.Element;
    abstract password(): JSX.Element;
    abstract email(): JSX.Element;
    abstract number(): JSX.Element;
    abstract radio(): JSX. Element;
    abstract checkbox(): JSX. Element;
    abstract select(): JSX.Element;
    abstract multiselect(): JSX.Element;
    abstract button(): JSX.Element;
    // non-mandatory
    radioButton(): JSX.Element {
        throw Error('Not implemented');
    }
    header() {
        return (
            <h2>{ this.props.form.displayName }</h2>
        )
    }

    handleChange(e: any, val?: any, ref?: any) {
        try {
            const value = val !== undefined ? val : e.target.value;
            this.context.setField(this.section, this.field.name, value);
            this.handleChangeEvents(value, ref);
            this.handleDependencies(value);
        } catch(error) {
            console.error(error);
        }
    }

    handleOpen(e: any) {
        const field = this.context.getField(this.section, this.field.name);
        const eventItem = field.events.open;
        switch (eventItem.type) {
            case 'options_loader':{
                this.context.api('get', eventItem.url, eventItem.queryParams, '', this.props.section).then((response: any) => {
                    let options = eventItem.responseKey ? response[eventItem.responseKey]: response;
                    const labelKey = eventItem.labelKey || 'label';
                    const valueKey = eventItem.valueKey || 'value';
                    if (options) {
                        options = options.map((o: any) => ({
                            label: o[labelKey],
                            value: o[valueKey],
                            ref: o
                        }))
                    }
                    this.context.setFieldOptions(this.section, this.field.name, options);
                    this.setState({form:{...this.props.form}});
                }).catch((error: any) => {
                    this.context.handleError(error, this.section, this.field.name);
                    this.setState({form:{...this.props.form}});
                });
            }
            break;
        }
    }

    handleChangeEvents(fieldValue?: any, fieldRef?: any) {
        const changes = this.context.getChangeEvents(this.section, this.field.name);
        let actualChanges = [];
        if (changes) {
            actualChanges = Array.isArray(changes) ? changes : [changes];
            actualChanges.forEach((changes) => {
                switch (changes.type) {
                    case 'prop_setter':
                    case 'setter': {
                        const {ref, value, valueKey, valueMap} = changes;
                        const section = changes.section ? changes.section : this.section;
                        let actualValue = value;
                        if (valueMap) {
                            let matchValue;
                            if (valueKey) {
                                const ref = fieldRef?.ref;
                                matchValue = ref ? FormUtils.getDataFromValueKey(ref, valueKey) : value;
                            } else {
                                matchValue = valueMap[fieldValue];
                            }
                            if (matchValue !== undefined) {
                                actualValue = matchValue;
                            }
                        } else {
                            if (valueKey) {
                                const ref = fieldRef?.ref;
                                actualValue = ref ? FormUtils.getDataFromValueKey(ref, valueKey) : value;
                            } else if (changes.valueFn) {
                                const fn = this.context.getFn(changes.valueFn);
                                actualValue = fn ? fn(fieldValue) : ''
                            }
                        }
                        if (changes.type === 'setter') {
                            this.context.setField(section, ref, actualValue);
                        } else if (changes.type === 'prop_setter') {
                            if (actualValue != undefined) {
                                const actualRef = ref ? ref : this.field.name;
                                const field = this.context.getField(section, actualRef);
                                FormUtils.updateFieldProp(field, changes.name, actualValue);
                            }
                        }
                    }
                    break;
                    case 'event_emitter': {
                        const value = changes.value;
                        const {eventType, payload} = changes;
                        if (value !== undefined) {
                            if (value === fieldValue) {
                                this.context.emit(eventType, payload);
                            }
                        } else {
                            this.context.emit(eventType, payload);
                        }
                    }
                    break;
                    // case 'pattern_loader': {
                    //     const url = changes.url;
                    //     if (url) {
                    //         this.context.api('get',url, fieldValue, this.props).then((response: any) => {
                    //             const results = changes.responseKey ? response.data[changes.responseKey] : response.data;

                    //         });
                    //     }
                    // }
                    // break;
                }
            })
        }
    }

    handleDependencies(value: any) {
        this.context.handleDependencies(this.section, this.field.name, value, true).then(() => {
            this.props.sync();
        });
    }

    handleValidation() {
        const value = this.props.form.value;
        this.validate(value);
    }

    validate(value: string | number | boolean | undefined) {
        const meta = this.props.form;
        if (meta.validation?.required) {
            if (!value) {
                this.setError(true, meta.validation?.required_detail?.errorMsg || MSGS.ERROR_MSG.REQUIRED);
                return;
            }
        }
        if (meta.validation?.pattern) {
            const regx = new RegExp(meta.validation?.pattern);
            const strValue = value ? value + '' : '';
            if (value && !regx.test(strValue)) {
                this.setError(true, meta.validation?.pattern_detail?.errorMsg || MSGS.ERROR_MSG.PATTERN);
                return;
            }
        }
        if (meta.validation?.min) {
            const hasError = ValidationUtil.updateMinError(meta, value, this.setError.bind(this));
            if (hasError) return;
        }
        if (meta.validation?.max) {
            const hasError = ValidationUtil.updateMaxError(meta, value, this.setError.bind(this));
            if (hasError) return;
        }
        this.setError(false,'');
    }

    setError(hasError: boolean, errorMsg: string) {
        const error = {hasError, errorMsg};
        this.context.setError(this.section, this.field.name, error);
        this.setState({error});
    }
}

function Display(props: any) {
    return (
        <Fragment>
            {props?.form?.display && props.children}
        </Fragment>
    )
}

interface IState {
    error: IError;
    componentError: IError;
    form: IMeta;
    loading: boolean;
}
