import React, { Fragment } from "react";
import FormFieldRenderer from "../FormFieldRenderer";
import BaseFormWizard from "../form-wizard/BaseFormWizard";
import { IField } from "../../constants/model-interfaces";
import { IEventPayload, IFormField } from "../../constants/common-interface";
import { EVENTS } from "../../constants/constants";

/**
 * Displays a grouped form with many steps
 * * @category To be implemented
 */
abstract class BaseFormStepper extends BaseFormWizard {
    componentDidMount() {
        this.setState({
            activeIndex: this.context?.page?.pageNumber ? this.context.page.pageNumber - 1 : 1
        });
        this.context.listener(EVENTS.SWITCH, (payload: { payload: string; callback?: () => void }) => {
            switch (payload.payload) {
                case "next":
                    this.setActiveIndex(this.state.activeIndex + 1);
                    break;
                case "previous":
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
        return (
            <Fragment>
                {this.steps()}
                {this.screens()}
            </Fragment>
        );
    }

    abstract steps(): JSX.Element;

    screens(): JSX.Element {
        const field = this.fields.find((_f, i) => i === this.state.activeIndex);
        const formField = this.context.form[field?.name ?? "default"] as IFormField;
        const sync = () => false;
        return (
            <Fragment>
                {field && (
                    <FormFieldRenderer {...field} key={field.name} section={field.name} form={formField} sync={sync} />
                )}
                {this.footer()}
            </Fragment>
        );
    }

    footer() {
        return <Fragment />;
    }

    next(e: React.SyntheticEvent) {
        if (this.state.activeIndex < this.fields.length - 1) {
            this.setActiveIndex(this.state.activeIndex + 1);
        }
        e.preventDefault();
    }
}

export default BaseFormStepper;
