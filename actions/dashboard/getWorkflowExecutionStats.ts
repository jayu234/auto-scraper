'use server';

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string, {
  success: number,
  failed: number,
}>

export async function GetWorkflowExecutionStats(selectedPeriod: Period) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unathenticated!");
  }

  const dateRange = PeriodToDateRange(selectedPeriod);
  const workflowExecutions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lt: dateRange.endDate,
      },
    },
  });

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  }).map((date) => format(date, 'yyyy-MM-dd'))
  .reduce((acc, date) => {
    acc[date] = {
      success: 0,
      failed: 0,
    }
    return acc;
  }, {} as any);

  for(const execution of workflowExecutions) {
    const date = format(execution.startedAt!, 'yyyy-MM-dd');
    if(execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    } else if(execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  }

  const result = Object.entries(stats).map(([date, info]) => ({
    date,
    ...info,
  }));
  
  return result;
}