import React, { useState } from 'react';

import { Button, Stack } from '@mui/material';

import {
  SendLockdown,
  ReadLockdown,
  WriteCustomSerialization,
  ReadBootConfig
} from './api';

const BUTTON_WIDTH = 170;

export const CustomControl = (props: any): JSX.Element => {
  const [isBusy, setBusy] = useState(false);

  const getBootConfig = async () => {
    setBusy(true);
    let update: any = { ...props.ui };
    let config: any = await ReadBootConfig();
    update.bootConfig = config;
    update.checkEmptyBlock = true;
    props.onUpdate(update);
    console.log('ui init done', update);
    setBusy(false);
  };

  const lockdown = async () => {
    let update: any = JSON.parse(JSON.stringify(props.ui));

    setBusy(true);
    try {
      let result: any = await SendLockdown(props.ui.lockdown);
      let state: any = await ReadLockdown();
      update.lockdown = state;
      update.lockdown.locked = result;

      props.onUpdate(update);
      setBusy(false);
    } catch (e) {
      console.log('LOCKDOWN ERROR', e);
      update.lockdown = false;
      props.onUpdate(update);
      setBusy(false);
    }
  };

  const writeCustomSerialization = () => {
    setBusy(true);
    WriteCustomSerialization(
      props.ui.bootConfig.slice(0, props.ui.bootConfig.length - 16)
    ).then(() => {
      let update: any = JSON.parse(JSON.stringify(props.ui));
      update.checkEmptyBlock = true;
      props.onUpdate(update);
      console.log('CONTROL CS:', props.ui.bootConfig);
      setBusy(false);
    });
  };

  return (
    <Stack sx={{ width: '100%', position: 'relative' }}>
      {props.ui.page === 'lockdown' && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          <Button
            disabled={props.ui.lockdown.locked === 1 || isBusy}
            variant="contained"
            sx={{ width: BUTTON_WIDTH + 50 }}
            onClick={() => {
              lockdown();
            }}
          >
            Lock
          </Button>
        </Stack>
      )}

      {props.ui.page === 'custom serialiazation' && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          <Button
            variant="contained"
            sx={{ width: BUTTON_WIDTH + 50 }}
            onClick={() => {
              getBootConfig();
            }}
          >
            Read From Flash
          </Button>
          <Button
            variant="contained"
            sx={{ width: BUTTON_WIDTH + 50 }}
            onClick={() => {
              writeCustomSerialization();
            }}
          >
            Write To Flash
          </Button>
        </Stack>
      )}
      {props.ui.page === 'raw' && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          <Button
            variant="contained"
            sx={{ width: BUTTON_WIDTH + 50 }}
            onClick={() => {
              getBootConfig();
            }}
          >
            Read From Flash
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default CustomControl;
