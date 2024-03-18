# metaform-core
A framework for building react form libraries. Create your react form components and use this framework for adding form behavior using JSON-based schema.

## Change logs
- [fix #54: add support for post api](https://github.com/manojadams/metaforms-core/issues/54)

## Introduction
This library reads the JSON-based schema and lays out beautiful forms.
It acts as a base for creating a dynamic form library.

## Main features
- Layouting configuration
- Support for multiple-page forms
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
  This is another type of form grouping that contains declarations to implement stepper functionalities for your form.

## How to use
  This library contains abstract declarations and requires the user to implement his own core components.
  - BasicFormControl - for basic components
  - BasicFormGroup - for basic form grouping
  - BasicFormStepper = for stepper functionalities
  - Write your classes (typescript) and extend the above controls.
  - To know details, check the documentation.
  
## Implement an `email` control
````typescript
class MyFormControl extends CoreFormControl {
  /**
   * Implement email
   */
  email() {
    return (
      <div className="form-group">
        <label forName="exampleInputEmail1">Email address</label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          onChange={this.handleChange}
        >
      </div>
    )
  }
}
````

## Implement a `phone` control
````typescript
class MyFormControl extends CoreFormControl {
  /**
   * Implement phone
   */
  phone() {
    return (
      <div className="form-group">
        <label forName="phone">Your Phone</label>
        <input
          type="tel"
          className="form-control"
          id="phone" aria-describedby="phoneHelp"
          placeholder="Enter your phone"
          onChange={this.handleChange}
        >
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
import MetaformRenderer from "@manojadams/metaforms-core";
import React from "react";
import FormControl from "./forms/FormControl";      // your form control implementation
import FormGroup from "./forms/FormGroup";          // your form group implementation
import { FormStepper } from "./forms/FormStepper";  // your form stepper implementation

class FormRenderer extends React.Component {

  constructor(props: IFormRenderer) {
    super(props);
  }

  render() {
    return (
      <MetaformRenderer 
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

MIT © [manojadams](https://github.com/manojadams)
