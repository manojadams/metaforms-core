import React from "react";
import FormUtils from "./utils/FormUtil";
import EventEmitter from "eventemitter3";
import { IFieldError, ISchema } from "./constants/model-interfaces";
import { IError, IEventPayload, IFieldChange, IFormRenderer } from "./constants/common-interface";
import { metaAPI } from "./meta-api";
import { CHANGE_MODE, DEFAULT, EVENTS, FORM_ACTION, NEXT_RESPONSE_MODE } from "./constants/constants";
import MetaForm from "./core/MetaForm";
import MetaFormUpdater from "./core/MetaFormUpdater";
import SchemaErrorBoundary from "./SchemaErrorBoundary";
import FormContext from "./form/form-context";
import Form from "./form/Form";
import FormImpls from "./core/FormImpl";
import FormImplsContext from "./form/form-impl-context";
import { Container } from "layout-emotions";
import FormConfig from "./core/FormConfig";

interface IState {
    error: IError;
    isLoading: boolean;
    validated: boolean;
}

/**
 * The core class responsible for form rendering
 * @category Form renderer
 */
export default class MetaFormRenderer extends React.Component<IFormRenderer> {
    schema: ISchema;
    state: IState;
    name: string;
    lastAction: string;
    metaform: MetaForm;
    metaformUpdater: MetaFormUpdater;
    formImpls: FormImpls;

    constructor(props: IFormRenderer) {
        super(props);

        this.handleCustom = this.handleCustom.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.validate = this.validate.bind(this);
        this.setLoading = this.setLoading.bind(this);

        this.schema = FormUtils.cleanupSchema(props.schema);
        this.name = props.name ?? DEFAULT;
        this.lastAction = "";
        this.formImpls = new FormImpls();
        const formConfig = new FormConfig(props.type ?? DEFAULT, props.sectionLayout, props.fieldLayout, props.config);
        try {
            this.metaform = new MetaForm(this.props.schema, new EventEmitter(), formConfig, this.props.rest);
            this.metaformUpdater = new MetaFormUpdater(this.name, this.metaform);
            metaAPI.metaForm.add(this.name, this.metaform);
            if (props.icons) {
                this.metaform.setIcons(props.icons);
            }
            this.state = {
                error: { hasError: false, errorMsg: "" },
                isLoading: false,
                validated: false
            };
            if (props.fns) {
                this.metaform.setFns(props.fns);
            }
            if (props.controls) {
                this.metaform.setControls(props.controls);
            }
            if (props.components) {
                this.metaform.setControlElements(props.components);
            }
            if (props.onError) {
                this.metaform.setErrorHandler(props.onError);
            }
            // initialize metaform only after all properties are set
            this.metaform.init(props.data);
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
            if (props.baseFormWizard) {
                this.formImpls.setFormWizard(props.baseFormWizard);
            }
        } catch (e) {
            this.metaform = new MetaForm(
                {
                    fields: [],
                    buttons: []
                },
                new EventEmitter(),
                formConfig,
                this.props.rest
            );
            this.metaformUpdater = new MetaFormUpdater(this.name, this.metaform);
            this.state = {
                error: { hasError: true, errorMsg: e?.message },
                isLoading: false,
                validated: false
            };
            console.error(e);
        }
    }

    componentDidMount() {
        this.metaform.listener(EVENTS.SUBMIT, async () => {
            if (this.props.onSubmit) {
                this.props.onSubmit(
                    await FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter ?? {}),
                    this.metaform.getPage().pageNumber,
                    this.setErrors
                );
            }
        });
        this.metaform.listener(EVENTS._FIELD_CHANGE, async (params: IEventPayload) => {
            let formData;
            if (this.props.onChange) {
                if (this.props.changeResponseMode === CHANGE_MODE.FORM_DATA) {
                    formData = await FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter ?? {});
                } else if (this.props.changeResponseMode === CHANGE_MODE.SECTION_DATA) {
                    const page = this.metaform.getPage();
                    const sectionData = this.metaform.getSection(page.pageNumber);
                    formData = await FormUtils.updateSectionFormData(sectionData, {}, this.props.formatter ?? {});
                }
                this.props.onChange(params.payload as IFieldChange, formData);
            }
        });
        this.metaform.listener(EVENTS._FIELD_CLOSE, (...params) => {
            if (this.props.onPopupClose) {
                this.props.onPopupClose(params);
            }
        });
        this.metaform.listener(EVENTS.VALIDATION_ERROR, (params) => {
            if (this.props.onSubmitError) {
                this.props.onSubmitError(params);
            }
        });
    }

    componentWillUnmount() {
        this.metaform.removeListener(EVENTS.SUBMIT);
        this.metaform.removeListener(EVENTS._FIELD_CHANGE);
        this.metaform.removeListener(EVENTS._FIELD_CLOSE);
        this.metaform.removeListener(EVENTS.VALIDATION_ERROR);
        this.metaformUpdater.destroy(this.name);
    }

    render() {
        const outerClassname = this.props?.className ?? this.props?.className ?? "";
        const rootClassname = `${outerClassname} ${this.lastAction}`;
        return (
            <SchemaErrorBoundary error={this.state.error}>
                <FormContext.Provider value={this.metaform}>
                    <FormImplsContext.Provider value={this.formImpls}>
                        <Container className={rootClassname}>
                            <Form
                                schema={this.props.schema}
                                validated={this.state.validated}
                                validate={this.validate}
                                form={this.metaform.form}
                                sectionLayout={this.metaform.formConfig?.sectionLayout}
                                onCustom={this.handleCustom}
                                onPrevious={this.handlePrevious}
                                onNext={this.handleNext}
                                onSubmit={this.handleSubmit}
                                emit={(eventType: string, payload: IEventPayload) => {
                                    this.metaform.emit(eventType, payload);
                                }}
                                buttons={this.props.buttons}
                                formValidated={(validated) => {
                                    this.setState({ validated });
                                }}
                            />
                        </Container>
                    </FormImplsContext.Provider>
                </FormContext.Provider>
            </SchemaErrorBoundary>
        );
    }

    validate(e: React.SyntheticEvent, type: string): boolean {
        e.preventDefault();
        switch (type) {
            case FORM_ACTION.NEXT:
                return this.metaform.validate();
            case FORM_ACTION.SUBMIT:
                return this.metaform.validate();
            default:
                this.setState({ validated: true });
        }
        return true;
    }

    setErrors(errors: IFieldError | Array<IFieldError>) {
        const page = this.metaform.getPage();
        const section = this.metaform.getSectionName(page.pageNumber);

        try {
            if (Array.isArray(errors)) {
                errors.forEach((error) => {
                    const { field, hasError, errorMsg } = error;
                    this.metaform.setError(section?.name ?? "", field, {
                        hasError,
                        errorMsg
                    });
                });
            } else {
                const { field, hasError, errorMsg } = errors;
                this.metaform.setError(section?.name ?? "", field, {
                    hasError,
                    errorMsg
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    async handleCustom(e: React.MouseEvent) {
        if (this.props.onCustom) {
            this.props.onCustom(await FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter || {}), e);
        }
    }

    async handlePrevious() {
        this.lastAction = FORM_ACTION.PREVIOUS;
        if (this.props.onPrevious) {
            const page = this.metaform.getPage();
            const nextResponseMode = this.props.nextResponseMode || NEXT_RESPONSE_MODE.FORM_DATA;
            if (nextResponseMode === NEXT_RESPONSE_MODE.PAGE_DATA) {
                const sectionData = this.metaform.getSection(page.pageNumber);
                this.props.onPrevious(
                    await FormUtils.updateSectionFormData(sectionData, {}, this.props.formatter || {}),
                    page.pageNumber
                );
            } else {
                const formData = this.metaform.form;
                this.props.onPrevious(
                    await FormUtils.updateFormData(formData, {}, this.props.formatter || {}),
                    page.pageNumber
                );
            }
        }
    }

    async handleNext() {
        this.lastAction = FORM_ACTION.NEXT;
        if (this.props.onNext) {
            const page = this.metaform.getPage();
            this.setLoading(true);
            const nextResponseMode = this.props.nextResponseMode || NEXT_RESPONSE_MODE.FORM_DATA;
            try {
                if (nextResponseMode === NEXT_RESPONSE_MODE.PAGE_DATA) {
                    const sectionData = this.metaform.getSection(page.pageNumber);
                    return await this.props.onNext(
                        await FormUtils.updateSectionFormData(sectionData, {}, this.props.formatter || {}),
                        page.pageNumber,
                        this.setErrors
                    );
                } else {
                    const formData = this.metaform.form;
                    return await this.props.onNext(
                        await FormUtils.updateFormData(formData, {}, this.props.formatter || {}),
                        page.pageNumber,
                        this.setErrors
                    );
                }
            } finally {
                this.setLoading(false);
            }
        }
        return true;
    }

    async handleSubmit() {
        this.lastAction = FORM_ACTION.SUBMIT;

        if (this.props.onSubmit) {
            this.setLoading(true);
            const nextResponseMode = this.props.nextResponseMode || NEXT_RESPONSE_MODE.FORM_DATA;
            const page = this.metaform.getPage();
            try {
                const sectionData = this.metaform.getSection(page.pageNumber);
                if (nextResponseMode === NEXT_RESPONSE_MODE.PAGE_DATA) {
                    return await this.props.onSubmit(
                        await FormUtils.updateSectionFormData(sectionData, {}, this.props.formatter || {}),
                        page.pageNumber,
                        this.setErrors
                    );
                } else {
                    return await this.props.onSubmit(
                        await FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter || {}),
                        page.pageNumber,
                        this.setErrors
                    );
                }
            } finally {
                this.setLoading(false);
            }
        }
    }

    setLoading(isLoading: boolean) {
        this.setState({ isLoading });
        if (this.props.setLoading) {
            this.props.setLoading(isLoading);
        }
    }
}
