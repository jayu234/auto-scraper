import { Button } from '@/components/ui/button';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSimpleBezierPath, useReactFlow } from '@xyflow/react'
import React from 'react'

export default function DeletableEdge(props: EdgeProps) {

  const [edgePath, labelX, labelY] = getSimpleBezierPath(props);
  const { setEdges } = useReactFlow();
  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }} >
          <Button
            variant={"outline"}
            size={"icon"}
            className="w-5 h-5 border cursor-pointer rounded-full text-xs leading-none hover : shadow-1g"
            onClick={() => setEdges(eds => eds.filter(e => e.id !== props.id))}
          >
            X
          </Button>
        </div>
      </EdgeLabelRenderer >
    </>
  )
}
