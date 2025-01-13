'use client';

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose } from '@radix-ui/react-dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { UpdateWorkflowCron } from '@/actions/workflows/updateWorkflowCron';
import { useMutation } from '@tanstack/react-query';
import parser from 'cron-parser';
import cronstrue from 'cronstrue';
import { RemoveWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule';

export default function SchedulerDialog(props: {
  cron: string | null;
  workflowId: string;
}) {
  const [cron, setCron] = useState<string>(props.cron || '');
  const [isValidCron, setIsValidCron] = useState<boolean>(false);
  const [humanReadableCron, setHumanReadableCron] = useState<string>('');

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success('Workflow scheduled', { id: 'schedule-cron' });
    },
    onError: (error: any) => {
      toast.error(error, { id: 'schedule-cron' });
    },
  });

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success('Schedule removed', { id: 'remove-schedule' });
    },
    onError: (error: any) => {
      toast.error(error, { id: 'remove-schedule' });
    },
  });

  useEffect(() => {
    try {
      parser.parseExpression(cron);
      const humanReadableStr = cronstrue.toString(cron, { locale: '' });
      setIsValidCron(true);
      setHumanReadableCron(humanReadableStr);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      setIsValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableCron = workflowHasValidCron && cronstrue.toString(props.cron!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size={'sm'}
          className={cn('text-sm p-0 h-auto text-orange-500',
            workflowHasValidCron && 'text-primary'
          )}
        >
          {workflowHasValidCron ? (
            <div className='flex items-center gap-1'>
              <ClockIcon className='h-3 w-3' />
              {readableCron}
            </div>
          ) : (
            <div className='flex items-center gap-1 '>
              <TriangleAlertIcon className='h-3 w-3' />
              Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="py-6">
          <DialogTitle asChild>
            <div className="flex flex-col items-center gap-2">
              <CalendarIcon className={'stroke-primary'} />
              <p className="text-xl text-primary">Schedule workflow execution</p>
            </div>
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC
          </p>
          <Input
            placeholder='E.g. * * * * *'
            value={cron}
            onChange={(event) => {
              setCron(event.target.value);
            }}
          />
          <div
            className={cn(
              'bg-accent rounded-md p-4 border text-sm border-destructive text-destructive',
              isValidCron && 'border-primary text-primary',
            )}
          >
            {isValidCron ? humanReadableCron : 'Invalid cron expression'}
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="">
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={"outline"}
                  disabled={
                    mutation.isPending || removeScheduleMutation.isPending
                  }
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: 'remove-schedule' });
                    removeScheduleMutation.mutate(props.workflowId);
                  }}
                >
                  Remove current schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={mutation.isPending || !isValidCron}
              onClick={() => {
                toast.loading('Scheduling workflow...', { id: 'schedule-cron' });
                mutation.mutate({
                  workflowId: props.workflowId,
                  cron,
                })
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
