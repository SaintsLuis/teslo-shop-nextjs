'use client'

import { useCartStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const RedirectIfCartEmpty = () => {
  const router = useRouter()

  const numberOfItems = useCartStore(
    (state) => state.getSummaryInformation().numberOfItems
  )

  // skipHydration: true zustand
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (numberOfItems === 0) {
      router.replace('/empty')
    }
  }, [numberOfItems, router])

  return null
}
