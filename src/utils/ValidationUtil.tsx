import { MSGS } from "../constants";
import { IMeta } from "../constants/model-interfaces";

export default class ValidationUtil {
    constructor() {

    }
    static updateMaxError(meta: IMeta, value: string | boolean | number | undefined, setError: Function) {
        let hasError = false;
        if (!meta?.validation?.max) {
            return hasError;;
        }
        switch(meta.displayType) {
            case 'number':
                if (value) {
                    const strValue = value ? value + '' : '';
                    const val = parseInt(strValue);
                    if (val > meta.validation.max) {
                        setError(true, meta.validation?.max_detail?.errorMsg || MSGS.ERROR_MSG.MAX);
                        hasError = true;
                        return hasError;
                    }
                }
                break;
            case 'month':
            case 'date':
                if (value) {
                    const strValue = value ? value + '' : '';
                    const valDate = new Date(strValue);
                    const maxDate = new Date(meta.validation.max);
                    if (valDate.getTime() > maxDate.getTime()) {
                        setError(true, meta.validation.max_detail?.errorMsg || MSGS.ERROR_MSG.MAX);
                        hasError = true;
                        return hasError;
                    }
                }
        }
        return hasError;
    }

    static updateMinError(meta: IMeta, value: string | boolean | number | undefined, setError: Function) {
        let hasError = false;
        if (!meta?.validation?.min) {
            return hasError;
        }
        switch(meta.displayType) {
            case 'number':
                if (value) {
                    const strValue = value ? value + '' : '';
                    const val = parseInt(strValue);
                    if (val < meta.validation.min) {
                        setError(true, meta.validation?.min_detail?.errorMsg || MSGS.ERROR_MSG.MIN);
                        hasError = true;
                        return hasError;
                    }
                }
                break;
            case 'month':
            case 'date':
                if (value) {
                    const strValue = value ? value + '' : '';
                    const valDate = new Date(strValue);
                    const minDate = new Date(meta.validation?.min);
                    if (valDate.getTime() < minDate.getTime()) {
                        setError(true, meta.validation.min_detail?.errorMsg || MSGS.ERROR_MSG.MIN);
                        hasError = true;
                        return hasError;
                    }
                }
        }
        return hasError;
    }
}