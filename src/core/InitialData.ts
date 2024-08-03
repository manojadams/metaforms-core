import { IFormData } from "../constants/common-interface";
import { IField } from "../constants/model-interfaces";

/**
 * Used for initial form data
 */
class InitialData {
    data: IFormData;

    constructor(data: IFormData) {
        this.data = data;
    }

    get(field: IField) {
        try {
            if (field.prop) {
                const nestedProps = field.prop.split("#");
                if (nestedProps.length > 1) {
                    const [firstProp, ...restProps] = nestedProps;
                    return this.getNestedProp(this.data[firstProp] as IFormData, field.name, restProps);
                } else {
                    return this.data[field.prop][field.name];
                }
            } else {
                return this.data[field.name];
            }
        } catch (e) {
            console.error("wrong initial data format", e);
        }

        return undefined;
    }

    getNestedProp(data: IFormData, fieldName: string, props: Array<string>) {
        const [firstProp, ...restProps] = props;
        if (props.length > 1) {
            this.getNestedProp(data[firstProp] as IFormData, fieldName, restProps);
        } else {
            return data[firstProp][fieldName];
        }
    }
}

export default InitialData;
