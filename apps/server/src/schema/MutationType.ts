import { GraphQLObjectType } from 'graphql';

import { messageMutations } from '../modules/message/mutations/messageMutations';
import { authMutations } from '../modules/auth/mutations/authMutations';
import { transactionMutations } from '../modules/transactions/mutations/transactionMutations';

export const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		...messageMutations,
		...authMutations,
		...transactionMutations
	}),

});
