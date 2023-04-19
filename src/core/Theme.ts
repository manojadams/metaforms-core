import { ITheme, IThemeConfig } from "./../constants/model-interfaces";

export default class Theme {
    type: string;
    sectionLayout?: string;
    fieldLayout?: string;
    config?: IThemeConfig;
    constructor(theme: ITheme) {
        this.fieldLayout = theme.fieldLayout;
        this.type = theme.type;
        this.sectionLayout = theme.sectionLayout;
        this.config = theme.config;
    }
}
