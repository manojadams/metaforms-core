import { IForm, IFormField, TCondition } from "../constants/common-interface";
import { MSGS } from "../constants/constants";
import { CONTROLS } from "../constants/controls";
import { IMeta } from "../constants/model-interfaces";
import { ISetError, TValue } from "../constants/types";

export default class ValidationUtil {
    static updateMaxError(meta: IMeta, value: TValue, setError: ISetError) {
        let hasError = false;
        if (!meta?.validation?.max) {
            return hasError;
        }
        switch (meta.displayType) {
            case CONTROLS.NUMBER:
            case CONTROLS.CURRENCY:
                if (value) {
                    const strValue = value ? value + "" : "";
                    const val = parseInt(strValue);
                    if (val > parseInt(meta.validation.max as string)) {
                        const errorMsg = meta.validation?.maxDetail?.errorMsg || MSGS.ERROR_MSG.MAX;
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
                    const maxDate = new Date(meta.validation.max);
                    if (valDate.getTime() > maxDate.getTime()) {
                        const errorMsg = meta.validation?.maxDetail?.errorMsg || MSGS.ERROR_MSG.MAX;
                        setError(true, errorMsg);
                        hasError = true;
                        return hasError;
                    }
                }
        }
        return hasError;
    }

    static updateMinError(meta: IMeta, value: TValue, setError: ISetError) {
        let hasError = false;
        if (!meta?.validation?.min) {
            return hasError;
        }
        switch (meta.displayType) {
            case CONTROLS.NUMBER:
            case CONTROLS.CURRENCY:
                if (value) {
                    const strValue = value ? value + "" : "";
                    const val = parseInt(strValue);
                    if (val < parseInt(meta.validation.min as string)) {
                        const errorMsg = meta.validation?.minDetail?.errorMsg || MSGS.ERROR_MSG.MIN;
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
                    const minDate = new Date(meta.validation?.min);
                    if (valDate.getTime() < minDate.getTime()) {
                        const errorMsg = meta.validation?.minDetail?.errorMsg || MSGS.ERROR_MSG.MIN;
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
                                formField.error.hasError = true;
                                formField.error.errorMsg =
                                    formField.validation?.requiredDetail?.errorMsg || MSGS.ERROR_MSG.REQUIRED;
                                hasErrors = true;
                            }

                            // for pattern validation - string only
                            if (formField.value && formField.validation?.pattern) {
                                const regexp = new RegExp(formField.validation.pattern);
                                if (!regexp.test(formField.value as string)) {
                                    formField.error.hasError = true;
                                    formField.error.errorMsg =
                                        formField.validation.patternDetail?.errorMsg ||
                                        formField.validation.patternDetail?.errorMsg ||
                                        MSGS.ERROR_MSG.PATTERN;
                                    hasErrors = true;
                                }
                            }

                            // for min/max validation
                            if (formField.value !== undefined) {
                                // min validation
                                if (formField.validation?.min !== undefined) {
                                    this.updateMinError(
                                        formField as IMeta,
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
                                        formField as IMeta,
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
            const lSection = leftOperand?.section || section;
            const lField = this.getField(form, lSection, leftOperand.ref);
            const lValue = lField.value === "" ? '""' : lField.value;
            let rValue;
            if (rightOperand && typeof rightOperand === "object" && "ref" in rightOperand) {
                // means its an operand
                const rSection = rightOperand?.section || section;
                const rField = this.getField(form, rSection, rightOperand.ref);
                rValue = rField.value;
            } else {
                rValue = rightOperand;
            }
            rValue = rValue === "" ? '""' : rValue;
            parsedCondition += "(" + lValue + operator + rValue + ")" + (nextCondition || "");
        });
        // eslint-disable-next-line no-new-func
        const evalCondition = parsedCondition ? Function(`return ${parsedCondition}`) : () => false;
        return evalCondition(parsedCondition);
    }

    static getField(form: IForm, section: string, field: string) {
        return form[section][field];
    }
}
