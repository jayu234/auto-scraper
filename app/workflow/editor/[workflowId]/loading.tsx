import { Loader2 } from 'lucide-react'
import React from 'react'

function Loading() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <Loader2 className="animate-spin stroke-primary" />
    </div>
  )
}

export default Loading