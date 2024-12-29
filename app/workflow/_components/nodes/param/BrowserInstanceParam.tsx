'use client';

import { ParamsProps } from '@/types/appNode';
import React from 'react'

export default function BrowserInstanceParam({ param }: ParamsProps) {
  return (
    <div className='text-xs'>{param.name}</div>
  )
}
