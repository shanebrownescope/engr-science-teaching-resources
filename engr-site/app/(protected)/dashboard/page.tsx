
"use client"
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const DashboardPage = () => {
  const router = useRouter()
  const role = useCurrentRole()

  useEffect(() => {
    if (role && role !== "admin") {
      router.push("/unauthorized")
    }
  }, [])

  return (
    <div>should only be admin</div>
  )
}

export default DashboardPage