import { EventEmitter } from 'eventemitter3';
import React from 'react';
import MetaForm from '../constants/MetaForm';
import Theme from '../constants/Theme';

const FormContext = React.createContext(new MetaForm({
        theme:new Theme({type: 'default', sectionLayout: 'default'}),
        fields:[], 
        buttons: []
    }, new EventEmitter()));

export default FormContext;