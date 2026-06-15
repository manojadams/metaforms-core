import { SyntheticEvent } from "react";
import BaseFormControl from "../form/form-controls/BaseFormControl";
import BaseFormGroup from "../form/form-group/BaseFormGroup";
import BaseFormStepper from "../form/form-stepper/BaseFormStepper";
import BaseFormWizard from "../form/form-wizard/BaseFormWizard";
import { IFormAdapter } from "./adapter-interface";
import {
    IControlProps,
    IElementTypes,
    IEventPayload,
    IFieldChange,
    IFnTypes,
    IFooterProps,
    IFormData,
    TFormResponse,
    TValidator
} from "./common-interface";
import { IFieldError, IFormatterType, IFormConfig, IFormConfigExtended, IRest, IUISchema } from "./model-interfaces";
import { TChangeMode, TFormType, TNextResponseMode, TSectionLayout } from "./types";

export interface IFormRenderer extends IUISchema, IFormConfig {
    baseFormControl?: typeof BaseFormControl;
    baseFormGroup?: typeof BaseFormGroup;
    baseFormStepper?: typeof BaseFormStepper;
    baseFormWizard?: typeof BaseFormWizard;
    loader?: JSX.Element;

    /**
     * Basic inputs params
     */
    /** Form class */
    className?: string;
    /** Input form data in key, value object format */
    data?: IFormData;
    /** Form class */
    type?: TFormType;
    /** Section layout */
    sectionLayout?: TSectionLayout;
    /** Field layout - row | column (default) */
    fieldLayout?: "row" | "column" | string;
    /** Spacing around the field */
    spacing?: string;

    /** theme configuration input params */
    themeConfig?: IFormConfigExtended;

    /**
     * Customization params
     */
    buttons?: IElementTypes;
    controls?: IElementTypes;
    components?: Record<string, React.FunctionComponent<IControlProps>>;
    fns?: IFnTypes;
    validators?: Record<string, TValidator>;
    footer?: React.FunctionComponent<IFooterProps>;
    formatter?: IFormatterType;
    icons?: IElementTypes;
    lastPageNumber?: number;
    name?: string;
    nextResponseMode?: TNextResponseMode;
    /** */
    changeResponseMode?: TChangeMode;
    pageNumber?: number;

    /**
     * REST API configruation params in the form
     */
    rest?: IRest;

    /**
     * Map fields to custom components
     */
    formAdapter?: IFormAdapter;
    adapterConfig?: Record<string, string>;

    /**
     * Event handling params
     */
    onChange?: (change: IFieldChange, formData?: IFormData) => void;
    onCustom?: (formData: IFormData, e: SyntheticEvent) => TFormResponse;
    onError?: (errorResponse: any) => TFormResponse;
    onPopupClose?: (params: Array<unknown>) => void;
    onPrevious?: (formData: IFormData, pageNumber: number) => TFormResponse;
    onNext?: (
        formData: IFormData,
        pageNumber: number,
        setErrors: (errors: IFieldError | Array<IFieldError>) => void
    ) => TFormResponse;
    onSubmit: (
        formData: IFormData,
        pageNumber: number,
        setErrors: (errors: IFieldError | Array<IFieldError>) => void
    ) => TFormResponse;
    onSubmitError?: (params: IEventPayload) => void;
    setLoading?: (isLoading: boolean) => void;
}
