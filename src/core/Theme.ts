import { ITheme, IThemeConfig } from "./../constants/model-interfaces";

export default class Theme {
    type: string;
    sectionLayout?: string | undefined;
    config?: IThemeConfig;
    constructor(theme: ITheme) {
        this.type = theme.type;
        this.sectionLayout = theme.sectionLayout;
        this.config = theme.config;
    }
}
