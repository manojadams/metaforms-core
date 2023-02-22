import React, { Fragment } from "react";
import { IEventPayload, ISectionError } from "../../constants/common-interface";
import { EVENTS } from "../../constants/constants";
import { IField, IMeta, ISchema } from "../../constants/model-interfaces";
import { TCallback } from "../../constants/types";
import FormContext from "../form-context";

interface IState {
    error: ISectionError;
    activeIndex: number;
    tabFields: Array<IField>;
}

/**
 * Displays a grouped form (Form with many sections like tabs)
 * * @category To be implemented
 */
export default abstract class BaseFormGroup extends React.Component<ISchema> {
    static contextType = FormContext;
    declare context: React.ContextType<typeof FormContext>;
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
        this.context.listener(EVENTS.SWITCH, (payload: { payload: string; callback?: TCallback }) => {
            switch (payload.payload) {
                case "next":
                    this.setActiveIndex(this.state.activeIndex + 1, payload.callback);
                    break;
                case "previous":
                    this.setActiveIndex(this.state.activeIndex - 1, payload.callback);
                    break;
            }
        });
        this.context.listener(EVENTS.VALIDATION_ERROR, (payload: { payload: string; callback: TCallback }) => {
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
        this.context.listener(EVENTS._END_OF_PAGE, (data: IEventPayload) => {
            this.context.setEndOfPage(data?.payload as number);
            // also disable tabs after end of page
            this.state.tabFields.forEach((tab, index) => {
                if (data.payload && index >= data.payload) {
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

    setActiveIndex(index: number, callback?: TCallback) {
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
