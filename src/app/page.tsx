"use client";

import {Button} from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
const Page = () => {
  const [value, setValue] = React.useState("");
  const trpc = useTRPC();
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message Created");
    },
    onError: () => {
      toast.error("Failed to invoke background job.");
    },
  }));
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button disabled={createMessage.isPending} onClick={() => createMessage.mutate({ value: value })}>
        Invoke Background Job
      </Button>
    </div>
  );
}

export default Page;