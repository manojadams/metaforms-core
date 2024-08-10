import { EMAIL_PATTERN, MSGS } from "../constants/constants";
import { IField, IValidation } from "../constants/model-interfaces";
import { TValue } from "../constants/types";
import ValidationUtil from "./ValidationUtil";

class MetaformUtil {
    static getDefaultValidation(displayType: string | undefined, validation: IValidation | undefined) {
        if (displayType) {
            switch (displayType) {
                case "email": {
                    let emailValidation = validation;
                    if (!emailValidation) {
                        emailValidation = {};
                    }
                    emailValidation.pattern = emailValidation?.pattern ?? EMAIL_PATTERN;
                    emailValidation.pattern = {
                        value:
                            (ValidationUtil.getValidationValue(emailValidation, "pattern") as string | undefined) ??
                            EMAIL_PATTERN,
                        errorMsg:
                            ValidationUtil.getValidationErrorMsg(emailValidation, "pattern") ??
                            MSGS.ERROR_MSG.EMAIL_INVALID
                    };

                    return emailValidation;
                }
            }
        }
        return validation;
    }

    /**
     * Reads initial field value for form fields
     * @param field
     * @param value
     * @returns
     */
    static getInitlalFieldValue(field: IField, value: Exclude<TValue, Date>) {
        if (value !== undefined) {
            return value;
        }

        return field?.meta?.value !== undefined ? field?.meta?.value : "";
    }
}

export default MetaformUtil;
