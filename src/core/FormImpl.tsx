import BaseFormControl from "../form/form-controls/BaseFormControl";
import BaseFormGroup from "../form/form-group/BaseFormGroup";
import BaseFormStepper from "../form/form-stepper/BaseFormStepper";
import BaseFormWizard from "../form/form-wizard/BaseFormWizard";

export default class FormImpls {
    IBaseFormControl = BaseFormControl;
    IBaseFormGroup = BaseFormGroup;
    IBaseFormStepper = BaseFormStepper;
    IBaseFormWizard = BaseFormWizard;

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
