import { Handle, Position } from '@xyflow/react';
import React, { ReactNode } from 'react'
import NodeParamField from './NodeParamField';
import { TaskInput } from '@/types/task';

export const NodeInputs = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col divide-y gap-2'>{children}</div>
  )
};

export const NodeInput = ({ param, nodeId }: {param: TaskInput, nodeId: string}) => {
  return (
    <div className='flex justify-start relative p-3 bg-secondary w-full'>
      <NodeParamField param={param} nodeId={nodeId}/>
      {!param.hideHandle && 
        <Handle
          id={param.name}
          type='source'
          position={Position.Left}
          className='!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4'
        />
      }
    </div>
  )
}
