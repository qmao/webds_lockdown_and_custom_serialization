import React from 'react';

import {
    Stack,
    Typography,
    Input,
    Select,
    MenuItem,
    styled,
    Chip
} from '@mui/material';

import { webdsService } from './local_exports';

import LockOpenIcon from '@mui/icons-material/LockOpen';

const StyledContainer = ({ children }: any) => {
    return (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
            sx={{ width: '100%' }}
        >
            {children}
        </Stack>
    );
};

const SELECT_WIDTH = 200;

const StyledTitle = styled(Typography)(({ theme }: any) => ({
    width: '40%',
    textAlign: 'right',
    fontSize: 13,
    fontWeight: 'bold'
}));

const StyledInput = styled(Input)(({ theme }: any) => ({
    width: SELECT_WIDTH,
    fontSize: 13,
    paddingLeft: '8px'
}));

const StyledSelect = styled(Select)(({ theme }: any) => ({
    width: SELECT_WIDTH,
    fontSize: 13,
    paddingLeft: '8px'
}));

enum Settings {
    Drive,
    Interrupt,
    Pin,
    Polarity,
    PullupResistor,
    Address,
    CPHA,
    CPOL
}

const LoadI2cAddress = (props: any) => {
    return (
        <StyledContainer>
            <StyledTitle>I2C Address</StyledTitle>
            <StyledInput
                sx={{ width: SELECT_WIDTH }}
                value={props.address.toString()}
                onChange={(e: any) =>
                    props.onValueChange(Settings.Address, e.target.value)
                }
            />
        </StyledContainer>
    );
};

const LoadSPICpha = (props: any) => {
    return (
        <StyledContainer>
            <StyledTitle> CPHA </StyledTitle>
            <StyledSelect
                value={props.value}
                variant="standard"
                onChange={(e: any) =>
                    props.onValueChange(Settings.CPHA, e.target.value)
                }
            >
                <MenuItem value={0}>Falling Edge</MenuItem>
                <MenuItem value={1}>Leading Edge</MenuItem>
            </StyledSelect>
        </StyledContainer>
    );
};

const LoadSPICpol = (props: any) => {
    return (
        <StyledContainer>
            <StyledTitle> CPOL </StyledTitle>
            <StyledSelect
                value={props.value}
                variant="standard"
                onChange={(e: any) =>
                    props.onValueChange(Settings.CPOL, e.target.value)
                }
            >
                <MenuItem value={0}>Rising edge </MenuItem>
                <MenuItem value={1}>Falling edge </MenuItem>
            </StyledSelect>
        </StyledContainer>
    );
};

const LoadAttnDrive = (props: any) => {
    return (
        <StyledContainer>
            <StyledTitle> Drive</StyledTitle>
            <StyledSelect
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Age"
                value={props.drive}
                variant="standard"
                onChange={(e: any) =>
                    props.onValueChange(Settings.Drive, e.target.value)
                }
            >
                <MenuItem value={0}>Push-Pull Output</MenuItem>
                <MenuItem value={1}>Open-Drain Output</MenuItem>
            </StyledSelect>
        </StyledContainer>
    );
};

const LoadAttnInterrupt = (props: any) => {
    return (
        <StyledContainer>
            <StyledTitle> Interrupt </StyledTitle>
            <StyledSelect
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={props.enable}
                variant="standard"
                onChange={(e: any) =>
                    props.onValueChange(Settings.Interrupt, e.target.value)
                }
            >
                <MenuItem value={0}>Disabled</MenuItem>
                <MenuItem value={1}>Enabled</MenuItem>
            </StyledSelect>
        </StyledContainer>
    );
};

const LoadAttnPin = (props: any) => {
    return (
        <StyledContainer>
            <StyledTitle> Pin</StyledTitle>
            <StyledInput
                sx={{ width: SELECT_WIDTH }}
                value={props.pin.toString()}
                onChange={(e: any) => props.onValueChange(Settings.Pin, e.target.value)}
            />
        </StyledContainer>
    );
};

const LoadAttnPolarity = (props: any) => {
    return (
        <StyledContainer>
            <StyledTitle> Polarity</StyledTitle>
            <StyledSelect
                variant="standard"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Age"
                value={props.polarity}
                onChange={(e: any) =>
                    props.onValueChange(Settings.Polarity, e.target.value)
                }
            >
                <MenuItem value={0}>Active-Low</MenuItem>
                <MenuItem value={1}>Active-High</MenuItem>
            </StyledSelect>
        </StyledContainer>
    );
};

const LoadAttnPullupResistor = (props: any) => {
    return (
        <StyledContainer>
            <StyledTitle> Pull-up Resistor</StyledTitle>
            <StyledSelect
                value={props.pullup}
                variant="standard"
                onChange={(e: any) =>
                    props.onValueChange(Settings.PullupResistor, e.target.value)
                }
            >
                <MenuItem value={0}>External</MenuItem>
                <MenuItem value={1}>Internal</MenuItem>
            </StyledSelect>
        </StyledContainer>
    );
};

export const LockDown = (props: any): JSX.Element => {
    const webdsTheme = webdsService.ui.getWebDSTheme();

    const onValueChange = (id: Settings, value: any) => {
        if (props.ui.lockdown.locked) {
            return;
        }

        let update: any = JSON.parse(JSON.stringify(props.ui));

        switch (id) {
            case Settings.Drive:
                update.lockdown.drive = value;
                break;
            case Settings.Interrupt:
                update.lockdown.enable = value;
                break;
            case Settings.Pin:
                update.lockdown.pin = Number(value);
                break;
            case Settings.Polarity:
                update.lockdown.polarity = value;
                break;
            case Settings.PullupResistor:
                update.lockdown.pullup = value;
                break;
            case Settings.Address:
                update.lockdown.address = Number(value);
                break;
            case Settings.CPHA:
                update.lockdown.cpha = value;
                break;
            case Settings.CPOL:
                update.lockdown.cpol = value;
                break;
        }
        props.onUpdate(update);
    };

    return (
        <Stack
            direction="column"
            spacing={4}
            justifyContent="center"
            sx={{ width: '100%' }}
        >
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Chip
                    label={props.ui.lockdown.locked ? 'Locked' : 'Unlocked'}
                    variant="outlined"
                    icon={<LockOpenIcon />}
                    color="primary"
                />
            </Stack>
            <Stack
                direction="row"
                spacing={5}
                justifyContent="center"
                sx={{ width: '100%' }}
            >
                <Stack
                    direction="column"
                    sx={{ border: 1, borderColor: webdsTheme.palette.divider }}
                    alignItems="center"
                >
                    <Typography
                        sx={{
                            width: '100%',
                            textAlign: 'center',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            py: 0.5
                        }}
                    >
                        Attention Interrupt
          </Typography>
                    <Stack sx={{ p: 2 }} spacing={1}>
                        <LoadAttnDrive
                            drive={props.ui.lockdown.drive}
                            onValueChange={onValueChange}
                        />
                        <LoadAttnInterrupt
                            enable={props.ui.lockdown.enable}
                            onValueChange={onValueChange}
                        />
                        <LoadAttnPin
                            pin={props.ui.lockdown.pin}
                            onValueChange={onValueChange}
                        />
                        <LoadAttnPolarity
                            polarity={props.ui.lockdown.polarity}
                            onValueChange={onValueChange}
                        />
                        <LoadAttnPullupResistor
                            pullup={props.ui.lockdown.pullup}
                            onValueChange={onValueChange}
                        />
                    </Stack>
                </Stack>
                <Stack
                    direction="column"
                    sx={{ border: 1, borderColor: webdsTheme.palette.divider }}
                    alignItems="center"
                >
                    <Typography
                        sx={{
                            width: '100%',
                            textAlign: 'center',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            py: 0.5
                        }}
                    >
                        Protocol
          </Typography>
                    <Stack sx={{ p: 3 }} spacing={1}>
                        {props.ui.lockdown.address !== undefined && (
                            <LoadI2cAddress
                                address={props.ui.lockdown.address}
                                onValueChange={onValueChange}
                            />
                        )}
                        {props.ui.lockdown.cpol !== undefined && (
                            <LoadSPICpol
                                value={props.ui.lockdown.cpol}
                                onValueChange={onValueChange}
                            />
                        )}
                        {props.ui.lockdown.cpha !== undefined && (
                            <LoadSPICpha
                                value={props.ui.lockdown.cpha}
                                onValueChange={onValueChange}
                            />
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default LockDown;
