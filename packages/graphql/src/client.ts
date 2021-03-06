import 'cross-fetch/polyfill';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { persistCache } from 'apollo-cache-persist';

export const authLink = setContext((_, { headers }) => {
  const storage = localStorage.getItem('state');
  const state: Record<string, any> = storage ? JSON.parse(storage) : {};

  return {
    headers: {
      ...headers,
      authorization: state.app.jwt ? `Bearer ${state.app.jwt}` : '',
    },
  };
});

export const createApolloClient = (uri: string | undefined, cache = {}): any => {
  if (uri) {
    const uploadLink = createUploadLink({ uri });
    const link = ApolloLink.from([authLink, uploadLink]);
    const restoreCache = new InMemoryCache().restore(cache);

    persistCache({
      cache: restoreCache,
      // @ts-ignore
      storage: window.localStorage,
    });

    return new ApolloClient({
      link,
      cache: restoreCache,
    });
  }
};
