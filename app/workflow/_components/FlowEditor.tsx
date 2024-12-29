'use client';

import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import NodeComponent from './nodes/NodeComponent';
import { useCallback, useEffect } from 'react';
import { AppNode } from '@/types/appNode';
import DeletableEdge from './edges/DeletableEdge';

const nodeTypes = {
  Node: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1, maxZoom: 1 }

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.defination);
      if (!flow) return;
      setNodes(flow.nodes);
      setEdges(flow.edges);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      console.error(error);
    }
  }, [workflow, setNodes, setEdges, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData('application/reactflow');
    if (typeof taskType === 'undefined' || !taskType) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes((nodes) => nodes.concat(newNode));
  }, [setNodes, screenToFlowPosition]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((edges) => addEdge({ ...connection, animated: true }, edges));
  }, [setEdges]);

  return (
    <main className='h-full w-full'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={{
          default: DeletableEdge
        }}
        snapGrid={snapGrid}
        snapToGrid
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={(event) => onDragOver(event)}
        onDrop={(event) => onDrop(event)}
        onConnect={onConnect}
      >
        <Controls fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor;