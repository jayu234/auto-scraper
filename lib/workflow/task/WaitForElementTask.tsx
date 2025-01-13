import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { EyeIcon } from "lucide-react";

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait for element",
  icon: (props) => <EyeIcon className="stroke-amber-400" {...props} />,
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
    {
      name: "Visibility",
      type: TaskParamTypes.SELECT,
      required: true,
      options: [
        { label: 'Visible', value: 'visible' },
        { label: 'Hidden', value: 'hidden' },
      ]
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamTypes.BROWSER_INSTANCE,
    }
  ] as const
} satisfies WorkflowTaskType ;