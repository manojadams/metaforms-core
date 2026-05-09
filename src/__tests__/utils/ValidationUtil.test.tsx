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

    it("uses returned string from validator as error message", () => {
        const form: IForm = {
            default: {
                email: getField("invalid-email", {
                    customEmail: {
                        value: true,
                        errorMsg: "Fallback error message"
                    }
                })
            }
        };
        const errors: Array<IFormErrorDetails> = [];

        const hasErrors = ValidationUtil.validateFormSection(form, "default", errors, true, {
            customEmail: (value) => "Email format is invalid"
        });

        expect(hasErrors).toBe(true);
        expect(form.default.email.error).toEqual({
            hasError: true,
            errorMsg: "Email format is invalid"
        });
        expect(errors).toEqual([{ id: "email", errorMsg: "Email format is invalid" }]);
    });

    it("trims whitespace from error message returned by validator", () => {
        const form: IForm = {
            default: {
                email: getField("invalid-email", {
                    customEmail: {
                        value: true,
                        errorMsg: "Fallback error message"
                    }
                })
            }
        };
        const errors: Array<IFormErrorDetails> = [];

        const hasErrors = ValidationUtil.validateFormSection(form, "default", errors, true, {
            customEmail: (value) => "   Email format is invalid   "
        });

        expect(hasErrors).toBe(true);
        expect(form.default.email.error).toEqual({
            hasError: true,
            errorMsg: "Email format is invalid"
        });
        expect(errors).toEqual([{ id: "email", errorMsg: "Email format is invalid" }]);
    });

    it("uses fallback error message when validator returns whitespace-only string", () => {
        const form: IForm = {
            default: {
                email: getField("invalid-email", {
                    customEmail: {
                        value: true,
                        errorMsg: "Fallback error message"
                    }
                })
            }
        };
        const errors: Array<IFormErrorDetails> = [];

        const hasErrors = ValidationUtil.validateFormSection(form, "default", errors, true, {
            customEmail: (value) => "   "
        });

        expect(hasErrors).toBe(true);
        expect(form.default.email.error).toEqual({
            hasError: true,
            errorMsg: "Fallback error message"
        });
        expect(errors).toEqual([{ id: "email", errorMsg: "Fallback error message" }]);
    });

    it("uses fallback error message when validator returns falsy value", () => {
        const form: IForm = {
            default: {
                email: getField("invalid-email", {
                    customEmail: {
                        value: true,
                        errorMsg: "Email validation failed"
                    }
                })
            }
        };
        const errors: Array<IFormErrorDetails> = [];

        const hasErrors = ValidationUtil.validateFormSection(form, "default", errors, true, {
            customEmail: (value) => false
        });

        expect(hasErrors).toBe(true);
        expect(form.default.email.error).toEqual({
            hasError: true,
            errorMsg: "Email validation failed"
        });
        expect(errors).toEqual([{ id: "email", errorMsg: "Email validation failed" }]);
    });
});
