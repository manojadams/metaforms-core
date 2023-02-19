import { TValue } from "./types";

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IUISchema {
    schema: ISchema;
}

export interface ISchema {
    fields: Array<IField>;
    theme?: ITheme;
    buttons?: Array<IField>;
    rest?: IRest;
}

export interface IRest {
    config: IConfig;
}

export interface IConfig {
    apihost?: string;
    basepath?: string;
    protocol?: string;
    headers?: Array<IConfigParam>;
}

export interface IConfigParam {
    key: string;
    value: string;
}

export interface IField {
    name: string;
    prop?: string;
    meta: IMeta;
    fields?: Array<IField>;
}

export interface IMeta {
    type?: string;
    display?: boolean;
    isArray?: boolean;
    displayName?: string;
    displayType?: string;
    placeholder?: string;
    value?: string | number | boolean;
    displayProps?: IDisplayProps;
    options?: Array<IOption>;
    isDisabled?: boolean;
    isReadonly?: boolean;
    validation?: IValidation;
    dependencies?: IDependency;
    loader?: ILoader;
    mui?: any;
    bootstrap?: any;
    url?: string;
    className?: string;
    events?: IEvent;
    labelPlacement?: string;
    error?: { hasError: boolean; errorMsg: string };
    init?: IURLLoaderConfig;
    config?: any;
    icons?: IIconConfig;
}

export interface IOption {
    value: string;
    label: string;
    ref?: any; // reference to original object
}

export interface ITemplateConfig {
    params: Record<string, string>;
}

export interface IURLLoaderConfig {
    type: string; // url_loader, lazy_loader, inputs
    url: string;
    urlType?: string; // for remote url
    queryParams?: Array<TParam>; // query params
    pathParams?: Array<TParam>; // path params
    responseKey?: string;
    valueKey?: string;
    labelKey?: string;
    loadOn?: Array<string>;
    openTo?: string; // for calendar -- year, month, day
    inputFormat?: string; // for calendar
    views?: string; // for calendar

    inputs?: Array<IMultitextInput>; // for inputs
    separator?: string; // for inputs

    accept?: string; // for input file
    toolbarVersion?: number; // for datepicker
}
export interface IIconConfig {
    [key: string]: {
        type: string;
        position?: string;
    };
}

// export interface IFieldConfig extends IURLLoaderConfig {}

export interface IDisplayProps {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    offset?: string;
    rs?: boolean; // row start
    isStandalone?: boolean;
    align?: string; // left, right, center
    fieldLayout?: string;
    optionsLayout?: string;
}

export interface ITheme {
    type: string;
    sectionLayout?: string;
    spacing?: string;
    className?: string;
    mui?: IMUITheme;
    bootstrap?: IBootstrapTheme;
}

export interface IValidation {
    required?: boolean;
    requiredDetail?: IValidationDetail;
    pattern?: string;
    patternDetail?: IPatternValidationDetail;
    min?: number | string;
    minDetail?: IValidationDetail;
    max?: number | string;
    maxDetail?: IValidationDetail;
    infoDetail?: IInfoDetail;
}

export interface IValidationDetail {
    errorMsg?: string;
}

export interface IPatternValidationDetail extends IValidationDetail {
    allowValidOnly?: boolean;
}

export interface IInfoDetail {
    infoMsg?: string;
    infoMsgFn?: string;
}

export interface IDependency {
    exists?: IExistsDependency;
    enabled?: IEnabledDependency;
    load?: ILoadDependency;
    equals?: IEqualsDependency;
    displayType?: IDisplayTypeDependency;
}

export interface IBaseDependency {
    section: string;
    ref: string;
    value: string;
}

export interface IExistsDependency extends IBaseDependency {
    // to be added later
}

export interface IEnabledDependency extends IBaseDependency {
    // to be added later
}

export interface ILoadDependency extends IBaseDependency {
    url: string;
}

export interface IEqualsDependency extends IBaseDependency {
    currentValue: any;
    resetValue: any;
}

export interface IDisplayTypeDependency extends IBaseDependency {
    // to be added later
}

export interface ILoader {
    // to be added later
}

export interface IFieldChange {
    type: string;
    reference: string;
}

export interface IEvent {
    click?: IClickEvent;
    input?: IInputEvent;
    change?: IChangeEvent | Array<IChangeEvent>;
    open?: IConfig; // for select
}

export interface IMUITheme {
    variant?: string;
    size?: string;
    tabs?: {
        variant: string;
    };
}

export interface IBootstrapTheme {}

export interface IClickEvent {
    type: string; // submit, reset, next, previous, action (custom)
    value?: string;
}
export interface IInputEvent {
    type: string;
    url: string;
    params: Array<TParam>;
    labelKey?: string;
    valueKey?: string;
    responseKey?: string;
    response?: string;
    value?: string;
}

export interface IChangeEvent {
    type: string; // setter
    ref: string;
    valueKey: string;
    value: TValue;
}

export interface IParamType {
    type?: string;
    ref?: string; // reference field
    section?: string; // reference section
}

export type TParamType = IParamType | string | undefined;
export type TParam = [string, TParamType];

export interface IFormatterType {
    [key: string]: Function;
}

export interface IMultitextInput {
    chars: string;
    width: string;
    isReadonly?: boolean;
    required?: boolean;
    placeholder?: string;
    value?: string;
}
