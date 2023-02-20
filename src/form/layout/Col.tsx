import React from "react";

export default function Col({ type, children }: { type: string; children: React.ReactNode }) {
    return <div className={"col-md-" + type}>{children}</div>;
}
