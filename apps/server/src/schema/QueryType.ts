import { GraphQLObjectType } from 'graphql';

import { messageConnectionField } from '../modules/message/messageFields';
import { getWalletQueries, getWalletResolverQuery, WalletConnection } from '../modules/wallet/queries/GetWalletQuery';
import { authMiddleware } from "../@shared/authMiddleware"
import { walletConnectionField } from '../modules/wallet/WalletFields';

export const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		...messageConnectionField('messages'),
		...getWalletQueries(),
		...walletConnectionField()
	}),
});
