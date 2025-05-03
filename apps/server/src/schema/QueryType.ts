import { GraphQLObjectType } from 'graphql';

import { messageConnectionField } from '../modules/message/messageFields';
import { walletConnectionField } from '../modules/wallet/WalletFields';
import { transactionConnectField } from '../modules/transactions/TransactionFields';

export const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		...messageConnectionField('messages'),
		...walletConnectionField(),
		...transactionConnectField()
	}),
});
