'use client';

import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import NodeComponent from './nodes/NodeComponent';
import { useEffect } from 'react';

const nodeTypes = {
  Node: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1, maxZoom: 1 }

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const { setViewport } = useReactFlow();
  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.defination);
      if(!flow) return;
      setNodes(flow.nodes);
      setEdges(flow.edges);
      if(!flow.viewport) return;
      console.log(flow.viewport);
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      console.error(error);
    }
  }, [workflow, setNodes, setEdges, setViewport]);
  
  return (
    <main className='h-full w-full'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        snapGrid={snapGrid}
        snapToGrid
        fitView
        fitViewOptions={fitViewOptions}
      >
        <Controls fitViewOptions={fitViewOptions}/>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor;