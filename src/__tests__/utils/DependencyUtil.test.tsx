import { IForm, IFormField, IDepdendencyItem } from "../../constants/common-interface";
import { DEP_TYPE, FORM_CONSTANTS } from "../../constants/constants";
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

        describe("with VALUE type (NEW)", () => {
            it("should set VALUE dependency with valueKey", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    valueKey: "customKey",
                    type: DEP_TYPE.VALUE
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.VALUE, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.VALUE,
                    field: "fieldB",
                    value: undefined,
                    valueKey: "customKey",
                    valueFn: undefined
                });
            });

            it("should set VALUE dependency with valueFn", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    valueFn: "customFunction",
                    type: DEP_TYPE.VALUE
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.VALUE, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0]).toEqual({
                    section: "default",
                    type: DEP_TYPE.VALUE,
                    field: "fieldB",
                    value: undefined,
                    valueKey: undefined,
                    valueFn: "customFunction"
                });
            });

            it("should set VALUE dependency with both valueKey and valueFn", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    valueKey: "id",
                    valueFn: "computeValue",
                    type: DEP_TYPE.VALUE
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.VALUE, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies).toHaveLength(1);
                expect(dependencies[0].valueKey).toBe("id");
                expect(dependencies[0].valueFn).toBe("computeValue");
            });

            it("should set VALUE dependency with value property", () => {
                const form = createMockForm();
                const dependency: IDepdendencyItem = {
                    ref: "fieldA",
                    section: "default",
                    value: "defaultValue",
                    valueKey: "customKey",
                    type: DEP_TYPE.VALUE
                };

                DependencyUtil.setDependency(form, dependency, "default", DEP_TYPE.VALUE, "fieldB");

                const dependencies = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
                expect(dependencies[0].value).toBe("defaultValue");
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

    describe("getConditionalDependencies", () => {
        it("should extract field references from simple condition", () => {
            const condition = [{ ref: "fieldX" }, "===", "value1"];

            const refs = DependencyUtil.getConditionalDependencies([condition as any]);

            expect(refs).toEqual(["fieldX"]);
        });

        it("should extract field references from condition with both operands", () => {
            const condition = [{ ref: "fieldX" }, "===", { ref: "fieldY" }];

            const refs = DependencyUtil.getConditionalDependencies([condition as any]);

            expect(refs).toEqual(["fieldX", "fieldY"]);
        });

        it("should handle multiple conditions", () => {
            const conditions = [
                [{ ref: "fieldA" }, "===", "value1"],
                [{ ref: "fieldB" }, ">=", { ref: "fieldC" }],
                [{ ref: "fieldD" }, "<=", "value2"]
            ];

            const refs = DependencyUtil.getConditionalDependencies(conditions as any);

            expect(refs).toContain("fieldA");
            expect(refs).toContain("fieldB");
            expect(refs).toContain("fieldC");
            expect(refs).toContain("fieldD");
            expect(refs.length).toBe(4);
        });

        it("should handle conditions without ref operands", () => {
            const condition = ["value1", "===", "value2"];

            const refs = DependencyUtil.getConditionalDependencies([condition as any]);

            expect(refs).toEqual([]);
        });

        it("should handle null right operands", () => {
            const condition = [{ ref: "fieldX" }, "===", null];

            const refs = DependencyUtil.getConditionalDependencies([condition as any]);

            expect(refs).toEqual(["fieldX"]);
        });

        it("should ignore non-object right operands without ref", () => {
            const condition = [{ ref: "fieldX" }, "===", { name: "test" }];

            const refs = DependencyUtil.getConditionalDependencies([condition as any]);

            expect(refs).toEqual(["fieldX"]);
        });
    });

    describe("setDependencies", () => {
        it("should set multiple dependencies of array type", () => {
            const form = createMockForm();
            const dependencies = {
                enabled: [
                    {
                        ref: "fieldA",
                        section: "default",
                        value: "true"
                    }
                ],
                equals: [
                    {
                        ref: "fieldB",
                        section: "default",
                        value: "test",
                        currentValue: "current_test"
                    }
                ]
            };

            DependencyUtil.setDependencies(form, "default", "fieldC", dependencies as any);

            const depsA = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
            const depsB = form.default.fieldB[FORM_CONSTANTS.DEPENDENCY_KEY];

            expect(depsA).toHaveLength(1);
            expect(depsA[0].type).toBe(DEP_TYPE.ENABLED);
            expect(depsB).toHaveLength(1);
            expect(depsB[0].type).toBe(DEP_TYPE.EQUALS);
        });

        it("should set single dependencies of non-array type", () => {
            const form = createMockForm();
            const dependencies = {
                enabled: {
                    ref: "fieldA",
                    section: "default",
                    value: "true"
                }
            };

            DependencyUtil.setDependencies(form, "default", "fieldB", dependencies as any);

            const deps = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
            expect(deps).toHaveLength(1);
            expect(deps[0].type).toBe(DEP_TYPE.ENABLED);
        });

        it("should handle mixed array and non-array dependencies", () => {
            const form = createMockForm();
            const dependencies = {
                enabled: [
                    {
                        ref: "fieldA",
                        section: "default",
                        value: "true"
                    }
                ],
                equals: {
                    ref: "fieldB",
                    section: "default",
                    value: "test",
                    currentValue: "current_test"
                }
            };

            DependencyUtil.setDependencies(form, "default", "fieldC", dependencies as any);

            const depsA = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
            const depsB = form.default.fieldB[FORM_CONSTANTS.DEPENDENCY_KEY];

            expect(depsA).toHaveLength(1);
            expect(depsB).toHaveLength(1);
        });

        it("should handle null dependencies", () => {
            const form = createMockForm();
            expect(() => {
                DependencyUtil.setDependencies(form, "default", "fieldA", null as any);
            }).not.toThrow();
        });

        it("should handle undefined dependencies", () => {
            const form = createMockForm();
            expect(() => {
                DependencyUtil.setDependencies(form, "default", "fieldA", undefined as any);
            }).not.toThrow();
        });
    });

    describe("assignDependency", () => {
        it("should assign dependency to field without existing dependencies", () => {
            const form = createMockForm();
            delete form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];

            const properties = {
                type: DEP_TYPE.ENABLED,
                field: "fieldB",
                value: "true"
            };

            DependencyUtil.assignDependency(form, "default", "fieldA", properties);

            const deps = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
            expect(deps).toBeDefined();
            expect(deps).toHaveLength(1);
            expect(deps[0]).toEqual(properties);
        });

        it("should append dependency to existing dependency array", () => {
            const form = createMockForm();
            form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY] = [
                { type: DEP_TYPE.ENABLED, field: "fieldB", value: "true" }
            ];

            const properties = {
                type: DEP_TYPE.EQUALS,
                field: "fieldC",
                value: "test"
            };

            DependencyUtil.assignDependency(form, "default", "fieldA", properties);

            const deps = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
            expect(deps).toHaveLength(2);
            expect(deps[1]).toEqual(properties);
        });

        it("should handle multiple assignments to same field", () => {
            const form = createMockForm();

            const prop1 = { type: DEP_TYPE.ENABLED, field: "fieldB" };
            const prop2 = { type: DEP_TYPE.EQUALS, field: "fieldC" };
            const prop3 = { type: DEP_TYPE.VALUE, field: "fieldD" };

            DependencyUtil.assignDependency(form, "default", "fieldA", prop1);
            DependencyUtil.assignDependency(form, "default", "fieldA", prop2);
            DependencyUtil.assignDependency(form, "default", "fieldA", prop3);

            const deps = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
            expect(deps).toHaveLength(3);
        });

        it("should work across different form sections", () => {
            const form: IForm = {
                default: {
                    fieldA: createMockFormField(),
                    fieldB: createMockFormField()
                },
                section1: {
                    fieldX: createMockFormField(),
                    fieldY: createMockFormField()
                }
            };

            const properties = {
                type: DEP_TYPE.ENABLED,
                field: "fieldB"
            };

            DependencyUtil.assignDependency(form, "default", "fieldA", properties);
            DependencyUtil.assignDependency(form, "section1", "fieldX", properties);

            const depsDefault = form.default.fieldA[FORM_CONSTANTS.DEPENDENCY_KEY];
            const depsSection1 = form.section1.fieldX[FORM_CONSTANTS.DEPENDENCY_KEY];

            expect(depsDefault).toHaveLength(1);
            expect(depsSection1).toHaveLength(1);
        });
    });

    describe("initDependencies", () => {
        it("should initialize dependencies for fields with meta.dependencies", () => {
            const form = createMockForm();
            const fields = [
                {
                    name: "fieldA",
                    meta: {
                        dependencies: {
                            enabled: [
                                {
                                    ref: "fieldB",
                                    section: "default",
                                    value: "true"
                                }
                            ]
                        }
                    }
                }
            ];

            DependencyUtil.initDependencies(form, "default", fields as any);

            const deps = form.default.fieldB[FORM_CONSTANTS.DEPENDENCY_KEY];
            expect(deps).toBeDefined();
            expect(deps.length).toBeGreaterThan(0);
        });

        it("should handle nested fields recursively", () => {
            const form: IForm = {
                default: {
                    parent: createMockFormField(),
                    child1: createMockFormField(),
                    child2: createMockFormField()
                }
            };

            const fields = [
                {
                    name: "parent",
                    meta: {
                        dependencies: {
                            enabled: [
                                {
                                    ref: "child1",
                                    section: "default",
                                    value: "true"
                                }
                            ]
                        }
                    },
                    fields: [
                        {
                            name: "child1",
                            meta: {
                                dependencies: {
                                    equals: [
                                        {
                                            ref: "child2",
                                            section: "default",
                                            value: "test",
                                            currentValue: "current"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ];

            DependencyUtil.initDependencies(form, "default", fields as any);

            const depsChild1 = form.default.child1[FORM_CONSTANTS.DEPENDENCY_KEY];
            const depsChild2 = form.default.child2[FORM_CONSTANTS.DEPENDENCY_KEY];

            expect(depsChild1).toBeDefined();
            expect(depsChild2).toBeDefined();
        });

        it("should skip fields without dependencies", () => {
            const form = createMockForm();
            const fields = [
                {
                    name: "fieldA",
                    meta: {}
                },
                {
                    name: "fieldB",
                    meta: {
                        dependencies: {
                            enabled: [
                                {
                                    ref: "fieldC",
                                    section: "default",
                                    value: "true"
                                }
                            ]
                        }
                    }
                }
            ];

            expect(() => {
                DependencyUtil.initDependencies(form, "default", fields as any);
            }).not.toThrow();
        });

        it("should handle empty fields array", () => {
            const form = createMockForm();
            const fields: any[] = [];

            expect(() => {
                DependencyUtil.initDependencies(form, "default", fields);
            }).not.toThrow();
        });

        it("should handle undefined fields", () => {
            const form = createMockForm();

            expect(() => {
                DependencyUtil.initDependencies(form, "default", undefined as any);
            }).not.toThrow();
        });

        it("should handle deeply nested fields", () => {
            const form: IForm = {
                default: {
                    level1: createMockFormField(),
                    level2: createMockFormField(),
                    level3: createMockFormField()
                }
            };

            const fields = [
                {
                    name: "level1",
                    meta: {},
                    fields: [
                        {
                            name: "level2",
                            meta: {
                                dependencies: {
                                    enabled: [
                                        {
                                            ref: "level3",
                                            section: "default",
                                            value: "true"
                                        }
                                    ]
                                }
                            },
                            fields: [
                                {
                                    name: "level3",
                                    meta: {}
                                }
                            ]
                        }
                    ]
                }
            ];

            DependencyUtil.initDependencies(form, "default", fields as any);

            const deps = form.default.level3[FORM_CONSTANTS.DEPENDENCY_KEY];
            expect(deps).toBeDefined();
        });
    });
});
