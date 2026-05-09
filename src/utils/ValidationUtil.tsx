import { IForm, IFormErrorDetails, IFormField, TCondition, TValidator } from "../constants/common-interface";
import { MSGS } from "../constants/constants";
import { CONTROLS } from "../constants/controls";
import { IFieldValidation, IValidation } from "../constants/model-interfaces";
import { ISetError, IValidationType, TValue } from "../constants/types";

export default class ValidationUtil {
    static readonly DEFAULT_VALIDATION_KEYS = [
        "required",
        "requiredDetail",
        "pattern",
        "patternDetail",
        "min",
        "minDetail",
        "max",
        "maxDetail",
        "info",
        "infoDetail"
    ];

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

    static isCustomValidationEnabled(validation: IValidation, validationKey: string) {
        const validationEntry = validation[validationKey];
        if (validationEntry === undefined) {
            return false;
        }

        if (typeof validationEntry === "boolean") {
            return validationEntry;
        }

        if (typeof validationEntry === "object" && validationEntry !== null && "value" in validationEntry) {
            return Boolean(validationEntry.value);
        }

        return true;
    }

    static updateCustomValidationError(
        meta: IFormField,
        value: TValue,
        validators: Record<string, TValidator> | undefined,
        setError: ISetError
    ) {
        if (!meta.validation || !validators) {
            return false;
        }

        const customValidationKeys = Object.keys(meta.validation).filter(
            (key) => !this.DEFAULT_VALIDATION_KEYS.includes(key) && validators[key]
        );

        for (const validationKey of customValidationKeys) {
            if (!this.isCustomValidationEnabled(meta.validation, validationKey)) {
                continue;
            }

            const isValid = validators[validationKey](value, meta.validation[validationKey]);
            const trimmedIsValid = typeof isValid === "string" ? (isValid as string).trim() : isValid;

            if (typeof trimmedIsValid === "string" && trimmedIsValid) {
                // isValid is a custom error message
                setError(true, trimmedIsValid);
                return true;
            } else if (!trimmedIsValid) {
                // isValid is falsy (validation failed)
                const errorMsg = this.getValidationErrorMsg(meta.validation, validationKey) || MSGS.ERROR_MSG.CUSTOM;
                setError(true, errorMsg);
                return true;
            }
        }

        return false;
    }

    static validateFormSection(
        form: IForm,
        sectionName: string,
        errors: Array<IFormErrorDetails>,
        isDefaultForm: boolean,
        validators?: Record<string, TValidator>
    ) {
        let hasErrors = false;
        if (form && form[sectionName]) {
            Object.keys(form[sectionName]).forEach((field) => {
                const formField: IFormField = form[sectionName][field];
                if (formField.display) {
                    const fieldId = isDefaultForm ? field : `${sectionName}.${field}`;
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
                                    errors.push({ id: fieldId, errorMsg: formField.error.errorMsg });
                                    hasErrors = true;
                                    return;
                                }
                            } else {
                                formField.error.hasError = false;
                                formField.error.errorMsg = "";
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
                                        errors.push({
                                            id: fieldId,
                                            errorMsg: formField.error.errorMsg
                                        });
                                        hasErrors = true;
                                        return;
                                    } else {
                                        formField.error.hasError = false;
                                        formField.error.errorMsg = "";
                                    }
                                }
                            }

                            // for min/max validation
                            if (formField.value !== undefined) {
                                // min validation
                                if (formField.validation?.min !== undefined) {
                                    const hasMinError = this.updateMinError(
                                        formField,
                                        formField.value,
                                        (hasError: boolean, errorMsg: string) => {
                                            formField.error.hasError = hasError;
                                            formField.error.errorMsg = errorMsg;
                                            if (hasError) {
                                                errors.push({ id: fieldId, errorMsg });
                                            }
                                            hasErrors = true;
                                        }
                                    );
                                    if (hasMinError) {
                                        return;
                                    }
                                }
                                // max validation
                                if (formField.validation?.max !== undefined) {
                                    const hasMaxError = this.updateMaxError(
                                        formField,
                                        formField.value,
                                        (hasError: boolean, errorMsg: string) => {
                                            formField.error.hasError = hasError;
                                            formField.error.errorMsg = errorMsg;
                                            if (hasError) {
                                                errors.push({ id: fieldId, errorMsg });
                                            }
                                            hasErrors = true;
                                        }
                                    );
                                    if (hasMaxError) {
                                        return;
                                    }
                                }
                            }
                        }

                        // for custom validations
                        const hasCustomValidationError = this.updateCustomValidationError(
                            formField,
                            formField.value,
                            validators,
                            (hasError: boolean, errorMsg: string) => {
                                formField.error.hasError = hasError;
                                formField.error.errorMsg = errorMsg;
                                if (hasError) {
                                    errors.push({ id: fieldId, errorMsg });
                                }
                            }
                        );
                        if (hasCustomValidationError) {
                            hasErrors = true;
                        }
                    }
                }
            });
        }
        return hasErrors;
    }

    static getOperandValue(operand: string | number | boolean | Date | null | undefined) {
        if (!operand) {
            return;
        }

        const operandType = typeof operand;

        switch (operandType) {
            case "string":
                return `'${operand}'`;
            default:
                // boolean, number etc.
                return operand;
        }
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
            const lValue = lField.value === "" ? '""' : this.getOperandValue(lField.value);
            let rValue;
            if (rightOperand && typeof rightOperand === "object" && "ref" in rightOperand) {
                // means its an operand
                const rSection = rightOperand?.section ?? section;
                const rField = this.getField(form, rSection, rightOperand.ref);
                rValue = rField.value;
            } else {
                rValue = rightOperand;
            }
            rValue = rValue === "" ? '""' : this.getOperandValue(rValue);
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
