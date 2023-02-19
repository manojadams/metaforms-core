import MetaFormUpdater from "./core/MetaFormUpdater";

export interface IMetaAPI {
    metaForm: MetaFormUpdater;
}

export const metaAPI: IMetaAPI = {
    metaForm: new MetaFormUpdater("default", null)
};
