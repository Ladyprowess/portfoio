'use client'

import { useEffect } from 'react'

// Registers the admin app's service worker (offline notice only, no caching).
export default function AdminAppRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => { /* the admin still works without it */ })
  }, [])
  return null
}
