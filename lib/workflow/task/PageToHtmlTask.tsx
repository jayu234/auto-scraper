import { TaskParamTypes, TaskType } from "@/types/task";
import { LucideProps, CodeIcon } from "lucide-react";

export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get HTML from page",
  icon: (props: LucideProps) => (
    <CodeIcon className=" stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamTypes.BROWSER_INSTANCE,
      required: true,
    },
  ],
  outputs: [
    {
      name: "HTML",
      type: TaskParamTypes.STRING,
    },
    {
      name: "Web page",
      type: TaskParamTypes.BROWSER_INSTANCE,
    }
  ]
};