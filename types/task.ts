export enum TaskType {
  LAUNCH_BROWSER = 'LAUNCH_BROWSER',
}

export enum TaskInputTypes {
  STRING = 'STRING',
}

export interface TaskInput {
  name: string;
  type: TaskInputTypes;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  [key: string]: unknown;
}