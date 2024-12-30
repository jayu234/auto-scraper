import { TaskType } from '@/types/task'
import { ExtractTextFromElementTask } from './ExtractTextFromElementTask'
import { LaunchBrowserTask } from './LaunchBrowserTask'
import { PageToHtmlTask } from './PageToHtmlTask'
import { WorkflowTaskType } from '@/types/workflow'

type Registry = {
  [K in TaskType]: WorkflowTaskType & { type: K };
}

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
}
