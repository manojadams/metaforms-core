import { SECTION_LAYOUT } from "./constants/constants";
import MetaFormUpdater from "./core/MetaFormUpdater";

export interface IMetaAPI {
    metaForm: MetaFormUpdater;
}

export const metaAPI: IMetaAPI = {
    metaForm: new MetaFormUpdater(SECTION_LAYOUT.DEFAULT, null)
};
