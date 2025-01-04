import Topbar from '@/app/workflow/_components/topbar/Topbar';
import { Loader2Icon } from 'lucide-react';
import React, { Suspense } from 'react'
import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases';
import ExecutionViewer from '../../_components/ExecutionViewer';

export default async function ExecutionViewerPage({
  params
}: {
  params: Promise<{ workflowId: string; executionId: string }>
}) {
  const { workflowId, executionId } = (await params);
  return (
    <div className='flex flex-col h-full w-full overflow-hidden'>
      <Topbar
        workflowId={workflowId}
        title='Workflow run details'
        subtitle={`Run ID: ${executionId}`}
        hideButtons
      />
      <section className='flex h-full overflow-auto'>
        <Suspense fallback={
          <div className='flex items-center justify-center h-full w-full'>
            <Loader2Icon className='h-10 w-10 stroke-primary animate-spin'/>
          </div>
        }>
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  )
}

async function ExecutionViewerWrapper({ executionId }: { executionId: string }) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div>Execution not found</div>
  }

  return <ExecutionViewer initialData={workflowExecution} />
} 