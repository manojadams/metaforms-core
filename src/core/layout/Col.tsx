import React from 'react';

export default function Col({type, children}:{type: string, children: any}) {
    return (<div className={"col-md-"+type}>{children}</div>)
}
