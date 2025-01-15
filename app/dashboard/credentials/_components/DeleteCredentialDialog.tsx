'use client';

import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DeleteCredential } from '@/actions/credentials/deleteCredential';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface Props {
  credentialName: string;
}

function DeleteCredentialDialog({ credentialName }: Props) {
  const [confirmText, setConfirmText] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success('Credential deleted', { id: `delete-credential_${credentialName}` });
      setConfirmText('');
    },
    onError: () => {
      toast.error('Something went wrong!', { id: `delete-credential_${credentialName}` });
    },

  })

  const handleDeleteCredential = () => {
    toast.loading('Deleting credential...', { id: `delete-credential_${credentialName}` });
    mutate({ name: credentialName });
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} size={'sm'}>
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this credential, you will not be able to recover it.
            <div className='flex flex-col py-4 gap-2'>
              <p>
                If you are sure, enter <b>{credentialName}</b> to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== credentialName || isPending}
            className={'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
            onClick={handleDeleteCredential}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCredentialDialog;