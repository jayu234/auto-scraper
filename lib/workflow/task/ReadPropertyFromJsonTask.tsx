import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { FileJson2Icon } from "lucide-react";

export const ReadPropertyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Read Property from JSON",
  icon: (props) => <FileJson2Icon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "JSON",
      type: TaskParamTypes.STRING,
      required: true,
    },
    {
      name: "Property name",
      type: TaskParamTypes.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Property value",
      type: TaskParamTypes.STRING,
    },
  ] as const,
} satisfies WorkflowTaskType;
