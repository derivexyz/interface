import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
} from '@apollo/client'

export default async function subgraphRequest<T = any, TVariables = OperationVariables>(
  client: ApolloClient<NormalizedCacheObject>,
  options: QueryOptions<TVariables, T>
): Promise<ApolloQueryResult<T | null | undefined>> {
  return client.query({ ...options, errorPolicy: 'all' })
}
