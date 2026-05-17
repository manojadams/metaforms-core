import React from "react";
import type FormImpls from "../core/FormImpl";

// Use null as default - MetaformRenderer always provides a value via Provider
// This avoids circular dependency at module load time
const FormImplsContext = React.createContext<FormImpls | null>(null);

export default FormImplsContext;
