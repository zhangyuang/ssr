import * as declareRoutes from "_build/ssr-declare-routes";
import * as ManualRoutes from "_build/ssr-manual-routes";
import { createContext } from "react";
import { combineRoutes, deepClone } from "ssr-common-utils";
import { proxy } from "valtio";
import type { IContext, ReactRoutesType } from "ssr-types";

export const Routes = combineRoutes(declareRoutes, ManualRoutes) as ReactRoutesType;
export const ssrCreateContext = () => {
  const STORE_CONTEXT = createContext<IContext>({
    state: {},
  });
  if (__isBrowser__) {
    window.STORE_CONTEXT = STORE_CONTEXT;
  }
  return STORE_CONTEXT;
};

export function createStore() {
  const { store } = Routes;
  const storeInstance = __isBrowser__ ? store : proxy(deepClone(store));
  if (__isBrowser__) {
    for (const key in storeInstance) {
      if (__isBrowser__ && window.__VALTIO_DATA__?.[key]) {
        Object.assign(storeInstance[key], window.__VALTIO_DATA__[key]);
      }
    }
  }
  return storeInstance;
}
