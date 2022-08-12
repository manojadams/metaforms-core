import React from "react";
import { ISchema } from "./constants/model-interfaces";
import FormContext from "./core/form-context";
import MetaForm from "./constants/MetaForm";
import { IError, IFormRenderer } from "./constants/common-interface";
import Form from "./core/Form";
import FormUtils from './utils/FormUtil';
import EventEmitter from "eventemitter3";
import SchemaErrorBoundary from "./schema-error";
import Theme from "./constants/Theme";

export default class FormRenderer extends React.Component<IFormRenderer> {
    schema: ISchema;
    state: IState;
    metaform: MetaForm;
    constructor(props: IFormRenderer) {
        super(props);
        this.schema = props.schema;
        try {
            this.metaform = new MetaForm(this.props.schema, new EventEmitter());
            if (props.icons) {
                this.metaform.setIcons(props.icons);
            }
            this.state = {
                validated: false,
                error: {hasError: false, errorMsg: ''}
            }
            if (props.pageNumber) {
                this.metaform.updatePage(props.pageNumber);
            }
            if (props.lastPageNumber) {
                this.metaform.setEndOfPage(props.lastPageNumber);
            }
            if (props.fns) {
                this.metaform.setFns(props.fns);
            }
            if (props.onError) {
                this.metaform.setErrorHandler(props.onError);
            }
        } catch (e) {
            this.metaform = new MetaForm({
                theme:new Theme({type:'default', sectionLayout: 'default'}),
                fields:[], 
                buttons: []
            }, new EventEmitter())
            this.state = {
                error: {hasError: true, errorMsg: e?.message},
                validated: false
            };
            console.error(e);
        }
    }
    componentDidMount() {
        this.metaform.listener('submit', (...params:any) => {
            if (this.props.onSubmit) {
                this.props.onSubmit(FormUtils.updateFormData(this.metaform.form, {},
                    this.props.formatter||{}), params)
            }
        });
    }
    componentWillUnmount() {
        this.metaform.removeListener('submit');
    }
    render() {
        let outerClassname = this.props?.className ? this.props.className 
            : this.props.schema?.theme?.className ? this.props.schema.theme.className : '';
        const rootClassname = `container ${outerClassname}` 
        return (
            <SchemaErrorBoundary error={this.state.error}>
                <FormContext.Provider value={this.metaform}>
                    <div className={rootClassname}>
                        <Form 
                            schema={this.props.schema} 
                            validated={this.state.validated} 
                            validate={this.validate.bind(this)}
                            form={this.metaform.form}    
                            theme={this.metaform.theme}
                            onPrevious={(...params: any) => {
                                if (this.props.onPrevious) {
                                    this.props.onPrevious(FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter||{}), params);
                                }
                            }}
                            onNext={(...params: any) => {
                                if (this.props.onNext) {
                                    this.props.onNext(FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter||{}), params);
                                }
                            }}
                            onSubmit={(...params: any) => {
                                if (this.props.onSubmit) {
                                    this.props.onSubmit(FormUtils.updateFormData(this.metaform.form, {}, this.props.formatter||{}), params)}
                                }
                            }
                            emit={(eventType: string, payload: any) => {
                                this.metaform.emit(eventType, payload);
                            }}
                            buttons={this.props.buttons}
                            formValidated={(validated) => {
                                this.setState({validated});
                            }}
                        />
                    </div>
                </FormContext.Provider>
            </SchemaErrorBoundary>
            )
    }

    validate(e: React.SyntheticEvent, type: string): boolean {
        e.preventDefault();
        switch (type) {
            case 'next':
                return this.metaform.validate();
            case 'submit':
                return this.metaform.validate();
        }
        this.setState({validated:true});
        return true;
    }
}

interface IState {
    validated: boolean;
    error: IError;
}