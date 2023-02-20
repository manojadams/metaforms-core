import React, { Fragment, ReactNode } from "react";

export default function Row(props: {
    isStandalone: boolean | undefined;
    align?: string;
    children: ReactNode;
}): JSX.Element {
    const rowClassName = props.align ? "row justify-content-" + props.align : "row";
    if (props.isStandalone) {
        return <div className={rowClassName}>{props.children}</div>;
    } else {
        return <Fragment>props.children</Fragment>;
    }
}
