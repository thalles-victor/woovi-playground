import { createLoader } from "@entria/graphql-mongo-helpers";
import { TransactionModel } from "./TransactionModel";
import { registerLoader } from "../loader/loaderRegister";

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: TransactionModel,
  loaderName: "TransactionLoader"
})

registerLoader('TransactionLoader', getLoader);

export const TransactionLoader = {
  Message: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};