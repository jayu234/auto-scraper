import { TaskParamTypes, TaskType } from "@/types/task";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text from element",
  icon: (props: LucideProps) => (
    <TextIcon className=" stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
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
  ],
  outputs: [
    {
      name: "Extracted text",
      type: TaskParamTypes.STRING,
    }
  ]
};