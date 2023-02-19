import React from "react";
import FormUtils from "./utils/FormUtil";
import EventEmitter from "eventemitter3";
import { ISchema } from "./constants/model-interfaces";
import { IError, IFormRenderer } from "./constants/common-interface";
import { metaAPI } from "./meta-api";
import Theme from "./core/Theme";
import { EVENTS, NEXT_RESPONSE_MODE } from "./constants/constants";
import MetaForm from "./core/MetaForm";
import MetaFormUpdater from "./core/MetaFormUpdater";
import SchemaErrorBoundary from "./form/SchemaErrorBoundary";
import FormContext from "./form/form-context";
import Form from "./form/Form";
import FormImpls from "./core/FormImpl";

export default class FormRenderer extends React.Component<IFormRenderer> {
    schema: ISchema;
    state: IState;
    name: string;
    lastAction: string;
    metaform: MetaForm;
    metaformUpdater: MetaFormUpdater;
    formImpls: FormImpls;

    constructor(props: IFormRenderer) {
        super(props);
        this.schema = FormUtils.cleanupSchema(props.schema);
        this.name = props.name || "default";
        this.lastAction = "";
        try {
            this.metaform = new MetaForm(this.props.schema, new EventEmitter());
            this.metaformUpdater = new MetaFormUpdater(this.name, this.metaform);
            metaAPI.metaForm.add(this.name, this.metaform);
            if (props.icons) {
                this.metaform.setIcons(props.icons);
            }
            this.state = {
                validated: false,
                error: { hasError: false, errorMsg: "" }
            };
            if (props.fns) {
                this.metaform.setFns(props.fns);
            }
            if (props.controls) {
                this.metaform.setControls(props.controls);
            }
            if (props.onError) {
                this.metaform.setErrorHandler(props.onError);
            }
            // initialize metaform only after all properties are set
            this.metaform.init();
            if (props.pageNumber) {
                this.metaform.updatePage(props.pageNumber);
            }
            if (props.lastPageNumber) {
                this.metaform.setEndOfPage(props.lastPageNumber);
            }

            if (props.baseFormControl) {
                this.formImpls.setFormControl(props.baseFormControl);
            }
            if (props.baseFormGroup) {
                this.formImpls.setFormGroup(props.baseFormGroup);
            }
            if (props.baseFormStepper) {
                this.formImpls.setFormStepper(props.baseFormStepper);
            }
        } catch (e) {
            this.metaform = new MetaForm(
                {
                    theme: new Theme({
                        type: "default",
                        sectionLayout: "default"
                    }),
                    fields: [],
                    buttons: []
                },
                new EventEmitter()
            );
            this.metaformUpdater = new MetaFormUpdater(this.name, this.metaform);
            this.state = {
                error: { hasError: true, errorMsg: e?.message },
                validated: false
            };
            console.error(e);
        }
    }

    componentDidMount() {
        this.metaform.listener("submit", (...params: any) => {
            if (this.props.onSubmit) {
                this.props.onSubmit(
                    FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter || {}),
                    params
                );
            }
        });
        this.metaform.listener(EVENTS._FIELD_CHANGE, (...params: any) => {
            if (this.props.onChange) {
                this.props.onChange(params);
            }
        });
        this.metaform.listener(EVENTS._FIELD_CLOSE, (...params: any) => {
            if (this.props.onPopupClose) {
                this.props.onPopupClose(params);
            }
        });
    }

    componentWillUnmount() {
        this.metaform.removeListener("submit");
        this.metaform.removeListener("$field_change");
        this.metaform.removeListener("$field_close");
    }

    render() {
        const outerClassname = this.props?.className
            ? this.props.className
            : this.props.schema?.theme?.className
            ? this.props.schema.theme.className
            : "";
        const rootClassname = `container ${outerClassname} ${this.lastAction}`;
        return (
            <SchemaErrorBoundary error={this.state.error}>
                <FormContext.Provider value={this.metaform}>
                    <div className={rootClassname}>
                        <Form
                            schema={this.props.schema}
                            validated={this.state.validated}
                            // eslint-disable-next-line react/jsx-no-bind
                            validate={this.validate.bind(this)}
                            form={this.metaform.form}
                            theme={this.metaform.theme}
                            onCustom={(...params: any) => {
                                if (this.props.onCustom) {
                                    this.props.onCustom(
                                        FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter || {}),
                                        params
                                    );
                                }
                            }}
                            onPrevious={(...params: any) => {
                                this.lastAction = "previous";
                                if (this.props.onPrevious) {
                                    const page = this.metaform.getPage();
                                    const nextResponseMode =
                                        this.props.nextResponseMode || NEXT_RESPONSE_MODE.FORM_DATA;
                                    if (nextResponseMode === NEXT_RESPONSE_MODE.PAGE_DATA) {
                                        const section = this.metaform.getSection(page.pageNumber);
                                        const formData = section;
                                        this.props.onPrevious(
                                            FormUtils.updateSectionFormData(formData, {}, this.props.formatter || {}),
                                            page.pageNumber
                                        );
                                    } else {
                                        const formData = this.metaform.form;
                                        this.props.onPrevious(
                                            FormUtils.updateFormData(formData, {}, this.props.formatter || {}),
                                            page.pageNumber
                                        );
                                    }
                                }
                            }}
                            onNext={async (...params: any) => {
                                this.lastAction = "next";
                                if (this.props.onNext) {
                                    const page = this.metaform.getPage();
                                    const nextResponseMode =
                                        this.props.nextResponseMode || NEXT_RESPONSE_MODE.FORM_DATA;
                                    if (nextResponseMode === NEXT_RESPONSE_MODE.PAGE_DATA) {
                                        const section = this.metaform.getSection(page.pageNumber);
                                        const formData = section;
                                        return await this.props.onNext(
                                            FormUtils.updateSectionFormData(formData, {}, this.props.formatter || {}),
                                            page.pageNumber
                                        );
                                    } else {
                                        const formData = this.metaform.form;
                                        return await this.props.onNext(
                                            FormUtils.updateFormData(formData, {}, this.props.formatter || {}),
                                            page.pageNumber
                                        );
                                    }
                                }
                                return true;
                            }}
                            onSubmit={(...params: any) => {
                                this.lastAction = "submit";
                                if (this.props.onSubmit) {
                                    const nextResponseMode =
                                        this.props.nextResponseMode || NEXT_RESPONSE_MODE.FORM_DATA;
                                    if (nextResponseMode === NEXT_RESPONSE_MODE.PAGE_DATA) {
                                        const page = this.metaform.getPage();
                                        const section = this.metaform.getSection(page.pageNumber);
                                        const formData = section;
                                        this.props.onSubmit(
                                            FormUtils.updateSectionFormData(formData, {}, this.props.formatter || {}),
                                            params
                                        );
                                    } else {
                                        this.props.onSubmit(
                                            FormUtils.updateFormData(
                                                this.metaform.form,
                                                {},
                                                this.props.formatter || {}
                                            ),
                                            params
                                        );
                                    }
                                }
                            }}
                            emit={(eventType: string, payload: any) => {
                                this.metaform.emit(eventType, payload);
                            }}
                            buttons={this.props.buttons}
                            formValidated={(validated) => {
                                this.setState({ validated });
                            }}
                            useNextResponse={this.props.useNextResponse}
                        />
                    </div>
                </FormContext.Provider>
            </SchemaErrorBoundary>
        );
    }

    validate(e: React.SyntheticEvent, type: string): boolean {
        e.preventDefault();
        switch (type) {
            case "next":
                return this.metaform.validate();
            case "submit":
                return this.metaform.validate();
            default:
                this.setState({ validated: true });
        }
        return true;
    }
}

interface IState {
    validated: boolean;
    error: IError;
}
