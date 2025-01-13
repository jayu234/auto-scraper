'use client';

import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import SaveBtn from './SaveBtn';
import ExecuteBtn from './ExecuteBtn';
import NavigationTabs from './NavigationTabs';
import PublishBtn from './PublishBtn';
import UnpublishBtn from './UnpublishBtn';

interface Props {
  title: string;
  subtitle?: string | null;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

function Topbar({ workflowId, title, subtitle, hideButtons = false, isPublished }: Props) {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p>}
        </div>
      </div>
      <div className='flex justify-center items-center'>
        <NavigationTabs workflowId={workflowId} />
      </div>
      <div className='flex gap-1 flex-1 justify-end'>
        {!hideButtons && (<>
          <div className='flex gap-2'>
            <ExecuteBtn workflowId={workflowId} />
            {isPublished ? <UnpublishBtn workflowId={workflowId} /> :
              <>
                <SaveBtn workflowId={workflowId} />
                <PublishBtn workflowId={workflowId} />
              </>
            }
          </div>
        </>)}
      </div>
    </header>
  )
}

export default Topbar;