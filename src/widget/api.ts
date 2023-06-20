import { requestAPI } from '../handler';

export async function ReadLockdown(): Promise<any> {
  try {
    const reply = await requestAPI<any>('boot-config/lockdown');
    console.log(reply);
    return Promise.resolve(reply['data']);
  } catch (e) {
    return Promise.reject((e as Error).message);
  }
}

export async function SendLockdown(data: any): Promise<any> {
  var dataToSend = {
    data: data
  };

  try {
    const reply = await requestAPI<any>('boot-config/lockdown', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    });

    return Promise.resolve(reply['status']);
  } catch (e) {
    console.error(`Error on POST ${dataToSend}.\n${e}`);
    return Promise.reject((e as Error).message);
  }
}

export async function ReadBootConfig(): Promise<any> {
  try {
    const reply = await requestAPI<any>('boot-config');
    console.log(reply);
    return Promise.resolve(reply['data']);
  } catch (e) {
    return Promise.reject((e as Error).message);
  }
}

export async function WriteCustomSerialization(data: any): Promise<any> {
  var dataToSend = {
    data: data
  };

  try {
    const reply = await requestAPI<any>('boot-config/custom-serialization', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    });

    return Promise.resolve(reply['status']);
  } catch (e) {
    console.error(`Error on POST ${dataToSend}.\n${e}`);
    return Promise.reject((e as Error).message);
  }
}
