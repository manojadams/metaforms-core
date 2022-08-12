import React, { Fragment, useContext } from "react";
import FormContext from "./form-context";

const Button = (props: IProps) => {
    const formContext = useContext(FormContext);
    return (
        <Fragment>

        </Fragment>
    )
}

interface IProps {
    children: string | undefined;
    className: string | undefined;
    onClick: (e: any) => any;
}

export default Button;