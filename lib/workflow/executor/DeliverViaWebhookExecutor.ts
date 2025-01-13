import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhookTask";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput('Target URL');

    if(!targetUrl) {
      environment.log.error('TargetUrl not defined');
    }

    const body = environment.getInput('Body');
    if(!body) {
      environment.log.error('Body not defined');
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const statusCode = response.status;
    if(statusCode !== 200) {
      environment.log.error(`Webhook failed with status code ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
