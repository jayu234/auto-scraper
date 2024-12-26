import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

async function Page() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/')
  }
  return (
    <div>Dashboard page</div>
  )
}

export default Page;