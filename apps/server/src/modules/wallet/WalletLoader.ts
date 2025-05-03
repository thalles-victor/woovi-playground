// @ts-nocheck
import { createLoader } from "@entria/graphql-mongo-helpers";
import { WalletModel } from "./WalletModel";
import { registerLoader } from "../loader/loaderRegister";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: WalletModel,
  loaderName: "WalletLoader"
})

registerLoader('WalletLoader', getLoader);

export const WalletLoader = {
  Message: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,

};