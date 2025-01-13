export enum TaskType {
  LAUNCH_BROWSER = 'LAUNCH_BROWSER',
  PAGE_TO_HTML = 'PAGE_TO_HTML',
  EXTRACT_TEXT_FROM_ELEMENT = 'EXTRACT_TEXT_FROM_ELEMENT',
  FILL_INPUT = 'FILL_INPUT',
  CLICK_ELEMENT = 'CLICK_ELEMENT',
  WAIT_FOR_ELEMENT = 'WAIT_FOR_ELEMENT',
  DELIVER_VIA_WEBHOOK = 'DELIVER_VIA_WEBHOOK',
}

export enum TaskParamTypes {
  STRING = 'STRING',
  BROWSER_INSTANCE = 'BROWSER_INSTANCE',
  SELECT = 'SELECT',
}

export type OptionType = {
  label: string;
  value: string;
}
export interface TaskParam {
  name: string;
  type: TaskParamTypes;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  options?: OptionType[];
  [key: string]: unknown;
}
