import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { BrainIcon } from "lucide-react";

export const ExtractTextWithAITask = {
  type: TaskType.EXTRACT_TEXT_WITH_AI,
  label: "Extract Text with AI",
  icon: (props) => <BrainIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Content",
      type: TaskParamTypes.STRING,
      required: true,
    },
    {
      name: "Credential",
      type: TaskParamTypes.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParamTypes.STRING,
      required: true,
      varient: 'textarea',
    },
  ] as const,
  outputs: [
    {
      name: "Extracted data",
      type: TaskParamTypes.STRING
    }
  ] as const
} satisfies WorkflowTaskType;