import { ComponentType } from "react";
import { IError, IFieldConfig } from "./common-interface";
import { IOption } from "./model-interfaces";
import { TMouseEvent, TValue } from "./types";

// Define value types per field
export type TInputValue = string | number | undefined;
export type TSelectValue = string | number | undefined;
export type TCheckboxValue = boolean;

export type TValueFiltered = Exclude<TValue, Date | null>;

export interface IBaseProps {
    className?: string;
    name?: string;
    label?: string;
    value: TValueFiltered;
    disabled?: boolean;
    readOnly?: boolean;
    error: IError;

    // evenst handlers
    onChange(e: TMouseEvent, val?: TValue): void;
    onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
}

export interface InputProps extends IBaseProps {
    type: string;
    value: TInputValue;
    placeholder?: string;
}

export interface IOptionProps extends IBaseProps {
    options: IOption[];
    value: TSelectValue;
    placeholder?: string;

    onChange(e: TMouseEvent, val?: TValue, ref?: IOption): void;
}

export interface ISelectProps extends IOptionProps {
    multiple?: boolean;
}

export interface IRadioProps extends IOptionProps {
    type: string;
    options: IOption[];
}

export interface IDateProps extends IBaseProps {
    type: string;
    value: any;
}

export interface ICheckboxProps extends IBaseProps {
    type: string;
    value: TCheckboxValue;
}

export interface IFileProps extends IBaseProps {
    type: string;
    accept?: string;
    file?: File | null;
}

export interface IFieldPropsMap {
    text: InputProps;
    date: IDateProps;
    select: ISelectProps;
    radio: IRadioProps;
    checkbox: ICheckboxProps;
    file: IFileProps;
}

export type TFieldPropsMap = IFieldPropsMap & {
    [key: string]: IBaseProps & Record<string, any>;
};

export interface IFieldAdapter<TKey extends keyof IFieldPropsMap> {
    component: React.ComponentType<IFieldPropsMap[TKey]>;
    baseProps?: Partial<IFieldPropsMap[TKey]>;
    customProps?: Record<string, any>;
    config?: IFieldConfig;
}

export type TFieldMapper = {
    [TKey in keyof IFieldPropsMap]?: ComponentType<IFieldPropsMap[TKey]> | IFieldAdapter<TKey>; // known keys — fully typed
} & {
    [key: string]: ComponentType<any> | IFieldAdapter<any>; // unknown keys — less strict typing
};
