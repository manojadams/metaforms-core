import React, { Fragment } from 'react';
import FormFieldRenderer from "../form-field-renderer";
import BaseFormWizard from "../form-wizard/base-form-wizard";
import { IField } from '../../constants/model-interfaces';
import { IEventPayload } from '../../constants/common-interface';

export default abstract class BaseFormStepper extends BaseFormWizard {
    componentDidMount() {
        this.setState({activeIndex: this.context?.page?.pageNumber ? this.context.page.pageNumber - 1 : 1});
        this.context.listener('switch',(payload: {payload:string,callback?: Function}) => {
            switch (payload.payload) {
                case 'next':
                    this.setActiveIndex(this.state.activeIndex+1);
                    break;
                case 'previous':
                    if (this.state.activeIndex > 0) {
                        this.setActiveIndex(this.state.activeIndex-1);
                    }
                    break;
            }
        });
        this.context.listener('validation_error',(payload: {payload:string,callback: Function}) => {
            this.setState({error: {
                hasError: true,
                section: payload.payload
            }});
        });
        this.context.listener('$enable-current-tab', () => {
            const tabField: IField | undefined = this.state.tabFields.find((f: IField, index:number) => index === this.state.activeIndex);
            if (tabField) {
                tabField.meta.isDisabled = undefined;
                this.setState({
                    tabFields: [...this.state.tabFields]
                });
            }
        });
        this.context.listener('$end_of_page', (payload: IEventPayload) => {
            this.context.setEndOfPage(payload?.value);
        });

        this.context.listener('$reset_end_of_page', () => {
            this.context.resetEndOfPage();
        });
    }
    componentWillUnmount() {
        this.context.removeListener('switch');
        this.context.removeListener('validation_error');
    }
    render() {
        return (
            <Fragment>
            {this.steps()}
            {this.screens()}
            </Fragment>
        )
    }
    abstract steps(): JSX.Element;

    screens(): JSX.Element {
        const field = this.fields.find((_f,i)=>i===this.state.activeIndex);
        const form = this.context.form[field?.name?field.name:'default'];
        const sync = () => false;
        return (
            <Fragment>
                {field && <FormFieldRenderer
                    {...field}
                    key={field.name}
                    section={field.name} 
                    form={form} 
                    sync={sync}/>}
                {this.footer()}
            </Fragment>
        )
    }

    footer() {
        // if (this.state.activeIndex<this.fields.length-1) {
        //     return (
        //         <div className="row text-center">
        //             <div className="col-12 col-md-2">
        //              <button className="btn btn-default d-block w-100 mt-4" onClick={this.next.bind(this)}>Next</button>
        //             </div>
        //         </div>
        //     )
        // }
        return (<Fragment></Fragment>)
    }

    next(e: React.SyntheticEvent) {
        if (this.state.activeIndex<this.fields.length-1) {
            this.setActiveIndex(this.state.activeIndex+1);
        }
        e.preventDefault();
    }

}