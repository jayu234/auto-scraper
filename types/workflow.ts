import React from "react";
import { TaskParam, TaskType } from "./task"
import { LucideProps } from "lucide-react";
import { AppNode } from "./appNode";

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

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];