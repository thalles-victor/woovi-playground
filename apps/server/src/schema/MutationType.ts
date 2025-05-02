import { GraphQLObjectType } from 'graphql';

import { messageMutations } from '../modules/message/mutations/messageMutations';
import { authMutations } from '../modules/message/mutations/authMutations';

export const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		...messageMutations,
		...authMutations
	}),

});
