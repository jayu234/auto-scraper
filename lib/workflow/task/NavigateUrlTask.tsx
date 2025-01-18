import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { LinkIcon } from "lucide-react";

export const NavigateUrlTask = {
  type: TaskType.NAVIGATE_URL,
  label: "Navigate to URL",
  icon: (props) => <LinkIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web page",
      type: TaskParamTypes.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "URL",
      type: TaskParamTypes.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamTypes.BROWSER_INSTANCE,
    }
  ] as const
} satisfies WorkflowTaskType ;