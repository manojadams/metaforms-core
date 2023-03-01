import React, { Fragment, ReactNode, SyntheticEvent } from "react";
import FormUtils from "../../utils/FormUtil";
import FormContext from "../form-context";
import ValidationUtil from "../../utils/ValidationUtil";
import { IField, IMeta, IOption } from "../../constants/model-interfaces";
import { IError, IRenderField } from "../../constants/common-interface";
import { DATA_LOADER, EVENTS, MSGS, _INTERNAL_VALUES } from "../../constants/constants";
import { TMouseEvent, TValue } from "../../constants/types";
import { CONTROLS } from "../../constants/controls";

interface IState {
    error: IError;
    componentError: IError;
    form: IMeta;
    loading: boolean;
}

/**
 * This is the base form control that contains methods that render fields depending upon `displayType` property.
 * Control rendering methods must be implemented in libs implementing metaform-core
 * @category To be implemented
 */
export default abstract class BaseFormControl extends React.Component {
    /** @internal */
    static contextType = FormContext;
    declare context: React.ContextType<typeof FormContext>;
    displayType?: string;
    field: IField;
    isFormControl: boolean;
    uuid: string;
    section: string;
    validation: { required: boolean | undefined; pattern: string | undefined };
    state: IState;

    constructor(public props: IRenderField) {
        super(props);
        this.field = props;
        this.displayType = props.meta.displayType;
        this.section = props.section;
        this.isFormControl = FormUtils.isFormControl(props.meta);
        this.uuid = FormUtils.getUUID();
        this.validation = {
            required: props?.meta?.validation?.required ? true : undefined,
            pattern: props?.meta?.validation?.pattern ? props?.meta?.validation?.pattern : undefined
        };
        this.state = {
            error: { hasError: false, errorMsg: "" },
            componentError: { hasError: false, errorMsg: "" },
            form: this.props.form,
            loading: false
        };
        this.handleValidation = this.handleValidation.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    setLoading(loading: boolean) {
        this.setState({ loading });
    }

    initConfig() {
        const configData = this.props.form?.config || null;
        let initData = this.props.form?.init || null;
        if (configData) {
            // check init mode
            const hasInitCode = configData?.loadOn && configData.loadOn.indexOf("init") >= 0;
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
            if (
                !(
                    initData?.type === DATA_LOADER.URL ||
                    initData?.type === DATA_LOADER.URL_LOADDER ||
                    initData?.type === DATA_LOADER.OPTIONS_LOADER
                )
            ) {
                return;
            }
            this.setLoading(true);
            this.context
                .getData(initData, this.props.form.value, this.props.section, _INTERNAL_VALUES.INITIAL)
                .then((options: Array<IOption>) => {
                    this.setLoading(false);
                    this.context.setFieldOptions(this.section, this.field.name, options);
                    if (this.props.form.value !== undefined) {
                        const ref = options.find((option) => option.value === this.props.form.value);
                        if (ref) {
                            this.handleChange(null, this.props.form.value, ref);
                        }
                        this.props.sync();
                    }
                })
                .catch(() => {
                    this.setLoading(false);
                });
        }
    }

    /** @internal */
    componentDidUpdate(props: IRenderField) {
        // no validation for non-displayed fields
        if (props && props?.form?.display) {
            const isDisabled = props.form?.isDisabled;
            if (isDisabled) {
                // reset disabled fields
                if (this.state.error.hasError) {
                    // eslint-disable-next-line react/no-did-update-set-state
                    this.setState({
                        error: {
                            hasError: false,
                            errorMsg: ""
                        }
                    });
                }
            } else if (this.state.error.hasError !== this.props.form.error?.hasError) {
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({
                    error: {
                        hasError: this.props.form.error?.hasError,
                        errorMsg: this.props.form.error?.errorMsg
                    }
                });
            }
        }
    }

    /** @internal */
    componentDidCatch(error: Error) {
        this.setState({
            componentError: { hasError: true, errorMsg: error.message }
        });
    }

    /** @internal */
    componentDidMount() {
        this.initConfig();
    }

    render() {
        if (this.isFormControl) {
            return this.state.componentError.hasError ? (
                <div className="w-100 h-100 text-center d-flex align-items-center justify-content-center text-danger">
                    {this.state.componentError.errorMsg}
                </div>
            ) : (
                <Display form={this.props.form}>{this.control()}</Display>
            );
        }
        return <Fragment />;
    }

    control() {
        switch (this.displayType) {
            case CONTROLS.HEADER:
                return this.header();
            case CONTROLS.PARAGRAPH:
                return this.paragraph();
            case CONTROLS.LABEL:
                return this.label();
            case CONTROLS.MONTH:
                return this.month();
            case CONTROLS.DATE:
                return this.date();
            case CONTROLS.SELECT:
                return this.select();
            case CONTROLS.RADIO:
                return this.radio();
            case CONTROLS.RADIO_BUTTON:
                return this.radioButton();
            case CONTROLS.CHECKBOX:
                return this.checkbox();
            case CONTROLS.EMAIL:
                return this.email();
            case CONTROLS.NUMBER:
                return this.number();
            case CONTROLS.PHONE:
                return this.phone();
            case CONTROLS.PASSWORD:
                return this.password();
            case CONTROLS.SEARCH:
                return this.search();
            case CONTROLS.HINT:
                return this.hint();
            case CONTROLS.MODALSEARCH:
                return this.modalsearch();
            case CONTROLS.FILE:
                return this.file();
            case CONTROLS.MULTITEXT:
                return this.multitext();
            case CONTROLS.TEXT:
            case CONTROLS.TEXT_FIELD:
                return this.text();
            case CONTROLS.TEMPATE:
                return this.templateControl();
            case CONTROLS.TEXT_CUSTOM:
                return this.customTextControl();
            case CONTROLS.CURRENCY:
                return this.currency();
            default:
                // use custom control
                return this.customControl();
        }
    }

    abstract month(): JSX.Element;
    abstract phone(): JSX.Element;
    abstract date(): JSX.Element;
    abstract search(): JSX.Element;
    /**
     * Input text control
     */
    abstract text(): JSX.Element;
    abstract label(): JSX.Element;
    abstract password(): JSX.Element;
    abstract email(): JSX.Element;
    abstract number(): JSX.Element;
    abstract radio(): JSX.Element;
    abstract checkbox(): JSX.Element;
    abstract select(): JSX.Element;
    abstract multiselect(): JSX.Element;
    abstract button(): JSX.Element;
    abstract hint(): JSX.Element;
    abstract file(): JSX.Element;

    // non-mandatory
    radioButton(): JSX.Element {
        throw Error("Not implemented");
    }

    multitext(): JSX.Element {
        throw Error("Not implemented");
    }

    header() {
        return <h2 className={this.getWrapperClassName()}>{this.props.form.displayName}</h2>;
    }

    modalsearch(): JSX.Element {
        throw Error("Not implemented");
    }

    paragraph(): JSX.Element {
        return <p className={this.getWrapperClassName()}>{this.props.form.displayName}</p>;
    }

    customControl(): JSX.Element {
        if (this.displayType) {
            const customWrapperClass = this.getWrapperClassName();
            return <div className={customWrapperClass}>{this.context.getControl(this.displayType)}</div>;
        }
        return this.text();
    }

    templateControl(): JSX.Element {
        throw Error("Not Implemented");
    }

    customTextControl(): JSX.Element {
        throw Error("Not Implemented");
    }

    currency(): JSX.Element {
        throw Error("Not Implemented");
    }

    handleChange(e: TMouseEvent, val?: TValue, ref?: IOption) {
        try {
            const value = val !== undefined ? val : (e?.target as HTMLInputElement)?.value;
            this.context.setField(this.section, this.field.name, value);
            this.context.handleChangeEvents(this.section, this.field.name, value, ref);
            this.handleDependencies(value);
            this.context.emit(EVENTS._FIELD_CHANGE, {
                payload: {
                    section: this.section,
                    field: this.field.name,
                    value
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    handleOpen() {
        const field = this.context.getField(this.section, this.field.name);
        const eventItem = field?.events?.open || field.config;
        switch (eventItem?.type) {
            case "url":
            case "options_loader":
                // eslint-disable-next-line no-lone-blocks
                {
                    this.context
                        .api("get", eventItem?.url + "", eventItem.queryParams, "", this.props.section)
                        .then((response: object) => {
                            let options = eventItem.responseKey ? response[eventItem.responseKey] : response;
                            const labelKey = eventItem.labelKey || "label";
                            const valueKey = eventItem.valueKey || "value";
                            if (options) {
                                options = options.map((o: object) => ({
                                    label: o[labelKey],
                                    value: o[valueKey],
                                    ref: o
                                }));
                            }
                            this.context.setFieldOptions(this.section, this.field.name, options);
                            this.setState({ form: { ...this.props.form } });
                        })
                        .catch((error: Error) => {
                            this.context.handleError(error, this.section, this.field.name);
                            this.setState({ form: { ...this.props.form } });
                        });
                }
                break;
        }
    }

    handleDependencies(value: TValue) {
        this.props.sync();
        this.context.handleDependencies(this.section, this.field.name, value, true).then(() => {
            this.props.sync();
        });
    }

    getWrapperClassName() {
        const customClassName = this.props.meta?.className || "";
        return (
            "meta-form-control-" +
            this.field.name +
            (this.props.form.isReadonly ? " meta-readonly" : "") +
            (" meta-form-control-" + this.displayType) +
            (customClassName ? " " + customClassName : "")
        );
    }

    handleValidation() {
        const value = this.props.form.value;
        this.validate(value);
    }

    validate(value: TValue) {
        const meta = this.props.form;
        if (meta.validation?.required) {
            const isEmpty = ValidationUtil.isEmptyField(value);
            if (isEmpty) {
                const errorMsg = meta.validation?.requiredDetail?.errorMsg || MSGS.ERROR_MSG.REQUIRED;
                this.setError(true, errorMsg);
                return;
            }
        }
        if (meta.validation?.pattern) {
            const regx = new RegExp(meta.validation?.pattern);
            const strValue = value ? value + "" : "";
            if (value && !regx.test(strValue)) {
                const errorMsg = meta.validation.patternDetail?.errorMsg || MSGS.ERROR_MSG.PATTERN;
                this.setError(true, errorMsg);
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
        this.setError(false, "");
    }

    setError(hasError: boolean, errorMsg: string) {
        const error = { hasError, errorMsg };
        this.context.setError(this.section, this.field.name, error);
        this.setState({ error });
    }

    getDisplayLabel() {
        return this.props.form.validation?.required ? this.props.form.displayName + " *" : this.props.form.displayName;
    }
}

BaseFormControl.contextType = FormContext;

function Display(props: { form: IMeta; children: ReactNode }) {
    return <Fragment>{props?.form?.display && props.children}</Fragment>;
}
