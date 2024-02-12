import React, { Fragment } from "react";
import FormFieldRenderer from "../FormFieldRenderer";
import BaseFormWizard from "../form-wizard/BaseFormWizard";
import { Row } from "layout-emotions";
import { DEFAULT } from "../../constants/constants";

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
        if (this.state.activeIndex < 0) return <Fragment />;
        const section = this.fields.find((_f, i) => i === this.state.activeIndex);
        const fields = section?.fields || [];
        const form = this.context.form[section?.name ?? DEFAULT];
        return (
            <Row
                className="section"
                gapX={this.context.formConfig.config?.gapX}
                gapY={this.context.formConfig.config?.gapY}
            >
                {fields.map((field) => (
                    <FormFieldRenderer
                        {...field}
                        key={section?.name + field.name}
                        section={section?.name ?? ""}
                        form={form[field.name]}
                        sync={this.sync}
                    />
                ))}
            </Row>
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
