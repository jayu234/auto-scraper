'use client';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils'
import { WorkflowExecutionStatus, WorkflowStatus } from '@/types/workflow';
import { Workflow } from '@prisma/client'
import { FileTextIcon, PlayIcon, ShuffleIcon, MoreVerticalIcon, TrashIcon, CornerDownRightIcon, CoinsIcon, MoveRightIcon, ChevronRightIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import DeleteWorkflowDialog from './DeleteWorkflowDialog';
import RunBtn from './RunBtn';
import SchedulerDialog from './SchedulerDialog';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz'
import ExecutionStatusIndicator, { ExecutionStatusLabel } from '@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator';
import { DuplicateWorkflowDialog } from './DuplicateWorkflowDialog';

const statusColors = {
  [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
  [WorkflowStatus.PUBLISHED]: 'bg-primary',
}

function WorkflowCard(workflow: Workflow) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card className="w-full border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30 group/card">
      <CardContent className='p-4 flex justify-between items-center h-[100px]'>
        <div className='flex items-center justify-end space-x-3'>
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus],
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className='text-base font-bold text-muted-foreground flex items-center'>
              <TooltipWrapper content={workflow.description} contentClassName='bg-white text-black'>
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className='flex items-center hover:underline'
                >
                  {workflow.name}
                </Link>
              </TooltipWrapper>
              {
                isDraft && (
                  <span className='text-xs ml-2 bg-yellow-100 text-yellow-600 rounded-full px-2'>
                    Draft
                  </span>
                )
              }
              <DuplicateWorkflowDialog workflowId={workflow.id} />
            </h3>
            <SchedulerSection isDraft={isDraft} creditsCost={workflow.creditsCost} cron={workflow.cron} workflowId={workflow.id} />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {workflow.status === WorkflowStatus.PUBLISHED && <RunBtn workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'sm',
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} isDraft={isDraft} />
    </Card>
  );
}

function WorkflowActions({ workflowName, workflowId }: { workflowName: string, workflowId: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} size={'sm'}>
            <TooltipWrapper content={"More Actions"}>
              <div className='flex items-center justify-center w-full h-full'>
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='text-destructive flex items-center gap-2 cursor-pointer '
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu >
    </>
  )
}

function SchedulerSection({
  isDraft, creditsCost, cron, workflowId
}: {
  isDraft: boolean, creditsCost: number, cron: string | null, workflowId: string
}) {
  if (isDraft) return null;

  return (
    <div className='flex items-center gap-2'>
      <CornerDownRightIcon size={16} className='h-4 w-4 text-muted-foreground' />
      <SchedulerDialog cron={cron} workflowId={workflowId} key={`${cron}-${workflowId}`} />
      <MoveRightIcon className='h-4 w-4 text-muted-foreground' />
      <TooltipWrapper content='Credits consumption for all run'>
        <div className='flex items-center gap-3'>
          <Badge
            variant={'outline'}
            className='space-x-2 text-muted-foreground rounded-md'>
            <CoinsIcon size={16} className='h-4 w-4' />
            <span className='text-sm'>{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  )
}

function LastRunDetails({ workflow, isDraft }: { workflow: Workflow, isDraft: boolean }) {
  if (isDraft) return null;
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

  const nextSchedule = nextRunAt && format(nextRunAt, 'yyyy-MM-dd HH:mm');
  const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt, 'UTC', 'HH:mm');
  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center
    text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {lastRunAt ? (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] group-hover:translate-x-0 transition"
            />
          </Link>
        )
          : isDraft && <p>No runs yet</p>
        }
      </div>
      {nextRunAt &&
        <div className='flex items-center text-sm gap-2'>
          <ClockIcon size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span>({nextScheduleUTC})</span>
        </div>
      }
    </div>
  );
}

export default WorkflowCard;
