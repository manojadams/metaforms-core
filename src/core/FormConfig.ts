import { IFormConfig, IFormConfigExtended } from "../constants/model-interfaces";
import { TFormType, TSectionLayout } from "../constants/types";

export default class FormConfig implements IFormConfig {
    type: TFormType;
    sectionLayout?: TSectionLayout;
    fieldLayout?: string;
    config?: IFormConfigExtended;
    constructor(type: TFormType, sectionLayout?: TSectionLayout, fieldLayout?: string, config?: IFormConfigExtended) {
        this.type = type;
        this.sectionLayout = sectionLayout;
        this.fieldLayout = fieldLayout;
        this.config = config;
    }
}
