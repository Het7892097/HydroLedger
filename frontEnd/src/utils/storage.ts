// import { Storage } from "@ionic/storage";
import {Preferences as store} from '@capacitor/preferences';

// const store = new Storage();
// const storeReady = store.create();

// export async function storageReady(){
//   await storeReady;
// }
export const storageService = {
  async get(key: string) {
    const result = await store.get({key});
    return result;
  },

  async set(key: string, value: unknown) {
    await store.set({key, value:JSON.stringify(value)});
  },

  async remove(key: string) {
    await store.remove({key});
  },

  async clearAll() {
    const isOnboarded =await this.get('isOnboarded');
    console.log("isOnboarded value ",isOnboarded.value)
    await store.clear();//clearing all vars from localstorage except isOnboarded-var
    await this.set("isOnboarded", isOnboarded.value);
    // console.log("after clearing all",(await this.get("isOnboarded")).value)
  },
};

export default store;