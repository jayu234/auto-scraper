import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { ArrowUpIcon } from "lucide-react";

export const ScrollToElementTask = {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: "Scroll to Element",
  icon: (props) => <ArrowUpIcon className="stroke-orange-400" {...props} />,
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
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamTypes.BROWSER_INSTANCE,
    }
  ] as const
} satisfies WorkflowTaskType ;