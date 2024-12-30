import React from "react";
import { TaskParam, TaskType } from "./task"
import { LucideProps } from "lucide-react";

export enum WorkflowStatus {
  "DRAFT" = "DRAFT",
  "PUBLISHED" = "PUBLISHED",
}

export type WorkflowTaskType = {
  type: TaskType;
  label: string;
  icon: React.FC<LucideProps>;
  isEntryPoint?: boolean;
  credits: number;
  inputs: TaskParam[];
  outputs: TaskParam[];
}