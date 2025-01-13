import prisma from '@/lib/prisma';
import { ExecuteWorkflow } from '@/lib/workflow/executeWorkflow';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowTrigger } from '@/types/workflow';
import crypto from 'crypto';
import parser from 'cron-parser';

export async function GET(req: Request) {
  const authHeaders = req.headers.get('Authorization');
  if(!authHeaders || !authHeaders.includes('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = authHeaders.split(' ')[1];
  if(!isValidSecret(secret)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get('workflowId') as string;

  if(!workflowId) {
    return Response.json({ error: 'Bad request!' }, { status: 400 });
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if(!workflow) {
    return Response.json({ error: 'Workflow not found!' }, { status: 400 });
  }

  const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan;
  if(!executionPlan) {
    return Response.json({ error: 'Bad request!' }, { status: 400 });
  }

  try {
    const nextRun = parser.parseExpression(workflow.cron!);
    const nextRunAt = nextRun.next().toDate();

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowTrigger.CRON,
        defination: workflow.defination,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              };
            });
          }),
        },
      },
      select: {
        id: true,
        phases: true,
      },
    });
  
    await ExecuteWorkflow(execution.id, nextRunAt);
    return new Response(JSON.stringify({ success: true, message: 'Workflow executed successfully!' }), { status: 200 });
  } catch (error: any) {
    console.error(error?.message);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function isValidSecret(secret: string) {
  const validSecret = process.env.API_SECRET || '';
  try {
    // Prevents from "Timing Attack" vulnerability
    return crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(validSecret));
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
}