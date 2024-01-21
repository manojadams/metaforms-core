import React, { Fragment } from "react";
import { IField, IMeta } from "../../constants/model-interfaces";
import FormContext from "../form-context";
import { EVENTS, FORM_ACTION } from "../../constants/constants";
import { IEventPayload } from "../../constants/common-interface";

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
        this.sync = this.sync.bind(this);
    }

    componentDidMount() {
        this.setState({
            activeIndex: this.context?.page?.pageNumber ? this.context.page.pageNumber - 1 : 1
        });
        this.context.listener(EVENTS.SWITCH, (payload: { payload: string; callback?: () => void }) => {
            switch (payload.payload) {
                case FORM_ACTION.NEXT:
                    this.setActiveIndex(this.state.activeIndex + 1);
                    break;
                case FORM_ACTION.PREVIOUS:
                    if (this.state.activeIndex > 0) {
                        this.setActiveIndex(this.state.activeIndex - 1);
                    }
                    break;
            }
        });
        this.context.listener(EVENTS.VALIDATION_ERROR, (payload: IEventPayload) => {
            this.setState({
                error: {
                    hasError: true,
                    section: payload
                }
            });
        });
        this.context.listener(EVENTS._END_OF_PAGE, (data: IEventPayload) => {
            this.context.setEndOfPage(data.payload as number);
        });

        this.context.listener(EVENTS._RESET_END_OF_PAGE, () => {
            this.context.resetEndOfPage();
        });
    }

    componentWillUnmount() {
        this.context.removeListener(EVENTS.SWITCH);
        this.context.removeListener(EVENTS.VALIDATION_ERROR);
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

    sync() {
        this.setState({ ...this.state });
    }
}
