import { UnpublishWorkflow } from '@/actions/workflows/unpublishWorkflow';
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query';
import { DownloadIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner';

export default function UnpublishBtn({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow unpublished!', { id: 'unpublish-workflow' });
    },
    onError: (error) => {
      toast.error(error.message, { id: 'unpublish-workflow' });
    }
  });

  return (
    <Button
      variant={'outline'}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading('Unpublishing workflow...', { id: 'unpublish-workflow' });
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className='stroke-primary' />
      Unpublish
    </Button>
  )
}
