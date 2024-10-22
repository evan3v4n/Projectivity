import { ApolloClient, InMemoryCache, createHttpLink, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export function createApolloClient(initialState: NormalizedCacheObject = {}): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink({
    uri: 'http://localhost:8080/query', // Your GraphQL endpoint
  });

  const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // True if running on the server
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState)
  });
}

// Optional: Create a singleton instance for client-side usage
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export function initializeApollo(initialState: NormalizedCacheObject = {}): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(initialState);

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject): ApolloClient<NormalizedCacheObject> {
  return initializeApollo(initialState);
}
