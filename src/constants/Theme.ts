import { IBootstrapTheme, IField, IMUITheme, ITheme } from "./model-interfaces";

export default class Theme {
    type: string;
    sectionLayout?: string | undefined;
    mui?: IMUITheme;
    bootstrap?: IBootstrapTheme;
    constructor(theme: ITheme) {
        this.type = theme.type;
        this.sectionLayout = theme.sectionLayout;
        this.mui = theme.mui;
        this.bootstrap = theme.bootstrap
    }
}