import React, { Fragment } from 'react';
import FormFieldRenderer from "../form-field-renderer";
import BaseFormWizard from "./base-form-wizard";

export default class BSFormWizard extends BaseFormWizard {
    componentDidMount() {
        this.context.listener('switch',(payload: {payload:string,callback?: Function}) => {
            switch (payload.payload) {
                case 'next':
                    this.setActiveIndex(this.state.activeIndex+1);
                    break;
                case 'previous':
                    this.setActiveIndex(this.state.activeIndex-1);
                    break;
            }
        });
        this.context.listener('validation_error',(payload: {payload:string,callback: Function}) => {
            this.setState({error: {
                hasError: true,
                section: payload.payload
            }});
        });
    }
    componentWillUnmount() {
        this.context.removeListener('switch');
        this.context.removeListener('validation_error');
    }
    screens(): JSX.Element {
        const field = this.fields.find((_f,i)=>i===this.state.activeIndex);
        const fn = () => false;
        const form = this.context.form[field?.name?field.name:'default'];
        return (
            <Fragment>
                {field && <FormFieldRenderer {...field} key={field.name} section={field.name} sync={fn} form={form}/>}
                {this.footer()}
            </Fragment>
        )
    }

    footer() {
        // if (this.state.activeIndex<this.fields.length-1) {
        //     return (
        //         <div className="row text-center">
        //             <div className="col-12 col-md-2">
        //                 <button className="btn btn-default d-block w-100 mt-4" onClick={this.next.bind(this)}>Next</button>
        //             </div>
        //         </div>
        //     )
        // }
        return (<Fragment></Fragment>)
    }

    next(e: any) {
        if (this.state.activeIndex<this.fields.length-1) {
            this.setActiveIndex(this.state.activeIndex+1);
        }
        e.preventDefault();
    }
}