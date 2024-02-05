export const MSGS = {
    ERROR_MSG: {
        REQUIRED: "Is a required field",
        PATTERN: "Pattern is invalid",
        MIN: "Is not a valid value",
        MIN_TEXT: "Minimum length is {CHARS} chars.",
        MAX: "Out of range",
        MAX_TEXT: "Maximum length is {CHARS} chars.",
        DATE_INVALID: "Date is not valid",
        EMAIL_INVALID: "Email is not valid"
    }
};

export const EMAIL_PATTERN = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$";

export const FORM_CONSTANTS = {
    DEPENDENCY_KEY: "dependencies"
};

export const DEFAULT_DATE_FORMAT = "dd/MM/yyyy";

export const NEXT_RESPONSE_MODE = {
    PAGE_DATA: "page-data",
    FORM_DATA: "form-data"
};

export const CHANGE_MODE = {
    FORM_DATA: "form-data",
    SECTION_DATA: "section-data"
};

export const FIELD_DISPLAY_TYPES = {
    TEXT: "text",
    SELECT: "select"
};

// to be deprecated
export const DEP_TYPE_OLD = {
    EXISTS: "exists",
    ENABLED: "enabled",
    EQUALS: "equals",
    LOAD: "load",
    LOAD_OPTIONS: "load_options",
    CHANGE: "change",
    VALIDATION: "validation",
    PROP_UPDATE: "prop_update",
    PATTERN_MATCH_URL_LOADER: "pattern_match_url_loader"
};

export const DEP_TYPE = {
    EXISTS: "exists",
    ENABLED: "enabled",
    EQUALS: "equals",
    LOAD: "load",
    LOAD_OPTIONS: "loadOptions",
    CHANGE: "change",
    VALIDATION: "validation",
    PROP_UPDATE: "propUpdate",
    PATTERN_MATCH_URL_LOADER: "patternMatchUrlLoader"
};

// to be deprecated
export const CHANGE_TYPE_OLD = {
    URL_LOADER: "url_loader",
    SETTER: "setter",
    PROP_SETTER: "prop_setter",
    EVENT_EMITTER: "event_emitter",
    SETTER_CONDITION: "setter_condition"
};

export const CHANGE_TYPE = {
    URL_LOADER: "urlLoader",
    SETTER: "setter",
    PROP_SETTER: "propSetter",
    EVENT_EMITTER: "eventEmitter",
    SETTER_CONDITION: "setterCondition"
};

export const URL_TYPE = {
    REMOTE: "remote"
};

export const _INTERNAL_VALUES = {
    INPUT: "$input",
    INITIAL: "$initial",
    VALUE_FN: "$valueFn",
    NOT_EMPTY: "$notempty",
    CONDITION: "$condition"
};

export const BUTTON_TYPE = {
    NEXT: "next",
    PREVIOUS: "previous",
    SUBMIT: "submit"
};

/**
 * Events with $ in prefix is meant to be used for internal purpose only
 */
export const EVENTS = {
    SUBMIT: "submit",
    SWITCH: "switch",
    VALIDATION_ERROR: "validation_error",
    PAGE_CHANGE: "page_change",
    _FIELD_CHANGE: "$field_change",
    _FIELD_CLOSE: "$field_close",
    _ENABLE_CURRENT_TAB: "$enable-current-tab",
    _END_OF_PAGE: "$end_of_page",
    _RESET_END_OF_PAGE: "$reset_end_of_page"
};

export const DEFAULT = "default";

export const SECTION_LAYOUT = {
    DEFAULT: "default",
    TABS: "tabs",
    WIZARD: "wizard",
    STEPPER: "stepper"
};

export const FIELD_LAYOUT = {
    DEFAULT: "column",
    ROW: "row",
    COLUMN: "column"
};

export const FORM_ACTION = {
    NEXT: "next",
    PREVIOUS: "previous",
    SUBMIT: "submit",
    DEFAULT: "default",
    CUSTOM: "custom",
    RESET: "reset"
};

export const DATA_LOADER = {
    URL: "url",
    URL_LOADDER: "url_loader",
    OPTIONS_LOADER: "options_loader"
};

export const API_METHOD = {
    GET: "get",
    POST: "post",
    PUT: "put"
};
