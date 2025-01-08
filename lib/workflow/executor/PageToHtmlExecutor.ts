import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtmlTask";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    if(!html) {
      environment.log.error('HTML not found');
      return false;
    }
    environment.setOutput('HTML', html);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
