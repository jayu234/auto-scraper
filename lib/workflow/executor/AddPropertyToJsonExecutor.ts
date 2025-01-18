import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJsonTask } from "../task/AddPropertyToJsonTask";

export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
): Promise<boolean> {
  try {
    const jsonContent = environment.getInput('JSON');
    const propertyName = environment.getInput('Property name');
    const propertyValue = environment.getInput('Property value');

    if(!jsonContent) {
      environment.log.error('JSON not defined');
    }

    if(!propertyName) {
      environment.log.error('Property name not defined');
    }

    if(!propertyValue) {
      environment.log.error('Property value not defined');
    }

    const json = JSON.parse(jsonContent);
    json[propertyName] = propertyValue;

    environment.setOutput('Updated JSON', JSON.stringify(json));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
