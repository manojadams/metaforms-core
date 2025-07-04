import React, { ReactElement, useMemo } from "react";
import ExtButton from "./ExtButton";
import FormButton from "./FormButton";
import { IField } from "../../../../constants/model-interfaces";
import FormUtils from "../../../../utils/FormUtil";

interface IProps {
    button: IField;
    className?: string;
    children?: ReactElement;
    handleClick: (arg1: React.MouseEvent, arg2: IField) => void;
}

function FooterButton(props: IProps) {
    const className = useMemo(() => FormUtils.getCssClassName(props.button.meta?.displayProps), [props.button]);
    if (props.children) {
        return (
            <ExtButton
                key={props.button.name}
                className={`${props.button.meta.className ?? ""} ${className ?? ""} ${props.className}`}
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
