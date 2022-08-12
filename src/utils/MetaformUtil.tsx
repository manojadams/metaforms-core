import { EMAIL_PATTERN, MSGS } from "../constants";
import { IValidation } from "../constants/model-interfaces";

class MetaformUtil {
    static getDefaultValidation(displayType: string | undefined, validation: IValidation | undefined) {
        if (displayType) {
            switch (displayType) {
                case 'email':
                    let emailValidation = validation;
                    if (!emailValidation) {
                        emailValidation = {};
                    }
                    emailValidation.pattern = emailValidation?.pattern || EMAIL_PATTERN;
                    if (!emailValidation.pattern_detail) {
                        emailValidation.pattern_detail = {}
                    }
                    emailValidation.pattern_detail.errorMsg = emailValidation?.pattern_detail?.errorMsg || MSGS.ERROR_MSG.EMAIL_INVALID;
                    return emailValidation;
            }
        }
        return validation;
    }
}

export default MetaformUtil;