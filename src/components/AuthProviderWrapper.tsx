'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { useApollo } from '@/lib/apolloClient'

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const apolloClient = useApollo({})
  return <AuthProvider apolloClient={apolloClient}>{children}</AuthProvider>
}
