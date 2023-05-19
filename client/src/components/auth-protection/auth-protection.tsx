import React from 'react'

type AuthProtectionProps = {
  children: React.ReactElement
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  /** @TODO Check for the authenticated users only */

  return children
}
