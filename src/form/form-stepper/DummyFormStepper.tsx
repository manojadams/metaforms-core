import BaseFormStepper from "./BaseFormStepper";

class DummyFormStepper extends BaseFormStepper {
    steps(): JSX.Element {
        throw new Error("Method not implemented.");
    }
}

export default DummyFormStepper;
