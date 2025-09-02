"use client";

import { ApolloProvider } from '@apollo/client/react';
import { client } from "@/libs/apollo-client";

export function ClientApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
