import DummyFormGroup from "../form/form-group/DummyFormGroup";
import DummyFormControl from "../form/form-controls/DummyFormControl";
import DummyFormStepper from "../form/form-stepper/DummyFormStepper";

export default class FormImpls {
    IBaseFormControl = DummyFormControl;
    IBaseFormGroup = DummyFormGroup;
    IBaseFormStepper = DummyFormStepper;

    /** Set form controls */
    setFormControl(baseFormControl: any) {
        this.IBaseFormControl = baseFormControl;
    }

    setFormGroup(baseFormGroup: any) {
        this.IBaseFormGroup = baseFormGroup;
    }

    setFormStepper(baseFormStepper: any) {
        this.IBaseFormStepper = baseFormStepper;
    }
}
