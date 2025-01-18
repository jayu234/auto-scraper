'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ParamsProps } from '@/types/appNode';
import React, { useEffect, useId, useState } from 'react'

function StringParamField({ param, updateNodeParamValue, value, disabled }: ParamsProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value);
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  let Component: any = Input;
  if(param?.varient === 'textarea') {
    Component = Textarea;
  }
  return (
    <div className='space-y-1 p-1 w-full'>
      <Label htmlFor={id} className='text-xs flex'>
        {param.name}
        {param.required && <p className='text-red-400 px-2'>*</p>}
      </Label>
      <Component
        id={id}
        disabled={disabled}
        className='text-xs bg-white dark:bg-black dark:text-white'
        value={internalValue}
        placeholder='Enter value here'
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue &&  updateNodeParamValue(e.target.value?.trim())}
      />
      {param.helperText && <p className='text-muted-foreground px-2'> {param.helperText} </p>}
    </div>
  )
}

export default StringParamField;