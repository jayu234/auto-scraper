'use client';

import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { DeleteUserWorkflow } from '@/actions/workflows/deleteWorkflow';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
}

function DeleteWorkflowDialog({ open, setOpen, workflowName, workflowId }: Props) {
  const [confirmText, setConfirmText] = useState<string>('');

  const { mutate, isPending, reset } = useMutation({
    mutationFn: DeleteUserWorkflow,
    onSuccess: () => {
      toast.success('Workflow deleted!', { id: `delete-workflow_${workflowId}` });
    },
    onError: () => {
      toast.error('Something went wrong!', { id: `delete-workflow_${workflowId}` });
    },

  })

  const handleDeleteWorkflow = () => {
    toast.loading('Deleting workflow...', { id: `delete-workflow_${workflowId}` });
    mutate({ id: workflowId });
    reset();
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
            <div className='flex flex-col py-4 gap-2'>
              <p>
                If you are sure, enter <b>{workflowName}</b> to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || isPending}
            className={'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
            onClick={handleDeleteWorkflow}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflowDialog;