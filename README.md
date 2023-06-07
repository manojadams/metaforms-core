# metaform-core
This is core library engine that dynamically creates forms from json based metaforms schema.

## Change logs
Fixed stepper and wizard not working

## Introduction
This library reads the json based metaforms schema and layouts beautiful forms.
It acts as a base for creating a dynamic form library which needs to implement the core components from this library.  

## Main features
- Layouting configuration
- Support for multiple page forms
- Support for field dependencies
- Support custom components

## Core components/concepts
- Form control (BaseFormControl)
- Form group (BaseFormGroup)
- Form stepper (BaseFormStepper)

### Form control (BaseFormControl)
  This is a class containing declarations of basic form controls as well as some other advanced form controls. 
  
### Form group (BaseFormGroup)
  Contains declarations of basic form grouping controls.

### Form stepper (BasicFormStepper)
  This is another type of form grouping that contains declartions to implement stepper functionalities for your form.

## How to use
  This library contains abstract declarations and requires the user to implement his own core components.
  - BasicFormControl - for basic components
  - BasicFormGroup - for basic form grouping
  - BasicFormStepper = for stepper functionalities
  - Write your own classes (typescript) and extend the above controls.
  - To know details, check the documentation.
  
## Sample for implementing basic `email` control
````typescript
class BootstrapFormControl extends CoreFormControl {
  /**
   * Implement email
   */
  email() {
    return (
      <div className="form-group">
        <label forName="exampleInputEmail1">Email address</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
    )
  }
}
````
  
## Install

```bash
npm install --save @manojadams/metaform-core
```

## Basic usage of the library
```tsx
import CoreFormRenderer, { IFormRenderer } from "@manojadams/metaforms-core";
import React from "react";
import FormControl from "./forms/FormControl";      // your form control implementation
import FormGroup from "./forms/FormGroup";          // your form group implementation
import { FormStepper } from "./forms/FormStepper";  // your form stepper implementation

class FormRenderer extends React.Component<IFormRenderer> {

  constructor(props: IFormRenderer) {
    super(props);
  }

  render() {
    return (
      <CoreFormRenderer 
        {...this.props} 
        baseFormControl={FormControl}
        baseFormGroup={FormGroup}
        baseFormStepper={FormStepper}
      />
    )
  }
}

export default FormRenderer;
```

## License

MIT © [manojgetwealthy](https://github.com/manojgetwealthy)