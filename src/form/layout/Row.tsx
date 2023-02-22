import React, { Fragment, ReactNode } from "react";
import { Row as MRow } from "layout-emotions";

export default function Row(props: { isStandalone: boolean | undefined; align?: string; children: ReactNode }) {
    const rowClassName = props.align ? "justify-content-" + props.align : "";
    if (props.isStandalone) {
        return <MRow className={rowClassName}>{props.children}</MRow>;
    } else {
        return <Fragment>{props.children}</Fragment>;
    }
}
