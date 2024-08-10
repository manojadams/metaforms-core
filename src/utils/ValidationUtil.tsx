import { IForm, IFormField, TCondition } from "../constants/common-interface";
import { MSGS } from "../constants/constants";
import { CONTROLS } from "../constants/controls";
import { IFieldValidation, IValidation } from "../constants/model-interfaces";
import { ISetError, IValidationType, TValue } from "../constants/types";

export default class ValidationUtil {
    static updateMaxError(meta: IFormField, value: TValue, setError: ISetError) {
        let hasError = false;
        const maxValue = this.getValidationValue(meta.validation, "max");
        const maxErrorMsg =
            this.getValidationErrorMsg(meta.validation, "max") ||
            this.getValidationErrorMsg(meta.validation, "maxDetail");
        switch (meta.displayType) {
            case CONTROLS.TEXT:
            case CONTROLS.PASSWORD:
            case CONTROLS.TEXT_FIELD:
                if (value) {
                    const strValue: string = value as string;
                    const maxLength: number = parseInt(maxValue as string);
                    if (strValue.length > maxLength) {
                        const errorMsg =
                            maxErrorMsg || MSGS.ERROR_MSG.MAX_TEXT.replace("{CHARS}", maxLength.toString());
                        setError(true, errorMsg);
                        hasError = true;
                        return hasError;
                    }
                }
                break;
            case CONTROLS.NUMBER:
            case CONTROLS.CURRENCY:
                if (value) {
                    const strValue = value ? value + "" : "";
                    const val = parseInt(strValue);
                    if (val > parseInt(maxValue as string)) {
                        const errorMsg = maxErrorMsg || MSGS.ERROR_MSG.MAX;
                        setError(true, errorMsg);
                        hasError = true;
                        return hasError;
                    }
                }
                break;
            case CONTROLS.MONTH:
            case CONTROLS.DATE:
                if (value) {
                    const strValue = value ? value + "" : "";
                    const valDate = new Date(strValue);
                    const maxDate = new Date(maxValue as string);
                    if (valDate.getTime() > maxDate.getTime()) {
                        const errorMsg = maxErrorMsg || MSGS.ERROR_MSG.MAX;
                        setError(true, errorMsg);
                        hasError = true;
                        return hasError;
                    }
                }
        }
        return hasError;
    }

    static updateMinError(meta: IFormField, value: TValue, setError: ISetError) {
        let hasError = false;
        const minValue = this.getValidationValue(meta.validation, "min");
        const minErrorMsg =
            this.getValidationErrorMsg(meta.validation, "min") ||
            this.getValidationErrorMsg(meta.validation, "minDetail");
        switch (meta.displayType) {
            case CONTROLS.TEXT:
            case CONTROLS.PASSWORD:
            case CONTROLS.TEXT_FIELD:
                if (value) {
                    const strValue: string = value as string;
                    const minLength: number = parseInt(minValue as string);
                    if (strValue.length < minLength) {
                        const errorMsg =
                            minErrorMsg || MSGS.ERROR_MSG.MIN_TEXT.replace("{CHARS}", minLength.toString());
                        setError(true, errorMsg);
                        hasError = true;
                        return hasError;
                    }
                }
                break;
            case CONTROLS.NUMBER:
            case CONTROLS.CURRENCY:
                if (value) {
                    const strValue = value ? value + "" : "";
                    const val = parseInt(strValue);
                    if (val < parseInt(minValue as string)) {
                        const errorMsg = minErrorMsg || MSGS.ERROR_MSG.MIN;
                        setError(true, errorMsg);
                        hasError = true;
                        return hasError;
                    }
                }
                break;
            case CONTROLS.MONTH:
            case CONTROLS.DATE:
                if (value) {
                    const strValue = value ? value + "" : "";
                    const valDate = new Date(strValue);
                    const minDate = new Date(minValue as string);
                    if (valDate.getTime() < minDate.getTime()) {
                        const errorMsg = minErrorMsg || MSGS.ERROR_MSG.MIN;
                        setError(true, errorMsg);
                        hasError = true;
                        return hasError;
                    }
                }
        }
        return hasError;
    }

    static isEmptyField(value: unknown) {
        if (value === "" || value === undefined || value === null) {
            return true;
        }
        return false;
    }

    static getValidationValue(validation: IValidation | undefined, validationKey: IValidationType) {
        if (!validation) {
            return undefined;
        }

        switch (typeof validation[validationKey]) {
            case "boolean":
            case "string":
            case "number":
                return validation[validationKey];
            case "object": {
                const validationProp = validation[validationKey] as IFieldValidation<boolean | string | number>;
                return validationProp?.value;
            }
        }

        return undefined;
    }

    static getValidationErrorMsg(validation: IValidation | undefined, validationKey: IValidationType) {
        if (!validation) {
            return "";
        }

        switch (typeof validation[validationKey]) {
            case "boolean":
            case "string":
            case "number":
                return "";
            case "object": {
                const validationProp = validation[validationKey] as IFieldValidation<boolean | string | number>;
                return validationProp?.errorMsg;
            }
        }

        return "";
    }

    static validateFormSection(form: IForm, sectionName: string) {
        let hasErrors = false;
        if (form && form[sectionName]) {
            Object.keys(form[sectionName]).forEach((field) => {
                const formField: IFormField = form[sectionName][field];
                if (formField.display) {
                    // for displayed fields only
                    // reset disabled fields
                    // disabled fields do not require validation
                    if (formField.isDisabled) {
                        formField.error.hasError = false;
                        formField.error.errorMsg = "";
                    } else {
                        if (formField.value !== false && formField.value !== 0) {
                            // for required field
                            if (formField.validation?.required && !formField.value) {
                                const requiredValue = this.getValidationValue(formField.validation, "required");
                                if (requiredValue) {
                                    formField.error.hasError = true;
                                    formField.error.errorMsg =
                                        this.getValidationErrorMsg(formField.validation, "required") ||
                                        this.getValidationErrorMsg(formField.validation, "requiredDetail") ||
                                        MSGS.ERROR_MSG.REQUIRED;
                                    hasErrors = true;
                                }
                            }

                            // for pattern validation - string only
                            if (formField.value && formField.validation?.pattern) {
                                const patternValue = this.getValidationValue(formField.validation, "pattern");
                                if (patternValue) {
                                    const regexp = new RegExp(patternValue as string);
                                    if (!regexp.test(formField.value as string)) {
                                        formField.error.hasError = true;
                                        formField.error.errorMsg =
                                            this.getValidationErrorMsg(formField.validation, "pattern") ||
                                            this.getValidationErrorMsg(formField.validation, "patternDetail") ||
                                            MSGS.ERROR_MSG.PATTERN;
                                        hasErrors = true;
                                    }
                                }
                            }

                            // for min/max validation
                            if (formField.value !== undefined) {
                                // min validation
                                if (formField.validation?.min !== undefined) {
                                    this.updateMinError(
                                        formField,
                                        formField.value,
                                        (hasError: boolean, errorMsg: string) => {
                                            formField.error.hasError = hasError;
                                            formField.error.errorMsg = errorMsg;
                                            hasErrors = true;
                                        }
                                    );
                                }
                                // max validation
                                if (formField.validation?.max !== undefined) {
                                    this.updateMaxError(
                                        formField,
                                        formField.value,
                                        (hasError: boolean, errorMsg: string) => {
                                            formField.error.hasError = hasError;
                                            formField.error.errorMsg = errorMsg;
                                            hasErrors = true;
                                        }
                                    );
                                }
                            }
                        }
                    }
                }
            });
        }
        return hasErrors;
    }

    /**
     * Condition parser
     */
    static parseCondition(form: IForm, condition: Array<TCondition>, section: string) {
        let parsedCondition = "";
        condition.forEach((c) => {
            const [leftOperand, operator, rightOperand, nextCondition] = c;
            const lSection = leftOperand?.section ?? section;
            const lField = this.getField(form, lSection, leftOperand.ref);
            const lValue = lField.value === "" ? '""' : lField.value;
            let rValue;
            if (rightOperand && typeof rightOperand === "object" && "ref" in rightOperand) {
                // means its an operand
                const rSection = rightOperand?.section ?? section;
                const rField = this.getField(form, rSection, rightOperand.ref);
                rValue = rField.value;
            } else {
                rValue = rightOperand;
            }
            rValue = rValue === "" ? '""' : rValue;
            parsedCondition += "(" + lValue + operator + rValue + ")" + (nextCondition ?? "");
        });
        // eslint-disable-next-line no-new-func
        const evalCondition = parsedCondition ? Function(`return ${parsedCondition}`) : () => false;
        return evalCondition(parsedCondition);
    }

    static getField(form: IForm, section: string, field: string) {
        return form[section][field];
    }
}
