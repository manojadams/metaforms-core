import React, { Fragment } from "react";
import { IEventPayload, ISectionError } from "../../constants/common-interface";
import { EVENTS } from "../../constants/constants";
import { IField, IMeta, ISchema } from "../../constants/model-interfaces";
import FormContext from "../form-context";

export default abstract class BaseFormGroup extends React.Component<ISchema> {
    static contextType = FormContext;
    context!: React.ContextType<typeof FormContext>;
    state: IState;
    tabFields: Array<IField>;
    sectionFields: Array<{
        name: string;
        fields: Array<IField> | undefined;
        meta: IMeta;
    }>;

    constructor(props: ISchema) {
        super(props);
        this.tabFields = props.fields.map((field: IField) => ({
            name: field.name,
            meta: field.meta
        }));
        this.sectionFields = props.fields.map((section: IField) => ({
            fields: section.fields,
            name: section.name,
            meta: section.meta
        }));
        this.state = {
            activeIndex: 0,
            error: { hasError: false, section: "" },
            tabFields: this.tabFields
        };
    }

    componentDidMount() {
        this.setState({
            activeIndex: this.context?.page?.pageNumber ? this.context.page.pageNumber - 1 : 1
        });
        this.context.listener(EVENTS.SWITCH, (payload: { payload: string; callback?: Function }) => {
            switch (payload.payload) {
                case "next":
                    this.setActiveIndex(this.state.activeIndex + 1, payload.callback);
                    break;
                case "previous":
                    this.setActiveIndex(this.state.activeIndex - 1, payload.callback);
                    break;
            }
        });
        this.context.listener(EVENTS.VALIDATION_ERROR, (payload: { payload: string; callback: Function }) => {
            this.setState({
                error: {
                    hasError: true,
                    section: payload.payload
                }
            });
        });
        this.context.listener(EVENTS._ENABLE_CURRENT_TAB, () => {
            const tabField: IField | undefined = this.state.tabFields.find(
                (f: IField, index: number) => index === this.state.activeIndex
            );
            if (tabField) {
                tabField.meta.isDisabled = undefined;
                this.setState({
                    tabFields: [...this.state.tabFields]
                });
            }
        });
        this.context.listener(EVENTS._END_OF_PAGE, (payload: IEventPayload) => {
            this.context.setEndOfPage(payload?.value);
            // also disable tabs after end of page
            this.state.tabFields.forEach((tab, index) => {
                if (payload.value && index >= payload.value) {
                    tab.meta.isDisabled = true;
                }
            });
            this.setState({
                tabFields: [...this.state.tabFields]
            });
        });

        this.context.listener(EVENTS._RESET_END_OF_PAGE, () => {
            this.context.resetEndOfPage();
        });
    }

    componentWillUnmount() {
        this.context.removeListener(EVENTS.SWITCH);
        this.context.removeListener(EVENTS.VALIDATION_ERROR);
        this.context.removeListener(EVENTS._ENABLE_CURRENT_TAB);
        this.context.removeListener(EVENTS._END_OF_PAGE);
        this.context.removeListener(EVENTS._RESET_END_OF_PAGE);
    }

    render() {
        return (
            <Fragment>
                {this.tabs()}
                {this.panels()}
            </Fragment>
        );
    }

    setActiveIndex(index: number, callback?: Function) {
        this.setState({ activeIndex: index }, () => {
            this.context.updatePage(this.state.activeIndex + 1);
            if (callback) {
                callback();
            }
        });
    }

    abstract tabs(): JSX.Element;
    abstract panels(): JSX.Element;
}

interface IState {
    error: ISectionError;
    activeIndex: number;
    tabFields: Array<IField>;
}
