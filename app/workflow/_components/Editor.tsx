import { Workflow } from '@prisma/client';
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import FlowEditor from './FlowEditor';
import Topbar from './topbar/Topbar';
import TaskMenu from './TaskMenu';
import { FlowVlidationContextProvider } from '@/components/context/FlowValidationContext';

interface Props {
  workflow: Workflow;
}

function Editor({ workflow }: Props) {
  return (
    <FlowVlidationContextProvider>
      <ReactFlowProvider>
        <div className='flex flex-col h-full w-full overflow-hidden'>
          <Topbar title={'Workflow Editor'} subtitle={workflow.name} workflowId={workflow.id} />
          <section className='flex h-full overflow-auto'>
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowVlidationContextProvider>
  )
}

export default Editor;