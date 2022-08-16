import BaseFormStepper from "./base-form-stepper";

class DummyFormStepper extends BaseFormStepper {
    steps(): JSX.Element {
        throw new Error("Method not implemented.");
    }
}

export default DummyFormStepper;