import BaseFormGroup from "./BaseFormGroup";

class DummyFormGroup extends BaseFormGroup {
    tabs(): JSX.Element {
        throw new Error("Method not implemented.");
    }

    panels(): JSX.Element {
        throw new Error("Method not implemented.");
    }
}

export default DummyFormGroup;
