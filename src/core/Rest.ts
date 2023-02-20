import { IConfig, IRest } from "../constants/model-interfaces";

export class Rest implements IRest {
    config: IConfig;
    baseurl: string;

    constructor(rest?: IRest) {
        this.config = rest?.config ? rest.config : {};
        const apihost = this.config?.apihost || "";
        const basepath = this.config?.basepath || "";
        this.baseurl = apihost + basepath;
    }

    get(url: string, params?: Array<Array<any>>, isRemote?: boolean) {
        const finalUrl = isRemote ? url : this.baseurl + url;
        return fetch(finalUrl).then((res) => res.json());
    }

    post() {
        throw new Error("Not implemented");
    }

    put() {
        throw new Error("Not implemented");
    }

    delete() {
        throw new Error("Not implemented");
    }
}
