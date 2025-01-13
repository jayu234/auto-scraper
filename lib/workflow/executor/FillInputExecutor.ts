import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInputTask";

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput('Selector');
    const value = environment.getInput('Value');

    if(!selector) {
      environment.log.error('Selector not defined');
    }

    if(!value) {
      environment.log.error('Value not defined');
    }

    await environment.getPage()!.type(selector, value);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
