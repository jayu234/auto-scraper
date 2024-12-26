import { TaskInputTypes, TaskType } from "@/types/task";
import { LucideProps, GlobeIcon } from "lucide-react";

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className=" stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Website URL",
      type: TaskInputTypes.STRING,
      helperText: "eg: https://example.com",
      required: true,
      hideHandle: true,
    }
  ]
};