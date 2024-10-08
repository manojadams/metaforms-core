import React, { Fragment, ReactNode } from "react";
import FormUtils from "../../utils/FormUtil";
import FormContext from "../form-context";
import ValidationUtil from "../../utils/ValidationUtil";
import { IField, IOption } from "../../constants/model-interfaces";
import { IControlProps, IError, IFormField, IRenderField } from "../../constants/common-interface";
import { EVENTS, FIELD_LAYOUT, MSGS, _INTERNAL_VALUES } from "../../constants/constants";
import { TMouseEvent, TValue } from "../../constants/types";
import { CONTROLS } from "../../constants/controls";
import { Header } from "./Styled";

interface IState {
    error: IError;
    componentError: IError;
    form: IFormField;
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
        this.state = {
            error: { hasError: false, errorMsg: "" },
            componentError: { hasError: false, errorMsg: "" },
            form: this.props.form,
            loading: false
        };
        this.handleValidation = this.handleValidation.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.setError = this.setError.bind(this);
        this.validate = this.validate.bind(this);
    }

    setLoading(loading: boolean) {
        this.setState({ loading });
    }

    initConfig() {
        const configData = this.props.form?.config || null;
        let initData = null;
        if (configData) {
            // check init mode
            const hasInitCode =
                configData?.loadOn && Array.isArray(configData.loadOn) ? configData.loadOn.indexOf("init") >= 0 : false;
            const hasDefaultinit = configData?.url && !configData?.lazy;
            if (hasInitCode || hasDefaultinit) {
                initData = configData;
            } else {
                // check edit mode
                if (this.props.form.value) {
                    // checking now for string only
                    initData = configData;
                }
            }
        }
        if (!(initData && initData.url)) {
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
            case CONTROLS.MULTISELECT:
                return this.multiselect();
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
            case CONTROLS.INPUT_MASK:
                return this.inputMask();
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
    abstract inputMask(): JSX.Element;
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
        return <Header className={this.getWrapperClassName()}>{this.props.form.displayName}</Header>;
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
            let control = this.context.getControl(this.displayType);
            if (control) {
                control = React.cloneElement(control, {
                    field: this.props.form,
                    name: this.props.name,
                    form: this.context.form,
                    error: this.state.error
                });
            }
            return <div className={customWrapperClass}>{control}</div>;
        }
        return this.text();
    }

    templateControl(): JSX.Element {
        if (this.displayType) {
            const customWrapperClass = this.getWrapperClassName();
            const template = (this.props.form?.config?.template as string) || "";
            const control = this.context.getControlElements(template) as React.FunctionComponent<IControlProps>;
            let customComponent: JSX.Element | null = null;
            if (control) {
                const element = control({
                    field: this.props.form,
                    form: this.context.form
                });
                if (React.isValidElement(element)) {
                    customComponent = React.cloneElement(element);
                }
            }
            if (customComponent) {
                return <div className={customWrapperClass}>{customComponent}</div>;
            } else {
                return <Fragment />;
            }
        }
        return this.text();
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
            // do not allow invalid pattern, if configured
            if (value && typeof this.field.meta.validation?.pattern !== "undefined") {
                if (
                    typeof this.field.meta.validation?.pattern === "object" &&
                    this.field.meta.validation?.pattern?.allowValidOnly
                ) {
                    const regexp = new RegExp(
                        ValidationUtil.getValidationValue(this.field.meta.validation, "pattern") as string
                    );
                    if (!regexp.test(value.toString())) {
                        return;
                    }
                }
            }
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
        if (!eventItem || !eventItem?.url) {
            return;
        }
        this.setLoading(true);
        this.context
            .getData(eventItem, "", this.section, eventItem?.type as string | undefined)
            .then((options: IOption[]) => {
                this.context.setFieldOptions(this.section, this.field.name, options);
                this.setState({ form: { ...this.props.form } });
                this.setLoading(false);
            })
            .catch((error: Error) => {
                this.context.handleError(error, this.section, this.field.name);
                this.setState({ form: { ...this.props.form } });
                this.setLoading(false);
            });
    }

    handleDependencies(value: TValue) {
        this.props.sync();
        this.context.handleDependencies(this.section, this.field.name, value, true).then(() => {
            this.props.sync();
        });
    }

    getWrapperClassName() {
        const customClassName = this.props.meta?.className || "";
        const fieldLayout = this.props.meta?.displayProps?.fieldLayout || this.context.formConfig?.fieldLayout;
        const fieldClassName = fieldLayout === FIELD_LAYOUT.ROW ? "mfield-row" : "mfield-col";
        return (
            "meta-form-control-" +
            this.field.name +
            " " +
            fieldClassName +
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
                const errorMsg =
                    ValidationUtil.getValidationErrorMsg(meta.validation, "required") ?? MSGS.ERROR_MSG.REQUIRED;
                this.setError(true, errorMsg);
                return;
            }
        }
        if (typeof meta.validation?.pattern !== "undefined") {
            const regx = new RegExp(ValidationUtil.getValidationValue(meta.validation, "pattern") as string);
            const strValue = value ? value + "" : "";
            if (value && !regx.test(strValue)) {
                const errorMsg =
                    ValidationUtil.getValidationErrorMsg(meta.validation, "pattern") ?? MSGS.ERROR_MSG.PATTERN;
                this.setError(true, errorMsg);
                return;
            }
        }
        if (typeof meta.validation?.min !== "undefined") {
            const hasError = ValidationUtil.updateMinError(meta, value, this.setError.bind(this));
            if (hasError) return;
        }
        if (typeof meta.validation?.max !== "undefined") {
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

function Display(props: { form: IFormField; children: ReactNode }) {
    return <Fragment>{props?.form?.display && props.children}</Fragment>;
}
