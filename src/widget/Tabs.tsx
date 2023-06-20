import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Paper, Tabs, Tab, Stack, Box, Divider } from '@mui/material';

import { HexView } from './HexView';
import { LockDown } from './LockDown';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

enum TabIndex {
    Lockdown = 0,
    CustomSerialization = 1,
    Raw = 2
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Stack
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index ? <Box sx={{ p: 3 }}>{children}</Box> : <></>}
        </Stack>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    };
}

export const RootTabs = (props: any) => {
    const theme = useTheme();
    const [value, setValue] = React.useState(TabIndex.Lockdown);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        let update: any = { ...props.ui };
        switch (newValue) {
            case TabIndex.Lockdown:
                update.page = 'lockdown';
                break;
            case TabIndex.CustomSerialization:
                update.page = 'custom serialiazation';
                break;
            case TabIndex.Raw:
                update.page = 'raw';
                break;
            default:
                return;
        }
        props.onUpdate(update);
    };

    const updateSlotData = (slots: any) => {
        let update: any = { ...props.ui };
        console.log('SLOT:', slots);
        switch (value) {
            case TabIndex.CustomSerialization:
                update.bootConfig.splice(0, slots.length, ...slots);

                break;
            case TabIndex.Raw:
                update.bootConfig = slots;
                break;
            default:
                return;
        }
        props.onUpdate(update);
    };

    return (
        <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
            <Paper elevation={0} sx={{ borderRadius: 0 }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Lockdown" {...a11yProps(0)} />
                    <Tab label="Custom Serialization" {...a11yProps(1)} />
                    <Tab label="Boot Config" {...a11yProps(2)} />
                </Tabs>
            </Paper>
            <Divider />

            <TabPanel value={value} index={TabIndex.Lockdown} dir={theme.direction}>
                <LockDown ui={props.ui} onUpdate={props.onUpdate} />
            </TabPanel>
            <TabPanel
                value={value}
                index={TabIndex.CustomSerialization}
                dir={theme.direction}
            >
                <HexView
                    ui={props.ui}
                    onUpdate={props.onUpdate}
                    rowWidth={8}
                    value={props.ui.bootConfig.slice(0, -16)}
                    onChange={updateSlotData}
                />
            </TabPanel>
            <TabPanel value={value} index={TabIndex.Raw} dir={theme.direction}>
                <HexView
                    ui={props.ui}
                    onUpdate={props.onUpdate}
                    rowWidth={16}
                    readOnly={true}
                    value={props.ui.bootConfig}
                    onChange={updateSlotData}
                />
            </TabPanel>
        </Box>
    );
};

export default RootTabs;
