import React, { ReactElement } from "react";
import ExtButton from "./ExtButton";
import FormButton from "./FormButton";
import { IField } from "../../../../constants/model-interfaces";

interface IProps {
    button: IField;
    children?: ReactElement;
    className?: string;
    handleClick: (arg1: React.MouseEvent, arg2: IField) => void;
}

function FooterButton(props: IProps) {
    if (props.children) {
        return (
            <ExtButton
                key={props.button.name}
                className={`${props.button.meta.className ?? ""} ${props.className ?? ""}`}
                type={props.button.meta.type}
                onClick={(e) => props.handleClick(e, props.button)}
            >
                {props.children}
            </ExtButton>
        );
    } else {
        return <FormButton className={props.className ?? ""} button={props.button} handleClick={props.handleClick} />;
    }
}

export default FooterButton;
