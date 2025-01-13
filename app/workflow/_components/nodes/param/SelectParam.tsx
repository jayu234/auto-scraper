'use client';

import { ParamsProps } from '@/types/appNode';
import React, { useId } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function SelectParam({ param, updateNodeParamValue, value }: ParamsProps) {
  const id = useId();

  return (
    <div className='flex flex-col gap-1 w-full'>
      <Label htmlFor={id} className='text-xs flex'>
        {param.name}
        {param.required && <p className='text-red-400 px-2'>*</p>}
      </Label>
      <Select
        defaultValue={value}
        onValueChange={(value) => (updateNodeParamValue(value))}
      >
        <SelectTrigger className='text-xs bg-white dark:bg-black dark:text-white'>
          <SelectValue placeholder="Select an option"/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options?.map((option) =>
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
