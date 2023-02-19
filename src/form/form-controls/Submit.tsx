import React, { Fragment, MouseEventHandler, SyntheticEvent, useContext, useEffect, useState } from "react";
import { IElementTypes } from "../../constants/common-interface";
import { BUTTON_TYPE } from "../../constants/constants";
import { IField } from "../../constants/model-interfaces";
import FormUtils from "../../utils/FormUtil";
import FormContext from "../form-context";

export default function (props: IProps) {
    const context = useContext(FormContext);
    const page = context.getPage();
    const [showPage, setShowPage] = useState({
        submit: page.showSave(),
        previous: page.showPrev(),
        next: page.showNext()
    });
    useEffect(() => {
        context.listener("page_change", () => {
            setShowPage({
                submit: page.showSave(),
                next: page.showNext(),
                previous: page.showPrev()
            });
        });
        return () => {
            context.removeListener("page_change");
        };
    }, []);
    const handleClick = (e: SyntheticEvent, button: IField) => {
        e.preventDefault();
        const callback = () => {
            if (button?.meta.events?.click) {
                const type = button.meta.events.click.type;
                switch (type) {
                    case "emit-event":
                        {
                            const eventName = button.meta.events.click.value || "";
                            context.emit(eventName, "");
                        }
                        break;
                }
            }
        };
        switch (button?.meta?.type) {
            case "submit":
                props.onSubmit(e, button, callback);
                break;
            case "reset":
                props.onReset(e, button, callback);
                break;
            case "previous":
                props.onPrevious(e, button, callback);
                break;
            case "next":
                props.onNext(e, button, callback);
                break;
            default:
                props.onCustom(e, button, callback);
        }
    };
    return (
        <div className="row footer" data-pagenumber={page.pageNumber}>
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
        </div>
    );
}

function FormButton({
    button,
    theme,
    form,
    className,
    handleClick
}: {
    button: IField;
    theme: string;
    form: any;
    className: string;
    handleClick: Function;
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

function ExtButton({
    className,
    children,
    type,
    onClick
}: {
    className: string;
    children: JSX.Element;
    type?: string;
    onClick: MouseEventHandler<any>;
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

interface IProps {
    buttons?: IElementTypes;
    formButtons?: Array<IField>;
    form: any;
    theme: string;
    onSubmit: Function;
    onReset: Function;
    onPrevious: Function;
    onNext: Function;
    onCustom: Function;
}
