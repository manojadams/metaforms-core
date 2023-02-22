import { SECTION_LAYOUT } from "./constants/constants";
import MetaFormUpdater from "./core/MetaFormUpdater";

export interface IMetaAPI {
    metaForm: MetaFormUpdater;
}

/**
 * API to update form data manually (indirectly from outside of forms)
 * @category API
 */
export const metaAPI: IMetaAPI = {
    metaForm: new MetaFormUpdater(SECTION_LAYOUT.DEFAULT, null)
};
