import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import { Suspense } from "react";
import { CreateCredentialDialog } from "./_components/CreateCredentialDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "./_components/DeleteCredentialDialog";

type Credential = Awaited<ReturnType<typeof GetCredentialsForUser>>[0];

export default async function CredentialsPage() {
  const credentials = await GetCredentialsForUser();

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        {credentials.length > 0 && <CreateCredentialDialog triggerText={'Create'} />}
      </div>
      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring your data remains
            safe
          </AlertDescription>
        </Alert>
        <Suspense fallback={<UserCredentialsSkeleton />}>
          <UserCredentials credentials={credentials}/>
        </Suspense>
      </div>
    </div>
  );
}

function UserCredentialsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {
        [1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))
      }
    </div>
  );
}


async function UserCredentials({ credentials }: { credentials: Credential[] }) {
  if (!credentials) {
    return <div>Something went wrong</div>;
  }
  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center
          justify-center">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredentialDialog />
        </div>
      </Card>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {credentials.map((item) => {
        const createdAt = formatDistanceToNow(item.createdAt, {
          addSuffix: true,
        })
        return (
          <Card key={item.id} className="w-full p-4 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                <LockKeyholeIcon size={18} className="stroke-primary" />
              </div>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>
            <DeleteCredentialDialog credentialName={item.name} />
          </Card>
        )
      })}
    </div>
  );
}