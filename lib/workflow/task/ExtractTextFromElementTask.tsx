import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text from element",
  icon: (props: LucideProps) => (
    <TextIcon className=" stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "HTML",
      type: TaskParamTypes.STRING,
      required: true,
      varient: 'textarea',
    },
    {
      name: "Selector",
      type: TaskParamTypes.STRING,
      required: true,
    }
  ] as const,
  outputs: [
    {
      name: "Extracted text",
      type: TaskParamTypes.STRING,
    }
  ] as const,
} satisfies WorkflowTaskType ;