import React from "react";
import { IField } from "../../../../constants/model-interfaces";

function FormButton({
    button,
    className,
    handleClick
}: {
    button: IField;
    className: string;
    handleClick: (e: React.MouseEvent, button: IField) => void;
}) {
    const btnClassName = button?.meta?.className;
    const colClassName = className ?? "mcol";
    return (
        <div className={colClassName}>
            <button
                className={"btn btn-default " + btnClassName}
                data-btn-type={button.meta.type}
                onClick={(e) => handleClick(e, button)}
            >
                {button.meta.displayName}
            </button>
        </div>
    );
}

export default FormButton;
