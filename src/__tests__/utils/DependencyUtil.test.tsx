import { IForm, IFormField } from "../../constants/common-interface";
import { DEP_TYPE, FORM_CONSTANTS } from "../../constants/constants";
import { IDepdendencyItem } from "../../constants/model-interfaces";
import DependencyUtil from "../../utils/DependencyUtil";

const createMockFormField = (value?: unknown): IFormField => ({
    display: true,
    displayType: "text",
    error: { hasError: false, errorMsg: "" },
    value,
    [FORM_CONSTANTS.DEPENDENCY_KEY]: []
});

const createMockForm = (): IForm => ({
    default: {
        fieldA: createMockFormField(),
        fieldB: createMockFormField(),
        fieldC: createMockFormField()
    }
});

describe("DependencyUtil", () => {
    describe("setDependency", () => {
        describe("with ENABLED type", () => {
            it("should set ENABLED dependency without resetValue", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "true",
                    type: DEP_TYPE.ENABLED
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.ENABLED, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.ENABLED,
                    field: "fieldB",
                    value: "true",
                    valueFn: undefined,
                    resetValue: undefined
                });
            });

            it("should set ENABLED dependency with resetValue", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "true",
                    type: DEP_TYPE.ENABLED,
                    resetValue: "default_value"
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.ENABLED, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.ENABLED,
                    field: "fieldB",
                    value: "true",
                    valueFn: undefined,
                    resetValue: "default_value"
                });
            });

            it("should set ENABLED dependency with valueFn", () => {
                const form = createMockForm();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const valueFn = (val: any) => val === "test";
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    valueFn,
                    type: DEP_TYPE.ENABLED
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.ENABLED, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.ENABLED,
                    field: "fieldB",
                    value: undefined,
                    valueFn,
                    resetValue: undefined
                });
            });

            it("should set ENABLED dependency with both value and resetValue", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "enabled",
                    type: DEP_TYPE.ENABLED,
                    resetValue: "reset_to_this"
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.ENABLED, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0].resetValue).toBe("reset_to_this");
                expect(dependencies[0].value).toBe("enabled");
            });
        });

        describe("with EQUALS type", () => {
            it("should set EQUALS dependency without resetValue", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "test",
                    currentValue: "current_test",
                    type: DEP_TYPE.EQUALS
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.EQUALS, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.EQUALS,
                    field: "fieldB",
                    value: "test",
                    currentValue: "current_test",
                    resetValue: undefined
                });
            });

            it("should set EQUALS dependency with resetValue", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "test",
                    currentValue: "current_test",
                    type: DEP_TYPE.EQUALS,
                    resetValue: "reset_value"
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.EQUALS, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.EQUALS,
                    field: "fieldB",
                    value: "test",
                    currentValue: "current_test",
                    resetValue: "reset_value"
                });
            });
        });

        describe("with LOAD_OPTIONS type", () => {
            it("should set LOAD_OPTIONS dependency with valueMap", () => {
                const form = createMockForm();
                const valueMap = {
                    option1: [{ id: "1", name: "Option 1" }],
                    option2: [{ id: "2", name: "Option 2" }]
                };
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    type: DEP_TYPE.LOAD_OPTIONS,
                    valueMap
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.LOAD_OPTIONS, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.LOAD_OPTIONS,
                    field: "fieldB",
                    valueMap
                });
            });
        });

        describe("refactored fieldRef and fieldDependency handling", () => {
            it("should initialize dependency array if not exists", () => {
                const form = createMockForm();
                delete form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];

                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "test",
                    type: DEP_TYPE.ENABLED
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.ENABLED, "fieldB");

                expect(form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY]).toBeDefined();
                expect(Array.isArray(form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY])).toBe(true);
            });

            it("should handle multiple dependencies for the same field", () => {
                const form = createMockForm();

                const dep1: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "value1",
                    type: DEP_TYPE.ENABLED
                };

                const dep2: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "value2",
                    type: DEP_TYPE.EQUALS,
                    currentValue: "test"
                };

                DependencyUtil.setDependency(form, dep1, "default", DEP_TYPE.ENABLED, "fieldB");
                DependencyUtil.setDependency(form, dep2, "default", DEP_TYPE.EQUALS, "fieldC");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(2);
                expect(dependencies[0].type).toBe(DEP_TYPE.ENABLED);
                expect(dependencies[1].type).toBe(DEP_TYPE.EQUALS);
            });

            it("should handle existing dependency arrays properly", () => {
                const form = createMockForm();
                // Ensure dependency array exists
                form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY] = [];

                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "test",
                    type: DEP_TYPE.ENABLED
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.ENABLED, "fieldB");

                // Verify dependency was added to existing array
                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0].type).toBe(DEP_TYPE.ENABLED);
            });
        });

        describe("with different dependency types", () => {
            it("should set CHANGE dependency with valueMap and changeType", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "trigger_value",
                    type: "change",
                    valueMap: { trigger_value: "new_value" }
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.CHANGE, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.CHANGE,
                    field: "fieldB",
                    value: "trigger_value",
                    valueMap: { trigger_value: "new_value" },
                    changeType: "change"
                });
            });

            it("should set VALIDATION dependency", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "validation_trigger",
                    type: DEP_TYPE.VALIDATION,
                    valueMap: { trigger: "valid" }
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.VALIDATION, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0].type).toBe(DEP_TYPE.VALIDATION);
            });

            it("should set PROP_UPDATE dependency with propName and propValue", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "trigger",
                    type: DEP_TYPE.PROP_UPDATE,
                    propName: "placeholder",
                    propValue: "Enter text",
                    valueMap: { trigger: "placeholder_value" }
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.PROP_UPDATE, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.PROP_UPDATE,
                    field: "fieldB",
                    value: "trigger",
                    valueMap: { trigger: "placeholder_value" },
                    propName: "placeholder",
                    propValue: "Enter text"
                });
            });
        });
    });

    describe("getDependencies", () => {
        it("should retrieve dependencies for a field", () => {
            const form = createMockForm();
            const dependency: IDepdendencyItem = {
                ref: "fieldA",
                section: "default",
                value: "test",
                type: DEP_TYPE.ENABLED
            };

            DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.ENABLED, "fieldB");
            const deps = DependencyUtil.getDependencies(form, "default", "fieldA");

            expect(deps).toBeDefined();
            expect(Array.isArray(deps)).toBe(true);
            expect(deps).toHaveLength(1);
        });
    });
});
