import { IFormElementConfig } from "../constants/adapter-interface";

export const getFormConfig = (formConfig: any) => {
    const _formConfig: Record<string, unknown> = {};
    if (formConfig) {
        Object.keys(formConfig).forEach((key) => {
            _formConfig[`data-${key}`] = formConfig[key];
        });
    }

    return _formConfig;
};

export const getFormClassNames = (
    variants: Record<string, Record<string, string>>,
    adapterConfig?: Record<string, string>
) => {
    const formClassnames: any = {};
    if (variants && adapterConfig) {
        Object.keys(variants).forEach((variant) => {
            if (adapterConfig[variant]) {
                Object.keys(variants[variant]).forEach((variantOption) => {
                    const variantOptionValue = variants[variant][variantOption];
                    formClassnames[variantOptionValue] = adapterConfig[variant] === variantOption;
                });
            }
        });
    }

    return formClassnames;
};
