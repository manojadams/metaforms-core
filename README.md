# metaform-core
This is a simple react library core for rendering json forms.

## Install

```bash
npm install --save @manojadams/metaform-core
```

## Basic usage
```tsx
import CoreFormRenderer, { IFormRenderer } from "@manojadams/metaforms-core";
import React from "react";
import FormControl from "./forms/FormControl";
import FormGroup from "./forms/FormGroup";
import { FormStepper } from "./forms/FormStepper";

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