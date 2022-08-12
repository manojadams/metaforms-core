import { IConfig, IRest } from "./model-interfaces";

export const MSGS = {
    ERROR_MSG: {
        'REQUIRED': 'Is a required field',
        'PATTERN': 'Pattern is invalid',
        'MIN': 'Is not a valid value',
        'MAX': 'Out of range',
        'DATE_INVALID': 'Date is not valid',
        'EMAIL_INVALID': 'Email is not valid'
    }
}

export const EMAIL_PATTERN = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";

export const FORM_CONSTANTS = {
    DEPENDENCY_KEY:'dependencies'
} 

export class Page {
    pageNumber: number;
    isGrouped: boolean;
    totalPages: number;
    constructor(isGrouped: boolean, private pages: number) {
        this.isGrouped = isGrouped;
        this.pageNumber = 1;
        this.totalPages = pages;
    }
    update(pageNumber: number) {
        if (pageNumber <= this.totalPages) {
            this.pageNumber = pageNumber;
        } else {
            this.pageNumber = this.totalPages;
        }
    }

    setEndOfPage(pageNumber: number) {
        if (pageNumber !== undefined && pageNumber < this.totalPages) {
            this.totalPages = pageNumber;
        }
    }

    resetEndOfPage() {
        this.totalPages = this.pages;
    }

    showPrev() {
        return this.isGrouped && this.pageNumber !== 1;
    }

    showNext() {
        return  this.isGrouped && this.pageNumber < this.totalPages;
    }

    showSave() {
        if (this.isGrouped) {
            return this.pageNumber >= this.totalPages;
        } else {
            return true;
        }
    }
}

export class Rest implements IRest{
    config: IConfig;
    baseurl: string;
    constructor(rest?: IRest) {
        this.config = rest?.config ? rest.config : {};
        const apihost = this.config?.apihost || '';
        const basepath = this.config?.basepath || '';
        this.baseurl = apihost + basepath;
    }
    get(url: string, params?: Array<Array<any>>) {
        return fetch(this.baseurl + url).then(res => res.json());
    }
    post() {
        // tp do
    }
    put() {
        // to do 
    }
    delete() {
        // to do
    }
}