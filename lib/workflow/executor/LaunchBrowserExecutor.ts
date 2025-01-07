import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website URL");
    const browser = await puppeteer.launch({
      headless: true,
    });

    environment.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl);

    environment.setPage(page);
    return true;
  } catch (error) {
    console.error("Error running Launch Browser executor", error);
    return false;
  } finally {
    
  }
}
