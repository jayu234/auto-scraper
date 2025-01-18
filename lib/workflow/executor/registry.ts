import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { TaskType } from "@/types/task";
import { WorkflowTaskType } from "@/types/workflow";
import { ExecutionEnvironment } from "@/types/executor";
import { FillInputExecutor } from "./FillInputExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { WaitForElementExecutor } from "./WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "./DeliverViaWebhookExecutor";
import { ExtractTextWithAIExecutor } from "./ExtractTextWithAIExecutor";
import { ReadPropertyFromJsonExecutor } from "./ReadPropertyFromJsonExecutor";
import { AddPropertyToJsonExecutor } from "./AddPropertyToJsonExecutor";
import { ScrollToElementExecutor } from "./ScrollToElementExecutor";
import { NavigateUrlExecutor } from "./NavigateUrlExecutor";

type ExecutorFn<T extends WorkflowTaskType> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type Registry = {
  [K in TaskType]: ExecutorFn<WorkflowTaskType & { type: K }>;
};

export const ExecutorRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  EXTRACT_TEXT_WITH_AI: ExtractTextWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,
};
