export type TValue = string | number | boolean | undefined;

export type TOperator = "===" | ">=" | "<=";

export type TNextCondition = "&&" | "||";

export type TiconPositionType = "start" | "end";

export type TCallback = () => void;

export type ISetError = (hasError: boolean, errorMsg: string) => void;

export type TNextResponseMode = "form-data" | "page-data";
