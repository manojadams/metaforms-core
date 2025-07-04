import React, { Fragment, useContext, useEffect, useState } from "react";
import { IElementTypes, IForm } from "../../../constants/common-interface";
import { BUTTON_TYPE, EVENTS, FORM_ACTION } from "../../../constants/constants";
import { IField } from "../../../constants/model-interfaces";
import { Row } from "layout-emotions";
import FormUtils from "../../../utils/FormUtil";
import FormContext from "../../form-context";
import styled from "@emotion/styled";
import ExtButton from "./Button/ExtButton";
import FormButton from "./Button/FormButton";
import FooterButton from "./Button/FooterButton";

interface IProps {
    buttons?: IElementTypes;
    formButtons: Array<IField>;
    form: IForm;
    useDefaultButtons: boolean;
    onSubmit: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onReset: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onPrevious: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onNext: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onCustom: (event: React.MouseEvent, field: IField, callback: () => void) => void;
}

function Footer(props: IProps) {
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
        <FooterStyled className="footer" data-pagenumber={page.pageNumber} useDefault={props.useDefaultButtons}>
            {props.formButtons.map((button: IField, idx: number) => {
                const subprops = {
                    button,
                    form: props.form,
                    handleClick
                };
                switch (button.meta.type) {
                    case BUTTON_TYPE.NEXT:
                        return showPage.next ? (
                            <FooterButton
                                key={button.name + idx}
                                button={button}
                                className={"next-btn"}
                                handleClick={handleClick}
                            >
                                {props?.buttons?.next ?? <Fragment />}
                            </FooterButton>
                        ) : (
                            <Fragment />
                        );
                    case BUTTON_TYPE.PREVIOUS:
                        return showPage.previous ? (
                            <FooterButton
                                key={button.name + idx}
                                button={button}
                                className={"previous-btn"}
                                handleClick={handleClick}
                            >
                                {props?.buttons?.previous ?? <Fragment />}
                            </FooterButton>
                        ) : (
                            ""
                        );
                    case BUTTON_TYPE.SUBMIT:
                        return showPage.submit ? (
                            <FooterButton
                                key={button.name + idx}
                                button={button}
                                className={"submit-btn"}
                                handleClick={handleClick}
                            >
                                {props?.buttons?.submit ?? <Fragment />}
                            </FooterButton>
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
                                        className={button.meta.className ?? "mcol mcol-md-4 submit-btn"}
                                        key={button.name + idx}
                                        type={button.meta.type}
                                        onClick={(e) => handleClick(e, button)}
                                    >
                                        {props.buttons[button.name]}
                                    </ExtButton>
                                ) : (
                                    <FormButton {...subprops} key={button.name + idx} />
                                );
                            }
                        }
                        return <Fragment key={button.name + idx} />;
                }
            })}
        </FooterStyled>
    );
}

const FooterStyled = styled(Row)<{ useDefault: boolean }>`
    gap: 1.5rem;
    margin-top: 1.5rem;
    justify-content: flex-end;
    ${(props) =>
        props.useDefault
            ? `
        display: flex;
        align-items: center;
        > * {
          width: auto;  
        }
    `
            : ""}
`;

export default Footer;
