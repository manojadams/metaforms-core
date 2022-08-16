import DummyFormControl from "../core/form-controls/DummyFormControl";
import DummyFormGroup from "../core/form-group/DummyFormGroup";
import DummyFormStepper from "../core/form-stepper/DummyFormStepper";

export default class FormImpls {
    IBaseFormControl = DummyFormControl;
    IBaseFormGroup =  DummyFormGroup;
    IBaseFormStepper = DummyFormStepper;

    constructor() {}

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