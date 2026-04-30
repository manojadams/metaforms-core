import { IForm, IFormErrorDetails, IFormField } from "../../constants/common-interface";
import ValidationUtil from "../../utils/ValidationUtil";

const getField = (value: IFormField["value"], validation: IFormField["validation"]): IFormField =>
    ({
        display: true,
        displayType: "text",
        error: { hasError: false, errorMsg: "" },
        validation,
        value
    } as IFormField);

describe("ValidationUtil", () => {
    it("validates custom validation entries", () => {
        const form: IForm = {
            default: {
                code: getField("abc", {
                    alphaOnly: {
                        value: true,
                        errorMsg: "Only uppercase letters are allowed"
                    }
                })
            }
        };
        const errors: Array<IFormErrorDetails> = [];

        const hasErrors = ValidationUtil.validateFormSection(form, "default", errors, true, {
            alphaOnly: (value) => /^[A-Z]+$/.test(value as string)
        });

        expect(hasErrors).toBe(true);
        expect(form.default.code.error).toEqual({
            hasError: true,
            errorMsg: "Only uppercase letters are allowed"
        });
        expect(errors).toEqual([{ id: "code", errorMsg: "Only uppercase letters are allowed" }]);
    });

    it("skips disabled custom validation entries", () => {
        const form: IForm = {
            default: {
                code: getField("abc", {
                    alphaOnly: false
                })
            }
        };
        const errors: Array<IFormErrorDetails> = [];

        const hasErrors = ValidationUtil.validateFormSection(form, "default", errors, true, {
            alphaOnly: () => false
        });

        expect(hasErrors).toBe(false);
        expect(errors).toEqual([]);
    });

    it("runs custom validations for boolean false values", () => {
        const form: IForm = {
            default: {
                accepted: getField(false, {
                    mustAccept: {
                        value: true,
                        errorMsg: "Must be accepted"
                    }
                })
            }
        };
        const errors: Array<IFormErrorDetails> = [];

        const hasErrors = ValidationUtil.validateFormSection(form, "default", errors, true, {
            mustAccept: (value) => value === true
        });

        expect(hasErrors).toBe(true);
        expect(errors).toEqual([{ id: "accepted", errorMsg: "Must be accepted" }]);
    });
});
