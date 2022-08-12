import React from 'react';
import { IMeta, ISchema } from '../../constants/model-interfaces';
import BaseFormGroup from "./base-form-group";
import Sections from "./common/Sections";

export default class BSFormGroup extends BaseFormGroup {
    constructor(props: ISchema) {
        super(props);
    }
    
    tabs(): JSX.Element {
        return (<Tabs tabs={this.tabFields} activeIndex={this.state.activeIndex} setActiveIndex={this.setActiveIndex.bind(this)}/>)
    }

    panels(): JSX.Element {
        return (<Sections sections={this.sectionFields} activeIndex={this.state.activeIndex} error={this.state.error}/>)
    }
    
}

function Tabs(props:{tabs: Array<{name: string, meta: IMeta}>, activeIndex: number, setActiveIndex:Function}) {
    const tabs = props.tabs;
    return (
        <ul className="nav nav-tabs" id="myTab" role="tablist">
            {
                tabs.map((tab,index)=> <Tab key={tab.name} {...tab} setActive={()=>props.setActiveIndex(index)} isActive={props.activeIndex === index}/>)
            }
        </ul>
    )
}

function Tab(props:{name: string, meta: IMeta, setActive: React.MouseEventHandler<HTMLAnchorElement>, isActive: boolean}) {
    const displayName = props?.meta?.displayName?props.meta.displayName:props.name;
    return (<li className="nav-item">
        <a className={props.isActive?'nav-link active':'nav-link'} id="contact-tab" data-toggle="tab" 
            href={'#'+props.name} role="tab" aria-controls="contact" aria-selected="false" onClick={props.setActive}>{displayName}</a>
    </li>)
}