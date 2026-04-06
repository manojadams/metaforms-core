import { IError, IErrorDetails } from "../constants/common-interface";
import { SECTION_LAYOUT } from "../constants/constants";
import { TValue } from "../constants/types";
import MetaForm from "./MetaForm";

/**
 * Update form data manually
 */
class MetaFormUpdater {
    private metaformMap: Map<string, MetaForm | null> = new Map();
    constructor(name: string, metaform: MetaForm | null) {
        this.metaformMap.set(name, metaform);
    }

    /**
     * Updates a form field (for a non-grouped forms)
     * @param section
     * @param field
     * @param value
     */
    updateField(section: string, field: string, value: TValue) {
        const defaultForm = this.metaformMap.get(SECTION_LAYOUT.DEFAULT);
        if (defaultForm) {
            defaultForm.updateField(section, field, value);
        }
    }

    /**
     * Sets field error
     * @param section
     * @param field
     * @param error
     */
    setFieldError(section: string, field: string, error: IError) {
        const defaultForm = this.metaformMap.get(SECTION_LAYOUT.DEFAULT);
        if (defaultForm) {
            defaultForm.setError(section, field, error);
        }
    }

    /**
     * Updates a form field
     * @param formName
     * @param section
     * @param field
     * @param value
     */
    updateFormField(formName: string, section: string, field: string, value: TValue) {
        const defaultForm = this.metaformMap.get(formName);
        if (defaultForm) {
            defaultForm.updateField(section, field, value);
        }
    }

    /**
     * Sets error in a form field
     * @param formName
     * @param section
     * @param field
     * @param error
     */
    setFormFieldError(formName: string, section: string, field: string, error: IError) {
        const defaultForm = this.metaformMap.get(formName);
        if (defaultForm) {
            defaultForm.setError(section, field, error);
        }
    }

    /**
     * Validates a given form and return the error details
     * @param formName
     * @returns
     */
    validateForm(formName: string): IErrorDetails {
        const defaultForm = this.metaformMap.get(formName);
        if (defaultForm) {
            return defaultForm.validate();
        } else {
            return { hasErrors: false, errors: [] };
        }
    }

    /**
     * @ignore
     * @param name
     * @param metaform
     */
    add(name: string, metaform: MetaForm) {
        this.metaformMap.set(name, metaform);
    }

    /**
     * Cleanup
     * @param name
     */
    destroy(name: string) {
        if (this.metaformMap && this.metaformMap.get(name)) {
            this.metaformMap.delete(name);
        }
    }
}

export default MetaFormUpdater;
