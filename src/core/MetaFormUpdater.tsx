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
