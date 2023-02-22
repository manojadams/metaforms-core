import React, { Fragment, useContext, useEffect, useState } from "react";
import { IElementTypes, IForm } from "../../constants/common-interface";
import { BUTTON_TYPE, EVENTS, FORM_ACTION } from "../../constants/constants";
import { IField } from "../../constants/model-interfaces";
import { Row as MRow } from "layout-emotions";
import FormUtils from "../../utils/FormUtil";
import FormContext from "../form-context";

interface IProps {
    buttons?: IElementTypes;
    formButtons?: Array<IField>;
    form: IForm;
    theme: string;
    onSubmit: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onReset: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onPrevious: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onNext: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onCustom: (event: React.MouseEvent, field: IField, callback: () => void) => void;
}

export default function (props: IProps) {
    const context = useContext(FormContext);
    const page = context.getPage();
    const [showPage, setShowPage] = useState({
        submit: page.showSave(),
        previous: page.showPrev(),
        next: page.showNext()
    });
    useEffect(() => {
        context.listener(EVENTS.PAGE_CHANGE, () => {
            setShowPage({
                submit: page.showSave(),
                next: page.showNext(),
                previous: page.showPrev()
            });
        });
        return () => {
            context.removeListener(EVENTS.PAGE_CHANGE);
        };
    }, []);
    const handleClick = (e: React.MouseEvent, button: IField) => {
        e.preventDefault();
        const callback = () => {
            if (button?.meta.events?.click) {
                const type = button.meta.events.click.type;
                switch (type) {
                    case "emit-event":
                        {
                            const eventName = button.meta.events.click.value || "";
                            context.emit(eventName);
                        }
                        break;
                }
            }
        };
        switch (button?.meta?.type) {
            case FORM_ACTION.SUBMIT:
                props.onSubmit(e, button, callback);
                break;
            case FORM_ACTION.RESET:
                props.onReset(e, button, callback);
                break;
            case FORM_ACTION.PREVIOUS:
                props.onPrevious(e, button, callback);
                break;
            case FORM_ACTION.NEXT:
                props.onNext(e, button, callback);
                break;
            default:
                props.onCustom(e, button, callback);
        }
    };
    return (
        <MRow className="footer" data-pagenumber={page.pageNumber}>
            {props.formButtons &&
                props.formButtons.map((button, idx) => {
                    const className = FormUtils.getCssClassName(button.meta?.displayProps);
                    const subprops = {
                        className,
                        button,
                        theme: props.theme,
                        form: props.form,
                        handleClick
                    };
                    switch (button.meta.type) {
                        case BUTTON_TYPE.NEXT:
                            return showPage.next ? (
                                props.buttons && props.buttons.next ? (
                                    <ExtButton
                                        key={button.name}
                                        className={button.meta.className || ""}
                                        type={button.meta.type}
                                        onClick={(e) => handleClick(e, button)}
                                    >
                                        {props.buttons.next}
                                    </ExtButton>
                                ) : (
                                    <FormButton {...subprops} key={button.name} />
                                )
                            ) : (
                                ""
                            );
                        case BUTTON_TYPE.PREVIOUS:
                            return showPage.previous ? (
                                props.buttons && props.buttons.previous ? (
                                    <ExtButton
                                        key={button.name}
                                        className={button.meta.className || ""}
                                        type={button.meta.type}
                                        onClick={(e) => handleClick(e, button)}
                                    >
                                        {props.buttons.previous}
                                    </ExtButton>
                                ) : (
                                    <FormButton {...subprops} key={button.name} />
                                )
                            ) : (
                                ""
                            );
                        case BUTTON_TYPE.SUBMIT:
                            return showPage.submit ? (
                                props.buttons && props.buttons.submit ? (
                                    <ExtButton
                                        key={button.name}
                                        className={button.meta.className || ""}
                                        type={button.meta.type}
                                        onClick={(e) => handleClick(e, button)}
                                    >
                                        {props.buttons.submit}
                                    </ExtButton>
                                ) : (
                                    <FormButton {...subprops} key={button.name} />
                                )
                            ) : (
                                ""
                            );
                        default:
                            {
                                const isButtonResolved = FormUtils.resolveButtonDependencies(
                                    button.meta?.dependencies,
                                    page
                                );
                                if (isButtonResolved) {
                                    return props.buttons && props.buttons[button.name] ? (
                                        <ExtButton
                                            className={button.meta.className || ""}
                                            key={button.name}
                                            type={button.meta.type}
                                            onClick={(e) => handleClick(e, button)}
                                        >
                                            {props.buttons[button.name]}
                                        </ExtButton>
                                    ) : (
                                        <FormButton {...subprops} key={button.name} />
                                    );
                                }
                            }
                            return <Fragment key={idx} />;
                    }
                })}
        </MRow>
    );
}

function FormButton({
    button,
    theme,
    className,
    handleClick
}: {
    button: IField;
    theme: string;
    form: IForm;
    className: string;
    handleClick: (e: React.MouseEvent, button: IField) => void;
}) {
    const btnClassName = button?.meta?.className;
    const colClassName = className || "col";
    switch (theme) {
        case "mui":
            return (
                <div className={colClassName}>
                    <button
                        className={btnClassName}
                        data-btn-type={button.meta.type}
                        onClick={(e) => handleClick(e, button)}
                    >
                        {button.meta.displayName}
                    </button>
                </div>
            );
        case "bootstrap":
        default:
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
}

/**
 * Represents an external button
 * @param param
 * @returns
 */

function ExtButton({
    className,
    children,
    type,
    onClick
}: {
    className: string;
    children: JSX.Element;
    type?: string;
    onClick: (e: React.MouseEvent) => void;
}) {
    return (
        <span
            data-btn-type={type}
            onClick={(e) => {
                if (e.currentTarget === e.target) {
                    // ignore click on self
                    e.stopPropagation();
                    e.preventDefault();
                } else {
                    onClick(e);
                }
            }}
            className={className}
        >
            {children}
        </span>
    );
}
