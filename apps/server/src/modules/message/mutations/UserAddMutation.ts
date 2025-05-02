import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";


const UserType = new GraphQLObjectType({
  name: "Thalles",
  description: "Name from thalles",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
     name: { 
      type: GraphQLString
     },
     email: {
      type: GraphQLString
     }
    
  })
})

const UserInputType = new GraphQLInputObjectType({
  name: "user",
  fields: () => ({
     id: {
      type: GraphQLString
     },
     name: {
      type: GraphQLString
     },
     email: {
      type: GraphQLString
     }
  })
})


export const mutation = mutationWithClientMutationId({
  name: "Teste",
  inputFields: {
    user: {
      type: UserInputType
    }
  },
  outputFields: {
    user: {type: UserType}
  },
  mutateAndGetPayload: async ({ user}) => {
    return {user}
  } 
})
