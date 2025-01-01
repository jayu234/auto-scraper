'use client';

import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import NodeComponent from './nodes/NodeComponent';
import { useCallback, useEffect } from 'react';
import { AppNode } from '@/types/appNode';
import DeletableEdge from './edges/DeletableEdge';
import { TaskRegistry } from '@/lib/workflow/task/registry';

const nodeTypes = {
  Node: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1, maxZoom: 1 }

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

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

    if(!connection.targetHandle) return;
    const node = nodes.find((node) => node.id === connection.target);
    if (!node) return;
    const nodeInputs = node.data.inputs;
    updateNodeData(node.id, {
      inputs: {
        ...nodeInputs,
        [connection.targetHandle]: ""
      }
    });
  }, [nodes, setEdges, updateNodeData]);

  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // Cannot connect to the same node
    if (connection.source === connection.target) return false;

    // Cannot connect to different type of nodes
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if(!sourceNode || !targetNode){
      return false;
    }

    const sourceTask = TaskRegistry[sourceNode.data.type as TaskType];
    const targetTask = TaskRegistry[targetNode.data.type as TaskType];

    const output = sourceTask.outputs.find((o) => o.name === connection.sourceHandle);
    const input = targetTask.inputs.find((i) => i.name === connection.targetHandle);

    if(output?.type !== input?.type) return false;

    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };

    return !hasCycle(targetNode);
  }, [edges, nodes]);

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
        isValidConnection={isValidConnection}
      >
        <Controls fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor;