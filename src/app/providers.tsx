// app/providers.tsx
'use client'

import { useEffect } from 'react'
import { setRemBase } from "~/utils/common"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setRemBase();
  }, []);
  return (
    <>
      {children}
    </>
  )
}