import React, { Fragment } from "react";
import { IField, IMeta } from "../../constants/model-interfaces";
import FormContext from "../form-context";

interface IState {
    activeIndex: number;
    tabFields: Array<IField>;
}

export default abstract class BaseFormWizard extends React.Component<{
    theme: string;
    fields: Array<IField>;
}> {
    static contextType = FormContext;
    declare context: React.ContextType<typeof FormContext>;
    state: IState;
    theme: string;
    fields: Array<{
        name: string;
        fields: Array<IField> | undefined;
        meta: IMeta;
    }>;

    constructor(props: { fields: Array<IField>; theme: string }) {
        super(props);
        this.theme = props.theme;
        this.fields = props.fields.map((section) => ({
            fields: section.fields,
            name: section.name,
            meta: section.meta
        }));
        this.state = {
            activeIndex: 0,
            tabFields: []
        };
    }

    render() {
        return <Fragment>{this.screens()}</Fragment>;
    }

    scrollToTop() {
        try {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (e) {
            console.error(e);
        }
    }

    setActiveIndex(index: number) {
        this.setState({ activeIndex: index }, () => {
            this.context.updatePage(this.state.activeIndex + 1);
            this.scrollToTop();
        });
    }

    abstract screens(): JSX.Element;
}
