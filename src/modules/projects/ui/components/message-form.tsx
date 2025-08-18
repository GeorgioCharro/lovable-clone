import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutoSize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useState } from "react";
import { Usage } from "./usage";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value cannot be empty" })
    .max(1000, { message: "Value cannot be longer than 1000 characters" }),
});

const MessageForm = ({ projectId }: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: usage } = useQuery(trpc.usage.status.queryOptions());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        );
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
        }
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };

  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;
  const showUsage = !!usage;
  const isMobile = useIsMobile();

  return (
    <Form {...form}>
      {showUsage && (
        <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          // tighter padding on mobile
          isMobile ? "p-2" : "p-4 pt-1",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <div className="relative">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <TextareaAutoSize
                {...field}
                disabled={isPending}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className={cn(
                  "pt-4 resize-none border-none w-full outline-none bg-transparent",
                  // add right padding on mobile to avoid overlapping the floating button
                  isMobile && "pr-12"
                )}
                placeholder="What would you like to build?"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />

          {/* Mobile: inline floating submit button */}
          {isMobile && (
            <Button
              type="submit"
              disabled={isButtonDisabled}
              aria-label="Submit"
              className={cn(
                "absolute top-2 right-2 size-8 rounded-full",
                isButtonDisabled && "bg-muted-foreground border"
              )}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon />
              )}
            </Button>
          )}
        </div>

        {/* Desktop footer controls (hidden on mobile) */}
        {!isMobile && (
          <div className="flex items-end justify-between gap-x-2 pt-2">
            <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </kbd>
              <span>{' '}to submit</span>
            </div>

            <Button
              type="submit"
              disabled={isButtonDisabled}
              className={cn(
                "size-8 rounded-full",
                isButtonDisabled && "bg-muted-foreground border"
              )}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon />
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default MessageForm;
