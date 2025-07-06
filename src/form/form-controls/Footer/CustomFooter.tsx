import React, { Fragment, useContext, useEffect, useMemo, useState } from "react";
import FormContext from "../../form-context";
import { IField } from "../../../constants/model-interfaces";
import { BUTTON_TYPE, EVENTS, FORM_ACTION } from "../../../constants/constants";
import FooterButton from "./Button/FooterButton";
import { IElementTypes } from "../../../constants/common-interface";

interface IProps {
    buttons?: IElementTypes;
    formButtons: Array<IField>;
    onSubmit: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onReset: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onPrevious: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onNext: (event: React.MouseEvent, field: IField, callback: () => void) => void;
    onCustom: (event: React.MouseEvent, field: IField, callback: () => void) => void;
}

const CustomFooter = (props: IProps) => {
    const context = useContext(FormContext);
    const page = context.getPage();
    const FooterComponent = context.getFooter();

    const buttons = useMemo(() => {
        return {
            previous: props.formButtons.find((btn) => btn.meta.type === BUTTON_TYPE.PREVIOUS),
            next: props.formButtons.find((btn) => btn.meta.type === BUTTON_TYPE.NEXT),
            submit: props.formButtons.find((btn) => btn.meta.type === BUTTON_TYPE.SUBMIT)
        };
    }, [props.formButtons]);

    const [showPage, setShowPage] = useState({
        submit: page.showSave(),
        previous: page.showPrev(),
        next: page.showNext()
    });

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

    const nextBtn =
        showPage.next && buttons.next ? (
            <FooterButton key={buttons.next.name} button={buttons.next} className="next-btn" handleClick={handleClick}>
                {props?.buttons?.next ?? <Fragment />}
            </FooterButton>
        ) : (
            <Fragment />
        );

    const previousBtn =
        showPage.previous && buttons.previous ? (
            <FooterButton
                key={buttons.previous.name}
                button={buttons.previous}
                className="previous-btn"
                handleClick={handleClick}
            >
                {props?.buttons?.previous ?? <Fragment />}
            </FooterButton>
        ) : (
            <Fragment />
        );

    const submitBtn =
        showPage.submit && buttons.submit ? (
            <FooterButton
                key={buttons.submit?.name}
                button={buttons.submit}
                className="submit-btn"
                handleClick={handleClick}
            >
                {props?.buttons?.submit ?? <Fragment />}
            </FooterButton>
        ) : (
            <Fragment />
        );

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

    return (
        <FooterComponent
            page={page.pageNumber}
            isGrouped={page.isGrouped}
            nextBtn={nextBtn}
            previousBtn={previousBtn}
            submitBtn={submitBtn}
        />
    );
};

export default CustomFooter;
