import { signInResolverMutation, signUpResolverMutation } from "./AuthAddMutation";

export const authMutations = {
  signUp: signUpResolverMutation,
  singIn: signInResolverMutation
}