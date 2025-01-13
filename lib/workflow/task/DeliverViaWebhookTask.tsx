import { TaskParamTypes, TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { SendIcon } from "lucide-react";

export const DeliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver via Webhook",
  icon: (props) => <SendIcon className="stroke-blue-400" {...props} />,
  isEntryPoint: false,
  credits: 5,
  inputs: [
    {
      name: "Target URL",
      type: TaskParamTypes.STRING,
      required: true,
    },
    {
      name: "Body",
      type: TaskParamTypes.STRING,
      required: true,
    },
  ] as const,
  outputs: [] as const
} satisfies WorkflowTaskType;