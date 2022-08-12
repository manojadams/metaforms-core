import React, { Fragment, MouseEventHandler, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { IElementTypes } from '../../constants/common-interface';
import { IField, IMeta } from '../../constants/model-interfaces';
import FormUtils from '../../utils/FormUtil';
import FormContext from '../form-context';
import Button
 from '../Button';
export default function (props: IProps) {
    const context = useContext(FormContext);
    const page = context.getPage();
    const [showPage, setShowPage] = useState({
        submit: page.showSave(),
        previous: page.showPrev(),
        next: page.showNext()
    });
    useEffect(() => {
        context.listener('page_change', () => {
            setShowPage({
                submit: page.showSave(),
                next: page.showNext(),
                previous: page.showPrev()
            });
        });
        return () => {
            context.removeListener('page_change');
        }
    }, []);
    const handleClick = (e: SyntheticEvent, button: IField) => {
        e.preventDefault();
        const callback = () => {
            if (button?.meta.events?.click) {
                const type = button.meta.events.click.type;
                switch (type) {
                    case 'emit-event':
                        const eventName = button.meta.events.click.value || '';
                        context.emit(eventName, '');
                        break;
                }
            }
        }
        switch (button?.meta?.type) {
            case 'submit':
                props.onSubmit(e, button, callback);
                break;
            case 'reset':
                props.onReset(e, button, callback);
                break;
            case 'previous':
                props.onPrevious(e, button, callback);
                break;
            case 'next':
                props.onNext(e, button, callback);
                break;
        }
    }
    return (
        <div className="row footer">
            {
                props.formButtons && props.formButtons.map(button => {
                    const className = FormUtils.getCssClassName(button.meta?.displayProps);
                    const subprops = { className, button, theme: props.theme, form: props.form, handleClick }
                    switch (button.meta.type) {
                        case 'next':
                            return (
                                showPage.next ? props.buttons && props.buttons.next
                                    ? <ExtButton key={button.name} className={button.meta.className || ''} onClick={(e) => handleClick(e, button)}>{props.buttons.next}</ExtButton>
                                    : <FormButton {...subprops} key={button.name} /> : ''
                            )
                        case 'previous':
                            return (
                                showPage.previous ? props.buttons && props.buttons.previous
                                    ? <ExtButton key={button.name} className={button.meta.className || ''} onClick={(e) => handleClick(e, button)}>{props.buttons.previous}</ExtButton>
                                    : <FormButton {...subprops} key={button.name} /> : ''
                            )
                        case 'submit':
                            return (
                                showPage.submit ? props.buttons && props.buttons.submit
                                    ? <ExtButton key={button.name} className={button.meta.className || ''} onClick={(e) => handleClick(e, button)}>{props.buttons.submit}</ExtButton>
                                    : <FormButton {...subprops} key={button.name} /> : ''
                            )
                        default: 
                            return (
                                props.buttons && props.buttons[button.name]
                                ? <ExtButton className={button.meta.className || ''} onClick={(e) => handleClick(e, button)}>{props.buttons[button.name]}</ExtButton>
                                : <FormButton {...subprops} key={button.name} />
                            )
                    }
                })
            }
        </div>
    )
}

function FormButton({ button, theme, form, className, handleClick }:
    { button: IField, theme: string, form: any, className: string, handleClick: Function }) {

    const btnClassName = button?.meta?.className;
    const colClassName = className ? className : 'col';
    switch (theme) {
        case 'mui':
            return (
                <div className={colClassName}>
                    <Button className={btnClassName}
                        onClick={(e) => handleClick(e, button)}
                    >{button.meta.displayName}</Button>
                </div>
            )
        case 'bootstrap':
        default:
            return (
                <div className={colClassName}>
                    <button className={"btn btn-default " + btnClassName}
                        onClick={(e) => handleClick(e, button)}
                    >{button.meta.displayName}</button>
                </div>
            )
    }
}

function ExtButton({ className, children, onClick }: { className: string, children: JSX.Element, onClick: MouseEventHandler<any> }) {
    return (
        <span onClick={(e) => {
            if (e.currentTarget === e.target) {
                // ignore click on self
                e.stopPropagation();
                e.preventDefault();
            } else {
                onClick(e);
            }
        }} className={className}>
            {children}
        </span>
    )
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
}