import React, { Fragment } from 'react';
import { IError } from './constants/common-interface';
import css from './styles.module.css';
export default class SchemaErrorBoundary extends React.Component<IProps> {
    state: {error: IError};
    constructor(props: IProps) {
        super(props);
        this.state = {
            error: props.error
        }
    }    

    componentDidCatch(error: any, errorInfo: any) {
        console.error(error);
        this.setState({error:{hasError:true, errorMsg: errorInfo}})
    }

    render() {
        if (this.state.error.hasError) {
            return (
                <Fragment>
                    <div className={css.wrapper}>
                        <h1 className={css.header}>Schema errors</h1>
                        <p className={css.detail}>{this.state.error.errorMsg}</p>
                    </div>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    {this.props.children}
                </Fragment>
                );
        }
    }
}

interface IProps {
    error: IError;
}