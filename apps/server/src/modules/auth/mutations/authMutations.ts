import { signUpResolverMutation } from "./SignUpMutation";
import { signInResolverMutation } from "./SignInMutation";

export const authMutations = {
  signUp: signUpResolverMutation,
  signIn: signInResolverMutation
}