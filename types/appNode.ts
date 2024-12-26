import { Node } from "@xyflow/react";
import { TaskInput, TaskType } from "./task";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: unknown;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface ParamsProps {
  param: TaskInput;
  value: string;
  updateNodeParamValue: (value: string) => void;
}