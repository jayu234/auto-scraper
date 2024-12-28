"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const UpdateWorkflow = async ({
  workflowId,
  defination,
}: {
  workflowId: string;
  defination: string;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  await prisma.workflow.update({
    data: {
      defination,
    },
    where: { id: workflowId },
  });

  revalidatePath(`/dashboard/workflows`);
};
