import DummyFormGroup from "../form/form-group/DummyFormGroup";
import DummyFormControl from "../form/form-controls/DummyFormControl";
import DummyFormStepper from "../form/form-stepper/DummyFormStepper";
import BaseFormControl from "../form/form-controls/BaseFormControl";
import BaseFormGroup from "../form/form-group/BaseFormGroup";
import BaseFormStepper from "../form/form-stepper/BaseFormStepper";
import BaseFormWizard from "../form/form-wizard/BaseFormWizard";

export default class FormImpls {
    IBaseFormControl = BaseFormControl;
    IBaseFormGroup = BaseFormGroup;
    IBaseFormStepper = BaseFormStepper;
    IBaseFormWizard = BaseFormWizard;

    constructor() {
        this.IBaseFormControl = DummyFormControl;
        this.IBaseFormGroup = DummyFormGroup;
        this.IBaseFormStepper = DummyFormStepper;
        this.IBaseFormWizard = DummyFormStepper;
    }

    /** Set form controls */
    setFormControl(baseFormControl: typeof BaseFormControl) {
        this.IBaseFormControl = baseFormControl;
    }

    setFormGroup(baseFormGroup: typeof BaseFormGroup) {
        this.IBaseFormGroup = baseFormGroup;
    }

    setFormStepper(baseFormStepper: typeof BaseFormStepper) {
        this.IBaseFormStepper = baseFormStepper;
    }

    setFormWizard(baseFormWizard: typeof BaseFormWizard) {
        this.IBaseFormWizard = baseFormWizard;
    }
}
