import { LaunchBrowserExecutor } from './LaunchBrowserExecutor';
import { PageToHtmlExecutor } from './PageToHtmlExecutor';
import { ExtractTextFromElementExecutor } from './ExtractTextFromElementExecutor';

export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
}