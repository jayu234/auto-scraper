"use client";

import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

// <------------- TODO: Implement Auto save feature ------------->

export default function SaveBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success('Flow saved successfully', { id: 'save-workflow' });
    },
    onError: () => {
      toast.error('Something went wrong', { id: 'save-workflow' });
    }
  });
  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading('Saving flow...', { id: 'save-workflow' });
        saveMutation.mutate({
          workflowId: workflowId,
          defination: JSON.stringify(toObject())
        });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}