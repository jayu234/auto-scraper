import { getUserWorkflows } from "@/actions/workflows/getUserWorkflows";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, InboxIcon } from "lucide-react";
import { Suspense } from "react";
import { CreateWorkflowDialog } from "./_components/CreateWorkflowDialog";

function page() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog/>
      </div>
      <Suspense fallback={<UserWorkflowsSkeleton />}>
        <UserWorkflows />
      </Suspense>
    </div>
  );
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {
        [1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))
      }
    </div>
  );
}


async function UserWorkflows() {
  const workflows = await getUserWorkflows();

  if (!workflows) {
    return <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try again later.
      </AlertDescription>
    </Alert>
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={37} className="stroke-primary" />
        </div>
        <div className="flex flex-col text-center gap-1">
          <p className="font-bold">No workflows found</p>
          <p className="text-sm text-muted-foreground">Click the button below to create your first workflow</p>
        </div>
        <CreateWorkflowDialog triggerButtonText="Create your first workflow"/>
      </div>
    )
  }
}

export default page;