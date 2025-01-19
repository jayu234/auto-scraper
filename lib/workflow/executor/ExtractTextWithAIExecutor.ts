import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextWithAITask } from "../task/ExtractTextWithAITask";
import { symmetricDecrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

export async function ExtractTextWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextWithAITask>
): Promise<boolean> {
  try {
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("Content not defined");
    }
    const credential = environment.getInput("Credential");
    if (!credential) {
      environment.log.error("Credential not defined");
    }

    const { userId } = await auth();
    if (!userId) {
      environment.log.error("User unauthenticated!");
      return false;
    }

    const userCredential = await prisma.credential.findUnique({
      where: {
        userId_name: {
          userId: userId,
          name: credential,
        },
      },
    });

    if (!userCredential) {
      environment.log.error("Selected credential not found");
      return false;
    }

    const decryptedCredential = symmetricDecrypt(userCredential.value);
    if (!decryptedCredential) {
      environment.log.error("Failed to decrypt credential");
    }

    const extractedData = {
      usernameSelector: "#username",
      passwordSelector: "#password",
      loginSelector: "",
    };

    environment.setOutput("Extracted data", JSON.stringify(extractedData));

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("Prompt not defined");
    }

    const openai = new OpenAI({
      apiKey: decryptedCredential,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content:
            "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you want to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
    });
    
    environment.log.info(`Prompt tokens ${response.usage?.prompt_tokens}`);
    environment.log.info(`Completion tokens ${response.usage?.completion_tokens}`);

    const result = response.choices[0].message?.content;
    if(!result) {
      environment.log.error("No response from AI");
    }

    environment.setOutput("Extracted data", JSON.stringify(result));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
