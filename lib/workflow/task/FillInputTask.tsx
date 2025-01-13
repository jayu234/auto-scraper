import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { Edit3Icon } from "lucide-react";

export const FillInputTask = {
  type: TaskType.FILL_INPUT,
  label: "Fill Input",
  icon: (props) => <Edit3Icon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web page",
      type: TaskParamTypes.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamTypes.STRING,
      required: true,
      hideHandle: true,
    },
    {
      name: "Value",
      type: TaskParamTypes.STRING,
      required: true,
      hideHandle: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamTypes.BROWSER_INSTANCE,
    }
  ] as const
} satisfies WorkflowTaskType ;