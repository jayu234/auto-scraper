'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { Loader2, ShieldEllipsisIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCredentialSchema, createCredentialSchemaType } from "@/schema/credential";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateCredential } from "@/actions/credentials/createCredential";

export function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<createCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success('Credential created', { id: 'create-credential' });
      setOpen(prev => !prev);
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        toast.success('Credential created', { id: 'create-credential' });
        return;
      }
      toast.error("Something went wrong!", { id: 'create-credential' });
    },
  });

  const onSubmit = useCallback(
    (values: createCredentialSchemaType) => {
      toast.loading('Creating credential....', { id: 'create-credential' });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}>
      <DialogTrigger asChild>
        <Button>{triggerText || 'Create credential'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="py-6">
          <DialogTitle asChild>
            <div className="flex flex-col items-center gap-2">
              <ShieldEllipsisIcon className={'stroke-primary'} />
              <p className="text-xl text-primary">Create credential</p>
            </div>
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="p-6">
          <Form {...form}>
            <form
              className="w-full space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique an descriptive name for thr credential. <br />
                      This name will be user to identify the credential.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="resize-none" />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with this credential <br />
                      This value will be securely encrypted and stored.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                {!isPending && 'Proceed'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
