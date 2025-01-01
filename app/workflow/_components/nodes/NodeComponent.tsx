import { memo } from "react";
import NodeCard from "./NodeCard";
import { NodeProps } from "@xyflow/react";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];
  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      {DEV_MODE && <p className='text-xs font-bold uppercase text-muted-foreground'>{props.id}</p>}
      <NodeHeader taskType={nodeData.type} nodeId={props.id}/>
      <NodeInputs>
        {task.inputs.map((input, index) => (
          <NodeInput key={index} input={input} nodeId={props.id} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task.outputs.map((input, index) => (
          <NodeOutput key={index} output={input} nodeId={props.id} />
        ))}
      </NodeOutputs>
    </NodeCard>
  )
});

export default NodeComponent;
NodeComponent.displayName = 'NodeComponent';