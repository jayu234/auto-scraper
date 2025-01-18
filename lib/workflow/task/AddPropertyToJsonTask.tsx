import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { DatabaseIcon } from "lucide-react";

export const AddPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: "Add Property to JSON",
  icon: (props) => <DatabaseIcon className="stroke-orange-400" {...props} />,
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
    {
      name: "Property value",
      type: TaskParamTypes.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Updated JSON",
      type: TaskParamTypes.STRING,
    },
  ] as const,
} satisfies WorkflowTaskType;
