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
