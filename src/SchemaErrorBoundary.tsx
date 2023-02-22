import React, { Fragment, ReactNode } from "react";
import { IError } from "./constants/common-interface";

interface IProps {
    children: ReactNode;
    error: IError;
}

export default class SchemaErrorBoundary extends React.Component<IProps> {
    state: { error: IError };
    constructor(props: IProps) {
        super(props);
        this.state = {
            error: props.error
        };
    }

    componentDidCatch(error: Error, errorInfo: object) {
        console.error(error);
        this.setState({ error: { hasError: true, errorMsg: errorInfo } });
    }

    render() {
        if (this.state.error.hasError) {
            return (
                <div className="wrapper-schema-error">
                    <h1 className="header">Schema errors</h1>
                    <p className="details">{this.state.error.errorMsg}</p>
                </div>
            );
        } else {
            return <Fragment>{this.props.children}</Fragment>;
        }
    }
}
