import { TaskInput, TaskInputTypes } from '@/types/task';
import React, { useCallback } from 'react'
import StringParamField from './param/StringParamField';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '@/types/appNode';

function NodeParamField({ param, nodeId }: { param: TaskInput, nodeId: string }) {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data?.inputs?.[param.name];

  const updateNodeParamValue = useCallback((newValue: string) => {
    updateNodeData(nodeId, {
      inputs: {
        ...node?.data?.inputs,
        [param.name]: newValue
      }
    })
  },
    [nodeId, updateNodeData, param.name, node?.data?.inputs]
  );

  switch (param.type) {
    case TaskInputTypes.STRING:
      return <StringParamField param={param} updateNodeParamValue={updateNodeParamValue} value={value} />
    default:
      return <div className="text-xs text-muted-foreground">
        Not implemented
      </div>
  }
}

export default NodeParamField;