import { SECTION_LAYOUT } from "../constants/constants";
import MetaForm from "./MetaForm";

class MetaFormUpdater {
    private metaformMap: Map<string, MetaForm | null> = new Map();
    constructor(name: string, metaform: MetaForm | null) {
        this.metaformMap.set(name, metaform);
    }

    updateField(section: string, field: string, value: any) {
        const defaultForm = this.metaformMap.get(SECTION_LAYOUT.DEFAULT);
        if (defaultForm) {
            defaultForm.updateField(section, field, value);
        }
    }

    updateFormField(formName: string, section: string, field: string, value: any) {
        const defaultForm = this.metaformMap.get(formName);
        if (defaultForm) {
            defaultForm.updateField(section, field, value);
        }
    }

    add(name: string, metaform: MetaForm) {
        this.metaformMap.set(name, metaform);
    }
}

export default MetaFormUpdater;
