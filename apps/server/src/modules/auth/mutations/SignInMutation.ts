// @ts-nocheck
import { mutationWithClientMutationId } from "graphql-relay";
import { signInUseCase } from "../usecases/signIn";
import { SignInDto } from "../usecases/auth.dtos";
import { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";

const SignInInputType = new GraphQLInputObjectType({
  name: "signInInputType",
  description: "Input type for sign in",
  fields: () => ({
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
  })
})



const SignInResponseObjType = new GraphQLObjectType({
  name: "signInResponse",
  description: "Auth response",
  fields: () => ({
    user: {
      type: new GraphQLObjectType({
        name: "userSignInResponse",
        fields: () => ({
          name: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          },
          createdAt: {
            type: GraphQLString
          },
          updatedAt: {
            type: GraphQLString
          },
          deletedAt: {
            type: GraphQLString
          },
          role: {
            type: GraphQLString
          }
        })
      })
    },
    accessToken: {
      type: new GraphQLObjectType({
        name: "accessTokenSignInResponse",
        fields: () => ({
          token: {
            type: GraphQLString
          },
          expiresIn: {
            type: GraphQLString
          }
        })
      })
    }
  })
})

export const signInResolverMutation = mutationWithClientMutationId({
  name: "signIn",
  inputFields: {
    signInDto: {
      type: SignInInputType
    }
  },
  outputFields: { data: { type: SignInResponseObjType } },
  mutateAndGetPayload: async (args: any) => {
    const dto = args.signInDto as SignInDto;

    const authResult = await signInUseCase(dto);

    return { data: { user: authResult.user, accessToken: authResult.accessToken } }
  }
})
