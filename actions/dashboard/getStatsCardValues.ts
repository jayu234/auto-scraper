"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function GetStatsCardValues(selectedPeriod: Period) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unathenticated!");
  }

  const dateRange = PeriodToDateRange(selectedPeriod);
  const workflowExecutions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      createdAt: {
        gte: dateRange.startDate,
        lt: dateRange.endDate,
      },
      status: {
        in: [WorkflowExecutionStatus.COMPLETED, WorkflowExecutionStatus.FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
      },
    },
  });

  const stats = {
    workflowExecutions: workflowExecutions.length,
    phaseExecutions: 0,
    creditsConsumed: 0,
  };

  stats.creditsConsumed = workflowExecutions.reduce(
    (acc, item) => acc + (item?.creditsConsumed || 0),
    0
  );

  stats.phaseExecutions = workflowExecutions.reduce(
    (acc, item) => acc + item.phases.length,
    0
  );

  return stats;
}
