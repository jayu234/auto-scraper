import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipProps {
  children: React.ReactNode;
  content: string | null;
  side?: 'top' | 'bottom' | 'left' | 'right';
  contentClassName?: string;
}

function TooltipWrapper(props: TooltipProps) {
  if(!props.content) return props.children;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent side={props.side}>{props.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipWrapper