import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website URL");
    const browser = await puppeteer.launch();
    environment.log.info(`Browser launched successfully`);

    environment.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.log.info(`Opening ${websiteUrl}`);

    environment.setPage(page);
    return true;
  } catch (error: any) {
    environment.log.error(error?.message);
    return false;
  }
}
