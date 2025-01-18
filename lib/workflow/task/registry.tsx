import { TaskType } from '@/types/task'
import { ExtractTextFromElementTask } from './ExtractTextFromElementTask'
import { LaunchBrowserTask } from './LaunchBrowserTask'
import { PageToHtmlTask } from './PageToHtmlTask'
import { WorkflowTaskType } from '@/types/workflow'
import { FillInputTask } from './FillInputTask'
import { ClickElementTask } from './ClickElementTask'
import { WaitForElementTask } from './WaitForElementTask'
import { DeliverViaWebhookTask } from './DeliverViaWebhookTask'
import { ExtractTextWithAITask } from './ExtractTextWithAITask'
import { ReadPropertyFromJsonTask } from './ReadPropertyFromJsonTask'
import { AddPropertyToJsonTask } from './AddPropertyToJsonTask'
import { ScrollToElementTask } from './ScrollToElementTask'
import { NavigateUrlTask } from './NavigateUrlTask'

type Registry = {
  [K in TaskType]: WorkflowTaskType & { type: K };
}

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_TEXT_WITH_AI: ExtractTextWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
}
