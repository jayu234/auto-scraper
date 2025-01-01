import { FlowToExecutionPlan, FlowToExecutionPlanErrorType, FlowToExecutionPlanValidationError } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleErrors = useCallback((error: FlowToExecutionPlanErrorType) => {
    switch (error.type) {
      case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
        toast.error('No entry point found');
        break;
      case FlowToExecutionPlanValidationError.INVALID_INPUTS:
        toast.error('Not all inputs values are set');
        if(error.invalidElements) setInvalidInputs(error.invalidElements);
        break;
      default:
        toast.error('Something went wrong');
    }
  }, [setInvalidInputs]);

  const generatedExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, errors } = FlowToExecutionPlan(nodes as AppNode[], edges);

    if(errors) {
      handleErrors(errors);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, handleErrors, clearErrors]);

  return generatedExecutionPlan;
};



export default useExecutionPlan;