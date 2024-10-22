'use client'

import { ApolloProvider } from "@apollo/client";
import  { useApollo }  from "@/lib/apolloClient";

export default function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  const client = useApollo({});

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}