// @ts-nocheck
import { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { SignUpDto } from "../usecases/auth.dtos";
import { signUpUseCase } from "../usecases/signUp";


const SignUpInputType = new GraphQLInputObjectType({
  name: "singUpInputType",
  description: "Input type for sign up",
  fields: () => ({
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    cpfCnpj: {
      type: GraphQLString
    }
  })
})


const SignUpResponseObjType = new GraphQLObjectType({
  name: "signUpResponse",
  description: "Auth response",
  fields: () => ({
    user: {
      type: new GraphQLObjectType({
        name: "userSignUpResponse",
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
        name: "accessTokenSignUpResponse",
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


export const signUpResolverMutation = mutationWithClientMutationId({
  name: "signUp",
  inputFields: {
    signUpDto: {
      type: SignUpInputType
    }
  },
  outputFields: { data: { type: SignUpResponseObjType } },
  mutateAndGetPayload: async (args: any) => {
    const dto = args.signUpDto as SignUpDto;

    const authResponse = await signUpUseCase(dto);

    return { data: { user: authResponse.user, accessToken: authResponse.accessToken } }
  }
})


