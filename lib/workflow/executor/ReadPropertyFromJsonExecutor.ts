import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJsonTask";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    const jsonContent = environment.getInput('JSON');
    const propertyName = environment.getInput('Property name');

    if(!jsonContent) {
      environment.log.error('JSON not defined');
    }

    if(!propertyName) {
      environment.log.error('Property name not defined');
    }

    const parsedData = JSON.parse(jsonContent);
    const propertyValue = parsedData[propertyName];

    if(!propertyValue) {
      environment.log.error('Property not found in the JSON data');
    }

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
