import { IError, IErrorDetails } from "./constants/common-interface";
import { DEFAULT, SECTION_LAYOUT } from "./constants/constants";
import { TValue } from "./constants/types";
import MetaFormUpdater from "./core/MetaFormUpdater";

export interface IMetaAPI {
    metaForm: MetaFormUpdater;

    // === Methods for default form (DEFAULT section) ===
    /**
     * Get field value from default form
     * @param field
     */
    getFieldValue(field: string): TValue | undefined;

    /**
     * Get field property from default form
     * @param field
     * @param property
     */
    getFieldProperty(field: string, property: string): any;

    /**
     * Updates a field in default form
     * @param field
     * @param value
     */
    updateField(field: string, value: TValue): void;

    /**
     * Sets field error in default form
     * @param field
     * @param error
     */
    setFieldError(field: string, error: IError): void;

    // === Methods for any form and section ===
    /**
     * Get field value from specific form and section
     * @param formName
     * @param section
     * @param field
     */
    getFormFieldValue(formName: string, section: string, field: string): TValue | undefined;

    /**
     * Get field property from specific form and section
     * @param formName
     * @param section
     * @param field
     * @param property
     */
    getFormFieldProperty(formName: string, section: string, field: string, property: string): any;

    /**
     * Updates a field in specific form and section
     * @param formName
     * @param section
     * @param field
     * @param value
     */
    updateFormField(formName: string, section: string, field: string, value: TValue): void;

    /**
     * Sets field error in specific form and section
     * @param formName
     * @param section
     * @param field
     * @param error
     */
    setFormFieldError(formName: string, section: string, field: string, error: IError): void;

    /**
     * Validates a given form and return the error details
     * @param formName
     */
    validateForm(formName: string): IErrorDetails;

    /**
     * Validates the default form and return the error details
     */
    validateDefaultForm(): IErrorDetails;
}

/**
 * API to update form data manually (indirectly from outside of forms)
 * @category API
 */
export const metaAPI: IMetaAPI = {
    metaForm: new MetaFormUpdater(SECTION_LAYOUT.DEFAULT, null),

    // === Default form methods ===
    getFieldValue: (field) =>
        metaAPI.metaForm.getFieldValue(DEFAULT, SECTION_LAYOUT.DEFAULT, field),

    getFieldProperty: (field, property) =>
        metaAPI.metaForm.getFieldProperty(DEFAULT, SECTION_LAYOUT.DEFAULT, field, property),

    updateField: (field, value) =>
        metaAPI.metaForm.updateField(SECTION_LAYOUT.DEFAULT, field, value),

    setFieldError: (field, error) =>
        metaAPI.metaForm.setFieldError(SECTION_LAYOUT.DEFAULT, field, error),

    // === Any form methods ===
    getFormFieldValue: (formName, section, field) =>
        metaAPI.metaForm.getFieldValue(formName, section, field),

    getFormFieldProperty: (formName, section, field, property) =>
        metaAPI.metaForm.getFieldProperty(formName, section, field, property),

    updateFormField: (formName, section, field, value) =>
        metaAPI.metaForm.updateFormField(formName, section, field, value),

    setFormFieldError: (formName, section, field, error) =>
        metaAPI.metaForm.setFormFieldError(formName, section, field, error),

    validateForm: (formName) =>
        metaAPI.metaForm.validateForm(formName),

    validateDefaultForm: () =>
        metaAPI.metaForm.validateForm(DEFAULT)
};
