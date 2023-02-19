import React from "react";
import BaseFormGroup from "./BaseFormGroup";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Sections from "./common/Sections";
import { Box } from "@mui/material";
import FormUtils from "../../utils/FormUtil";
import { IField } from "../../constants/model-interfaces";

export default class MuiFormGroup extends BaseFormGroup {
    tabs(): JSX.Element {
        const tabVariant: any = FormUtils.getThemeProp(
            "mui",
            this.context.theme,
            "variant"
        );
        // const disableRipple = FormUtils.getThemeProp('mui',this.context.theme,'disableRipple');
        return (
            <Box
                data-pagenumber={this.state.activeIndex + 1}
                sx={{
                    maxWidth: { xs: 320, sm: "unset", md: "unset" },
                    overflowX: "auto",
                    borderBottom: 1,
                    borderColor: "divider"
                }}
            >
                <Tabs
                    variant={tabVariant}
                    allowScrollButtonsMobile
                    value={this.state.activeIndex}
                    onChange={this.handleChange.bind(this)}
                    aria-label='tabs'
                >
                    {this.state.tabFields.map(
                        (tabField: IField, index: number) => {
                            const displayName = tabField?.meta?.displayName
                                ? tabField.meta.displayName
                                : tabField.name;
                            const isDisabled = tabField?.meta?.isDisabled
                                ? true
                                : undefined;
                            return (
                                <Tab
                                    key={displayName}
                                    label={displayName}
                                    disabled={isDisabled}
                                />
                            );
                        }
                    )}
                </Tabs>
            </Box>
        );
    }

    panels(): JSX.Element {
        return (
            <Sections
                sections={this.sectionFields}
                activeIndex={this.state.activeIndex}
                error={this.state.error}
            />
        );
    }

    handleChange(arg: any, index: number) {
        this.setActiveIndex(index);
    }
}
