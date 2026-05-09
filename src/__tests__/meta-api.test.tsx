import { metaAPI } from "./../meta-api";
import { IError, IErrorDetails } from "../constants/common-interface";
import { DEFAULT, SECTION_LAYOUT } from "../constants/constants";

describe("Meta API tests", () => {
    it("Check meta api is defined", () => {
        expect(metaAPI).toBeTruthy();
    });

    describe("Default form methods", () => {
        it("should have getFieldValue method for default form", () => {
            expect(metaAPI.getFieldValue).toBeDefined();
            expect(typeof metaAPI.getFieldValue).toBe("function");
        });

        it("should have getFieldProperty method for default form", () => {
            expect(metaAPI.getFieldProperty).toBeDefined();
            expect(typeof metaAPI.getFieldProperty).toBe("function");
        });

        it("should have updateField method for default form", () => {
            expect(metaAPI.updateField).toBeDefined();
            expect(typeof metaAPI.updateField).toBe("function");
        });

        it("should have setFieldError method for default form", () => {
            expect(metaAPI.setFieldError).toBeDefined();
            expect(typeof metaAPI.setFieldError).toBe("function");
        });

        it("should have validateDefaultForm method", () => {
            expect(metaAPI.validateDefaultForm).toBeDefined();
            expect(typeof metaAPI.validateDefaultForm).toBe("function");
        });

        it("should call metaForm.getFieldValue with DEFAULT form name and DEFAULT section", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "getFieldValue");
            metaAPI.getFieldValue("testField");
            expect(spy).toHaveBeenCalledWith(DEFAULT, SECTION_LAYOUT.DEFAULT, "testField");
            spy.mockRestore();
        });

        it("should call metaForm.getFieldProperty with DEFAULT form name and DEFAULT section", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "getFieldProperty");
            metaAPI.getFieldProperty("testField", "customProp");
            expect(spy).toHaveBeenCalledWith(DEFAULT, SECTION_LAYOUT.DEFAULT, "testField", "customProp");
            spy.mockRestore();
        });

        it("should call metaForm.updateField with DEFAULT section", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "updateField");
            metaAPI.updateField("testField", "newValue");
            expect(spy).toHaveBeenCalledWith(SECTION_LAYOUT.DEFAULT, "testField", "newValue");
            spy.mockRestore();
        });

        it("should call metaForm.setFieldError with DEFAULT section", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "setFieldError");
            const error: IError = { hasError: true, errorMsg: "Test error" };
            metaAPI.setFieldError("testField", error);
            expect(spy).toHaveBeenCalledWith(SECTION_LAYOUT.DEFAULT, "testField", error);
            spy.mockRestore();
        });

        it("should call metaForm.validateForm with DEFAULT form name", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "validateForm");
            metaAPI.validateDefaultForm();
            expect(spy).toHaveBeenCalledWith(DEFAULT);
            spy.mockRestore();
        });
    });

    describe("Any form methods", () => {
        it("should have getFormFieldValue method", () => {
            expect(metaAPI.getFormFieldValue).toBeDefined();
            expect(typeof metaAPI.getFormFieldValue).toBe("function");
        });

        it("should have getFormFieldProperty method", () => {
            expect(metaAPI.getFormFieldProperty).toBeDefined();
            expect(typeof metaAPI.getFormFieldProperty).toBe("function");
        });

        it("should have updateFormField method", () => {
            expect(metaAPI.updateFormField).toBeDefined();
            expect(typeof metaAPI.updateFormField).toBe("function");
        });

        it("should have setFormFieldError method", () => {
            expect(metaAPI.setFormFieldError).toBeDefined();
            expect(typeof metaAPI.setFormFieldError).toBe("function");
        });

        it("should have validateForm method", () => {
            expect(metaAPI.validateForm).toBeDefined();
            expect(typeof metaAPI.validateForm).toBe("function");
        });

        it("should call metaForm.getFieldValue with custom form name and section", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "getFieldValue");
            metaAPI.getFormFieldValue("customForm", "customSection", "testField");
            expect(spy).toHaveBeenCalledWith("customForm", "customSection", "testField");
            spy.mockRestore();
        });

        it("should call metaForm.getFieldProperty with custom form name and section", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "getFieldProperty");
            metaAPI.getFormFieldProperty("customForm", "customSection", "testField", "customProp");
            expect(spy).toHaveBeenCalledWith("customForm", "customSection", "testField", "customProp");
            spy.mockRestore();
        });

        it("should call metaForm.updateFormField with custom form, section and field", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "updateFormField");
            metaAPI.updateFormField("customForm", "customSection", "testField", "newValue");
            expect(spy).toHaveBeenCalledWith("customForm", "customSection", "testField", "newValue");
            spy.mockRestore();
        });

        it("should call metaForm.setFormFieldError with custom form, section and field", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "setFormFieldError");
            const error: IError = { hasError: true, errorMsg: "Test error" };
            metaAPI.setFormFieldError("customForm", "customSection", "testField", error);
            expect(spy).toHaveBeenCalledWith("customForm", "customSection", "testField", error);
            spy.mockRestore();
        });

        it("should call metaForm.validateForm with custom form name", () => {
            const spy = jest.spyOn(metaAPI.metaForm, "validateForm");
            metaAPI.validateForm("customForm");
            expect(spy).toHaveBeenCalledWith("customForm");
            spy.mockRestore();
        });
    });

    describe("Backward compatibility", () => {
        it("should keep metaForm property for backward compatibility", () => {
            expect(metaAPI.metaForm).toBeTruthy();
        });

        it("metaForm should have all original methods", () => {
            expect(metaAPI.metaForm.getFieldValue).toBeDefined();
            expect(metaAPI.metaForm.getFieldProperty).toBeDefined();
            expect(metaAPI.metaForm.updateField).toBeDefined();
            expect(metaAPI.metaForm.setFieldError).toBeDefined();
            expect(metaAPI.metaForm.updateFormField).toBeDefined();
            expect(metaAPI.metaForm.setFormFieldError).toBeDefined();
            expect(metaAPI.metaForm.validateForm).toBeDefined();
        });
    });
});
