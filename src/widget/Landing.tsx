import React, { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';

import { Canvas } from './mui_extensions/Canvas';
import { Content } from './mui_extensions/Content';
import { Controls } from './mui_extensions/Controls';
import { CustomControl } from './CustomControl';

import { RootTabs } from './Tabs';

import { ReadLockdown, ReadBootConfig } from './api';

export const Landing = (props: any): JSX.Element => {
  const [isReady, setReady] = useState(false);
  const [ui, setUi] = useState({
    page: 'lockdown',
    bootConfig: [],
    bootConfigDefault: [],
    checkEmptyBlock: false,
    lockdown: {}
  });

  useEffect(() => {
    async function fetch() {
      let update: any = { ...ui };
      let state: any = await ReadLockdown();
      let config: any = await ReadBootConfig();
      update.lockdown = state;
      update.bootConfig = config;
      setUi(update);
      console.log('ui init done', update);
      setReady(true);
    }
    fetch();
  }, []);

  const onUpdate = (u: any) => {
    if (JSON.stringify(ui) === JSON.stringify(u) && u.force_update === false) {
      return;
    }

    let update: any = JSON.parse(JSON.stringify(u));
    update.force_update = false;
    setUi(update);
    console.log('UPDATE UI', update);
  };

  return (
    <>
      {isReady && (
        <Canvas title={'Lockdown & Custom Serialization'} sx={{ width: 920 }}>
          <Content sx={{ height: 480 }}>
            <Stack direction="row" sx={{ height: '100%' }}>
              <RootTabs ui={ui} onUpdate={onUpdate} />
            </Stack>
          </Content>
          <Controls
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CustomControl onUpdate={onUpdate} ui={ui} />
          </Controls>
        </Canvas>
      )}
    </>
  );
};

export default Landing;
